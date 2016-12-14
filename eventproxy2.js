var SLICE = Array.prototype.slice;
var CONCAT = Array.prototype.concat;
var ALL_EVENT = '__all__';


function inherits (ctor, superCtor) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
}

var EventEmitter = require('eventemitter2').EventEmitter2;
var EventProxy = module.exports = function() {
      if(!(this instanceof EventProxy)) {
        return new EventProxy();
      }
      EventEmitter.call(this);
      this._fired = {};
};

inherits(EventProxy, EventEmitter);

EventProxy.prototype.bindForAll = function(callback) {
  this.on(ALL_EVENT, callback);
};


EventProxy.prototype.unbindForAll = function(callback) {
  this.removeListener(ALL_EVENT, callback);
};


EventProxy.prototype.trigger = function(eventName, data) {
  var ev, callback;
  var args = CONCAT.apply([], arguments);
  var both = 2;
  while (both--) {   
    if(!both) {
      args.splice(0, 1, ALL_EVENT);
    }
    this.emit.apply(this, args);
  }
  return this;
};


var _assign = function(/*ev1, ev2..evN, cb, once*/) {
  var proxy = this;
  var argsLength = arguments.length;
  var times = 0;
  var flag = {};
  if(argsLength < 3) {
    return this;
  }
  var events = SLICE.call(arguments, 0, -2);
  var callback = arguments[argsLength - 2];
  var isOnce = arguments[argsLength - 1];
  if(typeof callback !== "function") {
    return this;
  }

  var length = events.length;
  for(var index = 0; index < length; index++) {
    (function(key) {
      var method = isOnce ? "once" : "on";
      proxy[method](key, function(data) {
        this._fired[key] = this._fired[key] || {};
        this._fired[key].data = data;
        if(!flag[key]) {
          flag[key] = true;
          times++;
        }
      });
    })(events[index]);		
  }
  var _all = function() {
    if(times < length) {
      return;
    }
    var data = [];
    for(var index = 0; index < length; index++) {
      data.push(proxy._fired[events[index]].data);
    }
    if(isOnce) {
      proxy.unbindForAll(_all);
    }
    callback.apply(null, data);
  };
  proxy.bindForAll(_all);
};

EventProxy.prototype.all = function(eventname1, eventname2, callback, once) {
  var args = CONCAT.apply([], arguments);
  args.push(!!once);
  _assign.apply(this, args);
  return this;
};

EventProxy.prototype.assign = EventProxy.prototype.all;
