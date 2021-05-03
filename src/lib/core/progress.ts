import NProgress from 'nprogress';

// 计算百分比
export function calculatePercentage(loaded = 0, total = 1) {
  return Math.floor(loaded * 1.0) / total;
}
// 更新百分比
export function updatePercentage(e) {
  NProgress.status && NProgress.inc(calculatePercentage(e.loaded, e.total));
}
