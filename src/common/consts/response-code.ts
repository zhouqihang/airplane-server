/**
 * 状态码
 * 异常码以 4 开头的，会被filter捕获
 */
export enum EResponseCode {
  ok = 200,
  bad_request = 400,
  not_login = 4030,
  user_already_exist = 4100,
  user_not_exist = 41001,
}

export const responseMsgs: Record<EResponseCode, string> = {
  [EResponseCode.ok]: 'successed',
  [EResponseCode.bad_request]: '',
  [EResponseCode.not_login]: 'user not login',
  [EResponseCode.user_already_exist]: 'user already exist',
  [EResponseCode.user_not_exist]: 'user not exist',
};
