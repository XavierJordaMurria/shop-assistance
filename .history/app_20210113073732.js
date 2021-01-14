const http = require('http');
const path = require("path") 
const express = require('express');
    

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



app.use((req, res, next) => { console.log('Hi middlewate'); next()})

app.use((req, res, next) => { 
  res.send(`
  <h1>
    Hello from Express
  </h1>`)
})

app.listen()
console.log(`Express App listening on 3000`);