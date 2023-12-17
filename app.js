//jshint esversion:6
require("dotenv").config();
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const path = require("path"); 
const morgan = require("morgan")
const db = require('./managers/models/db')
const routesWeb = require('./web');

app.use(cookieParser());
app.set('view engine', 'ejs'); // Set EJS as the default template engine
app.set('views', path.join(__dirname, './src/views')); // Set views directory
// Parse JSON-encoded request bodies
app.use(bodyParser.json({ extended: true }));

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static("./src/public/general-css"));
app.use('/private',express.static("./src/public/admin-css"));

app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

app.use('/images', express.static(path.join(__dirname, './src/uploads')));


app.get('/test', (req, res) => {
    const response = {
      message: 'Hello, User!'
    };
    res.json(response);
  });

app.use(routesWeb);


ports = [process.env.PORT, process.env.PORT1, process.env.PORT2]
// Loop through the ports and start the server on each port
ports.forEach((port) => {
    app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    });
});