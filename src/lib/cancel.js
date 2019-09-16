import _ from 'lib/_';

function cancel() {
    const W_CONF = window.TINY_SENDER_CONFIG || {};

    if(W_CONF.AxiosCancel) {
        const acKeys = Object.keys(W_CONF.AxiosCancel);
        if(acKeys.length) {
            acKeys.forEach(ac => {
                const acf = W_CONF.AxiosCancel[ac];
                const flag = acf && _.typeOf(acf) === 'function';
                if(flag) {
                    acf(W_CONF.AxiosCancelText);
                }
            });
        }
    }

    W_CONF.AxiosCancel = null;
    W_CONF.AxiosCancel = {};
}

export default {
    cancel
};