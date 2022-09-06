const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../../models/People')
const { restart } = require('nodemon')

const protect = asyncHandler(async (req, res, next) => {
  let token
 
console.log(1111111)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]
     
      if (!token) {
      throw new Error('Authentication failed!');
    } 
      // Verify token
      const decoded = jwt.verify(token, "chagneit")
 
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error)
      let errorstat = error
      res.status(401).json(errorstat)
     // res.redirect('/error')

      // res.redirect('/login?failed=true'); 
     // res.redirect('http://localhost:3000/login');
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }
