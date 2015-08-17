'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';
import ItemMedia        from './item-media';
import Loading          from './util/loading';
import Sliders          from './sliders';
import TextArea         from './util/text-area';
import Button           from './util/button';
import Component        from '../lib/app/component';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Header extends React.Component {
  render () {
    return (
      <header className="text-center gutter-bottom">
        <h2>{ this.props.cursor } of { this.props.limit }</h2>
        <h4>Evaluate each item below</h4>
      </header>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Subject extends React.Component {
  render () {
    return (
      <h4>{ this.props.subject }</h4>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Description extends React.Component {
  render () {
    return (
      <section>{ this.props.description }</section>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Reference extends React.Component {
  render () {
    return (
      <h5>
        <a href={ this.props.url } rel="nofollow" target="_blank">{ this.props.title || this.props.url }</a>
      </h5>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Feedback extends React.Component {
  render () {
    return (
      <div { ...this.props }>
        <TextArea block placeholder="Can you provide feedback that would encourage the author to create a statement that more people would unite around?"></TextArea>
      </div>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class PromoteButton extends React.Component {
  render () {
    return (
      <Button block>{ this.props.subject }</Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class EditAndGoAgain extends React.Component {
  render () {
    return (
      <Button block { ...this.props }><i>Edit and go again</i></Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Finish extends React.Component {
  render () {
    return (
      <Button block><b>Neither</b></Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Promote extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = {
      cursor    :   1
    };
  }

  componentWillReceiveProps (props) {
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get evaluation', this.props.item)
        .on('OK get evaluation', evaluation => {
          console.log('GOT EVALUATION', evaluation);
          let limit = 5;

          this.setState({
            limit       :   limit,
            left        :   evaluation.items[0],
            right       :   evaluation.items[1],
            criterias   :   evaluation.criterias
          });
        })
    }
  }

  render () {

    let content = ( <Loading /> );

    if ( this.state.limit ) {
      content = [];

      content.push(
        (
          <Header { ...this.state } />
        ),
        (
          <Row data-stack="phone-and-down">
            <Column span="50" key="left" className="promote-left">
              <ItemMedia item={ this.state.left } />
              <Subject subject={ this.state.left.subject } />
              <Reference { ...this.state.left.references[0] } />
              <Description description={ this.state.left.description } />
              <div style={{ clear: 'both' }} />
              <Sliders criterias={ this.state.criterias } className="promote-sliders" />
              <Feedback className="gutter-top" />
              <div data-screen="phone-and-down" className="gutter-top">
                <PromoteButton { ...this.state.left } />
                <EditAndGoAgain />
              </div>
            </Column>

            <Column span="50" key="right" className="promote-right">
              <ItemMedia item={ this.state.right } />
              <Subject subject={ this.state.right.subject } />
              <Reference { ...this.state.right.references[0] } />
              <Description description={ this.state.left.description } />
              <div style={{ clear: 'both' }} />
              <Sliders criterias={ this.state.criterias } className="promote-sliders" />
              <Feedback className="gutter-top" />
              <div data-screen="phone-and-down" className="gutter-top">
                <PromoteButton { ...this.state.right } />
                <EditAndGoAgain />
              </div>
            </Column>
          </Row>
        ),
        (
          <h5 data-screen="phone-and-up" className="text-center gutter">Which of these is most important for the community to consider?</h5>
        ),
        (
          <Row data-stack="phone-and-down" data-screen="phone-and-up">
            <Column span="50" key="left" className="promote-left">
              <PromoteButton { ...this.state.left } />
              <EditAndGoAgain className="gutter-top" />
            </Column>

            <Column span="50" key="right" className="promote-right">
              <PromoteButton { ...this.state.right } />
              <EditAndGoAgain className="gutter-top" />
            </Column>
          </Row>
        ),
        (
          <div className="gutter">
            <Finish />
          </div>
        )
      );
    }

    return (
      <section className={`item-promote ${this.props.className}`}>
        { content }
      </section>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default Promote;
