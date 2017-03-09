'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Row                            from './util/row';
import Column                         from './util/column';
import Image                          from './util/image';
import Icon                           from './util/icon';
import Button                         from './util/button';
import InputGroup                     from './util/input-group';
import TextInput                      from './util/text-input';
import Select                         from './util/select';
import userType                       from '../lib/proptypes/user';
import politicalTendencyType          from '../lib/proptypes/political-tendency';
import PoliticalParty                 from './political-party';

class Voter extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user : userType,
    politicalTendency : React.PropTypes.arrayOf(politicalTendencyType)
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setRegisteredVoter () {
    const registered_voter = ReactDOM.findDOMNode(this.refs.registered).value;

    if ( registered_voter ) {
      window.socket.emit('set user info', { registered_voter });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setParty (obj) {
      window.socket.emit('set user info', obj );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setTendency () {
    const tendency = ReactDOM.findDOMNode(this.refs.tendency).value;

    if ( tendency ) {
      window.socket.emit('set user info', { tendency });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, politicalTendency } = this.props;


    let tendency = politicalTendency.map(tendency => (
      <option value={ tendency._id } key={ tendency._id }>{ tendency.name }</option>
    ));
    return (
      <section>
        <section style={{ width: '50%', float : 'left' }}>
          <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262642/p61hdtkkdks8rednknqo.png" responsive />
        </section>

        <section className="gutter">
          <h2>Voter</h2>
          <p>We use this information to make sure that we have balanced participation. When we see too little participation in certain categories then we increase our efforts to get more participation there.</p>
        </section>

        <Row baseline className="gutter">
          <Column span="25">
            Registered voter
          </Column>
          <Column span="75">
            <Select block medium ref="registered" defaultValue={ user.registered_voter } onChange={ this.setRegisteredVoter.bind(this) }>
              <option value=''>Choose one</option>
              <option value={ true }>Yes</option>
              <option value={ false }>No</option>
            </Select>
          </Column>
        </Row>

        <PoliticalParty className="gutter syn-row-baseline-items" split={25} user={user} onChange={ this.setParty.bind(this)} />

        <Row baseline className="gutter">
          <Column span="25">
            Political Tendency
          </Column>
          <Column span="75">
            <Select block medium ref="tendency" defaultValue={ user.tendency } onChange={ this.setTendency.bind(this) }>
              <option value=''>Choose one</option>
              { tendency }
            </Select>
          </Column>
        </Row>

      </section>
    );
  }
}

export default Voter;
