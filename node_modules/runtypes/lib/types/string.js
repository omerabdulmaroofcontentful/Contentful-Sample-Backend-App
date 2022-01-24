"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
/**
 * Validates that a value is a string.
 */
exports.String = runtype_1.create(function (value) {
    return typeof value === 'string'
        ? { success: true, value: value }
        : {
            success: false,
            message: "Expected string, but was " + (value === null ? value : typeof value),
        };
}, { tag: 'string' });
