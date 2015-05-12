/** @jsx React.DOM */
var localForage = require('localForage');;
var React = require('react');

var Surface = require('react-canvas').Surface,
    List = require('components/list'),
    ListItem = require('components/list-item'),
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
var App = React.createClass({
    componentWillMount: function(){
        StateStore.addListener(ActionTypes.LOGOUT, this._logout);
        StateStore.addListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._fetchMedias);
        MediaStore.addListener(ActionTypes.FETCH_TIMELINE, this._loadMedias);

        StateStore.addListener(ActionTypes.VIEW_DETAILS, this._handleViewDetails);
        StateStore.addListener(ActionTypes.VIEW_USER, this._handleViewUser);
        StateStore.addListener(ActionTypes.BACK_TO_HOME, this._handleBackToHome);
        StateStore.addListener(ActionTypes.VIEW_SETTINGS, this._handleViewSettings);
    },
    componentWillUnmount: function(){
        StateStore.removeListener(ActionTypes.LOGOUT, this._logout);
        StateStore.removeListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._fetchMedias);
        MediaStore.removeListener(ActionTypes.FETCH_TIMELINE, this._loadMedias)

        StateStore.removeListener(ActionTypes.VIEW_DETAILS, this._handleViewDetails);
        StateStore.removeListener(ActionTypes.VIEW_USER, this._handleViewUser);
        StateStore.removeListener(ActionTypes.BACK_TO_HOME, this._handleBackToHome);
        StateStore.removeListener(ActionTypes.VIEW_SETTINGS, this._handleViewSettings);
    },
    getInitialState: function(){
        return {
            medias: MediaStore.getTimelineMedias(), 

            title: _title,
            page: '/', 
            media: null,
            user: null};
    },
    render: function(){        
        return  (<div>
                    <App.NavigationBar onTitleClick={this._refresh} page={this.state.page} title={this.state.title}/>
                    {this._selectPage(this.state.page)}
                </div>)
            
    },
    _selectPage: function(page){
        switch(page){
            case '/media': 
                return <DetailsPage media={this.state.media}/>;

            case '/user': 
                return <UserPage user={this.state.user} />;

            case '/settings': 
                return <SettingsPage user={this.state.user} />;

            default: 
                return (this.state.medias ? 
                    (<div className="media-content">
                      <List medias={this.state.medias} />
                    </div>)
                    : <StatusBar currentStatus="Loading medias..." />);
        }
    },
    _fetchMedias: function(){
        if(!this.state.medias){
            AppServerActions.fetchTimeline();
        }
    },
    _loadMedias: function(medias){
        this.setState({medias: medias});
    }, 
    _handleViewDetails: function(media){
        this.setState({page: '/media', media: media, title: ''});
    },
    _handleViewSettings: function(){
        this.setState({page: '/settings', title: 'Settings'});
    },
    _handleViewUser: function(user){
        var roundedStyle = {width: 100, height: 100, borderRadius: 50}
        var title = (
            <div>
                <div><img src={user.profile_picture} style={roundedStyle}/></div>
                <div>{user.username}</div>
            </div>);
        this.setState({page: '/user', user: user, title: title});
    },
    _handleBackToHome: function(){
        this.setState({page: '/', media: null, title: _title})
    },
    _refresh: function(){
        this.setState({medias: null});
        AppServerActions.fetchTimeline();
    },
    _logout: function(){
        this.setState({medias: null});
    }
});

App.NavigationBar = React.createClass({
    propTypes: {
        onTitleClick: React.PropTypes.func.isRequired,
        title: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
            ]).isRequired
    },
    render: function(){
        return (
            <h1 className="brand">
                { this.props.page != '/' ?
                    <span className="left" style={{width: 44}} onClick={this._backToHome}>
                        <i className="fa fa-chevron-left" />
                    </span> : <span className="left" style={{width: 44}}/>
                }
                <span className="title" onClick={this.props.onTitleClick}>
                    {this.props.title}
                </span>
                <span className="right">
                    <img src="img/icons/icon48x48.png" style={{width: 24, height: 24}} onClick={this._goToSettings}/>
                </span>
            </h1>);
    },
    _backToHome: function(){
        AppViewActions.backToHome();
    },
    _goToSettings: function(){
        AppViewActions.viewSettings();
    }
});

React.render(<App />, document.getElementById('app'));
