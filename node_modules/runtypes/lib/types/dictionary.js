"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
var show_1 = require("../show");
function Dictionary(value, key) {
    if (key === void 0) { key = 'string'; }
    return runtype_1.create(function (x, visited) {
        if (x === null || x === undefined) {
            var a = runtype_1.create(x, { tag: 'dictionary', key: key, value: value });
            return { success: false, message: "Expected " + show_1.default(a) + ", but was " + x };
        }
        if (typeof x !== 'object') {
            var a = runtype_1.create(x, { tag: 'dictionary', key: key, value: value });
            return { success: false, message: "Expected " + show_1.default(a.reflect) + ", but was " + typeof x };
        }
        if (Object.getPrototypeOf(x) !== Object.prototype) {
            if (!Array.isArray(x)) {
                var a = runtype_1.create(x, { tag: 'dictionary', key: key, value: value });
                return {
                    success: false,
                    message: "Expected " + show_1.default(a.reflect) + ", but was " + Object.getPrototypeOf(x),
                };
            }
            else if (key === 'string')
                return { success: false, message: 'Expected dictionary, but was array' };
        }
        for (var k in x) {
            // Object keys are unknown strings
            if (key === 'number') {
                if (isNaN(+k))
                    return {
                        success: false,
                        message: 'Expected dictionary key to be a number, but was string',
                    };
            }
            var validated = runtype_1.innerValidate(value, x[k], visited);
            if (!validated.success) {
                return {
                    success: false,
                    message: validated.message,
                    key: validated.key ? k + "." + validated.key : k,
                };
            }
        }
        return { success: true, value: x };
    }, { tag: 'dictionary', key: key, value: value });
}
exports.Dictionary = Dictionary;
