'use strict';

import React                  from 'react';
import itemType               from '../lib/proptypes/item';

class YouTube extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    item : itemType
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state= { vHeight: 0,
            vWidth: 0
  };

  static isYouTube (item) {
    let is = false;

    let references = item.references || [];

    if ( references.length ) {
      let url = references[0].url;

      if ( YouTube.regex.test(url) ) {
        is = true;
      }
    }

    return is;
  }

  componentDidMount() {
    let container=this.refs.container;
    if(container.clientHeight && container.clientWidth){
      this.setState({vHeight: container.clientHeight, vWidth: container.clientWidth});
    }
  }

  componentDidUpdate() {
    let container=this.refs.container;
    if(container.clientHeight && container.clientWidth && ( container.clientHeight!== this.state.vHeight || container.clientWidth !== this.state.vWidth )){
      this.setState({vHeight: container.clientHeight, vWidth: container.clientWidth});
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static getId (url) {
    let youTubeId;

    url.replace(YouTube.regex, (m, v) => youTubeId = v);

    return youTubeId;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { item } = this.props;

    let { url } = item.references[0];

    let youTubeId = YouTube.getId(url);

    return (
      <div className="video-container" ref="container">
        <iframe id="ytplayer" modestbranding="1" controls="0" modestbranding=1" showinfo=0" type="text/html" allowFullScreen frameBorder="0" width={this.state.vWidth ? this.state.vWidth : "192"} height={ this.state.vHeight ? this.state.vHeight : "108" } 
         src={ `http://www.youtube.com/embed/${youTubeId}?autoplay=0` }>
        </iframe>
      </div>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

export default YouTube;
