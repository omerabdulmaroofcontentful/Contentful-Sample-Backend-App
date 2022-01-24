"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var show = function (needsParens, circular) { return function (refl) {
    var parenthesize = function (s) { return (needsParens ? "(" + s + ")" : s); };
    if (circular.has(refl)) {
        return parenthesize("CIRCULAR " + refl.tag);
    }
    circular.add(refl);
    try {
        switch (refl.tag) {
            // Primitive types
            case 'unknown':
            case 'never':
            case 'void':
            case 'boolean':
            case 'number':
            case 'string':
            case 'symbol':
            case 'function':
                return refl.tag;
            // Complex types
            case 'literal': {
                var value = refl.value;
                return typeof value === 'string' ? "\"" + value + "\"" : String(value);
            }
            case 'array':
                return "" + readonlyTag(refl) + show(true, circular)(refl.element) + "[]";
            case 'dictionary':
                return "{ [_: " + refl.key + "]: " + show(false, circular)(refl.value) + " }";
            case 'record': {
                var keys = Object.keys(refl.fields);
                return keys.length
                    ? "{ " + keys
                        .map(function (k) {
                        return "" + readonlyTag(refl) + k + partialTag(refl) + ": " + show(false, circular)(refl.fields[k]) + ";";
                    })
                        .join(' ') + " }"
                    : '{}';
            }
            case 'tuple':
                return "[" + refl.components.map(show(false, circular)).join(', ') + "]";
            case 'union':
                return parenthesize("" + refl.alternatives.map(show(true, circular)).join(' | '));
            case 'intersect':
                return parenthesize("" + refl.intersectees.map(show(true, circular)).join(' & '));
            case 'constraint':
                return refl.name || show(needsParens, circular)(refl.underlying);
            case 'instanceof':
                var name_1 = refl.ctor.name;
                return "InstanceOf<" + name_1 + ">";
            case 'brand':
                return show(needsParens, circular)(refl.entity);
        }
    }
    finally {
        circular.delete(refl);
    }
    throw Error('impossible');
}; };
exports.default = show(false, new Set());
function partialTag(_a) {
    var isPartial = _a.isPartial;
    return isPartial ? '?' : '';
}
function readonlyTag(_a) {
    var isReadonly = _a.isReadonly;
    return isReadonly ? 'readonly ' : '';
}
