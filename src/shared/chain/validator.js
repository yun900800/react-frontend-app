/**
 * 验证账号是否为空的验证器
 * @param {object} data - 包含 account 属性的对象。
 * @param {Function} next - 回调函数，用于继续下一个验证器或终止链。
 */
const validateAccountNotEmpty = (data, next) => {
  console.log('正在验证账号是否为空...');
  if (!data.account) {
    // 验证失败，传入错误信息并终止链
    return next('❌ 账号不能为空！');
  }
  // 验证通过，继续下一个验证器
  next();
};

/**
 * 验证密码格式的验证器
 * @param {object} data - 包含 password 属性的对象。
 * @param {Function} next - 回调函数。
 */
const validatePasswordFormat = (data, next) => {
  console.log('正在验证密码格式...',data);
  // 假设密码长度必须大于6
  if (!data.password || data.password.length < 6) {
    return next('❌ 密码长度必须大于6！');
  }
  next();
};

/**
 * 验证邮箱格式的验证器
 * @param {object} data - 包含 email 属性的对象。
 * @param {Function} next - 回调函数。
 */
const validateEmailFormat = (data, next) => {
  console.log('正在验证邮箱格式...',data);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    return next('❌ 邮箱格式不正确！');
  }
  next();
};

export {
    validateAccountNotEmpty,
    validatePasswordFormat,
    validateEmailFormat
}