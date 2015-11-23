/* global module, ga */

/**
 * Google Analytics people module
 * @module ga-people
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
  ga('comixTracker.set', 'userId', strIdentity);
}

/**
 * Set properties on a user record (you must call identifyUser right after this method)
 * @param {string|object} varProperty If a string, this is the name of the property. If an object, this is an associative array of names and values
 * @param {*} [varValue] A value to set on the given property name
 * @param {function} [fncCallback] If provided, the callback will be called after the tracking event
 */
function registerUserProperties (varProperty, varValue, fncCallback) {
  // TBD
}