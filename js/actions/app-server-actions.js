var AppDispatcher = require('dispatchers/app-dispatcher');
var ActionTypes = require('constants/app-constants').ActionTypes;
var StateStore = require('stores/state-store');
var BookmarkStore = require('stores/bookmark-store');
var MediaStore = require('stores/media-store');

var localForage = require('localForage');
var AppViewActions = require('actions/app-view-actions');
var _redirect_url = "http://alvinsj.com/viewfinder/ffos";

var AppServerActions = {
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
                cb(request.response.data);
                AppDispatcher.dispatch({
                    type: ActionTypes.SEARCH_HASHTAG,
                    hashtags: request.response.data
                });
            }
        });

        request.send()
    },

    fetchUserTimeline: function(user){
        localForage.getItem('user:'+user.id+':timeline', function(err, medias) {
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
                let medias = request.response.data;
                AppDispatcher.dispatch({
                     type: ActionTypes.FETCH_USER_TIMELINE,
                     user: user,
                     medias: medias
                 });
                localForage.setItem('user:'+user.id+':timeline', medias, function() {});
            }else{
                console.error(request);
            }
        });

        request.send()
    },
    fetchUser: function(user){
        localForage.getItem('user:'+user.id+':data', function(err, userData) {
            if(err) console.log(err);
            if(userData) {
                AppDispatcher.dispatch({
                    type: ActionTypes.FETCH_USER,
                    user: userData
                })
            }
        });

        var clientId = require('instagram').client_id;
        var path = `https://api.instagram.com/v1/users/${user.id}?client_id=${clientId}`;
        // We'll download the user's photo with AJAX.
        var request = new XMLHttpRequest({mozSystem: true});

        // Let's get the first user's photo.
        request.open('GET', path, true);
        request.responseType = 'json';

        // When the AJAX state changes, save the photo locally.
        request.addEventListener('load', function() {
            if (request.status  === 200) { // readyState DONE
                // We store the binary data as-is; this wouldn't work with localStorage.
                let userData = request.response.data;
                AppDispatcher.dispatch({
                     type: ActionTypes.FETCH_USER,
                     user: userData
                 });
                localForage.setItem('user:'+user.id+':data', userData, function() {});
            }else{
                console.error(request);
            }
        });

        request.send()
    },
    fetchHashtagTimeline: function(hashtag){
        localForage.getItem('hashtag:'+hashtag+':timeline', function(err, medias) {
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
                let medias = request.response.data;
                AppDispatcher.dispatch({
                     type: ActionTypes.FETCH_HASHTAG_TIMELINE,
                     hashtag: hashtag,
                     medias: medias
                 });
                localForage.setItem('hashtag:'+hashtag+':timeline', medias, function() {});
            }else{
                console.error(request);
            }
        });

        request.send()
    },
    fetchBookmarkTimeline: function(hashtag){
        localForage.getItem('bookmark:timeline', function(err, medias) {
            if(err) console.log(err);
            if(medias) {
                AppDispatcher.dispatch({
                    type: ActionTypes.FETCH_BOOKMARK_TIMELINE,
                    medias: medias
                })
            }
        });

        AppViewActions.fetchBookmarks(function(){
            BookmarkStore.getUserBookmarks().forEach((user) => {
                if(!MediaStore.getUserTimeline(user.id))
                    AppServerActions.fetchUserTimeline(user);
            });
            BookmarkStore.getHashtagBookmarks().forEach((hashtag) => {
                if(!MediaStore.getUserTimeline(hashtag.name))
                    AppServerActions.fetchHashtagTimeline(hashtag.name);
            });
        });
    }
}

module.exports = AppServerActions;
