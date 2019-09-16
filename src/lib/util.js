import NProgress from 'nprogress';
import _ from 'lib/_';

const u = {
    // 参数转拼接
    transform(data) {
        let fd = [];

        Object.keys(data).map((key) => {
            const _flag = _.typeOf(data[key]) === 'object';

            let item = _flag ?
                JSON.stringify(data[key]) :
                data[key];

            item = encodeURIComponent(item);

            fd.push(`${key}=${item}`);
        });

        return fd.join('&');
    },

    // 句柄：加载
    loadingHandler(options, loading) {
        const {
            // mask,
            btn,
            noProgress = false
        } = options;

        if (loading) {
            btn && btn.$update('loading', true);

            if (!noProgress) {
                window.TINY_SENDER_CONFIG.showProgress = true;
                NProgress.start();
            }
        } else {
            btn && btn.$update('loading', false);

            if (!noProgress) {
                setTimeout(() => {
                    window.TINY_SENDER_CONFIG.showProgress = false;
                    NProgress.done();
                    NProgress.remove();
                }, 300);
            }
        }
    },

    // 句柄：成功
    successHandler(res = {}, attach = {}) {
        u.do4End({ res, attach });
        return Promise.resolve(res);
    },

    // 句柄：失败
    errorHandler(res = {}, attach = {}) {
        u.do4End({ res, attach });
        return Promise.reject(res);
    },

    do4End(options = {}) {
        const {
            // res,
            attach,
        } = options;

        const {
            uuid,
        } = attach;

        const AC = window.TINY_SENDER_CONFIG.AxiosCancel;

        // delete cancel
        delete AC[uuid];
    },

    // 全量 trim
    deepTrim(obj = '') {
        const _bf = {
            perform2ObjectOrArray(obj = {}) {
                Object.keys(obj).forEach((k) => {
                    const type = _.typeOf(obj[k]);

                    if (type === 'object' || type === 'array') {
                        u.deepTrim(obj[k]);
                    } else if (type === 'string') {
                        obj[k] = _bf.perform2String(obj[k]);
                    }
                });
            },
            perform2String(str = '') {
                return str.trim();
            }
        };

        const type = _.typeOf(obj);

        if (type === 'object' || type === 'array') {
            _bf.perform2ObjectOrArray(obj);
        } else if (type === 'string') {
            obj = _bf.perform2String(obj);
        }

        return obj;
    },

    uuidMaker(date = new Date()) {
        const prefix = 'ts-xhr';
        const formatDate = date.toLocaleDateString().split('/').join('_');
        const random = Math.ceil(Math.random() * 1000);

        return `${prefix}-${formatDate}-${random}`;
    }
};

export default u;