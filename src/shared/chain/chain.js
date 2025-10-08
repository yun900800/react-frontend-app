/**
 * 通用的中间件风格验证链执行器
 * * @param {object} data - 需要被验证的领域对象（如用户对象、订单对象等）。
 * @param {Function[]} validators - 包含一系列验证器（中间件）函数的数组。
 * @param {Function} finalCallback - 验证链执行完毕后的回调函数。
 * 如果验证失败，回调函数会接收一个错误信息参数；
 * 如果验证成功，参数为 null。
 */
function runValidationChain(data, validators, finalCallback) {
  let index = 0;

  // 这是核心的 next 函数，用于将控制权传递给下一个验证器
  function next(error) {
    // 如果上一个验证器返回了错误，则立即停止并执行最终回调
    if (error) {
      return finalCallback(error);
    }

    // 如果所有验证器都已执行完毕
    if (index >= validators.length) {
      return finalCallback(null); // 验证成功，没有错误
    }

    const currentValidator = validators[index];
    index++;

    // 执行当前的验证器，并将 next 函数作为回调传给它
    // 每个验证器函数都接收 data 和 next 作为参数
    currentValidator(data, next);
  }

  // 从第一个验证器开始执行
  next();
}

/**
 * 基于 Promise 的异步验证链执行器
 * @param {object} data - 需要验证的数据对象。
 * @param {Function[]} validators - 包含验证器函数的数组。
 * @returns {Promise<void>} - 验证成功时 resolve，失败时 reject 并附带错误信息。
 */
const runAsyncValidationChain = (data, validators) => {
  return new Promise((resolve, reject) => {
    let index = 0;
    const next = (error) => {
      if (error) {
        // 🔴 这里是关键改动：始终 reject 一个 Error 对象
        if (error instanceof Error) {
          return reject(error);
        } else {
          // 如果 error 是字符串，也将其封装成 Error 对象
          return reject(new Error(error));
        }
      }
      if (index >= validators.length) {
        return resolve();
      }
      const currentValidator = validators[index];
      index++;
      currentValidator(data, next);
    };
    next();
  });
};

export {
    runValidationChain,
    runAsyncValidationChain
}

