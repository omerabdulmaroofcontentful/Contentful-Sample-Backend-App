"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
var util_1 = require("../util");
var show_1 = require("../show");
/**
 * Construct a record runtype from runtypes for its values.
 */
function InternalRecord(fields, isPartial, isReadonly) {
    return withExtraModifierFuncs(runtype_1.create(function (x, visited) {
        if (x === null || x === undefined) {
            var a = runtype_1.create(function (_x) { return ({ success: true, value: _x }); }, { tag: 'record', fields: fields });
            return { success: false, message: "Expected " + show_1.default(a) + ", but was " + x };
        }
        for (var key in fields) {
            if (!isPartial || (util_1.hasKey(key, x) && x[key] !== undefined)) {
                var value = isPartial || util_1.hasKey(key, x) ? x[key] : undefined;
                var validated = runtype_1.innerValidate(fields[key], value, visited);
                if (!validated.success) {
                    return {
                        success: false,
                        message: validated.message,
                        key: validated.key ? key + "." + validated.key : key,
                    };
                }
            }
        }
        return { success: true, value: x };
    }, { tag: 'record', isPartial: isPartial, isReadonly: isReadonly, fields: fields }));
}
exports.InternalRecord = InternalRecord;
function Record(fields) {
    return InternalRecord(fields, false, false);
}
exports.Record = Record;
function Partial(fields) {
    return InternalRecord(fields, true, false);
}
exports.Partial = Partial;
function withExtraModifierFuncs(A) {
    A.asPartial = asPartial;
    A.asReadonly = asReadonly;
    return A;
    function asPartial() {
        return InternalRecord(A.fields, true, A.isReadonly);
    }
    function asReadonly() {
        return InternalRecord(A.fields, A.isPartial, true);
    }
}
