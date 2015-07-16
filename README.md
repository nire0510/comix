# Comix
Mixpanel driver library for web applications

## Installation
* Install **Comix** with npm:  
`npm install comix`

## Usage
1. Include `comix.min.js` script file to the top of your page (`defer` or `async` attributes are not recommended):  
`<script src="node_modules/comix/comix.min.js"></script>`
2. Add the following initialization code block to the bottom of your page:  
  ```javascript
  comix.init({
    // (string) Your Mixpanel token:
    token: '',
    
    // (object): Additional properties which are sent with every track event:
    additional_properties: {},
    
    // (string) Attribute name which its value contains the event name for all track_links & track_forms events.
    // (it should not match any existing track_custom events names):
    attribute: 'data-comix',
    
    // (boolean) Should page view be tracked? the ebent name is the document's title:
    track_pageview: false,
    
    // (boolean) Should links clicks be tracked? requires to have an attribute named {{ attribute }}:
    track_links: false,
    
    // (boolean) Should forms submissions be tracked? requires to have an attribute named {{ attribute }}:
    track_forms: false,
    
    // (boolean | [{}]) Should custom events be tracked? can be either false or an array of custom events otherwise:
    track_custom: [
      {
        // (string) Selector of the elements you want to track:
        selector: '[data-comix-click]',
        
        // (string) The DOM event which triggers the track event:
        event: 'click',
        
        // (object) The name of the event which will be tracked:
        name: {
          // (string) Enumerator, could be either 'attribute', 'text' or 'function'
          type: 'attribute',
          
          // if type is 'attribute' - value is the name of the attribute which its value is the event name,
          // if type is 'text' - value is a string which is the event name,
          // if type is 'function' - value is a function which its returned value is the event name:
          value: 'data-comix-click'   
        }
      }
    ]
  });
  ```
3. If you set `track_links` or `track_forms` to `true`, make sure to add an attribute with the name specified in the `init` method.
4. If you wish to track events programatically, you can use the `track` event:  
  `comix.track('EVENT_NAME'[, {...}[, fncCallback]])`
  * `'EVENT_NAME' (string)` - the event name
  * `{...} (object)` - additional properties to add to the event (extra data) (optional)
  * `fncCallback (function)` - callback function to call after the event successfully submitted (optional)

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History
* **0.1.3** Jul 16<sup>th</sup>, 2015
  * New methods: trackCharge, disableEvents, registerEventsProperties, unregisterEventsProperties, identifyUser, registerUserProperties
  * New options in comix.init method 
  * Modules refactoring
  * More demos on test file
* **0.0.4** Jul 14<sup>th</sup>, 2015 - First release

## Credits
* [Mixpanel](https://mixpanel.com/)
* [Browserify](http://browserify.org/)

## License
MIT