const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:true})
const compression = require('compression')

const app = express()

const drinks = require('./routes/drinks')
const orders = require('./routes/orders')
const baristas = require('./routes/baristas')
const categories = require('./routes/categories')
const order_items = require('./routes/order_items')

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')
app.use(compression())

app.use(function(req, res, next){
	if(req.query && typeof req.query && '_method' in req.query){
		const method = req.query._method
		delete req.query._method
		req.method = method
		req.url = req.path
	}
	next()
})

app.use('/drinks', drinks)
app.use('/categories', categories)

app.use('/orders', orders)
app.use('/baristas', baristas)
app.use('/order_items', order_items)


app.get('/', function(request, response){
		response.redirect('/baristas/login')
	})

app.listen(3000)