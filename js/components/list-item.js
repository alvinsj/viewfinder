/** @jsx React.DOM */
var React = require('react');

var ReactCanvas = require('react-canvas');
var ListView = ReactCanvas.ListView;
var Group = ReactCanvas.Group;
var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;

var localForage = require('localForage');;
var React = require('react');
var ig = require('instagram-node').instagram();

var ListItem = React.createClass({
    getInitialState: function(){
        return { profile_pic: null, photo: null }
    },
    componentDidMount: function(){
        window.addEventListener('resize', this.handleResize, true);
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
        var imageStyle = this.getImageStyle();
        var captionTextStyle = this.getCaptionTextStyle();
        var mediaGroupStyle = this.getMediaGroupStyle();
        var userGroupStyle = this.getUserGroupStyle();
        var userImageStyle = this.getUserImageStyle();
        var infoGroupStyle = this.getInfoGroupStyle();
        var userTextStyle = this.getUserTextStyle();
        var likesTextStyle = this.getLikesTextStyle();

        var media = this.props.media;
        var profilePic = this.state.profile_pic ? 
                        <Image style={userImageStyle} src={this.state.profile_pic} /> : <Group />;

        return this.state.photo ?
            (<Group style={mediaGroupStyle}>
                <Group style={userGroupStyle}>
                    {profilePic}
                    <Text style={userTextStyle}>{media.user.username}</Text>
                </Group>
                <Image style={imageStyle} src={this.state.photo} />
                <Group style={infoGroupStyle}>
                    <Text style={captionTextStyle}>{media.caption.text}</Text>
                    <Text style={likesTextStyle}>{media.likes.count} likes</Text>
                </Group>
            </Group>)
            : <Group />;

    },
    getMediaGroupStyle: function(){
        return {
            width: window.innerWidth,
        }
    },
    getUserGroupStyle: function(){
        return {
            top: 0,
            width: window.innerWidth,
            fontSize: 10,
            color: "#FF9900"
        }
    },
    getImageStyle: function() {
        return {
            top: 40,
            width: window.innerWidth,
            height: window.innerWidth
        };
    },
    getInfoGroupStyle: function(){
        return {
            top: window.innerWidth+30,
            width: window.innerWidth,
            fontSize: 10,
            color: "#fff",
            backgroundColor: "#c0c0c0"
        }
    },
    getUserImageStyle: function(){
        return {
            top: 5,
            left: 5,
            width: 25,
            height: 25
        }
    }, 
    getUserTextStyle: function() {
        return {
            top: 13,
            left: 35,
            width: window.innerWidth-25,
            height: 30,
            color: '#fff',
            fontSize: 10
        }
    },
    getCaptionTextStyle: function() {
        return {
            top: window.innerWidth+50,
            left: 5,
            width: window.innerWidth-20,
            height: 40,
            color: '#fff',
            fontSize: 10
        }
    },
    getLikesTextStyle: function() {
        return {
            top: window.innerWidth+90,
            left: 10,
            textAlign: "right",
            width: window.innerWidth-20,
            height: 40,
            color: '#fff',
            fontSize: 10
        }
    },

    _cacheImage: function(key, picture_url, callback){
        var component = this;
        localForage.getItem(key, function(err, blob) {
          if(!blob){
            component._requestImage(key, picture_url, callback);
          }else{
            //console.log('photo_from_cache:', picture_url)
            callback(key, picture_url);
          }

        });
    },
    _requestImage: function(key, picture_url, callback){
        var request = new XMLHttpRequest({mozSystem: true});
         
        request.open('GET', picture_url, true);
        request.responseType = 'blob';
         
        request.addEventListener('load', function() {
            if (request.status  === 200) { 
                //console.log(request.response)
                localForage.setItem(key, request.response, function() {
                    callback(key, picture_url);
                });
            }
        });
         
        request.send()
    },
    handleResize: function(){
        this.forceUpdate();
    }
});

module.exports = ListItem;