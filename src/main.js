/* global module, require, global */
var config = require('./config.js'),
  decode = require('querystring').decode,
  helpers = require('./helpers.js'),
  mp = require('./mixpanel.js'),
  mpTracking = require('./mixpanel-tracking.js'),
  mpPeople = require('./mixpanel-people.js'),
  objSettings = config.defaults;

module.exports = {
  init: init,

  track: mpTracking.trackEvent,
  trackEvent: mpTracking.trackEvent,
  trackCharge: mpTracking.trackCharge,
  disableEvents: mpTracking.disableEvents,
  registerProperties: mpTracking.registerProperties,
  unregisterProperties: mpTracking.unregisterProperties,

  identifyUser: mpPeople.identifyUser,
  setUserProperties: mpPeople.setUserProperties
};

/**
 * Comix initialization
 * @param {object} objParams Initialization parameters
 */
function init (objParams) {
  var objInitProperties = {};

  // Extend defaults:
  for (var key in objSettings) {
    if (objSettings.hasOwnProperty(key) && objParams.hasOwnProperty(key)) {
      objSettings[key] = objParams[key];
    }
  }

  // Make sure Mixpanel token was set:
  if (objSettings.token === '') {
    throw new Error(config.dictionary.missingToken);
  }

  // Compose an initialization object based on Mixpanel scheme, by throwing out those which are not in scheme:
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  config.mixpanel_init.forEach(function initProperties (key) {
    if (objSettings.hasOwnProperty(key)) {
      objInitProperties[key] = objSettings[key];
    }
  });
  // BUT - we prefer our pageview event!
  objInitProperties.track_pageview = false;
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  // We're adding a ready callback, too:
  objInitProperties.loaded = _ready;

  // Initialize mixpanel proxy:
  mp.init(objParams.token, objInitProperties);
}

/**
 * Mixpanel library ready callback
 * @private
 */
function _ready () {
  var arrRegisteredEvents = [];

  // matches polyfill:
  Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

  // Extract all query string tokens & add them to all events along with the additional properties:
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  if (this === window) {
    mpTracking.registerProperties(helpers.extend(decode(document.location.search && document.location.search.substr(1)) || {}, objSettings.additional_properties));
  }

  // Should track page views?
  if (objSettings.track_pageview) {
    mpTracking.trackPageView();
  }

  // Should track links clicks?
  // (requires the a link contains id, href & event attributes)
  if (objSettings.track_links) {
    [].forEach.call(document.querySelectorAll('a[href][id][' + objSettings.attribute + ']'), function each(element) {
      mpTracking.trackLink('#' + element.id, element.getAttribute(objSettings.attribute));
    });
  }

  // Should track forms submissions?
  // (requires the a form contains id & event attributes)
  if (objSettings.track_forms) {
    [].forEach.call(document.querySelectorAll('form[id][' + objSettings.attribute + ']'), function each(element) {
      mpTracking.trackForm('#' + element.id, element.getAttribute(objSettings.attribute));
    });
  }

  // Should report track attributes events?
  if (objSettings.track_custom && Object.prototype.toString.call(objSettings.track_custom) === '[object Array]' && objSettings.track_custom.length > 0) {
    objSettings.track_custom.forEach(function loop(item) {
      if (arrRegisteredEvents.indexOf(item.event) === -1) {
        arrRegisteredEvents.push(item.event);
        document.addEventListener(item.event, function (e) {
          var element = e.target,
            strEventName;

          // We report only if element matches custom_event selector &&
          if (element.matches(item.selector) === true) {
            e.preventDefault();

            try {
              switch (item.name.type) {
                case 'attribute':
                  if (element.hasAttribute(item.name.value) === true) {
                    strEventName = element.getAttribute(item.name.value);
                  }
                  break;
                case 'function':
                  if (item.name.value && typeof item.name.value === 'function') {
                    strEventName = (item.name.value)(element);
                  }
                  break;
                case 'text':
                  if (item.name.value) {
                    strEventName = item.name.value;
                  }
                  break;
              }

              if (strEventName) {
                mpTracking.trackEvent(strEventName, {}, function () {
                  if (element.tagName === 'A') {
                    var strHref = element.getAttribute('href'),
                      strTarget = element.getAttribute('target');

                    strHref && strHref.length > 0 && (strTarget ? window.open(strHref, strTarget) : document.location.href = strHref);
                  }
                  else if (element.getAttribute('type') === 'submit') {
                    helpers.findParentNode(element, 'FORM').submit();
                  }
                });
              }
            }
            catch (e) {
              console.warn(config.dictionary.trackEventFailed);
            }
          }
        }, false);
      }
    });
  }
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
}