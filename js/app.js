/** @jsx React.DOM */
var localForage = require('localForage');;
var React = require('react');
var ig = require('instagram-node').instagram();
    ig.use(require('./instagram'));

var List = require('./components/list');

var App = React.createClass({

    getDefaultProps: function(){
        var redirect_url = "http://alvinsj.com/viewfinder/ffos";
        var auth_url = ig.get_authorization_url(redirect_url);
        return {auth_url: auth_url, redirect_url: redirect_url};
    },
    getInitialState: function(){
        return {access_token: false, code: false, medias: false};
    },
    componentDidMount: function(){
        window.addEventListener('resize', this.handleResize, true);
    },
    render: function(){
        this._authAndFetchMedia();
        
        var status = "";
        if(!this.state.code){
            status = "Logging in...";
        }else if(!this.state.access_token){
            status = "Authenticating..."
        }else{
            status = "Loading media...";
        }

        return (
            <div>
                <h1 className="brand" onClick={this._refresh}>
                    Viewfinder <small>for Instagram</small>
                </h1>
                { this.state.medias ? 
                    (<div className="media-content">
                      <List medias={this.state.medias} />
                    </div>)
                    : <div className="status">{status}</div>
                }
            </div>)
            
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
                    //console.log('from last response');
                    component.setState({medias: medias});
                }
           });
           ig.user_self_feed(function(err, medias, pagination, remaining, limit) {
               component.setState({medias: medias});
               localForage.setItem('last', medias, function() {});
           });   
        }
    },
    handleResize: function(){
        this.forceUpdate();
    }
});

React.render(<App />, document.getElementById('app'));
