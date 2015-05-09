var AppDispatcher = require('dispatchers/app-dispatcher');
var ActionTypes = require('constants/app-constants').ActionTypes;

module.exports = {
	viewDetails: function(media){
		AppDispatcher.dispatch({
			type: ActionTypes.VIEW_DETAILS,
      		media: media})
	},
	viewUser: function(user){
		AppDispatcher.dispatch({
			type: ActionTypes.VIEW_USER,
      		user: user})
	},
	backToHome: function(){
		AppDispatcher.dispatch({
			type: ActionTypes.BACK_TO_HOME})
	}
}