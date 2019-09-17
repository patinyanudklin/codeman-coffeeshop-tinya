const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({extended:true})
const myBevDB = require('./myBevDB') 
const {basicA, baristaAuth} = require('../custom-auth')
const app = express()

router.route('/')
	.get( basicA, async function( request, response){
		let baristas = await myBevDB.getAllUsers()
		response.render('baristas/baristasList', {baristas})
	})
	.post( basicA, urlencodedParser, async function( request, response){
		const { name, username, password} = request.body
		await myBevDB.createUser(name, username, password)
		response.redirect('/baristas/login')
	})
	.delete( basicA, urlencodedParser, async function(request, response){
		const {id} = request.query
		await myBevDB.deleteUser(id, '')
		response.redirect('/baristas/login')
	})

router.get('/new', basicA, function( request, response){
	response.render('users/signup')
})

router.get('/login', function( request, response){
	response.render('users/login')
})

router.post('/session', urlencodedParser, async function( request, response){
		const {username, password} = request.body
		const status = await myBevDB.login(username, password)
		if(status == 0){
			response.redirect('/drinks')
		}else{
			response.redirect('/baristas/login')
		}
})

module.exports = router