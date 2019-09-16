/**
 * @name    ajax
 * @author  realign(realign@yeah.net)
 */

import './style/nprogress.less';
import './style/notify.less';

import _ from 'lib/_'; // 工具

import NProgress from 'nprogress'; // 进度条
import util from 'lib/util'; // ajax util
import Cancel from 'lib/cancel'; // 取消
import Config from 'lib/config'; // 配置
import Result from 'lib/result'; // 返回
import Notify from 'lib/notify'; // 通知

// import XHR from 'xhr/xhr';

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
    constructor(config = {}) {
        const self = this;

        // 属性
        // 兼容 code：[ 'code' ]
        self.codeKeys = config.codeKeys || [];
        // 兼容 msg： ['msg']
        self.msgKeys = config.msgKeys || [];
        // 返回非 200 报错信息
        self.ERR_MSG_NOT_200 = config.errorMsgNot200 || Result.ERR_MSG_NOT_200;
        // 无返回报错信息
        self.ERR_MSG_NO_RES = config.errorMsgNoResponse || Result.ERR_MSG_NO_RES;
        // 自定义通知函数： { error }
        self.notify = _.extend(config.notify, Notify);
        // 进度条插入位置，默认 body
        self.barEl = config.barEl;
        // 进度条高度：默认 4px
        self.barHeight = Config.getNumber(config.barHeight);
        // 进度条动画：默认：false
        self.barStriped = config.barStriped || false;

        // 取消
        self.CancelToken = null;

        const _axios_ = config.axios || window.axios || null;
        if(_axios_) {
            // axios 实例
            self.axios = self.makeAxios();
        } else {
            //
        }
    }

    /**
     * @name 生成axios
     * @param {*} axios
     */
    makeAxios(axios) {
        const self = this;

        /*** 取消请求 相关 ***/
        self.CancelToken = axios.CancelToken;

        window.TINY_SENDER_CONFIG = {};
        const TSC = window.TINY_SENDER_CONFIG;
        TSC.AxiosCancel = {};
        TSC.AxiosCancelText = '中断成功';

        /******* 进度条相关 *******/
        TSC.showProgress = false;

        // 计算百分比
        const calculatePercentage = function (loaded = 0, total = 1) {
            return Math.floor(loaded * 1.0) / total;
        };
        // 更新百分比
        const updatePercentage = (e) => {
            TSC.showProgress && NProgress.inc(calculatePercentage(e.loaded, e.total));
        };
        // 初始化进度条
        NProgress.configure(Config.NProgressConfig(self));
        // 进度监控
        axios.defaults.onDownloadProgress = updatePercentage;
        axios.defaults.onUploadProgress = updatePercentage;

        // 请求拦截器
        axios.interceptors.request.use(
            (config) => {
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
                return config;
            },
            error => Promise.reject(error)
        );

        // 全局非 200 报错处理
        axios.interceptors.response.use(
            (response) => {
                const res = response.data || {};

                const code = Result.getCode(res, self.codeKeys).code;
                if (code !== 200) {
                    // 全局非 200 报错
                    const msg = Result.getMsg(res, self.msgKeys).smg;
                    self.notify.error(msg || self.ERR_MSG_NOT_200);
                }

                return response;
            },
            (error) => {
                // eslint-disable-next-line no-console
                console.error(error);

                // 取消请求，会执行此分支，根据 err.message 来判断是 cancle
                if (error.message == TSC.AxiosCancelText) {
                    return false;
                }

                self.notify.error(self.ERR_MSG_NO_RES);
                // 取消加载状态
                util.loadingHandler({}, false);

                return util.errorHandler(error);
            }
        );

        return axios;
    }
    // 发起请求
    async ajax(url = '', options = {}) {
        const self = this;
        const T = new Date();
        const uuid = util.uuidMaker(T);

        let {
            method = 'get', // 方式
                norest = false, // 非 json
                data = {}, // 数据
                headers = {}, // 请求头
        } = options;
        method = method.toLowerCase();

        const config = {
            headers: {},
            url,
            method,
            data,
            norest,
        };
        Object.assign(config.headers, headers);

        data.t = T.getTime();

        // 设置 路由切换 取消 请求
        config.cancelToken = new self.CancelToken(c => {
            window.TINY_SENDER_CONFIG.AxiosCancel[uuid] = c;
        });

        // get 情况下，转换要发送数据对象名称
        if (method === 'get') {
            config.params = data;
        }

        // noreset
        if (method === 'post' && norest) {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            config.transformRequest = [(data) => {
                if (!data) {
                    return data;
                }
                return util.transform(data);
            }];
        }

        // trim
        if (config.data) {
            config.data = util.deepTrim(config.data);
        }
        if (config.params) {
            config.params = util.deepTrim(config.params);
        }

        // 设置加载状态
        util.loadingHandler(options, true);

        try {
            const json = await self.axios(config);
            const res = json.data || {};

            // 取消加载状态
            util.loadingHandler(options, false);

            const code = Result.getCode(res, self.codeKeys).code;
            if (code && code === 200) {
                return util.successHandler(res, {
                    uuid
                });
            }

            return util.errorHandler(res, {
                uuid
            });

        } catch (err) {
            // 取消加载状态
            util.loadingHandler(options, false);
            return util.errorHandler(err, {
                uuid
            });
        }
    }

    get(url, options = {}) {
        return this.ajax(url, options);
    }

    post(url, options = {}) {
        _.extend(options, {
            method: 'post'
        });
        return this.ajax(url, options);
    }

    form(url, options = {}) {
        _.extend(options, {
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