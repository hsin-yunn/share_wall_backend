//正式環境
const resErrorProd = function (err, res) {
  if (err.isOperational) {
    //可預期錯誤
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    //log 紀錄
    console.error('Service Error', err);
    //不可預期錯誤
    res.status(500).json({
      message: 'Server Error.',
    });
  }
};
//開發環境
const resErrorDev = function (err, res) {
  res.status(res.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
