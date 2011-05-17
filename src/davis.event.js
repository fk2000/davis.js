/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module that can be mixed into any object to provide basic event functionality.
 * This module is mixed into the prototype of Davis.App.
 */
Davis.event = {

  /**
   * an object used for storing event callbacks
   * @private
   */
  _callbacks: {},

  /**
   * ## app.bind
   * Binds a callback to a named event.
   *
   * @param {String} eventName
   * @param {Function} callback
   *
   * The callback will be called with its context set to which ever object this module
   * has been mixed into.  Any data that is passed when triggering the event will be passed
   * to the callback function as the first parameter.
   *
   * The following events are triggered internally by Davis and can be bound to:
   *
   *  __start__ : Triggered when the application is started
   *
   *  __lookupRoute__ : Triggered before looking up a route. The request being looked up is passed as an argument
   *
   *  __runRoute__ : Triggered before running a route. The request and route being run are passed as arguments
   *
   *  __routeNotFound__ : Triggered if no route for the current request can be found. The current request is passed as an arugment
   *
   *  __requestHalted__ : Triggered when a before filter halts the current request. The current request is passed as an argument
   *
   *  __unsupported__ : Triggered when starting a Davis app in a browser that doesn't support html5 pushState
   *
   * ### Example:
   *     app.bind('runRoute', function () {
   *       console.log('just about to run a route!')
   *     })
   */
  bind: function (eventName, callback) {
    if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
    this._callbacks[eventName].push(callback);
    return this;
  },
  /**
   * ## app.trigger
   * Triggers an event on the current object.
   *
   * @param {String} eventName
   * @param {Object} data (optional)
   *
   * Triggers an event on the current object: all callbacks bound using bind will be called.
   * An optional second param can be passed which will be passed as an argument to each callback
   * bound to the named event.
   *
   * ### Example:
   *     app.triger('foo')
   *     app.trigger('bar', {baz: true})
   */
  trigger: function (eventName) {
    var self = this;
    var args = arguments;
    if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
    Davis.utils.forEach(this._callbacks[eventName], function (callback) {
      callback.apply(self, Davis.utils.toArray(args, 1));
    }) 
    return this;
  }
};

