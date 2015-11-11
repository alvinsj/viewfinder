var AppDispatcher = require('dispatchers/app-dispatcher');
var ActionTypes = require('constants/app-constants').ActionTypes;
var localForage = require('localforage');

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
    },
    viewSettings: function(){
        AppDispatcher.dispatch({
            type: ActionTypes.VIEW_SETTINGS})
    },
    addUserBookmark: function(user){
        var setItem = (users) => {
            localForage.setItem('user:bookmarks', users, () => {
                AppDispatcher.dispatch({
                    type: ActionTypes.ADD_USER_BOOKMARK,
                    users: users
                });
            });
        };

        localForage.getItem('user:bookmarks', (err, users) => {
            if(err) console.log(err);
            users = users || [];

            var exists = users.reduce((truth, u) => {
                return u.id === user.id;
            }, false);

            if(!exists) users.push(user);
            setItem(users.sort((a,b) => {
                return a.username - b.username;
            }));
        });
    },
    removeUserBookmark: function(user){
        var setItem = (users) => {
            localForage.setItem('user:bookmarks', users, () => {
                AppDispatcher.dispatch({
                    type: ActionTypes.REMOVE_USER_BOOKMARK,
                    users: users
                });
            });
        };

        localForage.getItem('user:bookmarks', (err, users) => {
            if(err) console.log(err);
            users = users || [];

            var exists = users.reduce((truth, t, index) => {
                if(t.id === user.id || t === user) return index;
                return truth;
            }, -1);
            if(exists > -1) users.splice(exists, 1);

            setItem(users.sort((a,b) => {
                return a.username - b.username;
            }));
        });
    },
    addHashtagBookmark: function(hashtag){
        var setItem = (hashtags) => {
            localForage.setItem('hashtag:bookmarks', hashtags, () => {
                AppDispatcher.dispatch({
                    type: ActionTypes.ADD_HASHTAG_BOOKMARK,
                    hashtags: hashtags
                });
            });
        };

        localForage.getItem('hashtag:bookmarks', (err, hashtags) => {
            if(err) console.log(err);
            hashtags = hashtags || [];

            var exists = hashtags.reduce((truth, t) => {
                return t.name === hashtag.name;
            }, false);

            if(!exists) hashtags.push(hashtag);

            setItem(hashtags.sort((a,b) => {
                return a.name - b.name;
            }));
        });
    },
    removeHashtagBookmark: function(hashtag) {
        var setItem = (hashtags) => {
            localForage.setItem('hashtag:bookmarks', hashtags, () => {
                AppDispatcher.dispatch({
                    type: ActionTypes.REMOVE_HASHTAG_BOOKMARK,
                    hashtags: hashtags
                });
            });
        };

        localForage.getItem('hashtag:bookmarks', (err, hashtags) => {
            if(err) console.log(err);
            hashtags = hashtags || [];

            var exists = hashtags.reduce((truth, t, index) => {
                if(t.name === hashtag.name || t === hashtag) return index;
                return truth;
            }, -1);
            if(exists > -1) hashtags.splice(exists, 1);

            setItem(hashtags.sort((a,b) => {
                return a.name - b.name;
            }));
        });
    },
    saveBookmarksTimeline: function(all){
        localForage.setItem('bookmark:timeline', all, function() {});
    },
    fetchBookmarks: function(cb){
        localForage.getItem('user:bookmarks', (err, users) => {
            if(err) console.log(err);
            users = users || [];

            AppDispatcher.dispatch({
                type: ActionTypes.GET_USER_BOOKMARKS,
                users: users
            });
            if(cb) cb();
        });

        localForage.getItem('hashtag:bookmarks', (err, hashtags) => {
            if(err) console.log(err);
            hashtags = hashtags || [];

            AppDispatcher.dispatch({
                type: ActionTypes.GET_HASHTAG_BOOKMARKS,
                hashtags: hashtags
            });
            if(cb) cb();
        });
    }
}
