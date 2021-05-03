import {
  AjaxOptionsProps,
  ConfigProps,
  EWindow,
} from '@/index.d';

import { extend } from '@/lib/_';
import {
  loadingHandler,
} from '@/lib/handler';
import {
  after,
} from '@/lib/interceptors';
import Cancel from '@/lib/cancel';  // 取消
import Result from '@/lib/result';  // 返回
import Notify from '@/lib/notify/notify';  // 通知
import getCorer from '@/lib/core/get-corer';

/**
 * @name    TinySender
 * @param   axios
 * @param   config
 *              codeKeys    String-Array
 *              msgKeys     String-Array
 *              notify      Object          自定通知函数
 *              barHeight   Num | Str       进度条高度
 */
class TinySender {
  _window: EWindow;
  codeKeys: string[];
  msgKeys: string[];
  ERR_MSG_NOT_200: string;
  ERR_MSG_NO_RES: string;
  notify: any;
  barEl: any;
  barHeight: number;
  barStriped: boolean;
  CancelToken: any;
  corer: (options: AjaxOptionsProps) => Promise<any>;

  after: (json: any, options: any, TS: any) => Promise<any>
  constructor(baseConfig: ConfigProps) {
    const {
      codeKeys = [],
      msgKeys = [],
      errorMsgNot200 = Result.ERR_MSG_NOT_200,
      errorMsgNoResponse = Result.ERR_MSG_NO_RES,
      notify,
      barEl,
      barHeight,
      barStriped,

      after,
    } = baseConfig || {};

    // 属性
    this._window = window;
    // 兼容 code：[ 'code' ]
    this.codeKeys = codeKeys || [];
    // 兼容 msg： ['msg']
    this.msgKeys = msgKeys || [];
    // 返回非 200 报错信息
    this.ERR_MSG_NOT_200 = errorMsgNot200 || Result.ERR_MSG_NOT_200;
    // 无返回报错信息
    this.ERR_MSG_NO_RES = errorMsgNoResponse || Result.ERR_MSG_NO_RES;
    // 自定义通知函数： { error }
    this.notify = extend(notify, Notify);
    // 进度条插入位置，默认 body
    this.barEl = barEl;
    // 进度条高度：默认 4px
    this.barHeight = barHeight;
    // 进度条动画：默认：false
    this.barStriped = barStriped || false;
    // 取消
    this.CancelToken = null;
    // 异步核心
    this.corer = getCorer(this, baseConfig);

    this.after = after;
  }

  // 发起请求
  async ajax(url: string, options: AjaxOptionsProps) {
    options = { url, ...options };
    // 设置加载状态
    loadingHandler(options, true);

    try {
      const json = await this.corer(options);

      // 取消加载状态
      loadingHandler(options, false);

      // use after
      return await (this.after ? this.after(json, options, this) : after(json, options, this));
    } catch (err) {
      // // 取消加载状态
      // loadingHandler(options, false);
      // return util.errorHandler(err, {
      //   uuid
      // });
    }
  }

  get(url, options = {}) {
    return this.ajax(url, options);
  }

  post(url, options = {}) {
    extend(options, {
      method: 'post'
    });
    return this.ajax(url, options);
  }

  form(url, options = {}) {
    extend(options, {
      method: 'post',
      norest: true
    });
    return this.ajax(url, options);
  }

  cancel() {
    Cancel.cancel();
  }
}

export default TinySender;
