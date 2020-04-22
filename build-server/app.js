const express = require('express');
const { router } = require('./router');
const { dbControllers } = require('./controllers');
const storage = require('./storage');
const helpers = require('./utils/helpers');

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



const port = helpers.getConfig('port');
app.listen(port, async (err) => {
  if (err) console.log(`Server didn't launch because of error: ${err}`);
  else console.log(`Server successfully launched on the port: ${port}`);

  await storage.getInitialData();
});
