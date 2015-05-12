/** @jsx React.DOM */
var React = require('react'),
	Surface = require('react-canvas').Surface,
	localForage = require('localforage'),
	ListItem = require('components/list-item'),
	timeAgo = require('viewfinder-utils').timeAgo,
    AppViewActions = require('actions/app-view-actions');

var Media = React.createClass({
    getInitialState: function(){
        return { profile_pic: null, photo: null }
    },
    componentDidMount: function(){
        var component = this;
        //console.log(this.props.media);
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
        this._cacheImage('profile_pic:'+this.props.media.id,  
            this.props.media.user.profile_picture, callback_profile_pic);
        this._cacheImage('photo:'+this.props.media.id,  
            this.props.media.images.standard_resolution.url, callback_photo);

    },
    render: function(){
    	var media = this.props.media;
        return (
            <div className="media">
				<div className="image">
					<img src={this.state.photo} />
				</div>
				<div className="user" onClick={this._viewUser}>
					<div className="image"><img src={this.state.profile_pic} /></div>
					<div className="username">{media.user.username}</div>
					<div className="time-ago">{timeAgo(media.created_time)} ago</div>
				</div>
				<div className="info">
					<div className="caption">{media.caption.text}</div>
					<div className="likes">
						♥ {media.likes.count} likes
					</div>
				</div>
            </div>
        );
    },
    _viewUser: function(){
        AppViewActions.viewUser(this.props.media.user);
    },
    _cacheImage: function(key, picture_url, callback){
        var component = this;
		localForage.getItem(key, function(err, blob) {
			if(!blob){
				component._requestImage(key, picture_url, callback);
			}else{
				console.log('photo_from_cache:', picture_url)
				callback(key, picture_url);
			}

		});
    },
    _requestImage: function(key, picture_url, callback){
        // We'll download the user's photo with AJAX.
        var request = new XMLHttpRequest({mozSystem: true});
         
        // Let's get the first user's photo.
        request.open('GET', picture_url, true);
        request.responseType = 'blob';
         
        // When the AJAX state changes, save the photo locally.
        request.addEventListener('load', function() {
            if (request.status  === 200) { // readyState DONE
                // We store the binary data as-is; this wouldn't work with localStorage.
                console.log(request.response)
                localForage.setItem(key, request.response, function() {
                    // Photo  been saved, do whatever happens next!
                    callback(key, picture_url);
                });
            }
        });
         
        request.send()
    }
});

var DetailsPage = React.createClass({
	propTypes: {
		media: React.PropTypes.object.isRequired
	},
	render: function(){
		console.log('detailsPage', this.props.media)
		var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;
        var media = this.props.media;
		return  <div className="media-content">
					<Media media={this.props.media} />
                </div>
	}
});

module.exports = DetailsPage;