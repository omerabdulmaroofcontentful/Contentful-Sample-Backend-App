import { Runtype, Static } from '../runtype';
export declare const RuntypeName: unique symbol;
export interface Brand<B extends string, A extends Runtype> extends Runtype<Static<A> & {
    [RuntypeName]: B;
}> {
    tag: 'brand';
    brand: B;
    entity: A;
}
export declare function Brand<B extends string, A extends Runtype>(brand: B, entity: A): Brand<B, A>;
