"use strict";

const copying = require("../");
const assert = require("assert");

const test = require('pitesti')()

test`options`(() => {
  assert.throws(() => copying(), TypeError);
  assert.throws(() => copying({}), TypeError);
  assert.throws(() => copying({ enumerator: "keys" }), TypeError);
  assert.throws(() => copying({ enumerator: "keys", chain: true }), TypeError);
  assert.throws(
    () => copying({ enumerator: "keys", chain: true, descriptor: 0 }),
    TypeError
  );
  assert.throws(
    () => copying({ enumerator: "keys", chain: 0, descriptor: false }),
    TypeError
  );
  assert.throws(
    () => copying({ enumerator: 0, chain: true, descriptor: false }),
    TypeError
  );
});

test`inputs`(() => {
  const copy = copying({ enumerator: "keys", chain: false, descriptor: false });
  assert.throws(() => copy(), TypeError);
  assert.throws(() => copy({}), TypeError);
  assert.doesNotThrow(() => copy({}, {}));
  assert.doesNotThrow(() => copy({}, {}, {}));
  assert.doesNotThrow(() => copy({}, {}, {}, {}));
  assert.throws(() => copy(7, {}), TypeError);
  assert.throws(() => copy({}, 7), TypeError);
  assert.throws(() => copy("", {}), TypeError);
  assert.throws(() => copy({}, ""), TypeError);
  assert.throws(() => copy({}, false), TypeError);
  assert.throws(() => copy(false, {}), TypeError);
  assert.throws(() => copy({}, null), TypeError);
  assert.throws(() => copy(null, {}), TypeError);
  assert.throws(() => copy({}, undefined), TypeError);
  assert.throws(() => copy(undefined, {}), TypeError);
});

test();
