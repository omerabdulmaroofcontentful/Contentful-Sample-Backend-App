"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var show_1 = require("./show");
var errors_1 = require("./errors");
function create(validate, A) {
    A.check = check;
    A.assert = check;
    A._innerValidate = function (value, visited) {
        if (visited.has(value, A))
            return { success: true, value: value };
        return validate(value, visited);
    };
    A.validate = function (value) { return A._innerValidate(value, VisitedState()); };
    A.guard = guard;
    A.Or = Or;
    A.And = And;
    A.withConstraint = withConstraint;
    A.withGuard = withGuard;
    A.withBrand = withBrand;
    A.reflect = A;
    A.toString = function () { return "Runtype<" + show_1.default(A) + ">"; };
    return A;
    function check(x) {
        var validated = A.validate(x);
        if (validated.success) {
            return validated.value;
        }
        throw new errors_1.ValidationError(validated.message, validated.key);
    }
    function guard(x) {
        return A.validate(x).success;
    }
    function Or(B) {
        return index_1.Union(A, B);
    }
    function And(B) {
        return index_1.Intersect(A, B);
    }
    function withConstraint(constraint, options) {
        return index_1.Constraint(A, constraint, options);
    }
    function withGuard(guard, options) {
        return index_1.Constraint(A, guard, options);
    }
    function withBrand(B) {
        return index_1.Brand(B, A);
    }
}
exports.create = create;
function innerValidate(targetType, value, visited) {
    return targetType._innerValidate(value, visited);
}
exports.innerValidate = innerValidate;
function VisitedState() {
    var members = new WeakMap();
    var add = function (candidate, type) {
        if (candidate === null || !(typeof candidate === 'object'))
            return;
        var typeSet = members.get(candidate);
        members.set(candidate, typeSet ? typeSet.set(type, true) : new WeakMap().set(type, true));
    };
    var has = function (candidate, type) {
        var typeSet = members.get(candidate);
        var value = (typeSet && typeSet.get(type)) || false;
        add(candidate, type);
        return value;
    };
    return { has: has };
}
