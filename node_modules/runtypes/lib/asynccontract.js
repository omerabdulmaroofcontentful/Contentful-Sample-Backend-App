"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
function AsyncContract() {
    var runtypes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        runtypes[_i] = arguments[_i];
    }
    var lastIndex = runtypes.length - 1;
    var argTypes = runtypes.slice(0, lastIndex);
    var returnType = runtypes[lastIndex];
    return {
        enforce: function (f) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length < argTypes.length)
                throw new errors_1.ValidationError("Expected " + argTypes.length + " arguments but only received " + args.length);
            for (var i = 0; i < argTypes.length; i++)
                argTypes[i].check(args[i]);
            var returnedPromise = f.apply(void 0, args);
            if (!(returnedPromise instanceof Promise))
                throw new errors_1.ValidationError("Expected function to return a promise, but instead got " + returnedPromise);
            return returnedPromise.then(returnType.check);
        }; },
    };
}
exports.AsyncContract = AsyncContract;
