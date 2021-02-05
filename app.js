const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./util/path');
const ErrorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const atlasCredentials = require('./mongo-atlas-credentials');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { nextTick } = require('process');

const app = express();

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

app.use((req, res, next) => {
  User.findById("601149b3327fb898594afd07")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(e => console.error(e));
});

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use(authRoutes);

app.use(ErrorController.pageNotFound);

mongoose.connect(`mongodb+srv://${atlasCredentials.userName}:${atlasCredentials.userPass}@${atlasCredentials.clusterName}.mongodb.net/${atlasCredentials.dbName}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    User.findOne()
      .then(user => {
        if (user === undefined) {
          const user = new User({
            name: "Xavi",
            email: "email@email.com",
            items: []
          });

          user.save();
        }
      });
    app.listen(port);
    console.log(`${g(`Express App listening on ${port}`)}`);
  })
  .catch(e => console.error(e));