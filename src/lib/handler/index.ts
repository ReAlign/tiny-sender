import {
  AjaxOptionsProps,
} from '@/index.d';

import NProgress from 'nprogress';

export function loadingHandler(options: AjaxOptionsProps, loading: boolean) {
  const {
    progress = true,
  } = options;

  if (loading) {
    if (progress) {
      NProgress.start();
    }
  } else {
    if (progress) {
      setTimeout(() => {
        NProgress.done();
        NProgress.remove();
      }, 300);
    }
  }
}

// 句柄：成功
export function successHandler(res = {}) {
  // u.do4End({ res, attach });
  return Promise.resolve(res);
}

// 句柄：失败
export function errorHandler(res = {}) {
  // u.do4End({ res, attach });
  return Promise.reject(res);
}
