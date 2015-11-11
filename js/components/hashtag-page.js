
var React = require('react');
var AppServerActions = require('actions/app-server-actions'),
    ActionTypes = require('constants/app-constants').ActionTypes,
    MediaStore = require('stores/media-store'),
    List = require('components/list'),
    StatusBar = require('components/status-bar');

class HashtagPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._loadMedias = this._loadMedias.bind(this);

        this.state = {
            medias: MediaStore.getHashtagTimeline(props.hashtag)
        };
    }

    componentWillMount() {
        MediaStore.addListener(ActionTypes.FETCH_HASHTAG_TIMELINE, this._loadMedias);
    }

    componentWillUnmount() {
        MediaStore.removeListener(ActionTypes.FETCH_HASHTAG_TIMELINE, this._loadMedias);
    }

    componentDidMount() {
        var component = this;
        if(!this.state.medias){
             AppServerActions.fetchHashtagTimeline(this.props.hashtag);
        }
    }

    render() {
        var hashtag = this.props.hashtag;

        return ( !this.state.medias ?
            <StatusBar currentStatus={"Loading hashtag..."} />:
            <div className="media-content">
                <List medias={this.state.medias} />
            </div>);
    }

    _loadMedias(medias) {
        this.setState({medias: medias});
    }
}

HashtagPage.propTypes = {
    hashtag: React.PropTypes.object.isRequired
};

module.exports = HashtagPage;
