
var React = require('react');
var AppServerActions = require('actions/app-server-actions'),
    ActionTypes = require('constants/app-constants').ActionTypes,
    MediaStore = require('stores/media-store'),
    List = require('components/list'),
    StatusBar = require('components/status-bar');

class UserPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._loadMedias = this._loadMedias.bind(this);

        this.state = {
            medias: MediaStore.getUserTimeline(props.user.id)
        };
    }

    componentWillMount() {
        MediaStore.addListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
    }

    componentWillUnmount() {
        MediaStore.removeListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
    }

    componentDidMount() {
        var component = this;
        if(!this.state.medias){
             AppServerActions.fetchUserTimeline(this.props.user);
        }
    }

    render() {
        var user = this.props.user;
        return ( !this.state.medias ?
            <StatusBar currentStatus={"Loading user..."} />:
            <div className="media-content">
                <List medias={this.state.medias} />
            </div>);
    }

    _loadMedias(medias) {
        this.setState({medias: medias});
    }
}

UserPage.propTypes = {
    user: React.PropTypes.object.isRequired
};

module.exports = UserPage;
