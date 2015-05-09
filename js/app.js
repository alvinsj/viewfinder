/** @jsx React.DOM */
var localForage = require('localForage');;
var React = require('react');

var Surface = require('react-canvas').Surface,
    List = require('components/list'),
    ListItem = require('components/list-item'),
    UserPage = require('components/user-page'),
    StatusBar = require('components/status-bar')

    StateStore = require('stores/state-store'),
    MediaStore = require('stores/media-store'),
    AppViewActions = require('actions/app-view-actions'),
    AppServerActions = require('actions/app-server-actions'),

    ActionTypes = require('constants/app-constants').ActionTypes;

var App = React.createClass({
    componentWillMount: function(){
        StateStore.addListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._fetchMedias);
        MediaStore.addListener(ActionTypes.FETCH_TIMELINE, this._loadMedias);

        StateStore.addListener(ActionTypes.VIEW_DETAILS, this._handleViewDetails);
        StateStore.addListener(ActionTypes.VIEW_USER, this._handleViewUser);
        StateStore.addListener(ActionTypes.BACK_TO_HOME, this._handleBackToHome);
    },
    componentWillUnmount: function(){
        StateStore.removeListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._fetchMedias);
        MediaStore.removeListener(ActionTypes.FETCH_TIMELINE, this._loadMedias)

        StateStore.removeListener(ActionTypes.VIEW_DETAILS, this._handleViewDetails);
        StateStore.removeListener(ActionTypes.VIEW_USER, this._handleViewUser);
        StateStore.removeListener(ActionTypes.BACK_TO_HOME, this._handleBackToHome);
    },
    getInitialState: function(){
        return {
            medias: MediaStore.getTimelineMedias(), 

            page: '/', 
            media: null,
            user: null};
    },
    render: function(){        
        return  (<div>
                    <App.NavigationBar onTitleClick={this._refresh} page={this.state.page}/>
                    {this._selectPage(this.state.page)}
                </div>)
            
    },
    _selectPage: function(page){
        var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;

        switch(page){
            case '/media': 
                return (
                    <div className="media-content">
                        <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={30}>
                            <ListItem media={this.state.media} />
                        </Surface>
                    </div>);
                break;
            case '/user': 
                return <UserPage user={this.state.user} />;

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
        this.setState({page: '/media', media: media});
    },
    _handleViewUser: function(user){
        this.setState({page: '/user', user: user});
    },
    _handleBackToHome: function(){
        this.setState({page: '/', media: null})
    },
    _refresh: function(){
        this.setState({medias: null});
    }
});

App.NavigationBar = React.createClass({
    propTypes: {
        onTitleClick: React.PropTypes.func.isRequired
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
                    Viewfinder <small>for Instagram</small>
                </span>
                <span className="right">
                    <i className="fa fa-instagram" />
                </span>
            </h1>);
    },
    _backToHome: function(){
        AppViewActions.backToHome();
    }
});

React.render(<App />, document.getElementById('app'));
