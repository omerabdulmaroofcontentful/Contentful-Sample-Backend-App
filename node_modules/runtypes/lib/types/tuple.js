"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
var array_1 = require("./array");
var unknown_1 = require("./unknown");
function Tuple() {
    var components = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        components[_i] = arguments[_i];
    }
    return runtype_1.create(function (x, visited) {
        var validated = runtype_1.innerValidate(array_1.Array(unknown_1.Unknown), x, visited);
        if (!validated.success) {
            return {
                success: false,
                message: "Expected tuple to be an array:\u00A0" + validated.message,
                key: validated.key,
            };
        }
        if (validated.value.length !== components.length) {
            return {
                success: false,
                message: "Expected an array of length " + components.length + ", but was " + validated.value.length,
            };
        }
        for (var i = 0; i < components.length; i++) {
            var validatedComponent = runtype_1.innerValidate(components[i], validated.value[i], visited);
            if (!validatedComponent.success) {
                return {
                    success: false,
                    message: validatedComponent.message,
                    key: validatedComponent.key ? "[" + i + "]." + validatedComponent.key : "[" + i + "]",
                };
            }
        }
        return { success: true, value: x };
    }, { tag: 'tuple', components: components });
}
exports.Tuple = Tuple;
