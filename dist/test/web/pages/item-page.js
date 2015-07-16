'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _libAppMilk = require('../../../lib/app/milk');

var _libAppMilk2 = _interopRequireDefault(_libAppMilk);

var _configJson = require('../../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _componentsIntro = require('../components/intro');

var _componentsIntro2 = _interopRequireDefault(_componentsIntro);

var _componentsLayout = require('../components/layout');

var _componentsLayout2 = _interopRequireDefault(_componentsLayout);

var _modelsItem = require('../../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var ItemPage = (function (_Milk) {
  function ItemPage(props) {
    var _this = this;

    _classCallCheck(this, ItemPage);

    props = props || {};

    var options = { viewport: props.viewport, vendor: props.vendor };

    _get(Object.getPrototypeOf(ItemPage.prototype), 'constructor', this).call(this, 'Item Page', options);

    this.set('Item Document', function () {
      return _modelsItem2['default'].disposable();
    }).go(function () {
      return '/item/' + _this.get('Item Document').id + '/' + (0, _string2['default'])(_this.get('Item Document').subject).slugify();
    }, 'Going to disposable item URL')['import'](_componentsLayout2['default'], {
      title: function title() {
        return _configJson2['default'].title.prefix + _this.get('Item Document').subject;
      }
    });
  }

  _inherits(ItemPage, _Milk);

  return ItemPage;
})(_libAppMilk2['default']);

exports['default'] = ItemPage;
module.exports = exports['default'];