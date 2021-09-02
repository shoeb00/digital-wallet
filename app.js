const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const logger = require('./logger/logger')

const transRouter = require('./routes/transRouter');
const walletRouter = require('./routes/walletRouter');
const { config } = require('./config.json');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

// custom response method
app.use((req, res, next) => {
  res.publish = (data, ejsFile, status = 200) => {
    if(req.browser) {
      return res.render(ejsFile, data);
    }
    return res.status(status).json(data);
  }
  next();
});

// custom middleware to verify session cookies
app.use((req, res, next) => {
  let check = req.headers['user-agent']
  check = JSON.stringify(check).toLowerCase();
  if(check.includes('mozilla')){
    req.browser = true
  }
  const { cookies } = req;
  if(req.url.includes('register') && cookies.XW_ID) {
    req.user = cookies.XW_ID;
    return next();
  } 
  if(req.browser && !( req.url.includes('register') || req.url.includes('setup'))) {
    if(cookies && cookies.XW_ID) {
      req.user = cookies['XW_ID'];
    } else {
      return res.redirect('/register');
    }
  }
  return next();
});

app.get('/health-check', (req, res) => {
  return res.publish({ message: "Server is ready to accept connections." });
});

app.get('/register', (req, res) => {
  console.log('in register:', req.user);
  if(req.user) {
    return res.redirect('/home');
  }
  return res.render('register');
})

app.use('/', walletRouter);
app.use('/transaction', transRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;