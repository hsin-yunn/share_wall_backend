//自定義錯誤
const appErrorHandler = function (statusCode, errorMessage, next) {
  const error = new Error(errorMessage);
  error.statusCode = statusCode;
  //操作上可預期的錯誤
  error.isOperational = true;
  next(error);
};

mudule.exports = appErrorHandler;
