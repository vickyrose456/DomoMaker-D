const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const csrf = require('csurf');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// connect to the DB
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://victoriaolivieri:5wAIPI4lVifWWiLL@cluster1.gica3.mongodb.net/olivieri-domo-maker-a?retryWrites=true&w=majority';
// 'mongodb://127.0.0.1/DomoMaker';

mongoose.connect(dbURI, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// connect to redis (hardcoded way)
const redisURL = process.env.REDISCLOUD_URL
|| 'redis://default:Uxt1yhJYU6WrwT4CjmkgfpUFpbf0q1th@redis-16243.c263.us-east-1-2.ec2.cloud.redislabs.com:16243';

const redisClient = redis.createClient({
  legacyMode: true,
  url: redisURL,
});

redisClient.connect().catch(console.error);

const app = express();

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* key = name of cookie that takes in request
default key = connect.sid, so renamed to sessionid for security
secret = private string used for hashing
resave = tells session to refresh so key is active
saveUn... = option tells module to always make sessions even when not logged in
this auto gen each user session key
*/
/* app.use(session({
  key: 'sessionid',
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
})); */

// instead of storing everything in server variables, store in Redis DB instead
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());
// gen unique token for each req. req from same session will match
// otherwise error is called.
app.use(csrf());

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing csrf token!');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Listening on port ${port}`);
});
