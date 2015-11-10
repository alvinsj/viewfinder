var AppDispatcher = require('dispatchers/app-dispatcher');
var ActionTypes = require('constants/app-constants').ActionTypes;
var StateStore = require('stores/state-store'),

    ig = StateStore.ig,
    localForage = require('localForage');

var _redirect_url = "http://alvinsj.com/viewfinder/ffos";

module.exports = {
    searchUser: function(query, cb) {
        var clientId = require('instagram').client_id;
        var path = `https://api.instagram.com/v1/users/search?q=${query}&client_id=${clientId}`;
        var request = new XMLHttpRequest({mozSystem: true});

        request.open('GET', path, true);
        request.responseType = 'json';

        request.addEventListener('load', function() {
            if (request.status  === 200) {
                cb(request.response.data);
                AppDispatcher.dispatch({
                    type: ActionTypes.SEARCH_USER,
                    users: request.response.data
                });
            }
        });

        request.send()
    },
    searchHashtag: function(query, cb) {
        var clientId = require('instagram').client_id;
        var path = `https://api.instagram.com/v1/tags/search?q=${query}&client_id=${clientId}`;
        var request = new XMLHttpRequest({mozSystem: true});

        request.open('GET', path, true);
        request.responseType = 'json';

        request.addEventListener('load', function() {
            if (request.status  === 200) {
                console.log(request.response.data)
                cb(request.response.data);
                AppDispatcher.dispatch({
                    type: ActionTypes.SEARCH_HASHTAG,
                    hashtags: request.response.data
                });
            }
        });

        request.send()
    },

    logout: function(){
        console.log('Logging out')

        var browser = document.getElementById('browser');
        var app = document.getElementById('app');

        browser.setAttribute('src', "https://instagram.com/accounts/logout");

        var dispatch = function(event){
            if(event.detail == "https://instagram.com/accounts/logout"){
            }else if(event.detail == "https://instagram.com/"){
                console.log('Logged out');
                browser.removeEventListener('mozbrowserlocationchange', dispatch);
                AppDispatcher.dispatch({
                    type: ActionTypes.LOGOUT
                });
            }
        };
        browser.addEventListener('mozbrowserlocationchange', dispatch);
    },
    getInstagramCode: function(){
        console.log('getInstagramCode')

        StateStore.ig = require('instagram-node').instagram();
        ig = StateStore.ig;
        ig.use(require('instagram'));

        var auth_url = ig.get_authorization_url(_redirect_url);
        var browser = document.getElementById('browser');
        var app = document.getElementById('app');

        app.style.display = 'none';
        browser.style.display = 'block';

        browser.addEventListener('mozbrowserlocationchange', function(event){
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
        browser.setAttribute('src', auth_url);
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

       localForage.getItem('timeline', function(err, medias) {
               if(err) console.log(err);
            if(medias) {
                AppDispatcher.dispatch({
                    type: ActionTypes.FETCH_TIMELINE,
                    medias: medias
                })
            }
       });
       ig.user_self_feed(function(err, medias, pagination, remaining, limit) {
              if(err) console.log(err);

           AppDispatcher.dispatch({
                type: ActionTypes.FETCH_TIMELINE,
                medias: medias
            });
           localForage.setItem('timeline', medias, function() {});
       });

    },
    fetchUserTimeline: function(user){
        console.log('fetchUserTimeline', user);

        localForage.getItem('user:'+user.id+':timeline:', function(err, medias) {
            if(err) console.log(err);
            if(medias) {
                AppDispatcher.dispatch({
                    type: ActionTypes.FETCH_USER_TIMELINE,
                    user: user,
                    medias: medias
                })
            }
        });

        var clientId = require('instagram').client_id;
        var path = `https://api.instagram.com/v1/users/${user.id}/media/recent?client_id=${clientId}`;
        // We'll download the user's photo with AJAX.
        var request = new XMLHttpRequest({mozSystem: true});

        // Let's get the first user's photo.
        request.open('GET', path, true);
        request.responseType = 'json';

        // When the AJAX state changes, save the photo locally.
        request.addEventListener('load', function() {
            if (request.status  === 200) { // readyState DONE
                // We store the binary data as-is; this wouldn't work with localStorage.
                console.log(path, request.response)
                AppDispatcher.dispatch({
                     type: ActionTypes.FETCH_USER_TIMELINE,
                     user: user,
                     medias: request.response.data
                 });
                localForage.setItem('user:'+user.id+':timeline', medias, function() {});
            }else{
                console.error(request);
            }
        });

        request.send()
    },
    fetchHashtagTimeline: function(hashtag){
        console.log('fetchHashtagTimeline', hashtag);

        localForage.getItem('hashtag:'+hashtag+':timeline:', function(err, medias) {
            if(err) console.log(err);
            if(medias) {
                AppDispatcher.dispatch({
                    type: ActionTypes.FETCH_HASHTAG_TIMELINE,
                    hashtag: hashtag,
                    medias: medias
                })
            }
        });

        var clientId = require('instagram').client_id;
        var path = `https://api.instagram.com/v1/tags/${hashtag}/media/recent?client_id=${clientId}`;
        // We'll download the user's photo with AJAX.
        var request = new XMLHttpRequest({mozSystem: true});

        // Let's get the first user's photo.
        request.open('GET', path, true);
        request.responseType = 'json';

        // When the AJAX state changes, save the photo locally.
        request.addEventListener('load', function() {
            if (request.status  === 200) { // readyState DONE
                // We store the binary data as-is; this wouldn't work with localStorage.
                console.log(path, request.response)
                AppDispatcher.dispatch({
                     type: ActionTypes.FETCH_HASHTAG_TIMELINE,
                     hashtag: hashtag,
                     medias: request.response.data
                 });
                localForage.setItem('hashtag:'+hashtag+':timeline', medias, function() {});
            }else{
                console.error(request);
            }
        });

        request.send()
    }
}
