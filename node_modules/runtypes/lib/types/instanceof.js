"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
function InstanceOf(ctor) {
    return runtype_1.create(function (value) {
        return value instanceof ctor
            ? { success: true, value: value }
            : {
                success: false,
                message: "Expected " + ctor.name + ", but was " + (value === null ? value : typeof value),
            };
    }, { tag: 'instanceof', ctor: ctor });
}
exports.InstanceOf = InstanceOf;
