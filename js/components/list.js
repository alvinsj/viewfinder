
var React = require('react');
var ListItem = require('components/list-item');
var assign = require('object-assign');

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.getItemHeight = this.getItemHeight.bind(this);
        this.getNumberOfItems = this.getNumberOfItems.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.state = {};
    }

    render() {
        var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;
        var medias = this.props.medias.map((media, index) => {
            return this.renderItem(index);
        })
        return (
            <div ref="listview" className="pic-list">
                {medias}
            </div>);
    }

    getNumberOfItems() {
        //console.log('items', this.props.medias.length)
        return this.props.medias.length;
    }

    getItemHeight() {
        //console.log('item height', window.innerWidth);
        return window.innerWidth+150;
    }

    renderItem(index) {
        //console.log('loading item ', index)
        var media = this.props.medias[index];
        return <ListItem key={index} media={media} />
    }
}

module.exports = List;
