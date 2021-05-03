import NProgress from 'nprogress';
import {
  getConfig,
  injectStyle,
} from './config';
import NProgressStyle from './style/nprogress.less';

export function NProgressInit(TS: any) {
  injectStyle(NProgressStyle);
  const _c = getConfig(TS);
  NProgress.configure(_c);
}
