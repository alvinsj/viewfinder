var React = require('react'),

    ReactDOM = require('react-dom'),
    localForage = require('localforage'),
    ListItem = require('components/list-item'),

    AppServerActions = require('actions/app-server-actions'),
    AppViewActions = require('actions/app-view-actions'),

    StatusBar = require('components/status-bar'),
    SearchStore = require('stores/search-store');

class SearchHashtag extends React.Component {
    static get propTypes () {
        return {
            onHashtagSelected: React.PropTypes.func.isRequired
        }
    }
    constructor(props, context) {
        super(props, context);
        this._handleSearch = this._handleSearch.bind(this);
        this.renderHashtags = this.renderHashtags.bind(this);
        this.render = this.render.bind(this);
        this._handleHashtagClick = this._handleHashtagClick.bind(this);
        this.state = {
            result: SearchStore.getHashtagSeachHistory(),
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
                    <input ref="searchInput" className="search-hashtag" type="text"/>
                    <input type="submit" onClick={this._handleSearch} className="search-button" value="Search" />
                </form>
                <div className="search-result">
                    {this.renderHashtags(this.state.result)}
                </div>
                <StatusBar currentStatus={this.state.status}/>
            </div>);
    }

    renderHashtags (hashtags) {
        if(!hashtags) return <div><i>No hashtag found</i></div>;
        return hashtags.map((hashtag, index) =>
            <a key={index} onClick={this._handleHashtagClick(hashtag)} className="hashtag">
                <span className="hashtag-media-count">
                    <span className="fa fa-instagram"/> {hashtag.media_count}
                </span>
                <span className="hashtag-name">#{hashtag.name}</span>
            </a>);
    }

    _handleHashtagClick (hashtag) {
        return (e) => {
            if(e) e.preventDefault();
            this.props.onHashtagSelected(hashtag)
        }
    }

    _handleSearch (e) {
        if(e) e.preventDefault();
        let input = ReactDOM.findDOMNode(this.refs['searchInput']);
        AppServerActions.searchHashtag(input.value, (result) => {
            this.setState({result: result, status: ''});
        });
        this.setState({status: 'Searching '+input.value+'...'})
    }
}



module.exports = SearchHashtag;
