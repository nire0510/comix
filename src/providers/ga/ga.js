/* global module, ga */
var gaTracking = require('./ga-tracking'),
  gaPeople = require('./ga-people');

/**
 * Google Analytics main module
 * @module ga
 */

module.exports = {
  init: init,

  track: gaTracking.trackEvent,
  trackEvent: gaTracking.trackEvent,
  //trackCharge: gaTracking.trackCharge,
  trackPageView: gaTracking.trackPageView,
  //trackLink: gaTracking.trackLink,
  //trackForm: gaTracking.trackForm,
  disableEvents: gaTracking.disableEvents,
  registerEventsProperties: gaTracking.registerEventsProperties,
  //unregisterEventsProperties: gaTracking.unregisterEventsProperties,

  identifyUser: gaPeople.identifyUser,
  //registerUserProperties: gaPeople.registerUserProperties
};

/**
 * This function initializes a new instance of the Google Analytics tracking object
 * @param {string} strWebProperyId Your web property ID
 * @param {object} objInitProperties Google Analytics initialization properties
 */
function init (strWebProperyId, objInitProperties) {
  // jscs:disable
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  // jscs:enable

  ga('create', strWebProperyId, 'auto', {'name': 'comixTracker'});
}