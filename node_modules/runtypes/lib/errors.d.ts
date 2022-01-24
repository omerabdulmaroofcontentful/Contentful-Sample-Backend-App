export declare class ValidationError extends Error {
    key?: string | undefined;
    name: string;
    constructor(message: string, key?: string | undefined);
}
