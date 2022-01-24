"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
var show_1 = require("../show");
var util_1 = require("../util");
function Union() {
    var alternatives = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        alternatives[_i] = arguments[_i];
    }
    var match = function () {
        var cases = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cases[_i] = arguments[_i];
        }
        return function (x) {
            for (var i = 0; i < alternatives.length; i++) {
                if (alternatives[i].guard(x)) {
                    return cases[i](x);
                }
            }
        };
    };
    return runtype_1.create(function (value, visited) {
        var commonLiteralFields = {};
        for (var _i = 0, alternatives_1 = alternatives; _i < alternatives_1.length; _i++) {
            var alternative = alternatives_1[_i];
            if (alternative.reflect.tag === 'record') {
                var _loop_1 = function (fieldName) {
                    var field = alternative.reflect.fields[fieldName];
                    if (field.tag === 'literal') {
                        if (commonLiteralFields[fieldName]) {
                            if (commonLiteralFields[fieldName].every(function (value) { return value !== field.value; })) {
                                commonLiteralFields[fieldName].push(field.value);
                            }
                        }
                        else {
                            commonLiteralFields[fieldName] = [field.value];
                        }
                    }
                };
                for (var fieldName in alternative.reflect.fields) {
                    _loop_1(fieldName);
                }
            }
        }
        for (var fieldName in commonLiteralFields) {
            if (commonLiteralFields[fieldName].length === alternatives.length) {
                for (var _a = 0, alternatives_2 = alternatives; _a < alternatives_2.length; _a++) {
                    var alternative = alternatives_2[_a];
                    if (alternative.reflect.tag === 'record') {
                        var field = alternative.reflect.fields[fieldName];
                        if (field.tag === 'literal' &&
                            util_1.hasKey(fieldName, value) &&
                            value[fieldName] === field.value) {
                            return runtype_1.innerValidate(alternative, value, visited);
                        }
                    }
                }
            }
        }
        for (var _b = 0, alternatives_3 = alternatives; _b < alternatives_3.length; _b++) {
            var targetType = alternatives_3[_b];
            if (runtype_1.innerValidate(targetType, value, visited).success) {
                return { success: true, value: value };
            }
        }
        var a = runtype_1.create(value, { tag: 'union', alternatives: alternatives });
        return {
            success: false,
            message: "Expected " + show_1.default(a) + ", but was " + (value === null ? value : typeof value),
        };
    }, { tag: 'union', alternatives: alternatives, match: match });
}
exports.Union = Union;
