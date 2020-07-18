"use strict";

const copying = require("../");

const {
  dest, src, notHave, isValue, isGetterValue, g
} = require('./helpers');

const test = require('pitesti')()

test`ownKeys, no chain, no descriptor`(() => {
  const copy = copying({ enumerator: "ownKeys", chain: false, descriptor: false });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isValue(result, "b", 2);
  notHave(result, "c");
  notHave(result, "d");
  isValue(result, "e", 5);
  notHave(result, "f");
  isValue(result, g, 7);
});

test`ownKeys, chain, no descriptor`(() => {
  const copy = copying({ enumerator: "ownKeys", chain: true, descriptor: false });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isValue(result, "b", 2);
  isValue(result, "c", 3);
  isValue(result, "d", 4);
  isValue(result, "e", 5);
  isValue(result, "f", 6);
  isValue(result, g, 7);
});

test`ownKeys, no chain, descriptor`(() => {
  const copy = copying({ enumerator: "ownKeys", chain: false, descriptor: true });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isGetterValue(result, "b", 2);
  notHave(result, "c");
  notHave(result, "d");
  isValue(result, "e", 5);
  notHave(result, "f");
  isValue(result, g, 7);
});

test`ownKeys, chain, descriptor`(() => {
  const copy = copying({ enumerator: "ownKeys", chain: true, descriptor: true });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isGetterValue(result, "b", 2);
  isValue(result, "c", 3);
  isGetterValue(result, "d", 4);
  isValue(result, "e", 5);
  isValue(result, "f", 6);
  isValue(result, g, 7);
});

test();
