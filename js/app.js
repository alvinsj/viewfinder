var localForage = require('localForage');
var React = require('react');
var ReactDOM = require('react-dom');

var List = require('components/list'),
    ListItem = require('components/list-item'),

    SearchUserPage = require('components/search-user-page'),
    SearchHashtagPage = require('components/search-hashtag-page'),

    HashtagPage = require('components/hashtag-page'),
    UserPage = require('components/user-page'),
    DetailsPage = require('components/details-page'),
    StatusBar = require('components/status-bar'),
    SettingsPage = require('components/settings-page'),

    StateStore = require('stores/state-store'),
    MediaStore = require('stores/media-store'),

    AppViewActions = require('actions/app-view-actions'),
    AppServerActions = require('actions/app-server-actions'),

    ActionTypes = require('constants/app-constants').ActionTypes;

var _title = <span>Viewfinder <small>for Instagram</small></span>;

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._fetchMedias = this._fetchMedias.bind(this);
        this._handleBackToHome = this._handleBackToHome.bind(this);
        this._handleViewDetails = this._handleViewDetails.bind(this);
        this._handleViewSettings = this._handleViewSettings.bind(this);
        this._handleViewUser = this._handleViewUser.bind(this);
        this._handleViewHashtag = this._handleViewHashtag.bind(this);

        this._loadMedias = this._loadMedias.bind(this);
        this._logout = this._logout.bind(this);
        this._refresh = this._refresh.bind(this);
        this._selectPage = this._selectPage.bind(this);
        this._handlePageSelected = this._handlePageSelected.bind(this);
        this._titleFromPage = this._titleFromPage.bind(this);

        this.state = {
            medias: MediaStore.getTimelineMedias(),

            title: _title,
            page: '/',
            previous: [],
            media: null,
            user: null,
            hashtag: null
        };
    }

    componentWillMount() {
        StateStore.addListener(ActionTypes.LOGOUT, this._logout);
        StateStore.addListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._fetchMedias);
        MediaStore.addListener(ActionTypes.FETCH_TIMELINE, this._loadMedias);

        StateStore.addListener(ActionTypes.VIEW_DETAILS, this._handleViewDetails);
        StateStore.addListener(ActionTypes.VIEW_USER, this._handleViewUser);
        StateStore.addListener(ActionTypes.BACK_TO_HOME, this._handleBackToHome);
        StateStore.addListener(ActionTypes.VIEW_SETTINGS, this._handleViewSettings);
    }

    componentWillUnmount() {
        StateStore.removeListener(ActionTypes.LOGOUT, this._logout);
        StateStore.removeListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._fetchMedias);
        MediaStore.removeListener(ActionTypes.FETCH_TIMELINE, this._loadMedias)

        StateStore.removeListener(ActionTypes.VIEW_DETAILS, this._handleViewDetails);
        StateStore.removeListener(ActionTypes.VIEW_USER, this._handleViewUser);
        StateStore.removeListener(ActionTypes.BACK_TO_HOME, this._handleBackToHome);
        StateStore.removeListener(ActionTypes.VIEW_SETTINGS, this._handleViewSettings);
    }

    render() {
        console.log(this.state.page)
        return  (<div>
                    <App.NavigationBar
                        onTitleClick={this._refresh}
                        page={this.state.page}
                        title={this._titleFromPage(this.state.page)}/>
                    {this._selectPage(this.state.page)}
                    <App.MenuBar onPageSelected={this._handlePageSelected}/>
                </div>)

    }

    _handlePageSelected(page){
        var previous = this.state.previous;
        previous.push(page);

        this.setState({page: page, previous: previous});
    }

    _titleFromPage(page){
        switch(page){
            case '/':
                return _title;

            case '/media':
                return <span className="fa fa-instagram" />;

            case '/hashtag':
                return '#'+this.state.hashtag;

            case '/user':
                var roundedStyle = {width: 100, height: 100, borderRadius: 50}
                return (
                    <div>
                        <div><img src={this.state.user.profile_picture} style={roundedStyle}/></div>
                        <div>{this.state.user.username}</div>
                    </div>);

            case '/settings':
                return 'Settings';

            case '/search_user':
                return <span><small><i className="fa fa-search"/></small> Search User</span>;

            case '/search_hashtag':
                return <span><small><i className="fa fa-search"/></small> Search #Hashtag</span>;

            default:
                return _title;
        }
        return
    }

    _selectPage(page) {
        switch(page){
            case '/media':
                return <DetailsPage media={this.state.media}/>;

            case '/user':
                return <UserPage user={this.state.user} />;

            case '/hashtag':
                return <HashtagPage hashtag={this.state.hashtag} />;

            case '/settings':
                return <SettingsPage user={this.state.user} />;

            case '/search_hashtag':
                return <SearchHashtagPage onHashtagSelected={this._handleViewHashtag}/>;

            case '/search_user':
                return <SearchUserPage onUserSelected={this._handleViewUser}/>;

            default:
                return (this.state.medias ?
                    (<div className="media-content">
                      <List medias={this.state.medias} />
                    </div>)
                    : <StatusBar currentStatus="" />);
        }
    }

    _fetchMedias() {
        if(!this.state.medias){
            AppServerActions.fetchTimeline();
        }
    }

    _loadMedias(medias) {
        this.setState({medias: medias});
    }

    _handleViewDetails(media) {
        var previous = this.state.previous;
        previous.push('/media');

        this.setState({page: '/media', previous: previous, media: media});
    }

    _handleViewSettings() {
        var previous = this.state.previous;
        previous.push('/settings');
        this.setState({page: '/settings', previous: previous});
    }

    _handleViewHashtag(hashtag) {
        var previous = this.state.previous;
        previous.push('/hashtag');

        this.setState({page: '/hashtag', previous: previous, hashtag: hashtag});
    }

    _handleViewUser(user) {
        var previous = this.state.previous;
        previous.push('/user');

        this.setState({page: '/user', previous: previous, user: user});
    }

    _handleBackToHome() {
        var previous = this.state.previous;
        previous.pop();
        var page = previous.pop();
        if(!page) page = '/';

        this.setState({page: page});

        if(page === '/'){
            this.setState({previous: [], media: null})
        }
    }

    _refresh() {
    }

    _logout() {
        this.setState({medias: null});
    }
}

App.MenuBar = class extends React.Component {
    render () {
        return (
            <div className="menu-bar">
                <div><a className="fa fa-users" onClick={this._handleClick('/search_user')}/></div>
                <div><a className="fa fa-tags" onClick={this._handleClick('/search_hashtag')}/></div>
                <div><a className="fa fa-bookmark-o" onClick={this._handleClick('/bookmarks')}/></div>
            </div>)
    }
    _handleClick (page){
        return (e) => {
            if(e) e.preventDefault();
            this.props.onPageSelected(page);
        }
    }
};

App.NavigationBar = class extends React.Component {
    render (){
        return (
            <h1 className="brand">
                { this.props.page != '/' ?
                    <span className="left" style={{width: 44}} onClick={this._backToHome}>
                        <i className="fa fa-chevron-left" />
                    </span> : <span className="left" style={{width: 44}}><i className="fa" /></span>
                }
                <span className="title" onClick={this.props.onTitleClick}>
                    {this.props.title}
                </span>
                <span className="right">
                    <img src="img/icons/icon48x48.png" style={{width: 24, height: 24}} onClick={this._goToSettings}/>
                </span>
            </h1>);
    }

    _backToHome (){
        AppViewActions.backToHome();
    }

    _goToSettings (){
        AppViewActions.viewSettings();
    }
};

App.NavigationBar.propTypes = {
    onTitleClick: React.PropTypes.func.isRequired,
    title: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
        ]).isRequired
};

ReactDOM.render(<App />, document.getElementById('app'));
