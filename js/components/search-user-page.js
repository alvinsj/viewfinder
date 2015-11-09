var React = require('react'),
	localForage = require('localforage'),
	ListItem = require('components/list-item'),
	timeAgo = require('viewfinder-utils').timeAgo,
	ReactDOM = require('react-dom'),
	AppServerActions = require('actions/app-server-actions'),
    AppViewActions = require('actions/app-view-actions');

class SearchUser extends React.Component {
	constructor(props, context) {
		super(props, context);
		this._handleSearch = this._handleSearch.bind(this);
		this.renderUsers = this.renderUsers.bind(this);
		this.render = this.render.bind(this);
		this.state = {
			result: null
		}
	}

    render() {
		console.log('searchPage');
		var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;
        var media = this.props.media;

		return (
			<div className="media-content" style={{flexFlow: 'column'}}>
				<form className="content" onSubmit={this._handleSearch}>
				    <input ref="searchInput" className="searchUser" type="text"/>
		            <input type="submit" onClick={this._handleSearch} className="searchButton" value="Search" />
				</form>
				<div className="content">
					{this.renderUsers(this.state.result)}
				</div>
	        </div>);
	}

	renderUsers (users) {
		if(!users) return <div/>
		return users.map((user, index) =>
			<a key={index} onClick={this._handleUserClick(user)} className="user" style={styles.user}>
				<img style={styles.user_pic} src={user.profile_picture} />
				<span style={styles.user_name}>{user.username} {user.full_name}</span>
			</a>);
	}

	_handleUserClick (user) {
		return (e) => {
			if(e) e.preventDefault();
			AppViewActions.viewUser(user);
		}
	}

	_handleSearch (e) {
		if(e) e.preventDefault();
		let input = ReactDOM.findDOMNode(this.refs['searchInput']);
		AppServerActions.searchUser(input.value, (result) => {
			console.log(result);
			this.setState({result: result});
		});
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

module.exports = SearchUser;
