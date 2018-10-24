/*
 * File: server-error.js
 * Project: simple-react-full-stack
 * File Created: Wednesday, 24th October 2018 9:50:43 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Wednesday, 24th October 2018 9:53:32 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */



module.exports = class ServerError extends Error {
    constructor (message, status) {
    
      // Calling parent constructor of base Error class.
      super(message);
      
      // Saving class name in the property of our custom error as a shortcut.
      this.name = this.constructor.name;
  
      // Capturing stack trace, excluding constructor call from it.
      Error.captureStackTrace(this, this.constructor);
      
      // You can use any additional properties you want.
      // I'm going to use preferred HTTP status for this error types.
      // `500` is the default value if not specified.
      this.status = status || 500;
      
    }
  };