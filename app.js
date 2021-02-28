const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./util/path');
const ErrorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const atlasCredentials = require('./mongo-atlas-credentials');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = `mongodb+srv://${atlasCredentials.userName}:${atlasCredentials.userPass}@${atlasCredentials.clusterName}.mongodb.net/${atlasCredentials.dbName}?retryWrites=true&w=majority`

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set("views", 'views');


const port = 3000;

/**
 * Console log colors function.
 * e.g. console.log(`${g("this will be of a green color")}`)
 */
const { r, g, b, w, c, m, y, k } = [
  ['r', 1], ['g', 2], ['b', 4], ['w', 7],
  ['c', 6], ['m', 5], ['y', 3], ['k', 0],
].reduce((cols, col) => ({
  ...cols, [col[0]]: f => `\x1b[3${col[1]}m${f}\x1b[0m`
}), {})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use(session({ secret: "my session secret", resave: false, saveUninitialized: false, store: store }));

// csrfProtection need to goes always after initializing the session.
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch(e => {
      next(new Error(e));
    });
});


/**
 * ROUTES
 */
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use('/500', ErrorController.get500);

app.use((error, req, res, next) => {
  res.status(500).render(
    '500',
    {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});
app.use(ErrorController.pageNotFound);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port);
    console.log(`${g(`Express App listening on ${port}`)}`);
  })
  .catch(e => console.error(e));