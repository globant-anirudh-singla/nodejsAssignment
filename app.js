const express = require('express');
const bodyParser = require('body-parser');
const { init } = require('./database/db');
const { router } = require('./routes/taskRoutes');
const errorHandler = require('./errorHandler');

const app = express();

app.use(bodyParser.json());
(async () => {
  await init();
})();
app.use('/tasks', router);
app.use(errorHandler);

app.listen(3000, async ()=> {
  console.log('express server started');
});
