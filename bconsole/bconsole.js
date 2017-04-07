"use strict";
var layouts = require('log4js').layouts;

function bconsoleAppender (layout, timezoneOffset) {
  layout = layout || layouts.messagePassThroughLayout;
  return function(loggingEvent) {
    console.info(layout(loggingEvent, timezoneOffset));
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return bconsoleAppender(layout, config.timezoneOffset);
}

exports.appender = bconsoleAppender;
exports.configure = configure;
