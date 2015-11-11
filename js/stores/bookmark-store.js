var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('constants/app-constants').ActionTypes;

var _hashtagBookmarks = [], _userBookmarks = [];

var BookmarkStore = assign({}, EventEmitter.prototype, {
    getUserBookmarks: function(){
        return _userBookmarks;
    },
    getHashtagBookmarks: function(){
        return _hashtagBookmarks;
    },
    dispatchToken: AppDispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.GET_USER_BOOKMARKS:
                _userBookmarks = action.users;
                BookmarkStore.emit(ActionTypes.GET_USER_BOOKMARKS, _userBookmarks);
                break;

            case ActionTypes.GET_HASHTAG_BOOKMARKS:
                _hashtagBookmarks = action.hashtags;
                BookmarkStore.emit(ActionTypes.GET_HASHTAG_BOOKMARKS, _hashtagBookmarks);
                break;

            case ActionTypes.ADD_USER_BOOKMARK:
                _userBookmarks = action.users;
                BookmarkStore.emit(ActionTypes.ADD_USER_BOOKMARK, _userBookmarks);
                break;

            case ActionTypes.ADD_HASHTAG_BOOKMARK:
                _hashtagBookmarks = action.hashtags;
                BookmarkStore.emit(ActionTypes.ADD_HASHTAG_BOOKMARK, _hashtagBookmarks);
                break;

            case ActionTypes.REMOVE_USER_BOOKMARK:
                _userBookmarks = action.users;
                BookmarkStore.emit(ActionTypes.ADD_USER_BOOKMARK, _userBookmarks);
                break;

            case ActionTypes.REMOVE_HASHTAG_BOOKMARK:
                _hashtagBookmarks = action.hashtags;
                BookmarkStore.emit(ActionTypes.ADD_HASHTAG_BOOKMARK, _hashtagBookmarks);
                break;
            default:
              // do nothing
          }
    })
});

module.exports = BookmarkStore;
