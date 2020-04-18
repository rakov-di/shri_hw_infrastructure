require('dotenv').config();
const path = require('path');
const express = require('express');
const { router } = require('./router/router');

const app = express();

// Функции промежуточной обработки (middleware)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());
app.use(router);

// app.use(express.static(path.resolve(__dirname, '../build')));
// Общий обработчик ошибок - пока не используется, ошибки обрабатываются индивидуально
app.use((err, req, res, next) => {
  console.error(`Server error: ${err.message}`);
  res.status(500).json({
    message: `Server error: ${err.message}`
  });
  next();
});

const port = 8000;
app.listen(port, err => {
  if (err) console.log(`Server didn't launch because of error: ${err}`);
  else console.log(`Server successfully launched on the port: ${port}`);
});

//
// require('dotenv').config();
// const path = require('path');
// const express = require('express');
// // const { router } = require('./routes/router');
//
// const app = express();
//
// // Функции промежуточной обработки (middleware)
// app.use(express.json());
// app.use(express.urlencoded()); // TODO Разобраться, почему из postman не отправляется обычный json
// app.use(express.static(path.resolve(__dirname, '../build')));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// // app.use(router);
// // Общий обработчик ошибок - пока не используется, ошибки обрабатываются индивидуально
// app.use((err, req, res, next) => {
//   console.error(`Server error: ${err.message}`);
//   res.status(500).json({
//     message: `Server error: ${err.message}`
//   });
// });
//
// const port = 8000;
// app.listen(port, err => {
//   if (err) console.log(`Server didn't launch because of error: ${err}`);
//   else console.log(`Server successfully launched on the port: ${port}`);
// });
