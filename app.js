var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appResErrorHandler = require('./service/appResErrorHandler');

// 程式出現重大錯誤時 -> 抓戰犯，有預期之外的出錯
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(err);
  process.exit(1);
});

//env
dotenv.config({ path: './config.env' });
//connect database
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('connect success'))
  .catch((error) => {
    console.log(error, 'connect error');
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//404 not found
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'failed',
    message: 'page not found',
  });
});

// 錯誤處理
app.use(function (err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return appResErrorHandler.resErrorDev(err, res);
  }
  // production
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
    return appResErrorHandler.resErrorProd(err, res);
  }
  appResErrorHandler.resErrorProd(err, res);
});

// 未捕捉到的 catch -> 有人沒寫catch
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
