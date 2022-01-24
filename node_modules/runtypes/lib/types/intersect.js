"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtype_1 = require("../runtype");
function Intersect() {
    var intersectees = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        intersectees[_i] = arguments[_i];
    }
    return runtype_1.create(function (value, visited) {
        for (var _i = 0, intersectees_1 = intersectees; _i < intersectees_1.length; _i++) {
            var targetType = intersectees_1[_i];
            var validated = runtype_1.innerValidate(targetType, value, visited);
            if (!validated.success) {
                return validated;
            }
        }
        return { success: true, value: value };
    }, { tag: 'intersect', intersectees: intersectees });
}
exports.Intersect = Intersect;
