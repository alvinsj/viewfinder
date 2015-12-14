
var React = require('react');
var AppServerActions = require('actions/app-server-actions'),
    ActionTypes = require('constants/app-constants').ActionTypes,
    MediaStore = require('stores/media-store'),
    UserStore = require('stores/user-store'),
    List = require('components/list'),
    StatusBar = require('components/status-bar'),
    linkify = require('utils/linkify');

class UserPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._loadMedias = this._loadMedias.bind(this);
        this._loadUser = this._loadUser.bind(this);

        this.state = {
            medias: MediaStore.getUserTimeline(props.user.id),
            user: UserStore.getUser(props.user.id)
        };
    }

    componentWillMount() {
        MediaStore.addListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
        UserStore.addListener(ActionTypes.FETCH_USER, this._loadUser);
    }

    componentWillUnmount() {
        MediaStore.removeListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
        UserStore.removeListener(ActionTypes.FETCH_USER, this._loadUser);
    }

    componentDidMount() {
        var component = this;
        if(!this.state.medias){
             AppServerActions.fetchUserTimeline(this.props.user);
        }
        if(!this.state.user){
            AppServerActions.fetchUser(this.props.user);
        }
    }

    render() {
        var user = this.props.user;
        console.log('user', user, this.state.user);


        return ( !this.state.medias ?
            <StatusBar currentStatus={"Loading user..."} />:
            <div className="media-content">
                {this.state.user ?
                    <div className="profile">
                        <div className="fullname">{this.state.user.full_name}. <span className="follow">Following: {this.state.user.counts.follows}, Followers: {this.state.user.counts.followed_by}</span></div>
                        <div className="bio">{linkify(this.state.user.bio)}</div>
                        <div className="website">{linkify(this.state.user.website)}</div>
                    </div> : <div />}
                <List medias={this.state.medias} />
            </div>);
    }

    _loadUser(user){
        this.setState({user: user});
    }

    _loadMedias(medias) {
        this.setState({medias: medias});
    }
}

UserPage.propTypes = {
    user: React.PropTypes.object.isRequired
};

module.exports = UserPage;
