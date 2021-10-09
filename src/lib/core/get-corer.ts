import {
  AjaxOptionsProps,
  ConfigProps,
} from '@/index.d';

import { NProgressInit } from '@/lib/nprogress/nprogress';

import axiosCore from '@/lib/core/axios';
import xhrCore from '@/lib/core/xhr';

export default (baseConfig: ConfigProps): ((options: AjaxOptionsProps) => Promise<any>) => {
  const {
    axios,
  } = baseConfig || {};

  /** 进度条   相关 ***/
  // 初始化进度条
  NProgressInit();

  return axios ? axiosCore(baseConfig) : xhrCore(baseConfig);
};
