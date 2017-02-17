'use strict';

import React                        from 'react';
import ReactDOM                     from 'react-dom';
import superagent                   from 'superagent';
import config                       from 'syn/../../public.json';
import Component                    from '../lib/app/component';
import Modal                        from './util/modal';
import Form                         from './util/form';
import Button                       from './util/button';
import Submit                       from './util/submit';
import ButtonGroup                  from './util/button-group';
import Icon                         from './util/icon';
import Link                         from './util/link';
import Row                          from './util/row';
import Column                       from './util/column';
import EmailInput                   from './util/email-input';
import Password                     from './util/password';
import InputGroup                   from './util/input-group';
import Loading                      from './util/loading';
import Facebook                     from '../lib/app/fb-sdk';

class Join extends React.Component {
    static click () {
    let modal = document.querySelector('.syn-join');
    modal.classList.add('syn--visible');
  }

  render(){
      let classes = [ 'syn-join' ];

      if ( this.props.show ) {
        classes.push('syn--visible');
      }
      return(
        <Modal className={ Component.classList(this, ...classes) } title="Join">
            <JoinForm {...this.props}/>
        </Modal>
      );
  }
}

class JoinForm extends React.Component {

  constructor (props) {
    super(props);

    this.state = { validationError : null, successMessage : null, info : null, joinActive: false, loginActive: false };
  }

  signup () {

    let email = ReactDOM.findDOMNode(this.refs.email).value,
      password = ReactDOM.findDOMNode(this.refs.password).value,
      confirm = ReactDOM.findDOMNode(this.refs.confirm).value,
      agree = ReactDOM.findDOMNode(this.refs.agree),
      path = window.location.pathname;

    this.setState({ validationError : null, info : 'Logging you in...' });

    if ( password !== confirm ) {
      this.setState({ validationError : 'Passwords do not match', info: null });

      return;
    }

    if ( ! agree.classList.contains('fa-check-square-o') ) {
      this.setState({ validationError : 'Please agree to our terms of service', info: null });

      return;
    }

    window.onbeforeunload=null; // stop the popup about navigating away

    superagent
      .post('/sign/up')
      .send({ email, password })
      .end((err, res) => {
        switch ( res.status ) {
          case 401:
            this.setState({ validationError : 'This email address is already taken', info: null });
            break;

          case 200:
            this.setState({ validationError : null, successMessage : 'Welcome aboard!', info: null });
            //location.href = '/page/profile';
            //location.href = '/';
            location.href=path;
            break;

          default:
            this.setState({ validationError : 'Unknown error', info: null });
            break;
        }

        // location.href = '/';
      });
  }


  static signIn (email, password) {
    window.onbeforeunload=null; // stop the popup about navigating away
    return new Promise((ok, ko) => {
      try {
        superagent
          .post('/sign/in')
          .send({ email, password })
          .end((err, res) => {
            // if ( err ) {
            //   return ko(err);
            // }
            switch ( res.status ) {
              case 404:
                ko(new Error("Email / Password Don't Match"));  // email not found but don't say that to the user
                break;

                case 401:
                  ko(new Error("Email / Password Don't Match")); // Wrong Password but dont say that to the users
                  break;

                case 200:
                  ok();
                  // location.href = '/page/profile';
                  break;

                default:
                  ko(new Error('Unknown error'));
                  break;
            }
          });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  login () {

    this.setState({ validationError : null, info : 'Logging you in...' });

    let email = ReactDOM.findDOMNode(this.refs.email).value,
      password = ReactDOM.findDOMNode(this.refs.password).value;

    JoinForm
      .signIn(email, password)
      .then(
        () => {
          this.setState({ validationError : null, info: null, successMessage : 'Welcome back' });
          setTimeout(() => location.href = window.location.pathname, 800); //'/page/profile'
        },
        error => {
          this.setState({ validationError : error.message, info: null })
        }
      );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loginWithFacebook () {
    // location.href = '/sign/in/facebook/';
    console.info("Join.loginWithFacebook");
    Facebook.connect();
  }

  loginWithTwitter () {
    location.href = '/sign/in/twitter/';
  }

  agree () {
    let box = ReactDOM.findDOMNode(this.refs.agree);

    if ( box.classList.contains('fa-square-o') ) {
      box.classList.remove('fa-square-o');
      box.classList.add('fa-check-square-o');
    }
    else {
      box.classList.add('fa-square-o');
      box.classList.remove('fa-check-square-o');
    }

    this.onChangeActive();
  }

  stopPropagation(e){
    e.stopPropagation();
 }

 onChangeActive(){
    let email = ReactDOM.findDOMNode(this.refs.email).value,
      password = ReactDOM.findDOMNode(this.refs.password).value,
      confirm = ReactDOM.findDOMNode(this.refs.confirm).value,
      agree = ReactDOM.findDOMNode(this.refs.agree).classList.contains('fa-check-square-o'); // true if the box is checked

      if(!this.state.loginActive && email && password && !confirm) this.setState({loginActive: true});
      if(this.state.loginActive && (!email || !password || confirm )) this.setState({loginActive: false});
      if(!this.state.joinActive && email && password && confirm && password==confirm && agree) this.setState({joinActive: true});
      if(this.state.joinActive && (!email || !password || !confirm || password!=confirm || !agree)) this.setState({joinActive: false});
 }



  render () {
    let content = (
      <div onClick={this.stopPropagation.bind(this)}>
        <ButtonGroup block>
          <Button primary onClick={ this.loginWithFacebook } medium className="join-with-facebook">
            <Icon icon="facebook" />
            <span className={ Component.classList(this) } inline> Facebook</span>
          </Button>

          <Button info onClick={ this.loginWithTwitter } medium className="join-with-twitter">
            <Icon icon="twitter" />
            <span> Twitter</span>
          </Button>
        </ButtonGroup>

        <div className="syn-form-group">
          <label>Email</label>
          <EmailInput block autoFocus medium required placeholder="Email" ref="email" name="email" onChange={this.onChangeActive.bind(this)}/>
        </div>

        <Row>
          <Column span="50">
            <div className="syn-form-group">
              <label>Password</label>

            </div>
          </Column>

          <Column span="50">
            <div className="syn-form-group">
              <label>Confirm</label>

            </div>
          </Column>

        </Row>

        <InputGroup block>
          <Password required placeholder="Password" ref="password" medium name="password" onChange={this.onChangeActive.bind(this)} />
          <Password required placeholder="Confirm password" ref="confirm" medium name="confirm" onChange={this.onChangeActive.bind(this)} />
        </InputGroup>



        <Row>
          <Column span="50" gutter className="text-left">
            <p style={{margin: 0}}>Already a user? Just Login</p>
          </Column>

          <Column span="50" text-right gutter>
            <a href="#" onClick={ this.agree.bind(this) } style={{ textDecoration: 'none', color: 'inherit', float: 'left', marginLeft: '1em'}}>
              <Icon icon="square-o" size="2" ref="agree" name="agree" />
            </a>
             <span>I agree to the </span><a href="/page/terms-of-service">Terms of Service</a>
          </Column>
        </Row>

        <ButtonGroup block>
          <Button primary onClick={ this.login.bind(this) } medium inactive={!this.state.loginActive} className="syn-form-group syn-form-submit login-button">
            <span className={ Component.classList(this) } inline> Login</span>
          </Button>

          <Button info onClick={ this.signup.bind(this) } medium inactive={!this.state.joinActive} className="syn-form-group syn-form-submit join-button">
            <span>Join</span>
          </Button> 
        </ButtonGroup>
        
      </div>
    );

    if ( this.state.info ) {
      content = ( <Loading message="Signing you in ..." /> );
    }

    else if ( this.state.successMessage ) {
      content = ( <div></div> );
    }

    return (
        <Form flash={ this.state } ref='form' name="join">
          { content }
        </Form>
    );
  }
}

export default Join;
export {Join, JoinForm};

