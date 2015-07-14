/* global module, require */
var config = require('./config.js');

module.exports = {
  /**
   * This function initializes a new instance of the Mixpanel tracking object
   * @param {string} strToken Your Mixpanel API token
   * @param {object} objInitProperties Mixpanel initialization properties
   */
  init: function init (strToken, objInitProperties) {
    // jscs:disable
    (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
    // jscs:enable

    mixpanel.init(strToken, objInitProperties);
  },

  /**
   * Disable events on the Mixpanel object
   * @param {[string]} [arrEventNames] An array of event names to disable. If passed no arguments, this function disables tracking of any event.
   */
  disable: function disable (arrEventNames) {
    mixpanel.disable(arrEventNames);
  },

  /**
   * Track an event
   * @param {string} strEventName The name of the event
   * @param {object} [objProperties] A set of properties to include with the event you're sending
   * @param {function} [fncCallback] If provided, the callback function will be called after tracking the event
   */
  track: function track (strEventName, objProperties, fncCallback) {
    mixpanel.track(strEventName || config.dictionary.missingEventName, objProperties || {}, fncCallback);
  },

  /**
   * Track page viewed event
   * @param {object} [objProperties] A set of properties to include with the event you're sending
   */
  trackPageView: function trackPageView (objProperties) {
    objProperties = objProperties || {};
    objProperties[config.dictionary.pageNamePropertyName] = document.title;
    objProperties[config.dictionary.pageURLPropertyName] = window.location.pathname;

    this.track(config.dictionary.pageViewedEventName, objProperties);
  },

  /**
   * Track link click event
   * @param {string} strSelector A valid DOM query selector
   * @param {object} strEventName The name of the event to track
   * @param {object} [objProperties] A properties object or function that returns a dictionary of properties when passed a DOMElement
   */
  trackLink: function trackLink (strSelector, strEventName, objProperties) {
    objProperties = objProperties || {};

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    mixpanel.track_links(strSelector, strEventName, objProperties);
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
  },

  /**
   * Track form submission event
   * @param {string} strSelector A valid DOM query
   * @param {object} strEventName The name of the event to track
   * @param {object} [objProperties] A properties object or function that returns a dictionary of properties when passed a DOMElement
   */
  trackForm: function trackForm (strSelector, strEventName, objProperties) {
    objProperties = objProperties || {};

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    mixpanel.track_forms(strSelector, strEventName, objProperties);
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
  }
};