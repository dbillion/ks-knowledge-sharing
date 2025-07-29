export declare class BaseResponseDto<T> {
    data: T;
    message?: string;
    timestamp: string;
    constructor(data: T, message?: string);
}
