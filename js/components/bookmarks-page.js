var React = require('react'),
    AppServerActions = require('actions/app-server-actions'),
    AppViewActions = require('actions/app-view-actions'),
    ActionTypes = require('constants/app-constants').ActionTypes;

var BookmarkStore = require('stores/bookmark-store');

module.exports = class extends React.Component {
    constructor(props, context){
        super(props, context);
        this._refresh = this._refresh.bind(this);
        this._handleHashtagClick = this._handleHashtagClick.bind(this);
        this._handleUserClick = this._handleUserClick.bind(this);
        this.renderHashtags = this.renderHashtags.bind(this);
        this.renderUsers = this.renderUsers.bind(this);

        this.state = {
            users: BookmarkStore.getUserBookmarks(),
            hashtags: BookmarkStore.getHashtagBookmarks()
        }
    }

    componentWillMount() {
        BookmarkStore.addListener(ActionTypes.GET_USER_BOOKMARKS, this._refresh);
        BookmarkStore.addListener(ActionTypes.ADD_USER_BOOKMARK, this._refresh);
        BookmarkStore.addListener(ActionTypes.REMOVE_USER_BOOKMARK, this._refresh);

        BookmarkStore.addListener(ActionTypes.GET_HASHTAG_BOOKMARKS, this._refresh);
        BookmarkStore.addListener(ActionTypes.ADD_HASHTAG_BOOKMARK, this._refresh);
        BookmarkStore.addListener(ActionTypes.REMOVE_HASHTAG_BOOKMARK, this._refresh);
    }

    componentWillUnmount() {
        BookmarkStore.removeListener(ActionTypes.GET_USER_BOOKMARKS, this._refresh);
        BookmarkStore.removeListener(ActionTypes.ADD_USER_BOOKMARK, this._refresh);
        BookmarkStore.removeListener(ActionTypes.REMOVE_USER_BOOKMARK, this._refresh);

        BookmarkStore.removeListener(ActionTypes.GET_HASHTAG_BOOKMARKS, this._refresh);
        BookmarkStore.removeListener(ActionTypes.ADD_HASHTAG_BOOKMARK, this._refresh);
        BookmarkStore.removeListener(ActionTypes.REMOVE_HASHTAG_BOOKMARK, this._refresh);
    }

    componentDidMount() {
        AppViewActions.fetchBookmarks();
    }

    render () {
        return (
            <div className="media-content">
                <div className="search-result">
                    {this.renderUsers(this.state.users)}
                    {this.renderHashtags(this.state.hashtags)}
                </div>
            </div>)

    }

    _refresh (){
        this.setState({
            users: BookmarkStore.getUserBookmarks(),
            hashtags: BookmarkStore.getHashtagBookmarks()
        });
    }

    renderUsers (users) {
        if(!users || users.length == 0) return <div><i>No user bookmark yet</i></div>;
        return users.map((user, index) =>
        <div>
            <div key={index}  className="user" style={styles.user}>
                <a onClick={this._handleUserClick(user)}>
                    <img style={styles.user_pic} src={user.profile_picture} />
                    <span style={styles.user_name}>{user.username}</span>
                </a>
                <button onClick={() => AppViewActions.removeUserBookmark(user)}>
                    <span className="fa fa-ban" />
                </button>
            </div>
        </div>);
    }

    renderHashtags (hashtags) {
        if(!hashtags || hashtags.length == 0) return <div><i>No hashtag bookmark yet</i></div>;
        return hashtags.map((hashtag, index) =>
        <div>
            <div key={index} className="hashtag">
                <a  onClick={this._handleHashtagClick(hashtag)} >
                    <span className="hashtag-media-count">
                        <span className="fa fa-instagram"/> {hashtag.media_count}
                    </span>
                    <span className="hashtag-name">#{hashtag.name}</span>
                </a>
                <button onClick={() => AppViewActions.removeHashtagBookmark(hashtag)}>
                    <span className="fa fa-ban" />
                </button>
            </div>
        </div>);
    }

    _handleHashtagClick (hashtag) {
        return (e) => {
            if(e) e.preventDefault();
            this.props.onHashtagSelected(hashtag)
        }
    }

    _handleUserClick (user) {
        return (e) => {
            if(e) e.preventDefault();
            this.props.onUserSelected(user)
        }
    }
}

let styles = {
    user: {
        display: "flex",
        flexFlow: "columns",
        width: "100%"
    },
    user_pic: {width: '25px', height: '25px'},
    user_name: {
        flex: 1,
        lineHeight: "25px",
        fontSize: "1.3em",
        paddingLeft: "10px"
    }
}
