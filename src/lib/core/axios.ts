import {
  AjaxOptionsProps,
  ConfigProps,
} from '@/index.d';

import formatOptions from '@/lib/core/format-options';
import {
  updatePercentage,
} from '@/lib/core/progress';

export default (baseConfig: ConfigProps) => {
  const {
    axios,
    baseUrl,
  } = baseConfig;
  if (!axios) {
    return null;
  }

  if(baseUrl) {
    axios.defaults.baseURL = baseUrl;
  }
  axios.defaults.onDownloadProgress = updatePercentage;
  axios.defaults.onUploadProgress = updatePercentage;

  return async function AXIOS_CORE(options: AjaxOptionsProps): Promise<any> {
    const {
      url,
      method,
      // timeout,
      headers,
      data,
      // onProgress,
    } = formatOptions(options);

    return await axios({
      headers,
      url,
      method,
      data,
    });
  };
};
