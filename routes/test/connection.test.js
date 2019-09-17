const request = require('supertest')
const express = require('express')

const baristas = require('../baristas')
const drinks = require('../drinks')
const orders = require('../orders')
const categories = require('../categories')
const order_items = require('../order_items')

const myBevDB = require('../myBevDB') 

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use('/drinks', drinks)
app.use('/categories', categories)
app.use('/orders', orders)
app.use('/baristas', baristas)
app.use('/order_items', order_items)

describe('Baristas routes', function(){
	describe('/baristas/*', function(){
		describe('landing without authentication',  function(){
			it('GET /baristas it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).get('/baristas')
				expect(response.status).toBe(401)
			})
			it('POST /baristas it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).post('/baristas')
				expect(response.status).toBe(401)
			})
			it('DELETE /baristas it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).delete('/baristas')
				expect(response.status).toBe(401)
			})

			it('GET /baristas/new it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).get('/baristas/new')
				expect(response.status).toBe(401)
			})
			it('GET /baristas/login it should return HTTP status 200 OK', async function(){
				const response = await request(app).get('/baristas/login')
				expect(response.status).toBe(200)
			})

			it('POST /baristas/session it should return HTTP status 302 Found', async function(){
				const response = await request(app)
					.post('/baristas/session')
					.auth('admin','supersecret')
					.send({
						username : "tinya",
						password : "1234"
					})
					.set('Content-Type', 'application/x-www-form-urlencoded')
				expect(response.status).toBe(302)
				myBevDB.currentUser = ''
				myBevDB.currentPosition = '' 
			})
		})
	})
})

describe('Drinks routes', function(){
	describe('/drinks/*', function(){
		describe('landing without authentication', function(){
			it('GET /drinks it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).get('/drinks')
				expect(response.status).toBe(401)
			})
			it('POST /drinks it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).post('/drinks')
				expect(response.status).toBe(401)
			})

			it('GET /drinks/new it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).get('/drinks/new')
				expect(response.status).toBe(401)
			})

			it('GET /drinks/search it should return HTTP status 200 OK', async function(){
				const response = await request(app).get('/drinks/search')
				expect(response.status).toBe(200)
			})

			it('GET /drinks/:id it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).get('/drinks/1')
				expect(response.status).toBe(401)
			})
			it('DELETE /drinks/:id it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).delete('/drinks/1')
				expect(response.status).toBe(401)
			})
			it('PUT /drinks/:id it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).put('/drinks/1')
				expect(response.status).toBe(401)
			})

			it('/drinks/:id/edit it should return HTTP status 401 Unauthorized', async function(){
				const response = await request(app).get('/drinks/1/edit')
				expect(response.status).toBe(401)
			})
		})
	})
})

describe('Orders routes', function(){
	describe('/Orders/*', function(){
		describe('landing without authentication', function(){
			it('GET /orders it should render baristas/login', async function(){
				const response = await request(app).get('/orders')
				expect(response.text).toMatchSnapshot()
			})
			it('GET /orders/new it should render baristas/login', async function(){
				const response = await request(app).get('/orders/new')
				expect(response.text).toMatchSnapshot()
			})
			it('GET /:id it should return HTTP status 200 OK', async function(){
				const response = await request(app).get('/orders/1')
				expect(response.status).toBe(200)
			})
			it('GET /:id/edit it should render baristas/login', async function(){
				const response = await request(app).get('/orders/1/edit')
				expect(response.text).toMatchSnapshot()
			})
		})
	})
})

describe('order_items routes', function(){
	describe('/order_items/*', function(){
		describe('landing without authentication', function(){
			it('POST /order_items it should render baristas/login', async function(){
				const response = await request(app).post('/order_items')
				expect(response.text).toMatchSnapshot()
			})
			it('DELETE /order_items/:id it should render baristas/login', async function(){
				const response = await request(app).delete('/order_items/1')
				expect(response.text).toMatchSnapshot()
			})
		})
	})
})