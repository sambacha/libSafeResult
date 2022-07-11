"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.fromThunk = exports.error = exports.spawnWithTimeout = exports.Deferred = void 0;
var deferred_js_1 = require("./deferred.js");
Object.defineProperty(exports, "Deferred", { enumerable: true, get: function () { return deferred_js_1.default; } });
var process_js_1 = require("./process.js");
Object.defineProperty(exports, "spawnWithTimeout", { enumerable: true, get: function () { return process_js_1.spawnWithTimeout; } });
var result_js_1 = require("./result.js");
Object.defineProperty(exports, "error", { enumerable: true, get: function () { return result_js_1.error; } });
Object.defineProperty(exports, "fromThunk", { enumerable: true, get: function () { return result_js_1.fromThunk; } });
Object.defineProperty(exports, "ok", { enumerable: true, get: function () { return result_js_1.ok; } });
__exportStar(require("./type.js"), exports);
