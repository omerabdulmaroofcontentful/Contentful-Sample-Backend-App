"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
/**
 * Construct an array runtype from a runtype for its elements.
 */
function InternalArr(element, isReadonly) {
    return withExtraModifierFuncs(runtype_1.create(function (xs, visited) {
        if (!Array.isArray(xs)) {
            return {
                success: false,
                message: "Expected array, but was " + (xs === null ? xs : typeof xs),
            };
        }
        for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
            var x = xs_1[_i];
            var validated = runtype_1.innerValidate(element, x, visited);
            if (!validated.success) {
                return {
                    success: false,
                    message: validated.message,
                    key: validated.key ? "[" + xs.indexOf(x) + "]." + validated.key : "[" + xs.indexOf(x) + "]",
                };
            }
        }
        return { success: true, value: xs };
    }, { tag: 'array', isReadonly: isReadonly, element: element }));
}
function Arr(element) {
    return InternalArr(element, false);
}
exports.Array = Arr;
function withExtraModifierFuncs(A) {
    A.asReadonly = asReadonly;
    return A;
    function asReadonly() {
        return InternalArr(A.element, true);
    }
}
