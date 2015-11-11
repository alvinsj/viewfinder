var React = require('react'),
    ReactDOM = require('react-dom'),
    localForage = require('localforage'),
    ListItem = require('components/list-item'),
    timeAgo = require('viewfinder-utils').timeAgo,
    ReactDOM = require('react-dom'),
    AppServerActions = require('actions/app-server-actions'),
    AppViewActions = require('actions/app-view-actions'),
    StatusBar = require('components/status-bar'),
    SearchStore = require('stores/search-store');

class SearchUser extends React.Component {
    static get propTypes () {
        return {
            onUserSelected: React.PropTypes.func.isRequired
        }
    }
    constructor(props, context) {
        super(props, context);
        this._handleSearch = this._handleSearch.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
        this.render = this.render.bind(this);
        this._handleUserClick = this._handleUserClick.bind(this);
        this.state = {
            result: SearchStore.getUserSeachHistory(),
            status: ''
        }
    }

    componentDidMount () {
        if(this.refs.searchInput)
            ReactDOM.findDOMNode(this.refs.searchInput).focus()
    }

    render() {
        return (
            <div className="media-content" style={{flexFlow: 'column'}}>
                <form className="search-bar" onSubmit={this._handleSearch}>
                    <input ref="searchInput" className="search-user" type="text"/>
                    <input type="submit" onClick={this._handleSearch} className="search-button" value="Search" />
                </form>
                <div className="search-result">
                    {this.renderUsers(this.state.result)}
                </div>
                <StatusBar currentStatus={this.state.status}/>
            </div>);
    }

    renderUsers (users) {
        if(!users || users.length == 0) return <div><i>No user found</i></div>;
        return users.map((user, index) =>
            <a key={index} onClick={this._handleUserClick(user)} className="user" style={styles.user}>
                <img style={styles.user_pic} src={user.profile_picture} />
                <span style={styles.user_name}>{user.username} <span className="name">{user.full_name}</span></span>
            </a>);
    }

    _handleUserClick (user) {
        return (e) => {
            if(e) e.preventDefault();
            this.props.onUserSelected(user)
        }
    }

    _handleSearch (e) {
        if(e) e.preventDefault();
        let input = ReactDOM.findDOMNode(this.refs['searchInput']);
        AppServerActions.searchUser(input.value, (result) => {
            this.setState({result: result, status: ''});
        });
        this.setState({status: 'Searching '+input.value+'...'})
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
