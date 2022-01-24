import { Runtype, Static } from '../runtype';
export interface Part<O extends {
    [_: string]: Runtype;
}> extends Runtype<{
    [K in keyof O]?: Static<O[K]>;
}> {
    tag: 'partial';
    fields: O;
}
/**
 * Construct a runtype for partial records
 */
export declare function Part<O extends {
    [_: string]: Runtype;
}>(fields: O): Part<O>;
export { Part as Partial };
