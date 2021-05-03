import {
  AjaxOptionsProps,
  ConfigProps,
} from '@/index.d';
import TinySender from '@/index';

import { NProgressInit } from '@/lib/nprogress/nprogress';

import axiosCore from '@/lib/core/axios';
import xhrCore from '@/lib/core/xhr';

export default (TS: TinySender, baseConfig: ConfigProps): ((options: AjaxOptionsProps) => Promise<any>) => {
  const {
    axios,
  } = baseConfig || {};

  /** 进度条   相关 ***/
  // 初始化进度条
  NProgressInit(TS);

  return axios ? axiosCore(axios) : xhrCore;
};
