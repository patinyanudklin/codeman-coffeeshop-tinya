const helper = require('./helper')

describe('helper', function(){
	describe('User Authentication', function(){
		describe('Get correct user with correct password', function(){
			it('should return 0', function(){
				const user = "TestAcct"
				const password = "TestPass"
				const dbUser = {
					username: user,
					password: password
				}
				expect(helper.userAuthentication(user, password, dbUser)).toBe(0)
			})
		})

		describe('Get correct user with incorrect password', function(){
			it('should return -1', function(){
				const user = "TestAcct"
				const password = "TestPass"
				const dbUser = {
					username: user,
					password: "IncorrectPassword"
				}
				expect(helper.userAuthentication(user, password, dbUser)).toBe(-1)
			})
		})

		describe('Get not existed user', function(){
			it('should return -1', function(){
				const user = "TestAcct"
				const password = "TestPass"
				const dbUser = null
				expect(helper.userAuthentication(user, password, dbUser)).toBe(-1)
			})
		})
	})

})