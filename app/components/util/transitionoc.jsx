'use strict';

import React                    from 'react';
import ClassNames          from 'classnames';

//
// use <TransitionOC ref={comp => { this.TransitionOCComponent = comp; }}}
// so that you can call this.TransitionOCComponent.toggle();
// 

export default class TransitionOC extends React.Component {

    constructor(props){
        super(props);
        this.state={shape: this.props.active ? 'opened' : 'closed'};
    }

    componentDidMount(){
        this.eventListener=this.transitioned.bind(this);
        this.refs.ele.addEventListener("transitionend", this.eventListener);
    }

    componentWillUnmount(){
        if(this.eventListener) this.refs.ele.removeEventListener("transitionend", this.eventListener);
    }

    toggle(set){
        console.info("TransitionOC toggle", set, this.props)
        if(typeof set === 'boolean') return this.componentWillReceiveProps({active: set});
        if(this.state.shape==='opened') this.setState({shape: 'closing'});  // start closing
        else if (this.state.shape===('closing')) this.setState({shape: 'opening'}); // reverse direction
        else if (this.state.shape===('closed')) this.setState({shape: 'opening'}); // start opening
        else if (this.state.shape===('opening')) this.setState({shape: 'closing'}); // reverse direction
    }

    componentWillReceiveProps(newProps){
        if(newProps.active){
            if(this.state.shape==='closed') this.setState({shape: 'opening'});
            else if (this.state.shape==='closing') this.setState({shape: 'opening'});
            else return; // open -> open, opening->opening no need to make a change
        }else{
            if(this.state.shape='opened') this.setState({shape: 'closing'});
            else if (this.state.shape=='opening') this.setState({shape: 'closing'});
            else return; // closed -> closed, closing -> closing no need to make a change
        }
    }

    transitioned(e){
        console.info("TransitionOC.transitioned",e);
        if(this.state.shape==='opening')       this.setState({shape: 'opened'}, ()=>{this.props.onChange && this.props.onChange(true)}); // finish opening
        else if(this.state.shape==='closing')  this.setState({shape: 'closed'}, ()=>{this.props.onChange && this.props.onChange(false)});  // finish closing
        else if(this.state.shape==='opened') { this.props.onChange && this.props.onChange(true)  } // finish opening
        else if(this.state.shape==='closed') { this.props.onChange && this.props.onChange(false) } // finish opening
    }

    render () {
        var classes = ClassNames( 
            this.props.className, 
            'opened-closed',
            this.state.shape
        )

        console.info("TransitionOC.render",classes)
        return (
            <div {...this.props} className={classes} ref='ele'  >
                { this.props.children }
            </div>
        );
    }
}

