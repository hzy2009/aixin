import defHttp from '@/utils/http/axios'

const Api = {
  Login: '/apm/sys/emailLogin',
  // Login: '/sys/login',
  phoneLogin: '/sys/phoneLogin',
  Logout: '/sys/logout',
  GetUserInfo: '/sys/user/getUserInfo',
  GetUserRole: '/apm/apmTodo/vipUpgrade/userInfo',
  // 获取系统权限
  // 1、查询用户拥有的按钮/表单访问权限
  // 2、所有权限
  // 3、系统安全模式
  GetPermCode: '/sys/permission/getPermCode',
  //新加的获取图形验证码的接口
  getInputCode: '/sys/randomImage',
  //获取短信验证码的接口
  getCaptcha: '/sys/sms',
  //注册接口
  registerApi: '/sys/user/register',
  //校验用户接口
  checkOnlyUser: '/sys/user/checkOnlyUser',
  //SSO登录校验
  validateCasLogin: '/sys/cas/client/validateLogin',
  //校验手机号
  phoneVerify: '/sys/user/phoneVerification',
  //修改密码
  passwordChange: '/sys/user/passwordChange',
  //第三方登录
  thirdLogin: '/sys/thirdLogin/getLoginUser',
  //第三方登录
  getThirdCaptcha: '/sys/thirdSms',
  //获取二维码信息
  getLoginQrcode: '/sys/getLoginQrcode',
  //监控二维码扫描状态
  getQrcodeToken: '/sys/getQrcodeToken',
  // 获取字典
  queryAllDictItems: '/apm/sys/front/queryAllDictItems'
}

export function getCodeInfo(currdatetime) {
  let url = Api.getInputCode + `/${currdatetime}`;
  return defHttp.get({ url: url });
}

// Login API
export function loginApi(data) {
  return defHttp.post({ url: Api.Login, data: { ...data ,captchaMode: 1} }); // Or data: params if body
}

// Logout API
export function logoutApi() {
  return defHttp.get({ url: Api.Logout }); // Or data: params if body
}


// Get user information
export function getUserRoleApi() {
  return defHttp.get({ url: Api.GetUserRole });
}

// Get dictionary
export function getAllDictApi() {
  return defHttp.get({ url: Api.queryAllDictItems });
}

/**
 * @description: Upload interface
 */
export function uploadImg(params, onUploadProgress) {
  return defHttp.uploadFile < UploadApiResult > (
    {
      url: `${import.meta.env.VITE_GLOB_UPLOAD_URL}/apm/sys/file/upload/A`,
      onUploadProgress,
    },
    params,
    { isReturnResponse: true }
  );
}