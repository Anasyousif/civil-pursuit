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
      <section className="promote-description">{ this.props.description }</section>
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
        <TextArea block placeholder="Can you provide feedback that would encourage the author to create a statement that more people would unite around?" className="user-feedback block"></TextArea>
      </div>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class PromoteButton extends React.Component {
  render () {
    return (
      <Button block { ...this.props }>{ this.props.subject }</Button>
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
    let text = 'Neither';

    let { cursor, limit } = this.props;

    if ( cursor === limit ) {
      text = 'Finish';
    }

    return (
      <Button block { ...this.props }><b>{ text }</b></Button>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnItem extends React.Component {
  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <ItemMedia item={ item } />
        <Subject subject={ item.subject } />
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnFeedback extends React.Component {
  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <Feedback className="gutter-top" />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnSliders extends React.Component {
  render () {
    let { item, position, criterias } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <Sliders criterias={ criterias } className="promote-sliders" />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ColumnButtons extends React.Component {
  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <PromoteButton { ...item } onClick={ this.props.next.bind(this.props.parent, position) } className="gutter-bottom" />
        <EditAndGoAgain />
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class SideColumn extends React.Component {
  render () {
    let { item, position, criterias, other } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    let promoteMe = (
      <PromoteButton { ...item } onClick={ this.props.next.bind(this.props.parent, position) } className="gutter-bottom" />
    );

    if ( ! other ) {
      promoteMe = ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <ItemMedia item={ item } />
        <Subject subject={ item.subject } />
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
        <div style={{ clear: 'both' }} />
        <Sliders criterias={ criterias } className="promote-sliders" />
        <Feedback className="gutter-top" />
        <div data-screen="phone-and-down" className="gutter-top">
          { promoteMe }
          <EditAndGoAgain />
        </div>
      </Column>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Promote extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = {
      cursor    :   1
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    console.log('receiving props', props.show, this.status)
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get evaluation', this.props.item)
        .on('OK get evaluation', evaluation => {
          console.log('GOT EVALUATION', evaluation);
          let limit = 5;

          this.items = evaluation.items;

          if ( evaluation.items[0] ) {
            window.socket.emit('add view', evaluation.items[0]._id);
          }

          if ( evaluation.items[1] ) {
            window.socket.emit('add view', evaluation.items[1]._id);
          }

          this.setState({
            limit       :   limit,
            left        :   evaluation.items[0],
            right       :   evaluation.items[1],
            criterias   :   evaluation.criterias
          });
        })
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  next (position) {
    console.log('next', position);

    let view = React.findDOMNode(this.refs.view);

    let { cursor, limit, left, right } = this.state;

    if ( cursor < limit ) {
      if ( ! position ) {
        cursor += 2;
      }

      else {
        cursor += 1;
      }

      switch ( position ) {
        case 'left' :
          window.socket.emit('promote', left._id);

          let feedback = view.querySelectorAll('.promote-right .user-feedback');

          for ( let i = 0; i < feedback.length; i ++ ) {
            let value = feedback[i].value;

            if ( value ) {
              let id = feedback[i].closest('.item').id.split('-')[1];

              console.log({ id });

              window.socket.emit('insert feedback', id, value);

              feedback[i].value = '';
            }
          }

          let votes = view.querySelectorAll('.promote-right [type="range"]');

          let visibleVotes = [];

          for ( let i = 0; i < votes.length; i ++ ) {
            if ( votes[i].offsetHeight ) {
              let id = votes[i].closest('.item').id.split('-')[1];

              let vote = {
                criteria : votes[i].dataset.criteria,
                value: votes[i].value,
                item : id
              };

              visibleVotes.push(vote);

              votes[i].value = 0;
            }
          }

          window.socket.emit('insert votes', visibleVotes);

          right = this.items[cursor];
          window.socket.emit('add view', right._id);
          break;

        case 'right':
          window.socket.emit('promote', right._id);

          let feedback = view.querySelectorAll('.promote-left .user-feedback');

          for ( let i = 0; i < feedback.length; i ++ ) {
            let value = feedback[i].value;

            if ( value ) {
              let id = feedback[i].closest('.item').id.split('-')[1];

              console.log({ id });

              window.socket.emit('insert feedback', id, value);

              feedback[i].value = '';
            }
          }

          let votes = view.querySelectorAll('.promote-left [type="range"]');

          let visibleVotes = [];

          for ( let i = 0; i < votes.length; i ++ ) {
            if ( votes[i].offsetHeight ) {
              let id = votes[i].closest('.item').id.split('-')[1];

              let vote = {
                criteria : votes[i].dataset.criteria,
                value: votes[i].value,
                item : id
              };

              visibleVotes.push(vote);

              votes[i].value = 0;
            }
          }

          window.socket.emit('insert votes', visibleVotes);

          left = this.items[cursor];
          window.socket.emit('add view', left._id);
          break;

        default:
          if ( left ) {
            let feedback = view.querySelectorAll('.promote-left .user-feedback');

            for ( let i = 0; i < feedback.length; i ++ ) {
              let value = feedback[i].value;

              if ( value ) {
                let id = feedback[i].closest('.item').id.split('-')[1];

                console.log({ id });

                window.socket.emit('insert feedback', id, value);

                feedback[i].value = '';
              }
            }

            let votes = view.querySelectorAll('[type="range"]');

            let visibleVotes = [];

            for ( let i = 0; i < votes.length; i ++ ) {
              if ( votes[i].offsetHeight ) {
                let id = votes[i].closest('.item').id.split('-')[1];

                let vote = {
                  criteria : votes[i].dataset.criteria,
                  value: votes[i].value,
                  item : id
                };

                visibleVotes.push(vote);

                votes[i].value = 0;
              }
            }

            window.socket.emit('insert votes', visibleVotes);
          }

          if ( right ) {
            let feedback = view.querySelectorAll('.promote-right .user-feedback');

            for ( let i = 0; i < feedback.length; i ++ ) {
              let value = feedback[i].value;

              if ( value ) {
                let id = feedback[i].closest('.item').id.split('-')[1];

                console.log({ id });

                window.socket.emit('insert feedback', id, value);

                feedback[i].value = '';
              }
            }

            let votes = view.querySelectorAll('.promote-right [type="range"]');

            let visibleVotes = [];

            for ( let i = 0; i < votes.length; i ++ ) {
              if ( votes[i].offsetHeight ) {
                let id = votes[i].closest('.item').id.split('-')[1];

                let vote = {
                  criteria : votes[i].dataset.criteria,
                  value: votes[i].value,
                  item : id
                };

                visibleVotes.push(vote);
              }
            }

            window.socket.emit('insert votes', visibleVotes);
          }

          left = this.items[cursor-1];

          if ( cursor > limit ) {
            cursor = limit;
            right = null;
          }
          else {
            right = this.items[cursor];
          }

          if ( left ) {
            window.socket.emit('add view', left._id);
          }

          if ( right ) {
            window.socket.emit('add view', right._id);
          }

          break;
      }

      let top = view.getBoundingClientRect().top;
      let { pageYOffset } = window;

      window.scrollTo(0, pageYOffset + top - 60);

      this.setState({ cursor, left, right });
    }

    else {
      switch ( position ) {
        case 'left' :
          window.socket.emit('promote', left._id);
          break;

        case 'right':
          window.socket.emit('promote', right._id);
          break;
      }

      this.setState({
        limit       :   0,
        left        :   {},
        right       :   {},
        criterias   :   [],
        cursor      :   1
      });

      this.status = 'iddle';

      view.closest('.item').querySelector('.toggle-details').click();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    let content = ( <Loading /> );

    if ( this.state.limit ) {
      content = [];

      let foo = <h5 className="text-center gutter">Which of these is most important for the community to consider?</h5>;

      if ( ! this.state.left || ! this.state.right ) {
        foo = ( <div></div> );
      }

      let promoteMe = (
        <ColumnButtons key="left-buttons" item={ this.state.left } position='left' next={ this.next.bind(this) } parent={ this } />
      );

      if ( ! this.state.left || ! this.state.right ) {
        promoteMe = ( <div></div> );
      }

      content.push(
        (
          <Header { ...this.state } />
        ),

        // big screens

        (
          <div data-screen="phone-and-up">
            <Row>
              <ColumnItem item={ this.state.left } position='left' key='item-left' />

              <ColumnItem item={ this.state.right } position='right' key='item-right' />
            </Row>

            <Row>
              <ColumnFeedback key="left-feedback" item={ this.state.left } position='left' />

              <ColumnFeedback key="right-feedback" item={ this.state.right } position='right' />
            </Row>

            <Row>
              <ColumnSliders key="left-sliders"  item={ this.state.left } position='left' criterias={ this.state.criterias } />

              <ColumnSliders key="right-sliders" item={ this.state.right } position='right' criterias={ this.state.criterias } />

            </Row>

            { foo }

            <Row>
              { promoteMe }

              <ColumnButtons key="right-buttons" item={ this.state.right } position='right' next={ this.next.bind(this) } parent={ this } />

            </Row>
          </div>
        ),

        // SMALL SCREENS

        (
          <div data-screen="up-to-phone">
            <Row data-stack>
              <SideColumn key="left" position="left" item={ this.state.left } criterias={ this.state.criterias } next={ this.next.bind(this) } parent={ this } other={ this.state.right } />

              <SideColumn key="right" position="right" item={ this.state.right } criterias={ this.state.criterias } next={ this.next.bind(this) } parent={ this } other={ this.state.left } />
            </Row>
          </div>
        ),
        (
          <div className="gutter">
            <Finish { ...this.state } onClick={ this.next.bind(this, null) } />
          </div>
        )
      );
    }

    return (
      <section className={`item-promote ${this.props.className}`} ref="view">
        { content }
      </section>
    );
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default Promote;
