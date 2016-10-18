'use strict';

var gulp = require('gulp');
var WeakMap = require('es6-weak-map');

var funcMap = {};
var nameMap = new WeakMap();

module.exports = funcMap;

process.nextTick(function() {
  Object.keys(funcMap)
    .filter(resolveFunction)
    .filter(resolveName)
    .filter(resolveArrayOrObject)
    .filter(isTask)
    .filter(registerTask);
});

function registerTask(name) {
  gulp.task(name, funcMap[name]);
}

function isTask(name) {
  var func = funcMap[name];
  if (func.private) {
    return false;
  }
  return (name === 'default' || func.description);
}

function isString(v) {
  return typeof v === 'string';
}

function isFunction(v) {
  return typeof v === 'function';
}

function isArray(v) {
  return Array.isArray(v);
}

function isPlainObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

function copyDescriptions(to, from) {
  if (from.description) {
    to.description = from.description;
  }

  if (!to.flags) {
    to.flags = {};
  }

  if (isArray(from)) {
    from.forEach(function(child) {
      to = mergeFlags(to, child);
    });
  }

  return mergeFlags(to, from);
}

function mergeFlags(to, from) {
  if (isPlainObject(from.flags)) {
    Object.keys(from.flags).forEach(function(key) {
      to.flags[key] = from.flags[key];
    });
  }

  return to;
}

function toAsyncable(func, displayName) {
  var wrapFn;
  if (func.length) {
    wrapFn = func;
  } else {
    wrapFn = function(done) {
      return func() || done();
    };
  }

  displayName = displayName || func.displayName || func.name;
  if (displayName) {
    wrapFn.displayName = displayName;
  }

  return copyDescriptions(wrapFn, func);
}

function resolveFunction(name) {
  var any = funcMap[name];

  if (isFunction(any)) {
    var firstName = nameMap.get(any);
    if (firstName) {
      funcMap[name] = funcMap[firstName];
      return true;
    }
    nameMap.set(any, name);

    var func = toAsyncable(any, name);
    funcMap[name] = func;
    nameMap.set(func, name);
    return true;
  }

  if (isString(any)) {
    return true;
  }

  if (isArray(any)) {
    return true;
  }

  if (isPlainObject(any)) {
    return true;
  }

  return false;
}

function resolveName(name) {
  var any = funcMap[name];

  if (isString(any)) {
    var func = resolveNameRcr(funcMap[name]);
    if (!func) {
      return false;
    }
    funcMap[name] = func;
  }

  return true;
}

function resolveNameRcr(any) {
  if (isString(any)) {
    return resolveNameRcr(funcMap[name]);
  }

  var name = nameMap.get(any);
  if (name) {
    return funcMap[name];
  }

  return any;
}

function resolveArrayOrObject(name) {
  var any = funcMap[name];
  if (isFunction(any)) {
    return true;
  }

  var func = resolveArrayOrObjectRcr(any);
  if (!func) {
    return false;
  }
  nameMap.set(any, name);

  func.displayName = name;
  funcMap[name] = func;
  nameMap.set(func, name);
  return true;
}

function resolveArrayOrObjectRcr(any) {
  if (isString(any)) {
    return resolveArrayOrObjectRcr(funcMap[any]);
  }

  if (isFunction(any)) {
    var name = nameMap.get(any);
    if (name) {
      return funcMap[name];
    }
    return toAsyncable(any);
  }

  if (isPlainObject(any)) {
    if ('watch' in any) {
      var name = nameMap.get(any);
      if (name) {
        return funcMap[name];
      }

      if (isString(any.call)) {
        return copyDescriptions(function() {
          gulp.watch(any.watch, any.opts, funcMap[any.call]);
        }, any);
      }

      if (isFunction(any.call)) {
        return copyDescriptions(function() {
          gulp.watch(any.watch, any.opts, toAsyncable(any.call));
        }, any);
      }

      if (isArray(any.call) || isPlainObject(any.call)) {
        return copyDescriptions(function() {
          gulp.watch(any.watch, any.opts, resolveArrayOrObjectRcr(any.call));
        }, any);
      }
    }
    return null;
  }

  var composer,
      funcs;

  if (isArray(any)) {
    if (any.length === 1 && isArray(any[0])) {
      funcs = any[0].map(resolveArrayOrObjectRcr).filter(isFunction);
      composer = gulp.series;
    } else {
      funcs = any.map(resolveArrayOrObjectRcr).filter(isFunction);
      composer = gulp.parallel;
    }

    if (!funcs.length) {
      return null;
    }
    return copyDescriptions(copyDescriptions(composer(funcs), funcs), any);
  }

  return null;
}

