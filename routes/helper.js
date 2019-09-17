module.exports = {
	userAuthentication: function(inputUser, inputPass, dbUser){
		if(dbUser == null ){
			console.log(`'${inputUser}' doesn't existed!`)
			return -1
		}

		if(dbUser.password != inputPass){
			console.log(`Incorrect password!`)
			return -1
		}
		else if(dbUser.username == inputUser && dbUser.password == inputPass){
			console.log('Login success!')
			return 0
		}
		console.log('Unknown Error')
		return -1
	}
}