/*!
 * Davis - history
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module to normalize and enhance the window.pushState method and window.onpopstate event.
 * Adds the ability to bind to whenever a new state is pushed onto the history stack and normalizes
 * both of these events into an onChange event.
 */
Davis.history = (function () {

  /**
   * storage for the push state handlers
   * @private
   */
  var pushStateHandlers = [];

  /**
   * Add a handler to the push state event.  This event is not a native event but is fired
   * every time a call to pushState is called.
   * 
   * @param {Function} handler
   * @private
   */
  var onPushState = function (handler) {
    pushStateHandlers.push(handler);
  };

  /**
   * Simple wrapper for the native onpopstate event.
   *
   * @param {Function} handler
   * @private
   */
  var onPopState = function (handler) {
    window.addEventListener('popstate', handler, true);
  };

  /**
   * returns a handler that wraps the native event given onpopstate.
   * When the page first loads or goes back to a time in the history that was not added
   * by pushState, the event.state object will be null.  This generates a request for the current
   * location in those cases
   *
   * @param {Function} handler
   * @private
   */
  var wrapped = function (handler) {
    return function (event) {
      if (event.state) {
        // the request that is pushed into the browser history looses its __proto__
        var req = event.state
        req.__proto__ = Davis.Request.prototype
        handler(req)
      } else {
        handler(Davis.Request.forPageLoad())
      };
    }
  }

  /**
   * ## Davis.history.onChange
   * Bind to the history on change event.  This is not a native event but is fired any time a new
   * state is pushed onto the history stack. The current history is then replaced or a state is popped
   * off the history stack.
   *
   * @param {Function} handler
   *
   * The handler function will be called with a request param which is an instance of Davis.Request.
   * @see Davis.Request
   */
  var onChange = function (handler) {
    onPushState(handler);
    onPopState(wrapped(handler));
  };

  /**
   * ## Davis.history.pushState
   * Push a request onto the history stack.  This is used internally by Davis to push a new request
   * resulting from either a form submit or a link click onto the history stack. It will also trigger
   * the onpushstate event.
   *
   * @param {Davis.Request} request
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   */
  var pushState = function (request) {
    history.pushState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  /**
   * ## Davis.history.replaceState
   * Replace the current state on the history stack.  This is used internally by Davis when performing
   * a redirect.  This will trigger an onpushstate event.
   *
   * @param {Davis.Request} request
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   */
  var replaceState = function (request) {
    history.replaceState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  /**
   * Exposing the public methods of this module
   * @private
   */
  return {
    replaceState: replaceState,
    pushState: pushState,
    onChange: onChange
  }
})()