/* global module, require */

/**
 * Mixpanel tracking module
 * @module mixpanel-tracking
 */

var config = require('../../config.js');

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
  if (process.browser) {
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