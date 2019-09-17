const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:true})
const router = express.Router()
const myBevDB = require('./myBevDB') 
const { basicA, baristaAuth} = require('../custom-auth')

router.route('/')
	.get( basicA, async function(request, response){
		const {q, category} = request.query
		let drinks = []
		let categories = []
		if(q) {
			drinks = await myBevDB.getDrinksBySearch(q)
			categories = await myBevDB.getAllCategories()		
		}
		else if(category){
			drinks = await myBevDB.getDrinksByCategory(category)
			categories = await myBevDB.getAllCategories()
		}
		else{
			drinks = await myBevDB.getAllDrinks()
			categories = await myBevDB.getAllCategories()
		}
		response.render('drinks/drinksList', {categories, drinks})
	})
	.post(urlencodedParser, basicA, async function(request, response){
		// create new drink
		const {category, drinkName, drinkImgUrl, drinkPrice} = request.body
		await myBevDB.createDrink(drinkName, category, drinkPrice, drinkImgUrl)
		response.redirect('/drinks/')
	})

router.get('/new', basicA, async function(request, response){
	const categories = await myBevDB.getAllCategories()
	response.render('drinks/newDrink', {categories})
})

router.get('/search', baristaAuth, urlencodedParser, async function(request, response){
	const {q, category} = request.query
	let drinks = []
	
	if(q=='All')
		drinks = await myBevDB.getAllDrinks()	
	else
		drinks = await myBevDB.getDrinksBySearch(q)

	if(q){
		response.json({drinks: drinks})
	}else if(category){
		response.redirect(`/drinks?category=${category}`)
	}
	else
	{
		response.redirect(`/drinks`)	
	}
})

router.route('/:id')
	.get(urlencodedParser, basicA, async function(request, response){
		const {id} = request.params
		const drink = await myBevDB.getDrinkById(id)
		response.render('drinks/showDrink', {drink})
	})
	.delete(urlencodedParser, basicA, async function(request, response){
		const {id} = request.params
		await myBevDB.deleteDrink(id)
		response.redirect('/drinks')
	})
	.put(urlencodedParser, basicA, async function(request, response){
		const {id} = request.params
		const {drinkName, category, drinkPrice, drinkImgUrl} = request.body
		await myBevDB.updateDrink( id, drinkName, category, drinkPrice, drinkImgUrl)
		response.redirect('/drinks')
	})

router.get('/:id/edit', basicA, urlencodedParser, async function(request, response){
	const {id} = request.params
	const categories = await myBevDB.getAllCategories()
	response.render('drinks/editDrink', {id, categories})
})

module.exports = router