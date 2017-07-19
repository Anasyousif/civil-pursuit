'use strict';

import React                        from 'react';
import Loading                      from './util/loading';
import Row                          from './util/row';
import Column                       from './util/column';
import PanelItems                   from './panel-items';
import makePanelId                  from '../lib/app/make-panel-id';
import itemType                     from '../lib/proptypes/item';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';
import DoubleWide                   from './util/double-wide';
import {ReactActionStatePath, ReactActionStatePathClient}  from 'react-action-state-path';

export default class Harmony extends React.Component {
  render(){
    console.info("Harmony above.render");
    return(
    <ReactActionStatePath {...this.props}>
      <RASPHarmony />
     </ReactActionStatePath>
    )
  }
}

class RASPHarmony extends ReactActionStatePathClient {

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    var raspProps={rasp: props.rasp};
    super(raspProps, 'side');
    console.info("RASPHarmony.constructor", this.props)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is where component specific actions are converted to component specific states
  //

  segmentToState(action) {
    var side = action.segment;
    var nextRASP = { shape: 'open', side: side, pathSegment: side };
    return { nextRASP, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
  }

  actionToState(action,rasp) {
    logger.info("RASPHarmony.actionToState", {action}, {rasp});
    var nextRASP={};
    if(action.type==="CHILD_SHAPE_CHANGED"){
      let delta={};
      if(action.shape==='open') delta.side=action.side; // action is to open, this side is going to be the open side
      else if(action.side === rasp.side) delta.side=null; // if action is to truncate (not open), and it's from the side that's open then truncate this
      delta.shape=delta.side ? 'open' : rasp.shape==='open' ? 'truncated' : rasp.shape;
      if(delta.side && rasp.side && rasp.side!== delta.side) this.toChild[rasp.side]({type: "CHANGE_STATE", shape: 'truncated'}); // if a side is going to be open, and it's not the side that is open, close the other side
      if(delta.side) delta.pathSegment=delta.side; // if a side is open, include it in the pathSegment
      else delta.pathSegment=null; //otherwise no path segment
      Object.assign(nextRASP, rasp, delta);
      return nextRASP; // return the new state
    } else return null; // don't know the action type so let the default handler have it
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user, rasp } = this.props;
    console.info("Harmony.render",this.props);
    const {shape, depth}=rasp;

    const leftRASP={shape, depth, toParent: this.toMeFromChild.bind(this, 'L')};  // inserting me between my parent and my child
    const rightRASP={shape, depth, toParent: this.toMeFromChild.bind(this, 'R')};  // inserting me between my parent and my child

    let  contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={rasp.side==='L'} key={item._id+'-left'}>
          <PanelStore type={ item.harmony.types[0] } parent={ item } limit={this.props.limit}>
              <PanelItems user={ user } rasp={leftRASP} hideFeedback = {this.props.hideFeedback}/>
          </PanelStore>
        </DoubleWide>
      );

    let contentRight = (
        <DoubleWide className="harmony-con" right expanded={rasp.side==='R'}  key={item._id+'-right'} >
          <PanelStore type={ item.harmony.types[1] } parent={ item } limit={this.props.limit}>
              <PanelItems user={ user } rasp={rightRASP} hideFeedback = {this.props.hideFeedback} />
          </PanelStore>
        </DoubleWide>
      );

    return (
      <section className={`item-harmony ${this.props.className}`}>
        { contentLeft }
        { contentRight }
      </section>
    );
  }
}
