const myBevDB = require('./myBevDB')

const testAccount = {
	name: "User0001",
	username: "TestUser0001",
	password: "1234"
}

describe('myBevDB', function(){
	describe('Current user', function(){
		describe('Set Current User', function(){
			it('current user and position should be set', function(){

				expect(myBevDB.getCurrentUser()).toBe('')
				expect(myBevDB.isCurrentUserBarista()).toBeFalsy()
				myBevDB.setCurrentUser(testAccount.username)
				expect(myBevDB.getCurrentUser()).toBe(testAccount.username)
				expect(myBevDB.isCurrentUserBarista()).toBeTruthy()
			})
		})
	})

	describe('User', function(){
		describe('Get All User', function(){
			it('Show get all user', async function(){
				let result = await myBevDB.getAllUsers()
				expect(result).not.toBeFalsy()
			})
		})
	})

	describe('Order', function(){
		describe('Create new order', function(){
			it('It should be in the DB', async function(){
				let newOrder = await myBevDB.createNewOrder()
				let result = await myBevDB.getOrderById(newOrder.id)
				expect(newOrder.id).toBe(result.id)
				await myBevDB.deleteOrderById(result.id)
			})
		})
	})

	describe('Order Item', function(){
		describe('Create new order Item', function(){
			it('It should be in the DB', async function(){
				let drinkId = 1
				let quantity = 3
				let newOrder = await myBevDB.createNewOrder()
				await myBevDB.addOrderItem(newOrder.id, drinkId, quantity)
				let orderDetails = await myBevDB.getOrderDetails(newOrder.id)

				expect(orderDetails.id).toBe(newOrder.id)
				expect(orderDetails.drinks[0].id).toBe(drinkId)
				expect(orderDetails.drinks[0].quantity).toBe(quantity)

				await myBevDB.deleteOrderById(newOrder.id)
				await myBevDB.deleteOrderItem(newOrder.id, drinkId)
			})
		})
	})
})

