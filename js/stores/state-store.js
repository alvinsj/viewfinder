var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('dispatchers/app-dispatcher');
var ActionTypes = require('constants/app-constants').ActionTypes;
var _access_token = null, _code = null;

var StateStore = assign({}, EventEmitter.prototype, {
    getInstagramCode: function(){
        return _code;
    },
    getInstagramAccessToken: function(){
        return _access_token;
    },
    dispatchToken: AppDispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.INSTAGRAM_CODE:
                _code = action.code;
                StateStore.emit(ActionTypes.INSTAGRAM_CODE, action.code);
                break;

            case ActionTypes.INSTAGRAM_ACCESS_TOKEN:
                _access_token = action.access_token;
                StateStore.emit(ActionTypes.INSTAGRAM_ACCESS_TOKEN, action.access_token);
                break;

            case ActionTypes.VIEW_DETAILS:
                  StateStore.emit(ActionTypes.VIEW_DETAILS, action.media);
                  break;

            case ActionTypes.VIEW_USER:
                  StateStore.emit(ActionTypes.VIEW_USER, action.user);
                  break;

            case ActionTypes.BACK_TO_HOME:
                  StateStore.emit(ActionTypes.BACK_TO_HOME);
                  break;

            case ActionTypes.VIEW_SETTINGS:
                StateStore.emit(ActionTypes.VIEW_SETTINGS);
                break;

            case ActionTypes.LOGOUT:
                _code = null;
                _access_token = null;
                StateStore.emit(ActionTypes.LOGOUT);
                break;

            default:
              // do nothing
          }
    })
});

module.exports = StateStore;
