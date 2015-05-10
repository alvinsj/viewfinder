/** @jsx React.DOM */
var React = require('react');
var AppServerActions = require('actions/app-server-actions'),
	ActionTypes = require('constants/app-constants').ActionTypes,
	MediaStore = require('stores/media-store'),
	List = require('components/list'),
	StatusBar = require('components/status-bar');

var UserPage = React.createClass({
	propTypes: {
		user: React.PropTypes.object.isRequired
	},
	getInitialState: function(){
		return {
			medias: MediaStore.getUserTimeline(this.props.user.id)
		}
	},
	componentWillMount: function(){
		MediaStore.addListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
	},
	componentWillUnmount: function(){
		MediaStore.removeListener(ActionTypes.FETCH_USER_TIMELINE, this._loadMedias);
	},
	componentDidMount: function(){
		var component = this;
		if(!this.state.medias){
 			AppServerActions.fetchUserTimeline(this.props.user)
        }
	},
	render: function(){
		var user = this.props.user;

		return ( !this.state.medias ?
			<StatusBar currentStatus={"Loading user..."} />: 
			<div class="media-content">
				<List medias={this.state.medias} />
			</div>);
	},
	_loadMedias: function(medias){
		this.setState({medias: medias});
	}
});

module.exports = UserPage;