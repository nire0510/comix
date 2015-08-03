(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.comix = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
/* global module */

/**
 * Configuration module
 * @module config
 */

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
module.exports = {
  mixpanel_init: ['cookie_expiration', 'cross_subdomain_cookie', 'disable_persistence', 'persistence', 'persistence_name', 'secure_cookie', 'track_links_timeout', 'upgrade'],
  defaults: {
    // Mixpanel token:
    token: '',
    // Additional properties which are sent with every track event:
    additional_properties: {},
    // Attribute name which its value contains the event name for all track_links & track_forms events (it should not match any existing track_custom events names):
    attribute: 'data-comix',
    // Should page view be tracked? the ebent name is the document's title:
    track_pageview: false,
    // Should links clicks be tracked? requires to have an attribute named {{ attribute }}:
    track_links: false,
    // Should forms submissions be tracked? requires to have an attribute named {{ attribute }}:
    track_forms: false,
    // Should custom events be tracked? either false or an array
    track_custom: false
    // track_custom: [
    //   {
    //     selector: '[data-comix-click]',
    //     event: 'click',
    //     name: {
    //       type: 'attribute',
    //       value: 'data-event'
    //     }
    //   }
    // ]
  },
  dictionary: {
    trackEventName: 'Track',
    trackEventFailed: 'Comix track miss',
    missingToken: 'Mixpanel token is required',
    missingEventName: '(Event Missing)',
    pageNamePropertyName: 'Page Name',
    pageURLPropertyName: 'Page URL',
    pageViewedEventName: 'Page Viewed'
  }
};
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
},{}],5:[function(require,module,exports){
/* global module */

/**
 * Helpers module
 * @module helpers
 */

module.exports = {
  /**
   * Find parent element of another element
   * @param {HTMLElement} elmTarget target element
   * @param {string} strNodeName The noe name of the parent
   * @return {HTMLElement}
   * @private
   */
  findParentNode: function findParentNode (elmTarget, strNodeName) {
    while (elmTarget.parentNode.nodeName !== strNodeName) {
      elmTarget = elmTarget.parentNode;
    }

    return elmTarget;
  },

  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  extend: function extend (defaults, options) {
    var objExtended = {},
      objProperty;

    for (objProperty in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, objProperty)) {
        objExtended[objProperty] = defaults[objProperty];
      }
    }

    for (objProperty in options) {
      if (Object.prototype.hasOwnProperty.call(options, objProperty)) {
        objExtended[objProperty] = options[objProperty];
      }
    }

    return objExtended;
  }
};
},{}],6:[function(require,module,exports){
/* global module */
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
  registerEventsProperties: mpTracking.registerEventsProperties,
  unregisterEventsProperties: mpTracking.unregisterEventsProperties,

  identifyUser: mpPeople.identifyUser,
  registerUserProperties: mpTracking.registerUserProperties
};

/**
 * Comix initialization
 * @param {object} objParams Initialization parameters
 * @param {string} objParams.token Your Mixpanel token
 * @param {object} [objParams.additional_properties={}] Additional properties which are sent with every track event
 * @param {string} [objParams.attribute="data-comix"] Attribute name which its value contains the event name for all track_links & track_forms events. (it should not match any existing track_custom events names)
 * @param {boolean} [objParams.track_pageview=false] Should page view be tracked? the ebent name is the document's title
 * @param {boolean} [objParams.track_links=false] Should links clicks be tracked? requires to have an attribute named {@link objParams.attribute}
 * @param {boolean} [objParams.track_forms=false] Should forms submissions be tracked? requires to have an attribute named {@link objParams.attribute}
 * @param {boolean|object[]} objParams.track_custom Should custom events be tracked? can be either false or an array of custom events otherwise
 * @param {number} [objParams.cookie_expiration=365] Super properties cookie expiration (in days)
 * @param {boolean} [objParams.cross_subdomain_cookie=true] Super properties span subdomains
 * @param {boolean} [objParams.disable_persistence=false] If this is true, the mixpanel cookie or localStorage entry will be deleted, and no user persistence will take place
 * @param {string} [objParams.persistence="cookie"] Type of persistent store for super properties (cookie/localStorage) if set to "localStorage", any existing mixpanel cookie value with the same persistence_name will be transferred to localStorage and deleted
 * @param {string} [objParams.persistence_name=""] Name for super properties persistent store
 * @param {boolean} [objParams.secure_cookie=false] If This is true, mixpanel cookies will be marked as secure, meaning they will only be transmitted over https
 * @param {number} [objParams.track_links_timeout=300] The amount of time track_links will wait for Mixpanel's servers to respond
 * @param {boolean} [objParams.upgrade=false] if you set upgrade to be true, the library will check for a cookie from our old js library and import super properties from it
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
 * @callback readyCallback
 * @private
 */
function _ready () {
  var arrRegisteredEvents = [];

  // matches polyfill:
  Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

  // Extract all query string tokens & add them to all events along with the additional properties:
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  if (this === window) {
    mpTracking.registerEventsProperties(helpers.extend(decode(document.location.search && document.location.search.substr(1)) || {}, objSettings.additional_properties));
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
},{"./config.js":4,"./helpers.js":5,"./mixpanel-people.js":7,"./mixpanel-tracking.js":8,"./mixpanel.js":9,"querystring":3}],7:[function(require,module,exports){
/* global module */

/**
 * Mixpanel people module
 * @module mixpanel-people
 */

module.exports = {
  identifyUser: identifyUser,
  registerUserProperties: registerUserProperties
};

/**
 * Identify a user with a unique ID. All subsequent actions caused by this user will be tied to this unique ID
 * @param {string} strIdentity A string that uniquely identifies a user
 */
function identifyUser (strIdentity) {
  mixpanel.identify(strIdentity);
}

/**
 * Set properties on a user record
 * @param {string|object} varProperty If a string, this is the name of the property. If an object, this is an associative array of names and values
 * @param {*} [varValue] A value to set on the given property name
 * @param {function} [fncCallback] If provided, the callback will be called after the tracking event
 */
function registerUserProperties (varProperty, varValue, fncCallback) {
  mixpanel.people.set(varProperty, varValue, fncCallback);
}
},{}],8:[function(require,module,exports){
/* global module, require */

/**
 * Mixpanel tracking module
 * @module mixpanel-tracking
 */

var config = require('./config.js');

module.exports = {
  disableEvents: disableEvents,
  trackEvent: trackEvent,
  trackPageView: trackPageView,
  trackLink: trackLink,
  trackForm: trackForm,
  trackCharge: trackCharge,
  registerEventsProperties: registerEventsProperties,
  unregisterEventsProperties: unregisterEventsProperties
};

/**
 * Disable events on the Mixpanel object
 * @param [string] [arrEventNames] An array of event names to disable. If passed no arguments, this function disables tracking of any event.
 */
function disableEvents (arrEventNames) {
  mixpanel.disable(arrEventNames);
}

/**
 * Track an event
 * @param {string} strEventName The name of the event
 * @param {object} [objProperties] A set of properties to include with the event you're sending
 * @param {function} [fncCallback] If provided, the callback function will be called after tracking the event
 */
function trackEvent (strEventName, objProperties, fncCallback) {
  mixpanel.track(strEventName || config.dictionary.missingEventName, objProperties || {}, fncCallback);
}

/**
 * Track page viewed event
 * @param {object} [objProperties] A set of properties to include with the event you're sending
 */
function trackPageView (objProperties) {
  // Works only in browser environment:
  if (this === window) {
    objProperties = objProperties || {};
    objProperties[config.dictionary.pageNamePropertyName] = document.title;
    objProperties[config.dictionary.pageURLPropertyName] = window.location.pathname;

    this.track(config.dictionary.pageViewedEventName, objProperties);
  }
}

/**
 * Track link click event
 * @param {string} strSelector A valid DOM query selector
 * @param {object} strEventName The name of the event to track
 * @param {object} [objProperties] A properties object or function that returns a dictionary of properties when passed a DOMElement
 */
function trackLink (strSelector, strEventName, objProperties) {
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  mixpanel.track_links(strSelector, strEventName, objProperties);
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
}

/**
 * Track form submission event
 * @param {string} strSelector A valid DOM query
 * @param {object} strEventName The name of the event to track
 * @param {object} [objProperties] A properties object or function that returns a dictionary of properties when passed a DOMElement
 */
function trackForm (strSelector, strEventName, objProperties) {
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  mixpanel.track_forms(strSelector, strEventName, objProperties);
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
}

/**
 * Record that you have charged the current user a certain amount of money
 * @param {number} fltAmount The amount of money charged to the current
 * @param {object} [objProperties] An associative array of properties associated with the charge
 * @param {function} [fncCallback] If provided, the callback will be called when the server responds
 */
function trackCharge (fltAmount, objProperties, fncCallback) {
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  mixpanel.people.track_charge(fltAmount, objProperties, fncCallback);
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
}

/**
 * Register a set of super properties, which are included with all events
 * @param {object} objProperties An associative array of properties to store about the user
 * @param {number} [intDays] How many days since the user's last visit to store the super properties
 */
function registerEventsProperties (objProperties, intDays) {
  mixpanel.register(objProperties, intDays);
}

/**
 * Delete a super property stored with the current user
 * @param {string} strProperty The name of the super property to remove
 */
function unregisterEventsProperties (strProperty) {
  mixpanel.unregister(strProperty);
}
},{"./config.js":4}],9:[function(require,module,exports){
/* global module */

/**
 * Mixpanel main module
 * @module mixpanel
 */

module.exports = {
  init: init
};

/**
 * This function initializes a new instance of the Mixpanel tracking object
 * @param {string} strToken Your Mixpanel API token
 * @param {object} objInitProperties Mixpanel initialization properties
 */
function init (strToken, objInitProperties) {
  // jscs:disable
  (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
    for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
  // jscs:enable

  mixpanel.init(strToken, objInitProperties);
}
},{}]},{},[6])(6)
});