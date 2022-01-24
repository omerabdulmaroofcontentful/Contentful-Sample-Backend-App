"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
/**
 * Validates anything, but provides no new type information about it.
 */
exports.Unknown = runtype_1.create(function (value) { return ({ success: true, value: value }); }, { tag: 'unknown' });
