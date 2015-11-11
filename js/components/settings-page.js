var React = require('react'),
    AppServerActions = require('actions/app-server-actions'),
    AppViewActions = require('actions/app-view-actions'),
    localForage = require('localforage');


class SettingsItem extends React.Component {
    render() {
        return (
        <div className="settings-item">
            <div className="name">{this.props.name}</div>
            <div className="value">{this.props.value}</div>
        </div>);
    }
}

class SettingsItemButton extends React.Component {
    render() {
        return (
        <div className="settings-item">
            <button className="button" onClick={this.props.onClick}>{this.props.name}</button>
        </div>);
    }
}

class SettingsItemSeparator extends React.Component {
    render() {
        return (
        <div className="settings-item">
            <div className="separator"></div>
        </div>);
    }
}

class Link extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._onClick = this._onClick.bind(this);
    }

    render() {
        return <a ref="link" href="#" onClick={this._onClick}>{this.props.children}</a>
    }

    _onClick(e) {
        e.preventDefault();

        var activity = new MozActivity({
            name: "view",
            data: {
                      type: "url",
                      url: this.props.href
                  }
        });
    }
}

class SettingsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._logout = this._logout.bind(this);
    }

    render() {
        return (
        <div className="media-content">
            <div className="media">
                <SettingsItem name="Version" value="0.1.0" />
                <SettingsItemSeparator />
                <SettingsItem name="Credits" />
                <SettingsItem name={<Link href="https://github.com/facebook/react">facebook/react</Link>} />
                <SettingsItem name={<Link href="https://github.com/babel">babel/babel</Link>}/>
                <SettingsItem name={<Link href="https://github.com/substack/browserify">substack/browserify</Link>} />
                <SettingsItem name={<Link href="https://github.com/mozilla/localforage">mozilla/localforage</Link>} />
                <SettingsItemButton name="Clear bookmarks/cache" onClick={this._clear}/>
             </div>
        </div>);
    }
    _clear() {
        localForage.clear(function(err) {
            if(!err) alert('Cache is cleared.');
            else alert('Cache cannot be cleared.');
        });
    }

    _logout() {
        AppViewActions.backToHome();
        AppServerActions.logout();
    }
}

module.exports = SettingsPage;
