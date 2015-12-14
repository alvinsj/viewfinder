var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('constants/app-constants').ActionTypes;
var BookmarkStore = require('stores/bookmark-store');

var _timelineMedias = null;

var _user = {};

var UserStore = assign({}, EventEmitter.prototype, {
    getUser: function(userId){
        return _user[userId];
    },
    dispatchToken: AppDispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.FETCH_USER:
                _user[action.user.id] = action.user;
                UserStore.emit(ActionTypes.FETCH_USER, action.user);
                break;
          }
    })
});

module.exports = UserStore;
