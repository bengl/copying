"use strict";

const assert = require("assert");
const { getOwnPropertyDescriptor, defineProperty } = Reflect;

const notHave = (obj, name) => {
  assert(!getOwnPropertyDescriptor(obj, name));
};
const isValue = (obj, name, val) => {
  assert("value" in getOwnPropertyDescriptor(obj, name));
  assert.strictEqual(obj[name], val);
};
const isGetterValue = (obj, name, val) => {
  assert("get" in getOwnPropertyDescriptor(obj, name));
  assert.strictEqual(obj[name], val);
};

const g = Symbol('g');

const dest = { dest: 0 };

const src = {
  a: 1,
  get b() {
    return 2;
  },
  __proto__: {
    c: 3,
    get d() {
      return 4;
    }
  },
  [g]: 7
};
Reflect.defineProperty(src, "e", {
  value: 5,
  enumerable: false,
  configurable: true
});
Reflect.defineProperty(src.__proto__, "f", {
  value: 6,
  enumerable: false,
  configurable: true
});

module.exports = { dest, src, notHave, isValue, isGetterValue, g };
