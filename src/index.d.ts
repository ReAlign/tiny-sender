export interface NormalObject {
  [propName: string]: any;
}

export interface ConfigProps {
  blockBefore: blockBeforeFn;
  blockAfter: blockAfterFn;
  axios?: any;

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
export interface blockReqProps {
  options: AjaxOptionsProps;
  TS: any;
}
export interface blockResProps {
  json: any;
  options: AjaxOptionsProps;
  TS: any;
}

export type blockBeforeFn = (o: blockReqProps) => Promise<any> | null;
export type blockAfterFn = (o: blockResProps) => Promise<any> | null;
