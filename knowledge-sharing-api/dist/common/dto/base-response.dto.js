"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponseDto = void 0;
class BaseResponseDto {
    data;
    message;
    timestamp;
    constructor(data, message) {
        this.data = data;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
}
exports.BaseResponseDto = BaseResponseDto;
//# sourceMappingURL=base-response.dto.js.map