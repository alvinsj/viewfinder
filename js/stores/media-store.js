var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('dispatchers/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('constants/app-constants').ActionTypes;
var BookmarkStore = require('stores/bookmark-store');

var _timelineMedias = null;

var _userTimeline = {}, _hashtagTimeline = {};

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
    getBookmarkTimeline: function() {
        var bookmarkTimeline = [];
        var sortByTime = (a, b) => {
            return parseInt(b.created_time) - parseInt(a.created_time);
        };

        BookmarkStore.getUserBookmarks().forEach((user) => {
            let timeline = _userTimeline[user.id];
            if(timeline)
                bookmarkTimeline = bookmarkTimeline
                    .concat(timeline).sort(sortByTime);

            if(bookmarkTimeline.length > 20)
                bookmarkTimeline.splice(20, bookmarkTimeline.length-20);
        });

        BookmarkStore.getHashtagBookmarks().forEach((hashtag) => {
            let timeline = _hashtagTimeline[hashtag.name];
            if(timeline)
                bookmarkTimeline = bookmarkTimeline
                    .concat(timeline).sort(sortByTime);

            if(bookmarkTimeline.length > 20)
                bookmarkTimeline.splice(20, bookmarkTimeline.length-20);
        });

        return bookmarkTimeline;
    },
    dispatchToken: AppDispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.FETCH_TIMELINE:
                _timelineMedias = action.medias;
                MediaStore.emit(ActionTypes.FETCH_TIMELINE, _timelineMedias);
                break;

            case ActionTypes.FETCH_USER_TIMELINE:
                _userTimeline[action.user.id] = action.medias;
                MediaStore.emit(ActionTypes.FETCH_USER_TIMELINE, action.medias);
                break;

            case ActionTypes.FETCH_HASHTAG_TIMELINE:
                _hashtagTimeline[action.hashtag] = action.medias;
                MediaStore.emit(ActionTypes.FETCH_HASHTAG_TIMELINE, action.medias);
                break;

            case ActionTypes.FETCH_BOOKMARK_TIMELINE:
                MediaStore.emit(ActionTypes.FETCH_BOOKMARK_TIMELINE);
                break;
            default:
              // do nothing
          }
    })
});

module.exports = MediaStore;
