/** eslint no-console: off */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRouter from './routes/apiV1Router';
import dbInit from './database/initScript';

dbInit();
const app = express();
const port = process.env.PORT || 3232;
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1/', apiRouter);


app.all('/*', (req, resp) => {
  resp.status(404).json({
    success: false,
    message: 'Invalid Route',
  });
});


app.listen(port, (error) => {
  if (error) console.log('An error occured while binding to port');
  console.log(`Server was set up at ${port}`);
});
export default app;
