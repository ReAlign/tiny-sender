import NProgress from 'nprogress';
import {
  getConfig,
  injectStyle,
} from './config';
import NProgressStyle from './style/nprogress.less';

export function NProgressInit() {
  injectStyle(NProgressStyle);
  const _c = getConfig();
  NProgress.configure(_c);
}
