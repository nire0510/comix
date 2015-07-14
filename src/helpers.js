/**
 * Created by nir on 6/14/15.
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