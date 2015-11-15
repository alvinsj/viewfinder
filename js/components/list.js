
var React = require('react');
var ListItem = require('components/list-item');
var assign = require('object-assign');

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.renderItem = this.renderItem.bind(this);
        this.state = {};
    }

    render() {
        var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;
        var medias = this.props.medias
            .map((media, index) => {
                return this.renderItem(index);
            });
        return (
            <div ref="listview" className="pic-list">
                {medias}
            </div>);
    }

    renderItem(index) {
        var media = this.props.medias[index];
        return <ListItem key={index} media={media} />
    }
}

module.exports = List;
