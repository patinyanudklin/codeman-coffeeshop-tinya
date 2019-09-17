const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({extended:true})
const myBevDB = require('./myBevDB') 
const { basicA, baristaAuth} = require('../custom-auth')

router.get('/', baristaAuth, async function( request, response){
	let ordersList = await myBevDB.getAllOrders()
	response.render('orders/ordersList', {ordersList})
})

router.get('/new', baristaAuth, async function( request, response){
	let order = await myBevDB.createNewOrder()
	let mode = 'NEW'
	response.render('orders/newAndEditOrder', { order, mode})
})

router.get('/:id', async function( request, response){
	const {id} = request.params
	let order = await myBevDB.getOrderDetails(id)
	let mode = 'VIEW'
	response.render('orders/newAndEditOrder', {order, mode})

})

router.get('/:id/edit', baristaAuth, async function( request, response){
	const {id} = request.params
	let order = await myBevDB.getOrderDetails(id)
	let mode = 'EDIT'
	response.render('orders/newAndEditOrder', { order, mode})
})

module.exports = router