// 类型定义
import {
  AjaxOptionsProps,
  ConfigProps,
  blockBeforeFn,
  blockAfterFn,
} from '@/index.d';
// 处理句柄
import {
  loadingHandler,
} from '@/lib/handler';
// 拦截器
import {
  after, before,
} from '@/lib/interceptors';
// 获取核心
import getCorer from '@/lib/core/get-corer';
import {
  isAsyncFunction,
} from '@/lib/_';
import * as Notify from '@/lib/notify/notify';

/**
 * TinySender
 *
 * @class TinySender
 */
class TinySender {
  public Notify: any;
  private corer: (options: AjaxOptionsProps) => Promise<any> | null = null;
  private blockBefore: blockBeforeFn;
  private blockAfter: blockAfterFn;
  constructor() { }
  public init(baseConfig: ConfigProps) {
    const {
      blockBefore,
      blockAfter,
    } = baseConfig || {};

    // 异步核心
    this.corer = getCorer(baseConfig);

    this.blockBefore = blockBefore;
    this.blockAfter = blockAfter;

    this.Notify = Notify;
  }

  /**
   * 发起请求
   * @param url 地址
   * @param options 参数
   * @returns {Promise<any>}
   */
  public async ajax(url: string, options: AjaxOptionsProps) {
    if (this.corer === null) {
      throw new Error('请先使用 .init(options) 初始化实例。');
    }

    options = { url, ...options };
    options = await before({ options, TS: this });
    // use before
    if (isAsyncFunction(this.blockBefore)) {
      options = await this.blockBefore({ options, TS: this });
    }
    // 设置加载状态
    loadingHandler(options, true);

    try {
      let json = await this.corer(options);

      // 取消加载状态
      loadingHandler(options, false);

      json = await after({ json, options, TS: this });
      // use after
      if (isAsyncFunction(this.blockAfter)) {
        json = await this.blockAfter({ json, options, TS: this });
      }
      return json;
    } catch (err) {
      // 取消加载状态
      loadingHandler(options, false);
      return err;
    }
  }

  public get(url, options = {}) {
    return this.ajax(url, options);
  }

  public post(url, options = {}) {
    Object.assign(options, {
      method: 'post'
    });
    return this.ajax(url, options);
  }

  public form(url, options = {}) {
    Object.assign(options, {
      method: 'post',
      norest: true
    });
    return this.ajax(url, options);
  }
}

export default new TinySender();
