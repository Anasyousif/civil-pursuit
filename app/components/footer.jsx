'use strict';

import React from 'react';

class Footer extends React.Component {
  render () {
    return (
      <footer className="syn-footer">
        <div style={{textAlign: 'right', position: 'absolute', right: 0}}>
          <a href="/sign/out">Logout</a>
        </div>
        <p>
          Copyright © 2014 - { new Date().getFullYear() } by <a href="http://www.synaccord.com" target="_blank">Synaccord, LLC.</a>
        </p>
        <p>
          <a href="/page/terms-of-service">Terms of Service</a> and <a href="/page/privacy-policy">Privacy Policy</a>
        </p>
      </footer>
    );
  }
}

export default Footer;
