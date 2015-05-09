/** @jsx React.DOM */
var React = require('react');

var ReactCanvas = require('react-canvas');
var ListView = ReactCanvas.ListView;
var Group = ReactCanvas.Group;
var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;

var ListItem = require('components/list-item');

var List = React.createClass({
    componentDidMount: function(){
        window.addEventListener('resize', this.handleResize, true);
        //var visibles = this.refs.listview.getVisibleItemIndexes();
        //console.log('visibles: ', visibles);
    },
    render: function(){
        var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;
        
        return (
            <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
                <ListView ref="listview" style={this.getListViewStyle()}
                    numberOfItemsGetter={this.getNumberOfItems}
                    itemHeightGetter={this.getItemHeight}
                    itemGetter={this.renderItem} />
            </Surface>);
    },
    getNumberOfItems: function () {
        //console.log('items', this.props.medias.length)
        return this.props.medias.length;
    },
    getItemHeight: function () {
        //console.log('item height', window.innerWidth);
        return window.innerWidth+150;
    },
    renderItem: function (index) {
        //console.log('loading item ', index)
        var media = this.props.medias[index];
        return <ListItem media={media} />
    },

    getListViewStyle: function () {
        return {
          top: 44,
          left: 0,
          width: window.innerWidth-10,
          height: window.innerHeight-44
        };
    },
    handleResize: function(){
        this.forceUpdate();
    }
});

module.exports = List;