/** @jsx React.DOM */
var React = require('react'),
	AppServerActions = require('actions/app-server-actions'),
	AppViewActions = require('actions/app-view-actions');


var SettingsItem = React.createClass({
	render: function(){
		return (
		<div className="settings-item">
			<div className="name">{this.props.name}</div>
			<div className="value">{this.props.value}</div>
		</div>);
	}
});

var SettingsItemButton = React.createClass({
	render: function(){
		return (
		<div className="settings-item">
			<button className="button" onClick={this.props.onClick}>{this.props.name}</button>
		</div>);
	}
});

var SettingsItemSeparator = React.createClass({
	render: function(){
		return (
		<div className="settings-item">
			<div className="separator"></div>
		</div>);
	}
});

var Link = React.createClass({
	render: function(){
		return <a ref="link" href="#" onClick={this._onClick}>{this.props.children}</a>
	},
	_onClick: function(e){
		e.preventDefault();

		var activity = new MozActivity({
		    name: "view",
		    data: {
		              type: "url",
		              url: this.props.href
		          }
	    });
	}
});

var SettingsPage = React.createClass({
	render: function(){
		return (
		<div className="media-content">
			<div className="media">
				<SettingsItem name="Version" value="0.0.1" />
				<SettingsItemSeparator />
				<SettingsItem name="Credits" />
				<SettingsItem name={<Link href="https://github.com/facebook/react">facebook/react</Link>} />
				<SettingsItem name={<Link href="https://github.com/Flipboard/react-canvas">flipboard/react-canvas</Link>} />
				<SettingsItem name={<Link href="https://github.com/totemstech/instagram-node">totemstech/instagram-node</Link>} />
				<SettingsItem name={<Link href="https://github.com/substack/browserify">substack/browserify</Link>} />
				<SettingsItem name={<Link href="https://github.com/mozilla/localforage">mozilla/localforage</Link>} />

				<SettingsItemButton name="Logout" onClick={this._logout}/>
 			</div> 
		</div>);
	},
	_logout: function(){
		AppViewActions.backToHome();
		AppServerActions.logout();
	}
})
module.exports = SettingsPage;