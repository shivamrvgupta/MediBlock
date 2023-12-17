const jwt = require('jsonwebtoken');
const models = require('../models');
const express = require("express");
const cookieParser = require('cookie-parser');
secretKey = process.env.SECRET_KEY
const app = express();



// This is a set of revoked tokens. In production, this should be a database table.

module.exports = {  

  authenticateToken:async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      console.log("Token is not verified")
      return res.redirect('/'); 
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.redirect('/');
      }
      req.user = user; 
      next(); 
    })
  },
  
  generateAccessToken: (user) => {
    const userObject = {
      userId: user._id,
      first_name : user.first_name,
      last_name : user.last_name,
      email : user.email,
      phone : user.phone,
    };
    return jwt.sign(userObject , secretKey, { expiresIn: '24h' });
  },
};
