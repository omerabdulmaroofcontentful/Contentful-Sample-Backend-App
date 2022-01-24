import { Runtype, Static } from '../runtype';
declare type RecordStaticType<O extends {
    [_: string]: Runtype;
}, Part extends boolean, RO extends boolean> = Part extends true ? RO extends true ? {
    readonly [K in keyof O]?: Static<O[K]>;
} : {
    [K in keyof O]?: Static<O[K]>;
} : RO extends true ? {
    readonly [K in keyof O]: Static<O[K]>;
} : {
    [K in keyof O]: Static<O[K]>;
};
export interface InternalRecord<O extends {
    [_: string]: Runtype;
}, Part extends boolean, RO extends boolean> extends Runtype<RecordStaticType<O, Part, RO>> {
    tag: 'record';
    fields: O;
    isPartial: Part;
    isReadonly: RO;
    asPartial(): InternalRecord<O, true, RO>;
    asReadonly(): InternalRecord<O, Part, true>;
}
export declare type Record<O extends {
    [_: string]: Runtype;
}, RO extends boolean> = InternalRecord<O, false, RO>;
export declare type Partial<O extends {
    [_: string]: Runtype;
}, RO extends boolean> = InternalRecord<O, true, RO>;
/**
 * Construct a record runtype from runtypes for its values.
 */
export declare function InternalRecord<O extends {
    [_: string]: Runtype;
}, Part extends boolean, RO extends boolean>(fields: O, isPartial: Part, isReadonly: RO): InternalRecord<O, Part, RO>;
export declare function Record<O extends {
    [_: string]: Runtype;
}>(fields: O): Record<O, false>;
export declare function Partial<O extends {
    [_: string]: Runtype;
}>(fields: O): Partial<O, false>;
export {};
