var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('constants/app-constants').ActionTypes;
var _timelineMedias = null;

var _userTimeline = {}, _hashtagTimeline = {};;

var MediaStore = assign({}, EventEmitter.prototype, {
    getTimelineMedias: function(){
        return _timelineMedias;
    },
    getUserTimeline: function(userId){
        return _userTimeline[userId];
    },
    getHashtagTimeline: function(hashtag){
        return _hashtagTimeline[hashtag];
    },
    dispatchToken: AppDispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.FETCH_TIMELINE:
                _timelineMedias = action.medias;
                MediaStore.emit(ActionTypes.FETCH_TIMELINE, _timelineMedias);
                break;

            case ActionTypes.FETCH_USER_TIMELINE:
                console.log(action);
                _userTimeline[action.user.id] = action.medias;
                MediaStore.emit(ActionTypes.FETCH_USER_TIMELINE, action.medias);
                break;

            case ActionTypes.FETCH_HASHTAG_TIMELINE:
                console.log(action);
                _userTimeline[action.hashtag.name] = action.medias;
                MediaStore.emit(ActionTypes.FETCH_HASHTAG_TIMELINE, action.medias);
                break;
            default:
              // do nothing
          }
    })
});

module.exports = MediaStore;
