/* global module, require, ga */

/**
 * Google Analytics tracking module
 * @module ga-tracking
 */

var arrDisabledEvents = [],
  // If you use GA dimentions & metrics, make sure you define the conversion dictionary below:
  objCustomVariablesDictionary = {
    "Param1": "dimension1"
  };

function renameProperty (obj, strOldName, strNewName) {
  // Do nothing if the names are the same
  if (strOldName == strNewName) {
    return obj;
  }
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (obj.hasOwnProperty(strOldName)) {
    obj[strNewName] = strNewName.indexOf('dimension') === 0 ? obj[strOldName] && obj[strOldName].toString() : obj[strOldName];
    delete obj[strOldName];
  }
  return obj;
}

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
 * Disable events on the Google Analytics object
 * @param [string] [arrEventNames] An array of event names to disable. If passed no arguments, this function disables tracking of any event.
 */
function disableEvents (arrEventNames) {
  arrDisabledEvents = arrEventNames ? arrEventNames : ['All'];
}

/**
 * Track an event
 * @param {string} strEventName The name of the event
 * @param {object} [objProperties] A set of properties to include with the event you're sending
 */
function trackEvent (strEventName, objProperties) {
  var objLabel = null;

  if (typeof objProperties === 'object') {
    if (Object.keys(objProperties).length === 1) {
      objLabel = objProperties[Object.keys(objProperties)[0]] && objProperties[Object.keys(objProperties)[0]].toString();
    }
    else if (Object.keys(objProperties).length > 1) {
      Object.keys(objCustomVariablesDictionary).forEach(function _rename (strKey) {
        renameProperty(objProperties, strKey, objCustomVariablesDictionary[strKey]);
      });
      objLabel = objProperties;
    }
  }

  if (!(arrDisabledEvents.indexOf(strEventName) >= 0 || arrDisabledEvents[0] === 'All')) {
    ga('comixTracker.send', 'event', strEventName, strEventName, objLabel);
  }
}

/**
 * Track page viewed event
 */
function trackPageView () {
  // Works only in browser environment:
  if (process.browser) {
    ga('comixTracker.send', 'pageview', {
      page: document.location.pathname,
      title: document.title
    });
  }
}

/**
 * Track link click event
 * @param {string} strSelector A valid DOM query selector
 * @param {object} strEventName The name of the event to track
 * @param {object} [objProperties] A properties object or function that returns a dictionary of properties when passed a DOMElement
 */
function trackLink (strSelector, strEventName, objProperties) {
  // TBD
}

/**
 * Track form submission event
 * @param {string} strSelector A valid DOM query
 * @param {object} strEventName The name of the event to track
 * @param {object} [objProperties] A properties object or function that returns a dictionary of properties when passed a DOMElement
 */
function trackForm (strSelector, strEventName, objProperties) {
  // TBD
}

/**
 * Record that you have charged the current user a certain amount of money
 * @param {number} fltAmount The amount of money charged to the current
 * @param {object} [objProperties] An associative array of properties associated with the charge
 * @param {function} [fncCallback] If provided, the callback will be called when the server responds
 */
function trackCharge (fltAmount, objProperties, fncCallback) {
  // TBD
}

/**
 * Register a set of super properties, which are included with all events
 * @param {object} objProperties An associative array of properties to store about the user
 */
function registerEventsProperties (objProperties) {
  Object.keys(objCustomVariablesDictionary).forEach(function _rename (strKey) {
    renameProperty(objProperties, strKey, objCustomVariablesDictionary[strKey]);
  });

  ga('comixTracker.set', objProperties);
}

/**
 * Delete a super property stored with the current user
 * @param {string} strProperty The name of the super property to remove
 */
function unregisterEventsProperties (strProperty) {
  // Not supported in GA
}