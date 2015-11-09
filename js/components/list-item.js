var React = require('react');
var localForage = require('localForage');

var AppViewActions = require('actions/app-view-actions'),
    timeAgo = require('viewfinder-utils').timeAgo;

class ListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._showDetails = this._showDetails.bind(this);
        this._showUser = this._showUser.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.state = { profile_pic: null, photo: null};
    }

    componentDidMount() {
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

    }

    render() {

        var media = this.props.media;
        var textAgo = timeAgo(media.created_time);

        var showUser = this._showUser.bind(this, media.user);
        var profilePic = this.state.profile_pic ?
                        <img style={styles.userImageStyle} src={this.state.profile_pic} onClick={showUser} /> : <div style={styles.userImageStyle}/>;

        console.log(this.state, this.props);

        return this.state.photo ?
            (<div style={styles.mediadivStyle}>
                <div style={styles.userdivStyle} onClick={showUser}>
                    {profilePic}
                    <div style={styles.usernamedivStyle} onClick={showUser}>{media.user.username}</div>
                    <div style={styles.timeAgodivStyle}>{textAgo} ago</div>
                </div>
                <img style={styles.imageStyle} src={this.state.photo} onClick={this._showDetails.bind(this, media)}/>
                <div style={styles.infodivStyle}>
                    <div style={styles.captiondivStyle}>{media.caption? media.caption.text : ""}</div>
                    <div style={styles.likesdivStyle}>♥{media.likes.count}likes</div>
                </div>
            </div>)
            : <div />;

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
            //console.log('photo_from_cache:', picture_url)
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
                //console.log(request.response)
                localForage.setItem(key, request.response, function() {
                    callback(key, picture_url);
                });
            }
        });

        request.send()
    }

    handleResize() {
        this.forceUpdate();
    }
}

ListItem.propTypes = {
    media: React.PropTypes.object.isRequired
};

let styles = {
    mediadivStyle: {
        width: window.innerWidth,
        display: "flex",
        flexFlow: "column"
    },

    userdivStyle: {
        display: "flex",
        flexFlow: "row",
        width: window.innerWidth,
        color: "#FF9900",
        padding: "10px"
    },

    usernamedivStyle: {
        flex: 1,
        paddingLeft: "5px",
        fontSize: "1.3em",
        lineHeight: "25px"
    },

    imageStyle: {
        width: window.innerWidth,
        height: window.innerWidth
    },

    infodivStyle: {
        width: window.innerWidth,
        fontSize: 10,
        color: "#fff",
        backgroundColor: "#c0c0c0"
    },

    userImageStyle: {
        width: 25,
        height: 25
    },

    timeAgodivStyle: {
        color: '#fff',
        fontSize: 14
    },

    captiondivStyle: {
        width: window.innerWidth-20,
        height: 40,
        color: '#fff',
        fontSize: 14
    },

    likesdivStyle: {
        top: window.innerWidth+90,
        left: 10,
        textAlign: "right",
        width: window.innerWidth-20,
        height: 40,
        color: '#fff',
        fontSize: 12
    }
}

module.exports = ListItem;
