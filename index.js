'use strict';

var gulp = require('gulp');
var WeakMap = require('es6-weak-map');

var funcMap = {};
var nameMap = new WeakMap();

module.exports = funcMap;

process.nextTick(function() {
  Object.keys(funcMap)
    .filter(resolveSameFunc)
    .filter(resolveName)
    .filter(resolveArray)
    .filter(shouldBeTask)
    .filter(registerTask)
});

function resolveSameFunc(name) {
  var any = funcMap[name];
  switch (typeof any) {
    case 'string': {
      return true;
    }
    case 'function': {
      var srcName = nameMap.get(any);
      if (srcName) {
        funcMap[name] = funcMap[srcName];
        return true;
      }
      nameMap.set(any, name);

      var func = toAsyncable(any, name);
      funcMap[name] = func;
      nameMap.set(func, name);
      return true;
    }
    default: {
      return Array.isArray(any);
    }
  }
}

function resolveName(name) {
  var any = funcMap[name];
  if (typeof any === 'string') {
    var func = resolveNameRcr(funcMap[name]);
    if (!func) {
      return false;
    }
    funcMap[name] = func;
  }
  return true;
}

function resolveNameRcr(any) {
  switch (typeof any) {
    case 'string': {
      return resolveNameRcr(funcMap[any]);
    }
    case 'function': {
      break;
    }
    default: {
      if (!Array.isArray(any)) {
        return null;
      }
      break;
    }
  }

  var name = nameMap.get(any);
  if (name) {
    return funcMap[name];
  }
  return any;
}


function resolveArray(name) {
  var func = resolveArrayRcr(funcMap[name]);
  if (!func) {
    return false;
  }
  funcMap[name] = func;
  return true;
}

function resolveArrayRcr(any) {
  switch (typeof any) {
    case 'string': {
      return resolveArrayRcr(funcMap[any]);
    }
    case 'function': {
      var name = nameMap.get(any);
      if (name) {
        return funcMap[name];
      }
      return toAsyncable(any);
    }
    default: {
      if (!Array.isArray(any) || any.length === 0) {
        return null;
      }
      break;
    }
  }

  var composer, funcs;

  if (any.length === 1 && Array.isArray(any[0])) {
    funcs = any[0].map(resolveArrayRcr).filter(isFunction);
    composer = gulp.series;
  } else {
    funcs = any.map(resolveArrayRcr).filter(isFunction);
    composer = gulp.parallel;
  }

  if (!funcs.length) {
    return null;
  }
  return mergeFlags(mergeFlags(copyDesc(composer(funcs), any), funcs), any);
}

function shouldBeTask(name) {
  var func = funcMap[name];
  if (func.private) {
    return false;
  }
  return (name === 'default' || func.description);
}

function registerTask(name) {
  gulp.task(name, funcMap[name]);
}

function toAsyncable(func, name) {
  var wrapFn;
  if (func.length) {
    wrapFn = func;
  } else {
    wrapFn = function(done) {
      return func() || done();
    };
  }

  name = name || func.displayName || func.name;
  if (name) {
    wrapFn.displayName = name;
  }
  return mergeFlags(copyDesc(wrapFn, func), func);
}

function isFunction(v) {
  return (typeof v === 'function');
}

function copyDesc(to, from) {
  if (from.description) {
    to.description = from.description;
  }
  return to;
}

function mergeFlags(to, from) {
  to.flags = to.flags || {};

  if (Array.isArray(from)) {
    for (var i = 0, n = from.length; i < n; i++) {
      to = mergeFlags(to, from[i]);
    }
  }

  if (isPlainObject(from.flags)) {
    var keys = Object.keys(from.flags);
    for (var i = 0, n = keys.length; i < n; i++) {
      var key = keys[i];
      to.flags[key] = from.flags[key];
    }
  }

  return to;
}

function isPlainObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}
