'use strict';

import React            from 'react';
import { EventEmitter } from 'events';
import makePanelId      from '../../lib/app/make-panel-id';
import publicConfig     from '../../../public.json';

class PanelStore extends React.Component {

  id;

  state = { panel : null, count : null, new : false };

  emitter = new EventEmitter();

  constructor(props){
    super(props);
    if(this.props.items){
      this.state.panel={};
      this.state.panel.type=this.props.type;
      this.state.panel.parent=this.props.parent || null;
      this.state.panel.items=this.props.items.slice(0);
      this.state.panel.limit= this.props.limit || publicConfig['navigator batch size'];
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    window.socket.on('OK create item', this.okCreateItem.bind(this));

    this.emitter.on('edit', this.edit.bind(this));

    if ( ! this.state.panel ) {
      const panel = { type : this.props.type };

      if ( this.props.parent ) {
        panel.parent = this.props.parent; //._id;
      }

      if(this.props.limit){panel.limit=this.props.limit}

      if(this.props.own){panel.own=this.props.own}

      this.id = makePanelId(panel);

      window.socket.emit('get items', panel, this.okGetItems.bind(this));
    } else {
            this.id = makePanelId({ type : this.props.type, parent: this.props.parent || null });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount() {
    window.socket.off('OK create item', this.okCreateItem.bind(this));

    this.emitter.removeListener('edit', this.edit.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  edit (item) {
    const loaded = this.state.panel.items.some(
      panelItem => panelItem._id === item._id
    );

    if ( loaded ) {
      this.emitter.emit('show', item._id, 'editItem');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetItems (panel, count) {
    if ( makePanelId(panel) === this.id ) {
      this.setState({ panel, count });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okCreateItem (item) {

    const parentId = this.props.parent ? this.props.parent._id || this.props.parent : undefined;
    const itemParentId= item.parent ? item.parent._id || item.parent : undefined;


    if ( item.type._id === this.props.type._id && itemParentId === parentId ) {

      let { items } = this.state.panel;

      if ( ! items ) {
        items = [];
      }

      items = [item].concat(items);

      this.setState( {panel: { items, new : item, type: this.props.type, parent: this.props.parent } } );
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, Object.assign({}, this.state, { emitter : this.emitter }), child.props.children )
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("PanelStore.render", this.props, this.state)
    const panelout = this.renderChildren();

    console.info("PanelStore children rendered");
    
    return (  
      <section>
        { panelout }
      </section>
    );
  }
}

export default PanelStore;
