const express = require('express');
const bodyParser = require('body-parser');
    
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// if (url === '/upload') {
//   res.setHeader('Content-Type', 'text/html');
//   res.write('<html>');
//   res.write('<head><title>Assignment 1</title></head>');
//   res.write('<body>');
//   res.write(`
//   <form action="/uploadFile" enctype="multipart/form-data" method="POST"> 
//       <span>Upload File:</span>   
//       <input type="file" name="mypic" required/> 
//       <br> 
//       <input type="submit" value="submit">  
//   </form> `);
//   res.write('</body>');
//   res.write('</html>');
//   return res.end();
// }
const app = express();
const port = 3000;

/**
 * Console log colors function.
 * e.g. console.log(`${g("this will be of a green color")}`)
 */
const { r, g, b, w, c, m, y, k } = [
  ['r', 1], ['g', 2], ['b', 4], ['w', 7],
  ['c', 6], ['m', 5], ['y', 3], ['k', 0],
].reduce((cols, col) => ({
  ...cols,  [col[0]]: f => `\x1b[3${col[1]}m${f}\x1b[0m`
}), {})

app.use(bodyParser.urlencoded({extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.statsend(`
  <h1>
    Hello from Express
  </h1>`);
})

app.listen(port);
console.log(`${g(`Express App listening on ${port}`)}`);