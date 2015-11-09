
var React = require('react');
var ListItem = require('components/list-item');

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.getItemHeight = this.getItemHeight.bind(this);
        this.getNumberOfItems = this.getNumberOfItems.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, true);
        //var visibles = this.refs.listview.getVisibleItemIndexes();
        //console.log('visibles: ', visibles);
    }

    render() {
        var surfaceWidth = window.innerWidth;
        var surfaceHeight = window.innerHeight;
        var medias = this.props.medias.map((media, index) => {
            return this.renderItem(index);
        })
        return (
            <div width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
                <div ref="listview" style={this.getListViewStyle()}>
                    {medias}
                </div>
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

    getListViewStyle() {
        return {
          top: 44,
          left: 0,
          width: window.innerWidth-10,
          height: window.innerHeight-44
        };
    }

    handleResize() {
        this.forceUpdate();
    }
}

module.exports = List;
