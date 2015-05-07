/** @jsx React.DOM */
var localForage = require('localForage');;
var React = require('react');
var ig = require('instagram-node').instagram();

    ig.use({
        client_id: '',
        client_secret: ''
    });

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
        return (
            <div className="media">
               <div className="user">
                <img src={this.state.profile_pic} /> {this.props.media.user.username}
               </div>
               <div className="image">
                  <img src={this.state.photo} />
               </div>
               <div className="info">
                  <div className="caption">{this.props.media.caption.text}</div>
                  <div className="likes">
                     {this.props.media.likes.count} likes
                  </div>
               </div>
            </div>
        );
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
})

var App = React.createClass({
    getDefaultProps: function(){
        var redirect_url = "http://alvinsj.com/viewfinder/ffos";
        var auth_url = ig.get_authorization_url(redirect_url);
        return {auth_url: auth_url, redirect_url: redirect_url};
    },
    getInitialState: function(){
        return {access_token: false, code: false, medias: false};
    },
    render: function(){
        this._authAndFetchMedia();
        
        if(!this.state.code){
            return <div className="status">Logging in...</div>
        }else if(!this.state.access_token){
            return <div className="status">Authenticating...</div>
        }else if(this.state.medias){
            var medias = this.state.medias.map(function(media){
                return <Media key={media.id} media={media}/>
            })
            return (<div>
                <h1 className="brand" onClick={this._refresh}>Viewfinder <small>for Instagram</small></h1>
                <div className="media-content">
                  {medias}
                </div>
            </div>)
        }else{
            return <div className="status">Loading media...</div>;
        }
            
    },
    _refresh: function(){
        this.setState({medias: false});
    },
    _authAndFetchMedia: function(){
        var component = this;
        if(!this.state.code){
            var browser = document.getElementById('browser');
            browser.style.display = 'block';
            browser.setAttribute('src', this.props.auth_url);
            browser.addEventListener('mozbrowserlocationchange',function(event){
                if(event.detail.indexOf('http://alvinsj.com') == 0){
                    var url = new URL(event.detail);
                    browser.stop();
                    browser.style.display = 'none';
                    component.setState({code: url.search.slice(6)})
                }
            });
        }
        else if(this.state.code && !this.state.access_token){
            ig.authorize_user(this.state.code, this.props.redirect_url, function(err, result){
                if (err) {
                    console.log('error: ', err.body);
                } else {
                    ig.use({ access_token: result.access_token });
                    component.setState({access_token: result.access_token});
                } 
            });
        }
        else if(this.state.access_token && !this.state.medias){
           localForage.getItem('last', function(err, medias) {
                if(medias) {
                    console.log('from last response');
                    component.setState({medias: medias});
                }
           });
           ig.user_self_feed(function(err, medias, pagination, remaining, limit) {
               component.setState({medias: medias});
               localForage.setItem('last', medias, function() {});
           });   
        }
    }
});

React.render(<App />, document.getElementById('app'));
