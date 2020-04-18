const express = require('express');
const { router } = require('./router');
const helpers = require('./utils/heleprs');
const { registerAgent } = require('./controllers');

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

// Первичные запросы за билд-листом и настройками репозитория
// Без этих данных билдить невозможно, поэтому
// запросы будут повторяться, пока не получат настройки и НЕ пустой список билдов)

registerAgent();

const port = helpers.getConfig('port');
app.listen(port, err => {
  if (err) console.log(`Server didn't launch because of error: ${err}`);
  else console.log(`Server successfully launched on the port: ${port}`);
});
