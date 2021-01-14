const http = require('http');
const path = require("path") 
const express = require('express');
    

const app = express();

const server = http.createServer(app);

server.listen(3000);