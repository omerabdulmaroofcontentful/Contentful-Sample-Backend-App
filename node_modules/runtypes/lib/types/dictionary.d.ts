import { Runtype, Static } from '../runtype';
export interface StringDictionary<V extends Runtype> extends Runtype<{
    [_: string]: Static<V>;
}> {
    tag: 'dictionary';
    key: 'string';
    value: V;
}
export interface NumberDictionary<V extends Runtype> extends Runtype<{
    [_: number]: Static<V>;
}> {
    tag: 'dictionary';
    key: 'number';
    value: V;
}
/**
 * Construct a runtype for arbitrary dictionaries.
 */
export declare function Dictionary<V extends Runtype>(value: V, key?: 'string'): StringDictionary<V>;
export declare function Dictionary<V extends Runtype>(value: V, key?: 'number'): NumberDictionary<V>;
