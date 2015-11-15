var React = require('react');
var localForage = require('localForage');

var AppViewActions = require('actions/app-view-actions'),
    timeAgo = require('viewfinder-utils').timeAgo;

var assign = require('object-assign');

class ListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._showDetails = this._showDetails.bind(this);
        this._showUser = this._showUser.bind(this);
        this.renderMedia = this.renderMedia.bind(this);

        this.state = {profile_pic: null, photo: null};
    }

    componentDidMount() {
        var component = this;
        var callback_profile_pic = function(key, url){
            localForage.getItem(key, function(err, blob) {
                if(blob){
                    var blobURL = URL.createObjectURL(blob);
                    component.setState({profile_pic: blobURL});
                }
            });
        };
        var callback_photo = function(key, url){
            localForage.getItem(key, function(err, blob) {
                if(blob){
                    var blobURL = URL.createObjectURL(blob);
                    component.setState({photo: blobURL});
                }
            });
        };
        this._cacheImage('profile_pic:'+this.props.media.user.id,
            this.props.media.user.profile_picture, callback_profile_pic);
        this._cacheImage('photo:'+this.props.media.id,
            this.props.media.images.standard_resolution.url, callback_photo);

    }

    render() {
        var media = this.props.media;
        var textAgo = timeAgo(media.created_time);

        var showUser = this._showUser.bind(this, media.user);
        var profilePic = this.state.profile_pic ?
                        <img className="pic-user-image" key={media.user.id} src={this.state.profile_pic} onClick={showUser} /> : <div className="pic-user-image"/>;

        return (
            <div className="pic" key={media.id}>
                <div className="pic-user" onClick={showUser}>
                    {profilePic}
                    <div className="pic-user-name" onClick={showUser}>{media.user.username}</div>
                    <div className="pic-user-timeago">{textAgo} ago</div>
                </div>
                {this.renderMedia()}
                <div  className="pic-info">
                    <div className="pic-info-caption">{media.caption? media.caption.text : ""}</div>
                    <div className="pic-info-likes"><span className="fa fa-heart"/> {media.likes.count}</div>
                </div>
            </div>);

    }

    renderMedia() {
        let media = this.props.media;
        if(media.type == 'video'){
            console.log('renderMedia: video', media);
            return [
                <div className="pic-type">
                    <i className="fa fa-video-camera" />    
                </div>,
                <video className="pic-img"
                    crossOrigin
                    onClick={(e) => {
                        let video = e.target;

                        if(video.paused || video.ended){
                            console.log('play');
                            video.play();
                        }else video.pause();
                    }}
                    src={media.videos.low_resolution.url}
                    poster={this.state.photo} />];
        }else{
            return <img className="pic-img" key={media.id}
                src={this.state.photo}
                onClick={this._showDetails.bind(this, media)}/>

        }
    }

    _showDetails(media, e) {
        AppViewActions.viewDetails(media);
    }

    _showUser(user, e) {
        AppViewActions.viewUser(user);
    }

    _cacheImage(key, picture_url, callback) {
        var component = this;
        localForage.getItem(key, function(err, blob) {
          if(!blob){
            component._requestImage(key, picture_url, callback);
          }else{
            callback(key, picture_url);
          }

        });
    }

    _requestImage(key, picture_url, callback) {
        var request = new XMLHttpRequest({mozSystem: true});

        request.open('GET', picture_url, true);
        request.responseType = 'blob';

        request.addEventListener('load', function() {
            if (request.status  === 200) {
                localForage.setItem(key, request.response, function() {
                    callback(key, picture_url);
                });
            }
        });

        request.send()
    }
}

ListItem.propTypes = {
    media: React.PropTypes.object.isRequired
};


module.exports = ListItem;
