"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcrypt = require("bcryptjs");
class PasswordUtil {
    static async hash(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    static async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
    static validate(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }
}
exports.PasswordUtil = PasswordUtil;
//# sourceMappingURL=password.util.js.map