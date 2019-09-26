$(function(){
	var card = function(drink){
		return `
				<div class="panel-block" style="border-radius: 0px">
					<div class="column" style="text-align: center">
						<img src="`+drink.imgUrl+`" alt="`+drink.drink_name+`" style="width:75px">
					</div>
					<div class="column">
						<p style="text-align: left"> Id:`+drink.id+` `+drink.drink_name+` `+ drink.price+` ฿</p>
					</div>
				</div>
				`
	}
	var input = $('[name="query"]')
	
	// list to add the data
	var list = $('#drinks')
	$(input).on('input', function(event){
		clearTimeout(this.delay)
		this.delay = setTimeout(function(){
			$(this).trigger('search')
		}.bind(this), 800)
	}).on('search', function(){
		var url = window.location.origin + '/drinks/search'
		var q = this.value
		if(q){
			url = url + '?q=' + q	
		}
		else{
			url = url + '?q=All'
		}
		$.ajax({
			url: url,
			success: function(data){
				console.log('got this data...')
				console.log(data)
				var drinks = data.drinks
				list.empty()
				for(var i=0; i< drinks.length; i++){
					list.append(card(drinks[i]))
				}
			}
		})
	})
	// invoke 1 time for 1st landing
	$(input).trigger('search')

})