/* global module */
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