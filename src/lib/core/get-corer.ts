import {
  ConfigProps,
} from '@/index.d';
import TinySender from '@/index';

import NProgress from 'nprogress';
import { NProgressConfig } from '@/lib/config';

import axiosCore from '@/lib/core/axios';
import xhrCore from '@/lib/core/xhr';

export default (TS: TinySender, baseConfig: ConfigProps) => {
  const {
    axios,
  } = baseConfig || {};

  /** 进度条   相关 ***/
  // 初始化进度条

  const _c = NProgressConfig(TS);
  NProgress.configure(_c);

  return axios ? axiosCore(axios) : xhrCore;
};
