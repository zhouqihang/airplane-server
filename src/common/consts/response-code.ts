/**
 * 状态码
 * 异常码以 4 开头的，会被filter捕获
 */
export enum EResponseCode {
  ok = 200,
  bad_request = 400,
  not_login = 4030,
}

export const responseMsgs: Record<EResponseCode, string> = {
  [EResponseCode.ok]: 'successed',
  [EResponseCode.bad_request]: '',
  [EResponseCode.not_login]: 'user not login',
};
