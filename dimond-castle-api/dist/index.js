"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
async function main() {
    await (0, db_1.connectDB)();
    app_1.default.listen(env_1.env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`[api] listening on http://localhost:${env_1.env.PORT}`);
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
