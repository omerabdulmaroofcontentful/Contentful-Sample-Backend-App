"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
/**
 * Validates that a value is a number.
 */
exports.Number = runtype_1.create(function (value) {
    return typeof value === 'number'
        ? { success: true, value: value }
        : {
            success: false,
            message: "Expected number, but was " + (value === null ? value : typeof value),
        };
}, { tag: 'number' });
