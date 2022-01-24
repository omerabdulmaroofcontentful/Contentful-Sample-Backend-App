import { Runtype } from '../runtype';
/**
 * Construct a possibly-recursive Runtype.
 */
export declare function Lazy<A extends Runtype>(delayed: () => A): A;
