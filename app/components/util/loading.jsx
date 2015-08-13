'use strict';

import React                        from 'react';
import Component                    from '../../lib/app/component';
import Icon                         from './icon';

class Loading extends React.Component {
  render () {
    return (
      <div className={ Component.classList(this, 'text-center', 'gutter', 'muted') }>
        <Icon icon="circle-o-notch" spin={ true } size={ 4 } />
      </div>
    );
  }
}

export default Loading;
