const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors')
const xssClean = require('xss-clean')
const  rateLimit  = require('express-rate-limit');
const userRouter = require('./routes/user.route');
const seedRouter = require('./routes/seed.route');
const { errorResponse } = require('./controllers/responseController');


const app = express();

// rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);
app.use(xssClean());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/test', (req, res) => {
  res.send('Hello World');
});


app.use('/api/v1/users', userRouter);
app.use('/api/v1/seed', seedRouter);

//client error handler
app.use((req, res, next) => {
  
  next(createError(404, 'Not Found'));
});

// server error handler - all errors are passed to this handler
app.use((error, req, res, next) => {
  return errorResponse(res,
    {
      message: error.message,
      statusCode: error.status
    });
});



module.exports = app;