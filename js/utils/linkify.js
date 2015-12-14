import React from 'react';
import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

const linkit = new LinkifyIt();
linkit.tlds(tlds);

class Link extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._onClick = this._onClick.bind(this);
    }

    render() {
        return <a ref="link" href="#" onClick={this._onClick}>{this.props.children}</a>
    }

    _onClick(e) {
        e.preventDefault();

        var activity = new MozActivity({
            name: "view",
            data: {
                      type: "url",
                      url: this.props.href
                  }
        });
    }
}

function linkify(string){
    const matches = linkit.match(string);
    var children = [];
    var current = string;

    //'abc http://h efg http://d'
    // console.log('linkify', string, matches);
    if(matches && matches.length > 0){
        var match = matches.shift();
        var parts = string.split(match.raw);

        parts.forEach((part) => {
            children = children.concat(linkify(part));
            children.push(<Link href={match.url}>{match.text}</Link>);
        });
        children.splice(-1);

        return children;
    }else{
        return [string];
    }
};

window.linkify = linkify;
module.exports = linkify;
