'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var CountDownCtrl = (function (_Controller) {
  function CountDownCtrl(props) {
    _classCallCheck(this, CountDownCtrl);

    _get(Object.getPrototypeOf(CountDownCtrl.prototype), 'constructor', this).call(this, props);

    this.props = props;

    this.template = $('#countdown');
  }

  _inherits(CountDownCtrl, _Controller);

  _createClass(CountDownCtrl, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'panel':
          return $('#countdown-panel');
          break;

        case 'remaining days':
          return $('.countdown-days', this.template);
        case 'remaining hours':
          return $('.countdown-hours', this.template);
        case 'remaining minutes':
          return $('.countdown-minutes', this.template);
        case 'remaining seconds':
          return $('.countdown-seconds', this.template);

        case 'remaining days label':
          return $('.countdown-days-label', this.template);

        case 'goal':
          return $('.discussion-goal', this.template);
        case 'registered':
          return $('.discussion-registered', this.template);
        case 'register':
          return $('.discussion-register_button', this.template);

        case 'panel title':
          return this.template.find('.panel-title');

        case 'is registered':
          return $('.discussion-is_registered', this.template);

        case 'invite':
          return $('.discussion-invite_people', this.template);

        case 'invite by email':
          return $('.discussion-invite_people-button_email', this.template);

        case 'deadline month':
          return $('.discussion-deadline-month', this.template);

        case 'deadline day':
          return $('.discussion-deadline-day', this.template);

        case 'deadline year':
          return $('.discussion-deadline-year', this.template);

        case 'deadline hour':
          return $('.discussion-deadline-hour', this.template);

        case 'deadline minute':
          return $('.discussion-deadline-minute', this.template);

        case 'deadline ampm':
          return $('.discussion-deadline-ampm', this.template);

        default:

      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      this.find('panel title').text('Countdown');
      this.publish('get discussion').subscribe(function (pubsub, discussion) {
        pubsub.unsubscribe();

        console.log('discussion', discussion);

        _this.discussion = discussion;

        _this.renderDeadline();

        _this.timer = setInterval(_this.renderCountdown.bind(_this), 1000);

        _this.renderGoal();

        _this.renderRegister();
      });
    }
  }, {
    key: 'renderDeadline',
    value: function renderDeadline() {
      var deadline = (0, _moment2['default'])(new Date(this.discussion.deadline));

      this.find('deadline month').text(deadline.format('MMM'));
      this.find('deadline day').text(deadline.format('D'));
      this.find('deadline year').text(deadline.format('YYYY'));
      this.find('deadline hour').text(deadline.format('h'));
      this.find('deadline minute').text(deadline.format('mm'));
      this.find('deadline ampm').text(deadline.format('a'));
    }
  }, {
    key: 'renderCountdown',
    value: function renderCountdown() {
      var deadline = new Date(this.discussion.deadline);

      var now = Date.now();

      var interval = deadline - now;

      if (interval < 0) {
        console.log('deadline OK');
        clearTimeout(this.timer);
        return this.renderDeadlineMet();
      }

      var days = Math.floor(interval / (1000 * 60 * 60 * 24));

      var daysRemainder = interval % (1000 * 60 * 60 * 24);

      var hours = Math.floor(daysRemainder / (1000 * 60 * 60));

      var hoursRemainder = daysRemainder % (1000 * 60 * 60);

      var minutes = Math.floor(hoursRemainder / (1000 * 60));

      var minutesRemainder = hoursRemainder % (1000 * 60);

      var seconds = Math.floor(minutesRemainder / 1000);

      this.find('remaining days').text(days);

      if (days < 2) {
        this.find('remaining days label').text('day');
      }

      if (days === 0) {
        this.find('remaining days').hide();
        this.find('remaining days label').hide();
      }

      this.find('remaining hours').text(hours < 10 ? '0' + hours : hours);

      this.find('remaining minutes').text(minutes < 10 ? '0' + minutes : minutes);

      this.find('remaining seconds').text(seconds < 10 ? '0' + seconds : seconds);
    }
  }, {
    key: 'renderGoal',
    value: function renderGoal() {
      this.find('registered').text(this.discussion.registered.length);
      this.find('goal').text(this.discussion.goal);
    }
  }, {
    key: 'renderRegister',
    value: function renderRegister() {
      var _this2 = this;

      if (this.socket.synuser && this.discussion.registered.some(function (user) {
        return _this2.socket.synuser.id;
      })) {
        this.find('register').hide();
        this.find('is registered').removeClass('hide');
        this.find('invite').removeClass('hide');
        this.find('invite by email').attr('href', 'mailto:?Subject=' + encodeURIComponent(this.discussion.subject) + '&Body=' + encodeURIComponent(this.discussion.description.replace(/\{hostname\}/g, location.hostname)));
      } else {
        this.find('register').on('click', function () {
          $('.join-button').click();
        });
      }
    }
  }, {
    key: 'renderDeadlineMet',
    value: function renderDeadlineMet() {
      this.template.hide();
      $('.panels').removeClass('hide');
    }
  }]);

  return CountDownCtrl;
})(_libAppController2['default']);

exports['default'] = CountDownCtrl;
module.exports = exports['default'];