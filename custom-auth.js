
const myBevDB = require('./routes/myBevDB') 
const basicAuth = require('express-basic-auth')

let basicA = basicAuth({
	users:{'admin':'1q2w3e4r'},
	challenge: true
})

let baristaAuth = function (req, res, next) {
  if(!myBevDB.isCurrentUserBarista()){
  	return res.render('users/login')
  }
  else
  	return next()
}


module.exports = {
	basicA: basicA,
	baristaAuth: baristaAuth
}