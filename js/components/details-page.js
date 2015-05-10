/** @jsx React.DOM */
var React = require('react'),
	Surface = require('react-canvas').Surface,
	ListItem = require('components/list-item');

var DetailsPage = React.createClass({
	render: function(){
		var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;

		return  <div className="media-content">
                    <Surface width={surfaceWidth} height={surfaceHeight-44} left={0} top={44}>
                        <ListItem media={this.props.media} />
                    </Surface>
                </div>
	}
})