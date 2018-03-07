"use strict";

global.test = require("pitesti")();

require("./test/basics.js");
require("./test/keys.js");
require("./test/ownkeys.js");
require("./test/enumerable.js");

test();
