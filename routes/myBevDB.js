const Sequelize = require('sequelize')
const {userAuthentication} = require('./helper')
const Op = Sequelize.Op
const { users, drinks, categories, orders, orderItems} = require('../models')

const User = users
const Drink = drinks
const Category = categories
const Order = orders
const OrderItem = orderItems

module.exports = {
	currentUser: '',
	currentPosition: '',
	setCurrentUser: function(username){
		this.currentUser = username
		this.currentPosition = 'Barista'
		console.log(`Set current user: ${this.currentUser}`)
	},
	isCurrentUserBarista: function(){
		if(this.currentPosition == 'Barista'){
			return true
		}
		else{
			return false
		}
	},
	getCurrentUser: function(){
		return this.currentUser
	},
	initTestDataset: function(){
		this.createUser("Tin", "tinya", "1234")
		this.createUser("Akarin", "akarin", "1234")
		this.createUser("Rinchan", "rinrin", "1234")
		this.createCategory("Soft Drink") // id: 1
		this.createCategory("Coffee") // id: 2
		this.createDrink("CocaCola", 1, 15, "https://www.dollargeneral.com/media/catalog/product/cache/image/e9c3970ab036de70892d86c6d221abfe/0/0/00049000050103_main.jpg")
		this.createDrink("Cappucino", 2, 45, "https://upload.wikimedia.org/wikipedia/commons/c/c8/Cappuccino_at_Sightglass_Coffee.jpg")
		this.createDrink("Sprite", 1, 13, "https://digitalcontent.api.tesco.com/v1/media/ghs/snapshotimagehandler_1854753346.jpeg")
	},
	getAllUsers: async function(){
		return User.findAll({raw: true})
	},
	getUserByName: async function(username){
		return await User.findOne({where:{username:username}, raw:true})
	},
	createUser: async function(name, username, password){
		await User.create({
			name: name,
			username: username, 
			password: password
		})
	},
	deleteUser: async function(id, username){

		let condition = {}
		if(id) condition.id = id
		if(username) condition.username = username

		await User.destroy({
			where: condition
		})
	},
	login: async function(username, password){
		const user = await this.getUserByName(username) 
		if(userAuthentication(username, password, user)==0){
			this.setCurrentUser(username)
			return 0
		}
		else
			return -1
	},
	createDrink: async function(name, category, price, imgUrl){
		Drink.create({
			drink_name: name, 
			category: category, 
			price: price, 
			imgUrl: imgUrl
		})
	},
	createCategory: async function(category){
		Category.create({
			category: category
		})
	},
	getAllCategories: async function()
	{
		const catList = await Category.findAll({raw: true})
		return catList
	},
	getAllDrinks: async function()
	{
		const drinkList = await Drink.findAll({raw: true})
		return drinkList
	},
	getDrinksByCategory: async function(category){
		const drinkList = await Drink.findAll({where:{category: category}})
		return drinkList
	},
	getDrinksBySearch: async function(search){
		const drinkList = await Drink.findAll({
			where: {drink_name: {[Op.substring]: search}}
		})
		return drinkList
	},
	getDrinkById: async function(id){
		let drinkObj = {}
	    await Drink.findByPk(id).then(drink=>{
	    	drinkObj.id = drink.id
	    	drinkObj.category = drink.category
	    	drinkObj.drink_name = drink.drink_name
	    	drinkObj.price = drink.price
	    	drinkObj.imgUrl	= drink.imgUrl
	    })
	    return drinkObj
	},
	updateDrink: async function( id, name, category, price, imgUrl){
		await Drink.findOne({where: {id: id}}).then(async drink=>{
			await drink.update({
				drink_name: name,
				category: category,
				price: price,
				imgUrl: imgUrl
			})
		})
	},
	deleteDrink: async function(id){
		Drink.destroy({where: {id: id}})
	},
	deleteCategory: async function(id){
		Category.findOne({where: {id:id}}).then(category=>{
			Drink.destroy({where:{category: category.category}})
			category.destroy()
		})
	},
	getAllOrders: async function(){
		return await Order.findAll({raw:true})
	},
	getOrderById: async function(id){
		return await Order.findOne({where:{id:id}, raw:true})
	},
	deleteOrderById: async function(id){
		await Order.destroy({where:{id:id}})
	},
	createNewOrder: async function(){
		let newOrder = await Order.create({
			status: 'NEW'
		})
		newOrder.totalPrice = 0
		return newOrder
	},
	addOrderItem: async function(orderId, beverageId, quantity){
		/* Might have too many DB call, Improvement needed */
		await OrderItem.findOne({
			raw:true,
			where:{
				order_id: orderId,
				beverage_id: beverageId
			}})
			.then(async function(result){
				if(result){
					console.log(result)
					await OrderItem.update({
						quantity: result.quantity+parseInt(quantity,10)
					}, 
					{
						where: {
							order_id: orderId,
							beverage_id: beverageId
						}
					})
				}
				else{
					console.log('create new row')
					await OrderItem.create({
						order_id: orderId,
						beverage_id: beverageId,
						quantity: parseInt(quantity,10)
					})
				}
			})
	},
	deleteOrderItem: async function(orderId, beverageId){
		await OrderItem.destroy({
			where: {
				order_id: orderId,
				beverage_id: beverageId
			}
		})
	},
	getOrderDetails: async function(orderId){
		let order = {id: parseInt(orderId,10), totalPrice: 0}

		await OrderItem.findAll({
			raw:true,
			where: {
				order_id: orderId
			}
		})
		.then(async function(result){
			if(result.length == 0){
				order.drinks = []
				return order
			}
			let listOfBevId = result.map(x=>x.beverage_id)
			let drinksList = await Drink.findAll({raw:true, where:{id: listOfBevId}})

			// add quantity property into drink obj
			drinksList.map( x => x.quantity = result.filter(y => y.beverage_id == x.id)[0].quantity)
			
			drinksList.forEach(function(drink){
				order.totalPrice += drink.price * drink.quantity
			})
			order.drinks = drinksList
		})
		return order
	}
}