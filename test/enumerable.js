"use strict";

const copying = require("../");

const {
  dest, src, notHave, isValue, isGetterValue, g
} = require('./helpers');

test`enumerable, no chain, no descriptor`(() => {
  const copy = copying({ enumerator: "enumerable", chain: false, descriptor: false });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isValue(result, "b", 2);
  notHave(result, "c");
  notHave(result, "d");
  notHave(result, "e");
  notHave(result, "f");
  notHave(result, g);
});

test`enumerable, chain, no descriptor`(() => {
  const copy = copying({ enumerator: "enumerable", chain: true, descriptor: false });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isValue(result, "b", 2);
  isValue(result, "c", 3);
  isValue(result, "d", 4);
  notHave(result, "e");
  notHave(result, "f");
  notHave(result, g);
});

test`enumerable, no chain, descriptor`(() => {
  const copy = copying({ enumerator: "enumerable", chain: false, descriptor: true });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isGetterValue(result, "b", 2);
  notHave(result, "c");
  notHave(result, "d");
  notHave(result, "e");
  notHave(result, "f");
  notHave(result, g);
});

test`enumerable, chain, descriptor`(() => {
  const copy = copying({ enumerator: "enumerable", chain: true, descriptor: true });
  const result = copy({}, dest, src);
  isValue(result, "dest", 0);
  isValue(result, "a", 1);
  isGetterValue(result, "b", 2);
  isValue(result, "c", 3);
  isGetterValue(result, "d", 4);
  notHave(result, "e");
  notHave(result, "f");
  notHave(result, g);
});
