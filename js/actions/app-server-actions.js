var AppDispatcher = require('dispatchers/app-dispatcher');
var ActionTypes = require('constants/app-constants').ActionTypes;
var StateStore = require('stores/state-store'),
	ig = StateStore.ig,
	localForage = require('localForage');

var _redirect_url = "http://alvinsj.com/viewfinder/ffos";

module.exports = {
	getInstagramCode: function(){
		console.log('getInstagramCode')
		var auth_url = ig.get_authorization_url(_redirect_url);

	    var browser = document.getElementById('browser');
        var app = document.getElementById('app');
        app.style.display = 'none';
        browser.style.display = 'block';
        browser.setAttribute('src', auth_url);
        browser.addEventListener('mozbrowserlocationchange',function(event){
            if(event.detail.indexOf('http://alvinsj.com') == 0){
                var url = new URL(event.detail);
                browser.stop();
                browser.style.display = 'none';
                app.style.display = 'block';
                AppDispatcher.dispatch({
                	type: ActionTypes.INSTAGRAM_CODE,
                	code: url.search.slice(6)
                });
            }
        });
	},
	getInstagramAccessToken: function(code){
		console.log('getInstagramAccessToken')
		var code = StateStore.getInstagramCode();

		ig.authorize_user(code, _redirect_url, function(err, result){
            if (err) {
                console.log('error: ', err);
            } else {
                ig.use({ access_token: result.access_token });
                AppDispatcher.dispatch({
                	type: ActionTypes.INSTAGRAM_ACCESS_TOKEN,
                	access_token: result.access_token
                })
            } 
        });
	},
	fetchTimeline: function(){
		console.log('fetchTimeline');
		var access_token = StateStore.getInstagramAccessToken();

        if(access_token){
           localForage.getItem('timeline', function(err, medias) {
                if(medias) {
                    AppDispatcher.dispatch({
                    	type: ActionTypes.FETCH_TIMELINE,
                    	medias: medias
                    })
                }
           });
           ig.user_self_feed(function(err, medias, pagination, remaining, limit) {
               AppDispatcher.dispatch({
                	type: ActionTypes.FETCH_TIMELINE,
                	medias: medias
                });
               localForage.setItem('timeline', medias, function() {});
           });   
        }else{
        	AppServerAction.getInstagramCode();
        }
	},
	fetchUserTimeline: function(user){
		console.log('fetchUserTimeline', user);
		var access_token = StateStore.getInstagramAccessToken();

        if(access_token){
           localForage.getItem('user:'+user.id+':timeline:', function(err, medias) {
                if(medias) {
                    AppDispatcher.dispatch({
                    	type: ActionTypes.FETCH_USER_TIMELINE,
                    	user: user,
                    	medias: medias
                    })
                }
           });
           ig.user_media_recent(user.id, function(err, medias, pagination, remaining, limit) {
               AppDispatcher.dispatch({
                	type: ActionTypes.FETCH_USER_TIMELINE,
                	user: user,
                	medias: medias
                });
               localForage.setItem('user:'+user.id+':timeline', medias, function() {});
           });   
        }else{
        	AppServerAction.getInstagramCode();
        }
	}
}