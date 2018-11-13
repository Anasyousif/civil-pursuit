'use strict';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const state         =   shape({
  _id  : string,
  name : string
});

export default state;
