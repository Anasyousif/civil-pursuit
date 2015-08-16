'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _utilImage = require('./util/image');

var _utilImage2 = _interopRequireDefault(_utilImage);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilInputGroup = require('./util/input-group');

var _utilInputGroup2 = _interopRequireDefault(_utilInputGroup);

var _utilTextInput = require('./util/text-input');

var _utilTextInput2 = _interopRequireDefault(_utilTextInput);

var _utilSelect = require('./util/select');

var _utilSelect2 = _interopRequireDefault(_utilSelect);

var Demographics = (function (_React$Component) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Demographics(props) {
    _classCallCheck(this, Demographics);

    _get(Object.getPrototypeOf(Demographics.prototype), 'constructor', this).call(this, props);

    this.state = { user: this.props.user };
  }

  _inherits(Demographics, _React$Component);

  _createClass(Demographics, [{
    key: 'validateGPS',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function validateGPS() {
      var _this = this;

      navigator.geolocation.watchPosition(function (position) {
        var _position$coords = position.coords;
        var longitude = _position$coords.longitude;
        var latitude = _position$coords.latitude;

        window.socket.emit('validate gps', longitude, latitude).on('OK validate gps', function (user) {
          return _this.setState({ user: user });
        });
      });
    }
  }, {
    key: 'setCity',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setCity() {
      var city = _react2['default'].findDOMNode(this.refs.city).value;

      if (city) {
        window.socket.emit('set city', city);
      }
    }
  }, {
    key: 'setState',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setState() {
      var state = _react2['default'].findDOMNode(this.refs.state).value;

      if (state) {
        window.socket.emit('set state', state);
      }
    }
  }, {
    key: 'setZip',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setZip() {
      var zip = _react2['default'].findDOMNode(this.refs.zip).value;

      if (zip) {
        window.socket.emit('set zip', zip);
      }
    }
  }, {
    key: 'setZip4',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setZip4() {
      var zip4 = _react2['default'].findDOMNode(this.refs.zip4).value;

      if (zip4) {
        window.socket.emit('set zip4', zip4);
      }
    }
  }, {
    key: 'setEducation',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setEducation() {
      var education = _react2['default'].findDOMNode(this.refs.education).value;

      if (education) {
        window.socket.emit('set education', education);
      }
    }
  }, {
    key: 'setRelationship',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setRelationship() {
      var relationship = _react2['default'].findDOMNode(this.refs.relationship).value;

      if (relationship) {
        window.socket.emit('set marital status', relationship);
      }
    }
  }, {
    key: 'setEmployment',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function setEmployment() {
      var employment = _react2['default'].findDOMNode(this.refs.employment).value;

      if (employment) {
        window.socket.emit('set employment', employment);
      }
    }
  }, {
    key: 'checkRace',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function checkRace(e) {
      var checkbox = e.target;

      if (checkbox.checked) {
        window.socket.emit('add race', checkbox.value);
      } else {
        window.socket.emit('remove race', checkbox.value);
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var user = _props.user;
      var config = _props.config;

      var races = config.race.map(function (race) {
        return _react2['default'].createElement(
          _utilRow2['default'],
          { key: race._id },
          _react2['default'].createElement(
            _utilColumn2['default'],
            { className: 'gutter' },
            race.name
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { className: 'gutter' },
            _react2['default'].createElement('input', { type: 'checkbox', onChange: _this2.checkRace.bind(_this2), value: race._id, defaultChecked: user.race.some(function (r) {
                return r === race._id;
              }) })
          )
        );
      });

      var education = config.education.map(function (educ) {
        return _react2['default'].createElement(
          'option',
          { value: educ._id, key: educ._id },
          educ.name
        );
      });

      var relationships = config.married.map(function (status) {
        return _react2['default'].createElement(
          'option',
          { value: status._id, key: status._id },
          status.name
        );
      });

      var employments = config.employment.map(function (employment) {
        return _react2['default'].createElement(
          'option',
          { value: employment._id, key: employment._id },
          employment.name
        );
      });

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'section',
          { style: { width: '50%', float: 'left' } },
          _react2['default'].createElement(_utilImage2['default'], { src: 'http://res.cloudinary.com/hscbexf6a/image/upload/v1423261951/y1qxy2fwmgiike5gx7ey.png', responsive: true })
        ),
        _react2['default'].createElement(
          'section',
          { className: 'gutter' },
          _react2['default'].createElement(
            'h2',
            null,
            'Demographics'
          ),
          _react2['default'].createElement(
            'p',
            null,
            'We use this information to make sure that we have balanced participation. When we see too little participation in certain demographics then we increase our efforts to get more participation there'
          )
        ),
        _react2['default'].createElement(
          _utilRow2['default'],
          null,
          _react2['default'].createElement(
            _utilColumn2['default'],
            { className: 'gutter' },
            'Race:'
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            null,
            races
          )
        ),
        _react2['default'].createElement(
          'section',
          { className: 'gutter' },
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Education'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(
                _utilSelect2['default'],
                { block: true, medium: true, ref: 'education', defaultValue: user.education, onChange: this.setEducation.bind(this) },
                _react2['default'].createElement(
                  'option',
                  { value: '' },
                  'Choose one'
                ),
                education
              )
            )
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Relationship'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(
                _utilSelect2['default'],
                { block: true, medium: true, ref: 'relationship', defaultValue: user.married, onChange: this.setRelationship.bind(this) },
                _react2['default'].createElement(
                  'option',
                  { value: '' },
                  'Choose one'
                ),
                relationships
              )
            )
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            { baseline: true, className: 'gutter-y' },
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '25' },
              'Employment'
            ),
            _react2['default'].createElement(
              _utilColumn2['default'],
              { span: '75' },
              _react2['default'].createElement(
                _utilSelect2['default'],
                { block: true, medium: true, ref: 'employment', defaultValue: user.employment, onChange: this.setEmployment.bind(this) },
                _react2['default'].createElement(
                  'option',
                  { value: '' },
                  'Choose one'
                ),
                employments
              )
            )
          )
        )
      );
    }
  }]);

  return Demographics;
})(_react2['default'].Component);

exports['default'] = Demographics;
module.exports = exports['default'];