"use strict";

const {
  getOwnPropertyDescriptor,
  defineProperty,
  getPrototypeOf,
  ownKeys
} = Reflect;
const { keys: objectKeys, hasOwnProperty } = Object;

const enumerators = {
  enumerable: enumerableEnumerator,
  ownKeys: ownKeysEnumerator,
  keys: keysEnumerator
};

const chainEnumerators = {
  enumerable: chainEnumerableEnumerator,
  ownKeys: chainOwnKeysEnumerator,
  keys: chainKeysEnumerator
};

function verifyOptions(options) {
  if (typeof options !== "object" || options === null) {
    throw new TypeError(`options must be a non-null object`);
  }
  if (!(options.enumerator in enumerators)) {
    throw new TypeError(
      `options.enumerator must be one of: 'enumerable', 'ownKeys', 'keys'`
    );
  }
  if (typeof options.chain !== "boolean") {
    throw new TypeError(`options.chain must be a boolean`);
  }
  if (typeof options.descriptor !== "boolean") {
    throw new TypeError(`options.chain must be a boolean`);
  }
}

function* enumerableEnumerator(object) {
  for (const propName in object) {
    if (hasOwnProperty.call(object, propName)) {
      yield propName;
    }
  }
}

function* chainEnumerableEnumerator(object) {
  for (const propName in object) {
    yield propName;
  }
}

function ownKeysEnumerator(object) {
  return ownKeys(object);
}

function chainOwnKeysEnumerator(object, seen = new Set()) {
  for (const propName of ownKeys(object)) {
    seen.add(propName);
  }
  const proto = getPrototypeOf(object);
  if (proto) {
    chainOwnKeysEnumerator(proto, seen);
  }
  return seen;
}

function keysEnumerator(object) {
  return objectKeys(object);
}

function chainKeysEnumerator(object, seen = new Set()) {
  for (const propName of objectKeys(object)) {
    seen.add(propName);
  }
  const proto = getPrototypeOf(object);
  if (proto) {
    chainKeysEnumerator(proto, seen);
  }
  return seen;
}

function getChainDescriptor(obj, propName) {
  if (hasOwnProperty.call(obj, propName)) {
    return getOwnPropertyDescriptor(obj, propName);
  } else {
    const proto = getPrototypeOf(obj);
    /* istanbul ignore else */
    if (proto !== null) {
      return getChainDescriptor(proto, propName);
    } else {
      // If we ever get here, we somehow decided to copy a property that doesn't
      // exist anywhere in the prototype chain. This shouldn't happen ever,
      // since our enumerators could never give us this, but if it does, we
      // ought to throw.
      throw new Error("Got to a null prototype when looking for a property!");
    }
  }
}

function makeCopyDescriptor(descriptorGetter) {
  return (dest, src, propName) =>
    defineProperty(dest, propName, descriptorGetter(src, propName));
}

function copyEvaluatedProperty(dest, src, propName) {
  dest[propName] = src[propName];
}

function makeSingleCopy(options) {
  const enumerator = (options.chain ? chainEnumerators : enumerators)[
    options.enumerator
  ];
  const copyProperty = options.descriptor
    ? makeCopyDescriptor(
        options.chain ? getChainDescriptor : getOwnPropertyDescriptor
      )
    : copyEvaluatedProperty;
  return (dest, src) => {
    for (const propName of enumerator(src)) {
      copyProperty(dest, src, propName);
    }
  };
}

function makeMultiCopy(singleCopy) {
  return (...objects) => {
    if (objects.length < 2) {
      throw new TypeError("need at least two object inputs!");
    }
    let destObj;
    for (const object of objects) {
      if (typeof object !== "object" || object === null) {
        throw new TypeError("all inputs must be non-null objects!");
      }
      if (destObj) {
        singleCopy(destObj, object);
      } else {
        destObj = object;
      }
    }
    return destObj;
  };
}

function createCopier(options) {
  verifyOptions(options);
  const singleCopy = makeSingleCopy(options);

  return makeMultiCopy(singleCopy);
}

module.exports = createCopier;
