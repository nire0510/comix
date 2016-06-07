/* global module */
var config = require('./config.js'),
  decode = require('querystring').decode,
  helpers = require('./helpers.js'),
  mp = require('./providers/mp/mp.js'),
  ga = require('./providers/ga/ga.js'),
  objSettings = config.defaults,
  providers = [];

module.exports = {
  init: init,

  track: trackEvent,
  trackEvent: trackEvent,
  trackCharge: trackCharge,
  trackPageView: trackPageView,
  disableEvents: disableEvents,
  registerEventsProperties: registerEventsProperties,
  unregisterEventsProperties: unregisterEventsProperties,

  identifyUser: identifyUser,
  registerUserProperties: registerUserProperties
};

/**
 * Comix initialization
 * @param {object} objParams Initialization parameters
 * @param {object} objParams.tokens Your analytics tools tokens
 * @param {object} [objParams.additional_properties={}] Additional properties which are sent with every track event
 * @param {string} [objParams.attribute="data-comix"] Attribute name which its value contains the event name for all track_links & track_forms events. (it should not match any existing track_custom events names)
 * @param {boolean} [objParams.track_pageview=false] Should page view be tracked? the event name is the document's title
 * @param {boolean} [objParams.track_links=false] Should links clicks be tracked? requires to have an attribute named {@link objParams.attribute}
 * @param {boolean} [objParams.track_forms=false] Should forms submissions be tracked? requires to have an attribute named {@link objParams.attribute}
 * @param {boolean|object[]} objParams.track_custom Should custom events be tracked? can be either false or an array of custom events otherwise
 * @param {number} [objParams.cookie_expiration=365] Super properties cookie expiration (in days)
 * @param {boolean} [objParams.cross_subdomain_cookie=true] Super properties span sub-domains
 * @param {boolean} [objParams.disable_persistence=false] If this is true, the Mixpanel cookie or localStorage entry will be deleted, and no user persistence will take place
 * @param {string} [objParams.persistence="cookie"] Type of persistent store for super properties (cookie/localStorage) if set to "localStorage", any existing Mixpanel cookie value with the same persistence_name will be transferred to localStorage and deleted
 * @param {string} [objParams.persistence_name=""] Name for super properties persistent store
 * @param {boolean} [objParams.secure_cookie=false] If This is true, Mixpanel cookies will be marked as secure, meaning they will only be transmitted over https
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

  // Instantiate analytics providers:
  Object.keys(objSettings.tokens).forEach(function initProperties (strProviderName) {
    var objProvider = eval(strProviderName);

    if (typeof objProvider === 'object') {
      providers.push({
        name: strProviderName,
        token: objSettings.tokens[strProviderName],
        obj: objProvider
      });
    }
    else {
      console.warn('Unknown provider: %s', strProviderName);
    }
  });

  // Make sure Mixpanel and/or Google Analytics tokens were set:
  if (providers.length === 0) {
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

  // Initialize providers:
  _init(objInitProperties);
}

/**
 * Mixpanel library ready callback
 * @callback readyCallback
 * @private
 */
function _ready () {
  // matches polyfill:
  Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

  // Extract all query string tokens & add them to all events along with the additional properties:
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  if (process.browser) {
    registerEventsProperties(helpers.extend(decode(document.location.search && document.location.search.substr(1)) || {}, objSettings.additional_properties));
  }

  // Should track page views?
  if (objSettings.track_pageview) {
    _trackPageView();
  }

  // Should track links clicks?
  // (requires the a link contains id, href & event attributes)
  if (objSettings.track_links) {
    _trackLinks();
  }

  // Should track forms submissions?
  // (requires the a form contains id & event attributes)
  if (objSettings.track_forms) {
    _trackForms();
  }

  // Should report track attributes events?
  if (objSettings.track_custom && Object.prototype.toString.call(objSettings.track_custom) === '[object Array]' && objSettings.track_custom.length > 0) {
    _trackCustomEvents();
  }
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
}

// Initialization handler:
function _init (objInitProperties) {
  providers.forEach(function _init (provider) {
    if (typeof provider.obj.init === 'function') {
      provider.obj.init(provider.token, objInitProperties);
    }
  });
}

// Track simple events handler:
function trackEvent (strEventName, objProperties, fncCallback) {
  providers.forEach(function _trackEvent (provider) {
    if (typeof provider.obj.trackEvent === 'function') {
      provider.obj.trackEvent(strEventName, helpers.extend({}, objProperties), fncCallback);
    }
  });
}

// Track monetization events handler:
function trackCharge (fltAmount, objProperties, fncCallback) {
  providers.forEach(function _trackCharge (provider) {
    if (typeof provider.obj.trackCharge === 'function') {
      provider.obj.trackCharge(fltAmount, objProperties, fncCallback);
    }
  });
}

// Track pave-view events pragmatically:
function trackPageView () {
  providers.forEach(function _trackPageView (provider) {
    if (typeof provider.obj.trackPageView === 'function') {
      provider.obj.trackPageView();
    }
  });
}

// Track pave-view events handler:
function _trackPageView () {
  providers.forEach(function _trackCharge (provider) {
    if (typeof provider.obj.trackPageView === 'function') {
      provider.obj.trackPageView();
    }
  });
}

// Track links clicks events handler:
function _trackLinks () {
  [].forEach.call(document.querySelectorAll('a[href][id][' + objSettings.attribute + ']'), function each (element) {
    providers.forEach(function _trackCharge (provider) {
      if (typeof provider.obj.trackLink === 'function') {
        provider.obj.trackLink('#' + element.id, element.getAttribute(objSettings.attribute));
      }
    });
  });
}

// Track forms submissions events handler:
function _trackForms () {
  [].forEach.call(document.querySelectorAll('form[id][' + objSettings.attribute + ']'), function each (element) {
    providers.forEach(function _trackCharge (provider) {
      if (typeof provider.obj.trackForm === 'function') {
        provider.obj.trackForm('#' + element.id, element.getAttribute(objSettings.attribute));
      }
    });
  });
}

// Track custom events handler:
function _trackCustomEvents () {
  var arrRegisteredEvents = [];

  objSettings.track_custom.forEach(function loop (item) {
    if (arrRegisteredEvents.indexOf(item.selector + item.event) === -1) {
      arrRegisteredEvents.push(item.selector + item.event);
      document.addEventListener(item.event, function onEvent (e) {
        var element = e.target,
          strEventName = '',
          objEventProperties = {},
          intAncestorLevel = 0;
        
        while (element.matches(item.selector) === false && intAncestorLevel < objSettings.bubbling_threshold) {
          if (element.parentElement) {
            element = element.parentElement;
          }
          intAncestorLevel++;
        }

        // We report only if element matches custom_event selector:
        if (element.matches(item.selector) === true) {
          // Prevent default for links & form submissions, so that event will have chance to be sent before browser redirects and cancel requests:
          if (element.tagName === 'A' || element.getAttribute('type') === 'submit') {
            e.preventDefault();
          }

          try {
            // event name:
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

            // event properties:
            if ('properties' in item) {
              switch (item.properties.type) {
                case 'attribute':
                  if (element.hasAttribute(item.properties.value) === true) {
                    objEventProperties = JSON.parse(element.getAttribute(item.properties.value));
                  }

                  break;
                case 'function':
                  if (item.properties.value && typeof item.properties.value === 'function') {
                    objEventProperties = (item.properties.value)(element);
                  }

                  break;
                case 'text':
                  if (item.properties.value) {
                    objEventProperties = JSON.parse(item.properties.value);
                  }

                  break;
              }
            }

            if (strEventName) {
              providers.forEach(function _trackEvent (provider) {
                if (typeof provider.obj.trackEvent === 'function') {
                  provider.obj.trackEvent(strEventName, objEventProperties, function onEvent () {
                    if (element.tagName === 'A') {
                      var strHref = element.getAttribute('href'),
                        strTarget = element.getAttribute('target');

                      strHref && strHref.length > 0 && (strTarget ? window.open(strHref, strTarget) : document.location.href = strHref);
                    }
                    else if (element.getAttribute('type') === 'submit') {
                      return true;
                      //helpers.findParentNode(element, 'FORM').submit();
                    }
                  });
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

// Disable events handler:
function disableEvents (arrEventNames) {
  providers.forEach(function _disableEvents (provider) {
    if (typeof provider.obj.disableEvents === 'function') {
      provider.obj.disableEvents(arrEventNames);
    }
  });
}

// Register global event properties handler:
function registerEventsProperties (objProperties, intDays) {
  providers.forEach(function _registerEventsProperties (provider) {
    if (typeof provider.obj.registerEventsProperties === 'function') {
      provider.obj.registerEventsProperties(objProperties, intDays);
    }
  });
}

// Unregister global event properties handler:
function unregisterEventsProperties (strProperty) {
  providers.forEach(function _unregisterEventsProperties (provider) {
    if (typeof provider.obj.unregisterEventsProperties === 'function') {
      provider.obj.unregisterEventsProperties(strProperty);
    }
  });
}

// Identify user event handler:
function identifyUser (strIdentity) {
  providers.forEach(function _identifyUser (provider) {
    if (typeof provider.obj.identifyUser === 'function') {
      provider.obj.identifyUser(strIdentity);
    }
  });
}

// Register global user properties handler:
function registerUserProperties (varProperty, varValue, fncCallback) {
  providers.forEach(function _registerUserProperties (provider) {
    if (typeof provider.obj.registerUserProperties === 'function') {
      provider.obj.registerUserProperties(varProperty, varValue, fncCallback);
    }
  });
}