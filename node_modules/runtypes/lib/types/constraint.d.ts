import { Runtype, Static } from '../runtype';
import { Unknown } from './unknown';
export declare type ConstraintCheck<A extends Runtype> = (x: Static<A>) => boolean | string;
export interface Constraint<A extends Runtype, T extends Static<A> = Static<A>, K = unknown> extends Runtype<T> {
    tag: 'constraint';
    underlying: A;
    constraint(x: Static<A>): boolean | string;
    name?: string;
    args?: K;
}
export declare function Constraint<A extends Runtype, T extends Static<A> = Static<A>, K = unknown>(underlying: A, constraint: ConstraintCheck<A>, options?: {
    name?: string;
    args?: K;
}): Constraint<A, T, K>;
export declare const Guard: <T, K = unknown>(guard: (x: unknown) => x is T, options?: {
    name?: string | undefined;
    args?: K | undefined;
} | undefined) => Constraint<Unknown, T, K>;
