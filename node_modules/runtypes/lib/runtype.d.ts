import { Result, Union2, Intersect2, Constraint, ConstraintCheck, Brand } from './index';
import { Reflect } from './reflect';
/**
 * A runtype determines at runtime whether a value conforms to a type specification.
 */
export interface Runtype<A = unknown> {
    /**
     * Verifies that a value conforms to this runtype. When given a value that does
     * not conform to the runtype, throws an exception.
     */
    assert(x: any): asserts x is A;
    /**
     * Verifies that a value conforms to this runtype. If so, returns the same value,
     * statically typed. Otherwise throws an exception.
     */
    check(x: any): A;
    /**
     * Validates that a value conforms to this type, and returns a result indicating
     * success or failure (does not throw).
     */
    validate(x: any): Result<A>;
    /**
     * A type guard for this runtype.
     */
    guard(x: any): x is A;
    /**
     * Union this Runtype with another.
     */
    Or<B extends Runtype>(B: B): Union2<this, B>;
    /**
     * Intersect this Runtype with another.
     */
    And<B extends Runtype>(B: B): Intersect2<this, B>;
    /**
     * Use an arbitrary constraint function to validate a runtype, and optionally
     * to change its name and/or its static type.
     *
     * @template T - Optionally override the static type of the resulting runtype
     * @param {(x: Static<this>) => boolean | string} constraint - Custom function
     * that returns `true` if the constraint is satisfied, `false` or a custom
     * error message if not.
     * @param [options]
     * @param {string} [options.name] - allows setting the name of this
     * constrained runtype, which is helpful in reflection or diagnostic
     * use-cases.
     */
    withConstraint<T extends Static<this>, K = unknown>(constraint: ConstraintCheck<this>, options?: {
        name?: string;
        args?: K;
    }): Constraint<this, T, K>;
    /**
     * Helper function to convert an underlying Runtype into another static type
     * via a type guard function.  The static type of the runtype is inferred from
     * the type of the guard function.
     *
     * @template T - Typically inferred from the return type of the type guard
     * function, so usually not needed to specify manually.
     * @param {(x: Static<this>) => x is T} guard - Type guard function (see
     * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
     *
     * @param [options]
     * @param {string} [options.name] - allows setting the name of this
     * constrained runtype, which is helpful in reflection or diagnostic
     * use-cases.
     */
    withGuard<T extends Static<this>, K = unknown>(guard: (x: Static<this>) => x is T, options?: {
        name?: string;
        args?: K;
    }): Constraint<this, T, K>;
    /**
     * Adds a brand to the type.
     */
    withBrand<B extends string>(brand: B): Brand<B, this>;
    /**
     * Convert this to a Reflect, capable of introspecting the structure of the type.
     */
    reflect: Reflect;
    _falseWitness: A;
}
/**
 * Obtains the static type associated with a Runtype.
 */
export declare type Static<A extends Runtype> = A['_falseWitness'];
export declare function create<A extends Runtype>(validate: (x: any, visited: VisitedState) => Result<Static<A>>, A: any): A;
export declare function innerValidate<A extends Runtype>(targetType: A, value: any, visited: VisitedState): Result<Static<A>>;
declare type VisitedState = {
    has: (candidate: object, type: Runtype) => boolean;
};
declare function VisitedState(): VisitedState;
export {};
