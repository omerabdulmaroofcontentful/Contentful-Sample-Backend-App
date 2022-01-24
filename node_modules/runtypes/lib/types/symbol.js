"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
/**
 * Validates that a value is a symbol.
 */
var Sym = runtype_1.create(function (value) {
    return typeof value === 'symbol'
        ? { success: true, value: value }
        : {
            success: false,
            message: "Expected symbol, but was " + (value === null ? value : typeof value),
        };
}, { tag: 'symbol' });
exports.Symbol = Sym;
