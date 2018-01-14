'use strict';
module.exports = from

var Readable = require('stream').Readable
  , util = require('util')

if(Readable === undefined) {
  Readable = require('readable-stream')
}

function Producer(source, options) {
  Readable.call(this, options)
  this._index = 0
  this._source = source
}

util.inherits(Producer, Readable)

Producer.prototype._read = function() {
  // evaluate the source, and push the results.
  this._source(this._index++)
}

// from
//
// a stream that reads from an source.
// source may be an array, or a function.
// from handles pause behaviour for you.
function from(source, options) {
  options = options || {}

  if(Array.isArray(source)) {
    source = source.slice()

    return from(streamify(source, options), options)
  }

  return new Producer(source, options)
}

function streamify(source, options) {
  return function(i) {
    if(source.length) {
      return this.push(source.shift(), options.encoding)
    }

    return this.push(null)
  }
}
