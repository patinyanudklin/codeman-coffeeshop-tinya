const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:true})
const router = express.Router()

const myBevDB = require('./myBevDB') 

router.get('/', async function(request, response){
		const categories = await myBevDB.getAllCategories()
		response.render('categories/categoriesList', {categories})
	})

router.post('/', urlencodedParser, async function(request, response){
		const {categoryName} = request.body
		await myBevDB.createCategory(categoryName)
		response.redirect('/categories/')
	})

router.delete('/:id', urlencodedParser, async function(request, response){
		const {id} = request.params
		await myBevDB.deleteCategory(id)
		response.redirect('/categories/')
	})

router.get('/new', function(request, response){
		response.render('categories/newCategory')
	})

module.exports = router