import {
  AjaxOptionsProps,
} from '@/index.d';

import formatOptions from '@/lib/core/format-options';
import {
  updatePercentage,
} from '@/lib/core/progress';

export default (axios) => {
  if (!axios) {
    return null;
  }

  axios.defaults.onDownloadProgress = updatePercentage;
  axios.defaults.onUploadProgress = updatePercentage;

  return async function AXIOS_CORE(url: string, options: AjaxOptionsProps): Promise<any> {
    const {
      method,
      // timeout,
      headers,
      data,
      // onProgress,
    } = formatOptions(url, options);

    const config = {
      headers,
      url,
      method,
      data,
    };
    const res = await axios(config);
    return (res || {}).data || {};
  };
};
