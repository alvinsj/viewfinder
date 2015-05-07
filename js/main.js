/** @jsx React.DOM */
var localForage = require('localForage');;
var React = require('react');
var ig = require('instagram-node').instagram();

    ig.use({
        client_id: '',
        client_secret: ''
    });

var Media = React.createClass({
    render: function(){
        return (
            <div className="media">
               <div className="user">
                <img src={this.props.media.user.profile_picture} /> {this.props.media.user.username}
               </div>
               <div className="image">
                  <img src={this.props.media.images.standard_resolution.url} />
               </div>
               <div className="info">
                  <div className="caption">{this.props.media.caption.text}</div>
                  <div className="likes">
                     {this.props.media.likes.count} likes
                  </div>
               </div>
            </div>
        );
    }
})

var App = React.createClass({
    getDefaultProps: function(){
        var redirect_url = "http://alvinsj.com/viewfinder/ffos";
        var auth_url = ig.get_authorization_url(redirect_url);
        return {auth_url: auth_url, redirect_url: redirect_url};
    },
    getInitialState: function(){
        return {access_token: false, code: false, medias: false}
    },
    _next: function(){
        var component = this;
        if(!this.state.code){
            var browser = document.getElementById('browser');
            browser.style.display = 'block';
            browser.setAttribute('src', this.props.auth_url);
            browser.addEventListener('mozbrowserlocationchange',function(event){
                console.log('locationchange:', event.detail);
                if(event.detail.indexOf('http://alvinsj.com') == 0){
                    var url = new URL(event.detail);
                    browser.stop();
                    browser.style.display = 'none';
                    component.setState({code: url.search.slice(6)})
                }
            });
            //console.log(this.state.auth_url);
        }
        else if(this.state.code && !this.state.access_token){
            ig.authorize_user(this.state.code, this.props.redirect_url, function(err, result){
                if (err) {
                    console.log('error: ', err.body);
    
                } else {
                  console.log('Yay! Access token is ' + result.access_token);
                    ig.use({ access_token: result.access_token });
                    component.setState({access_token: result.access_token});
                } 
            });
        }
        else if(this.state.access_token && !this.state.medias){
           ig.user_self_feed(function(err, medias, pagination, remaining, limit) {
               component.setState({medias: medias});
           });   
        }
    },
    render: function(){
        this._next();
        
        if(!this.state.code){
            return <div className="status">Logging in...</div>
        }else if(!this.state.access_token){
            return <div className="status">Authenticating...</div>
        }else if(this.state.medias){
            var medias = this.state.medias.map(function(media){
                return <Media media={media}/>
            })
            return <div className="media-content">
              <h1 onClick={this._refresh}>Viewfinder <small>for Instagram</small></h1>
              {medias}
            </div>
        }else{
            return <div className="status">Loading media...</div>;
        }
            
    },
    _refresh: function(){
        this.setState({medias: false});
    }
});

React.render(<App />, document.getElementById('app'));
