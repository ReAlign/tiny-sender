export interface EWindow extends Window {
  TINY_SENDER_CONFIG?: any;
}

export interface NormalObject {
  [propName: string]: any;
}

export interface ConfigProps {
  codeKeys: string[];
  msgKeys: string[];
  errorMsgNot200: string;
  errorMsgNoResponse: string;
  notify: any;
  barEl: any;
  barHeight: number;
  barStriped: boolean;
  axios: any;
  //
  timeout: number;
  baseUrl: string;
}

export interface AjaxOptionsProps {
  url?: string; //
  method?: string; // 方式
  norest?: boolean; // 非 json
  timeout?: number; // 超时时间
  data?: any; // 数据
  headers?: NormalObject; // 请求头
  trim?: boolean; // 所有参数是否进行 trim
  progress?: boolean; // progress
  onProgress?: (evt: any) => void; // 进度
}
