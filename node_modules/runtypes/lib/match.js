"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function match() {
    var cases = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        cases[_i] = arguments[_i];
    }
    return function (x) {
        for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
            var _a = cases_1[_i], T = _a[0], f = _a[1];
            if (T.guard(x))
                return f(x);
        }
        throw new Error('No alternatives were matched');
    };
}
exports.match = match;
