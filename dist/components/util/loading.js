'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libAppComponent = require('../../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

var _icon = require('./icon');

var _icon2 = _interopRequireDefault(_icon);

var Loading = (function (_React$Component) {
  function Loading() {
    _classCallCheck(this, Loading);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Loading, _React$Component);

  _createClass(Loading, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: _libAppComponent2['default'].classList(this, 'text-center', 'gutter', 'muted') },
        _react2['default'].createElement(_icon2['default'], { icon: 'circle-o-notch', spin: true, size: 4 }),
        _react2['default'].createElement(
          'h5',
          { className: 'text-info' },
          this.props.message
        )
      );
    }
  }]);

  return Loading;
})(_react2['default'].Component);

exports['default'] = Loading;
module.exports = exports['default'];