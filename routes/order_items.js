const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({extended:true})
const myBevDB = require('./myBevDB') 
const { basicA, baristaAuth} = require('../custom-auth')

router.post('/', baristaAuth, urlencodedParser, async function( request, response){
	const { orderId, drinkCode, quantity} = request.body
	if( typeof orderId === 'undefined' || 
		typeof drinkCode === 'undefined' || 
		typeof quantity === 'undefined' ){
		response.send('error')
	}
	else {
		await myBevDB.addOrderItem(orderId, drinkCode, quantity)
		response.redirect(`/orders/${orderId}/edit`)
	}
})

router.delete('/:id', baristaAuth, urlencodedParser, async function( request,response){
	const {drinkCode} = request.query
	const {id} = request.params
	const orderId = id
	if(typeof drinkCode === 'undefined' || typeof id === 'undefined'){
		response.send('error')
	}
	else {
		await myBevDB.deleteOrderItem( orderId, drinkCode)
		response.redirect(`/orders/${orderId}/edit`)
	}
})

module.exports = router