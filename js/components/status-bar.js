var React = require('react');

var AppServerActions = require('actions/app-server-actions'),
	StateStore = require('stores/state-store'),
	ActionTypes = require('constants/app-constants').ActionTypes;

var StatusBar = React.createClass({
	propTypes: {
		currentStatus: React.PropTypes.string.isRequired
	},
	getInitialState: function(){
		return {
			code: StateStore.getInstagramCode(),
			access_token: StateStore.getInstagramAccessToken()
		}
	},
	componentWillMount: function(){
		StateStore.addListener(ActionTypes.INSTAGRAM_CODE, this._handleInstagramCode);
       	StateStore.addListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._handleInstagramAccessToken);
	},
	componentWillUnmount: function(){
		StateStore.removeListener(ActionTypes.INSTAGRAM_CODE, this._handleInstagramCode);
        StateStore.removeListener(ActionTypes.INSTAGRAM_ACCESS_TOKEN, this._handleInstagramAccessToken);
	},
	render: function(){
		var status = "";
        if(!this.state.code){
            status = "Logging in...";
            AppServerActions.getInstagramCode();
        }else if(!this.state.access_token){
            status = "Authenticating...";
            AppServerActions.getInstagramAccessToken();
        }else{
            status = this.props.currentStatus;
        }

		return <div className="status">{status}</div>
	},
	_handleInstagramCode: function(code){
        this.setState({code: code});
    },
    _handleInstagramAccessToken: function(access_token){
        this.setState({access_token: access_token});
    }
});

module.exports = StatusBar;