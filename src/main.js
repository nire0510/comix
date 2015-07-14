/* global module, require, global */
var config = require('./config.js'),
  decode = require('querystring').decode,
  mp = require('./mixpanel.js'),
  helpers = require('./helpers.js'),
  objSettings = config.defaults;

module.exports = {
  /**
   * Comix initialization
   * @param {object} objParams Initialization parameters
   */
  init: function init (objParams) {
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
    // we prefer our pageview event!
    objInitProperties.track_pageview = false;
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    // We're adding a ready callback, too:
    objInitProperties.loaded = _ready;

    // Initialize mixpanel proxy:
    mp.init(objParams.token, objInitProperties);
  },

  /**
   * Track an event
   * @param {string} strEventName The name of the event
   * @param {object} [objProperties] A set of properties to include with the event you're sending
   * @param {function} [fncCallback] If provided, the callback function will be called after tracking the event
   */
  track: function track (strEventName, objProperties, fncCallback) {
    mp.track(strEventName, objProperties, fncCallback);
  },

  /**
   * Disable events on the Mixpanel object
   * @param {[string]} [arrEventNames] An array of event names to disable. If passed no arguments, this function disables tracking of any event.
   */
  disable: function disable (arrEventNames) {
    mp.disable(arrEventNames);
  }
};

/**
 * Mixpanel library ready callback
 * @private
 */
function _ready() {
  var arrRegisteredEvents = [];

  // matches polyfill:
  Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector;

  // Extract all query string tokens & add them to all events along with the additional properties:
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  mixpanel.register(helpers.extend(decode(document.location.search && document.location.search.substr(1)) || {}, objSettings.additional_properties));

  // Should track page views?
  if (objSettings.track_pageview) {
    mp.trackPageView();
  }

  // Should track links clicks?
  // (requires the a link contains id, href & event attributes)
  if (objSettings.track_links) {
    [].forEach.call(document.querySelectorAll('a[href][id][' + objSettings.attribute + ']'), function each(element) {
      mp.trackLink('#' + element.id, element.getAttribute(objSettings.attribute));
    });
  }

  // Should track forms submissions?
  // (requires the a form contains id & event attributes)
  if (objSettings.track_forms) {
    [].forEach.call(document.querySelectorAll('form[id][' + objSettings.attribute + ']'), function each(element) {
      mp.trackForm('#' + element.id, element.getAttribute(objSettings.attribute));
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
                mp.track(strEventName, {}, function () {
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