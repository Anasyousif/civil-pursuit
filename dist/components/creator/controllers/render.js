'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilUpload = require('../../../lib/util/upload');

var _libUtilUpload2 = _interopRequireDefault(_libUtilUpload);

var _libUtilForm = require('../../../lib/util/form');

var _libUtilForm2 = _interopRequireDefault(_libUtilForm);

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

function renderCreator(cb) {
  var _this = this;

  var q = new Promise(function (fulfill, reject) {

    var self = _this;

    var d = _domain2['default'].create().on('error', reject);

    d.run(function () {

      // Make sure template exists in DOM

      if (!_this.template.length) {
        throw new Error('Creator not found in panel ' + _this.panel.getId());
      }

      // Attach component to template's data

      _this.template.data('creator', _this);

      // Emulate input type file's behavior with button

      _this.find('upload image button').on('click', function () {
        _this.find('dropbox').find('[type="file"]').click();
      });

      // Use upload service

      new _libUtilUpload2['default'](_this.find('dropbox'), _this.find('dropbox').find('input'), _this.find('dropbox'));

      // Autogrow

      _this.template.find('textarea').autogrow();

      // References

      _this.renderReferences();

      // Build form using Form provider

      var form = new _libUtilForm2['default'](_this.template);

      form.send(_this.create.bind(_this));

      // Done

      fulfill();
    });
  });

  if (typeof cb === 'function') {
    q.then(cb.bind(null, null), cb);
  }

  return q;
}

exports['default'] = renderCreator;
module.exports = exports['default'];