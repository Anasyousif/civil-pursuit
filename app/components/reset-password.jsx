'use strict';

import React                        from 'react';
import Form                         from './util/form';
import EmailInput                   from './util/email-input';
import TextInput                    from './util/text-input';
import Password                     from './util/password';
import Panel                        from './panel';
import Loading                      from './util/loading';
import Button                       from './util/button'
import InputGroup                   from './util/input-group';
import Login                        from './login';
import userType                     from '../lib/proptypes/user';

class ResetPassword extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    userToReset : userType,
    urlParams : React.PropTypes.shape({
      token : React.PropTypes.string
    })
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = {
      validationError   : null,
      successMessage    : null,
      info              : null
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save () {
    const password            =   React.findDOMNode(this.refs.password);
    const confirmPassword     =   React.findDOMNode(this.refs.confirmPassword);
    const resetKey            =   React.findDOMNode(this.refs.reset);

    this.setState({ validationError : null });

    if ( password.value !== confirmPassword.value ) {
      this.setState({ validationError : 'Passwords don\'t match' });
      return;
    }

    if ( resetKey.value !== this.props.user.activation_key ) {
      this.setState({ validationError : 'Wrong reset key' });
      return;
    }

    this.props.actions['reset password'](password.value, user => {
      Login
        .signIn(this.props.user.email, password.value)
        .then(
          () => {
            this.setState({ validationError : null, info: null, successMessage : 'Welcome back' });
            setTimeout(() => location.href = '/page/profile', 800);
          },
          ko => this.setState({ validationError : 'Wrong email', info: null })
        );
    });

    this.setState({ info : 'Resetting your password' });

    // window.Dispatcher.on('password reset', () => {

    // });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let content = ( <Loading message="Getting user info" /> );

    if ( this.props.user ) {

      let formContents;

      if ( ! this.state.info && ! this.state.successMessage ) {
        formContents = (
          <div>
            <h3 className="text-center">Your email</h3>

            <EmailInput
              block
              autoFocus
              required
              medium
              disabled
              placeholder                 =   "Email"
              ref                         =   "email"
              name                        =   "email"
              value                       =   { this.props.user.email }
            />

            <h3 className="text-center">Your reset key</h3>

            <h5 className="text-center">Enter here the reset key that was sent to you by email</h5>

            <TextInput
              block
              medium
              required
              ref                         =   "reset"
              name                        =   "reset"
              placeholder                 =   "Your reset key"
            />

            <h3 className="text-center">Enter a new password</h3>

            <InputGroup block>
              <Password
                required
                medium
                placeholder               =   "Password"
                ref                       =   "password"
                name                      =   "password"
              />
              <Password
                required
                medium
                placeholder               =   "Confirm password"
                ref                       =   "confirmPassword"
                name                      =   "confirm-password"
              />
            </InputGroup>

            <Button radius block medium primary style={{ marginTop : '10px' }} type="submit">Save new password</Button>
          </div>
        );
      }

      content = (
        <Form
          form-center
          style                       =   {{ margin : '10px' }}
          flash                       =   { this.state }
          handler                     =   { ::this.save }
          name                        =   "reset-password"
        >
          { formContents }
        </Form>
      );
    }

    return (
      <Panel title="Reset password">
        { content }
      </Panel>
    );
  }
}

export default ResetPassword;
