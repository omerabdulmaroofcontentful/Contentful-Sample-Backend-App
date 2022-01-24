"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
/**
 * Be aware of an Array of Symbols `[Symbol()]` which would throw "TypeError: Cannot convert a Symbol value to a string"
 */
function literal(value) {
    return Array.isArray(value) ? String(value.map(String)) : String(value);
}
/**
 * Construct a runtype for a type literal.
 */
function Literal(valueBase) {
    return runtype_1.create(function (value) {
        return value === valueBase
            ? { success: true, value: value }
            : {
                success: false,
                message: "Expected literal '" + literal(valueBase) + "', but was '" + literal(value) + "'",
            };
    }, { tag: 'literal', value: valueBase });
}
exports.Literal = Literal;
/**
 * An alias for Literal(undefined).
 */
exports.Undefined = Literal(undefined);
/**
 * An alias for Literal(null).
 */
exports.Null = Literal(null);
