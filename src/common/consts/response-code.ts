/**
 * 状态码
 * 异常码以 4 开头的，会被filter捕获
 */
export enum EResponseCode {
  ok = 200,
  bad_request = 400,
  not_login = 4030,
  record_not_exist = 40001,
  record_exist = 40002,
  user_already_exist = 41000,
  user_not_exist = 41001,
  auth_login_err = 41002,
  user_disabled = 41003,
  pwd_not_equal_confirm_pwd = 41004,
  permission_denied = 41005,
}

export const responseMsgs: Record<EResponseCode, string> = {
  [EResponseCode.ok]: 'successed',
  [EResponseCode.bad_request]: '',
  [EResponseCode.not_login]: 'user not login',
  [EResponseCode.user_already_exist]: 'user already exist',
  [EResponseCode.user_not_exist]: 'user not exist',
  [EResponseCode.auth_login_err]: 'account or password is wrong',
  [EResponseCode.user_disabled]: 'user has been disabled',
  [EResponseCode.pwd_not_equal_confirm_pwd]:
    'password and confirm passowrd is not equal',
  [EResponseCode.record_not_exist]: 'record not exist',
  [EResponseCode.record_exist]: 'record exist',
  [EResponseCode.permission_denied]: 'permission_denied',
};
