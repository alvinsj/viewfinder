var React = require('react');

var AppServerActions = require('actions/app-server-actions'),
    StateStore = require('stores/state-store'),
    ActionTypes = require('constants/app-constants').ActionTypes;

class StatusBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._handleInstagramAccessToken = this._handleInstagramAccessToken.bind(this);
        this._handleInstagramCode = this._handleInstagramCode.bind(this);
        this._handleLogout = this._handleLogout.bind(this);

        this.state = {
            code: StateStore.getInstagramCode(),
            access_token: StateStore.getInstagramAccessToken()
        };
    }

    componentWillMount() {
        StateStore.addListener(ActionTypes.LOGOUT, this._handleLogout);
        StateStore.addListener(ActionTypes.INSTAGRAM_CODE, this._handleInstagramCode);
           StateStore.addListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._handleInstagramAccessToken);
    }

    componentWillUnmount() {
        StateStore.removeListener(ActionTypes.LOGOUT, this._handleLogout);
        StateStore.removeListener(ActionTypes.INSTAGRAM_CODE, this._handleInstagramCode);
        StateStore.removeListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._handleInstagramAccessToken);
    }

    render() {
        // var status = "";
        // if(!this.state.code){
        //     status = "Logging in...";
        //     //AppServerActions.getInstagramCode();
        // }else if(!this.state.access_token){
        //     status = "Authenticating...";
        //     //AppServerActions.getInstagramAccessToken();
        // }else{
            status = this.props.currentStatus;
        // }
        return <div className="status">{status}</div>
    }

    _handleInstagramCode(code) {
        this.setState({code: code});
    }

    _handleInstagramAccessToken(access_token) {
        this.setState({access_token: access_token});
    }

    _handleLogout() {
        this.setState({code: null, access_token: null});
    }
}

StatusBar.propTypes = {
    currentStatus: React.PropTypes.string.isRequired
};

module.exports = StatusBar;
