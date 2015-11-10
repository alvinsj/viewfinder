var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('constants/app-constants').ActionTypes;

var _userSearchHistory = [], _hashtagSearchHistory;

var SearchStore = assign({}, EventEmitter.prototype, {
    getUserSeachHistory: function(){
        return _userSearchHistory;
    },
    getHashtagSeachHistory: function(){
        return _hashtagSearchHistory;
    },
    dispatchToken: AppDispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.SEARCH_USER:
                _userSearchHistory = action.users;
                SearchStore.emit(ActionTypes.SEARCH_USER, _userSearchHistory);
                break;

            case ActionTypes.SEARCH_HASHTAG:
                _hashtagSearchHistory = action.hashtags;
                SearchStore.emit(ActionTypes.SEARCH_HASHTAG, _hashtagSearchHistory);
                break;
            default:
              // do nothing
          }
    })
});

module.exports = SearchStore;
