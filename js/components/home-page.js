var React = require('react');
var AppServerActions = require('actions/app-server-actions'),
    AppViewActions = require('actions/app-view-actions'),
    ActionTypes = require('constants/app-constants').ActionTypes,
    MediaStore = require('stores/media-store'),
    List = require('components/list'),
    StatusBar = require('components/status-bar'),
    BookmarkStore = require('stores/bookmark-store');

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._loadMedias = this._loadMedias.bind(this);

        this.state = {
            medias: MediaStore.getBookmarkTimeline()
        };
    }

    componentWillMount() {
        MediaStore.addListener(ActionTypes.FETCH_HASHTAG_TIMELINE, this._loadMedias);
        MediaStore.addListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
        MediaStore.addListener(ActionTypes.FETCH_BOOKMARK_TIMELINE, this._loadMedias);

        BookmarkStore.addListener(ActionTypes.ADD_USER_BOOKMARK, this._fetchTimeline);
        BookmarkStore.addListener(ActionTypes.ADD_HASHTAG_BOOKMARK, this._fetchTimeline);
    }

    componentWillUnmount() {
        MediaStore.removeListener(ActionTypes.FETCH_HASHTAG_TIMELINE, this._loadMedias);
        MediaStore.removeListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
        MediaStore.removeListener(ActionTypes.FETCH_BOOKMARK_TIMELINE, this._loadMedias);

        BookmarkStore.removeListener(ActionTypes.ADD_USER_BOOKMARK, this._fetchTimeline);
        BookmarkStore.removeListener(ActionTypes.ADD_HASHTAG_BOOKMARK, this._fetchTimeline);
    }

    componentDidMount() {
        AppServerActions.fetchBookmarkTimeline();
    }

    render() {
        return (
            <div className="media-content">
            {!this.state.medias || this.state.medias.length == 0 ?
                <StatusBar currentStatus={"Nothing here, bookmark a user/hashtag?"} />
                : <List medias={this.state.medias} /> }
            </div>);
    }

    _fetchTimeline(){
        AppServerActions.fetchBookmarksTimeline();
    }

    _loadMedias(medias) {
        let all = MediaStore.getBookmarkTimeline();

        AppViewActions.saveBookmarksTimeline(all);
        this.setState({medias: all});
    }
}

module.exports = HomePage;
