"use strict";
/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorUtils = require("./errorUtils");
var domain;
try {
    domain = require('domain');
}
catch (_e) {
    domain = undefined;
}
/*
* wrap is used for turning a traditional node cb(err, data) function call into a Promise.
* It wraps the call in a domain to handle async exceptions.
*
* Note that the first parameter to wrapMember is the "this" object for the call; if you don't need one, use wrap instead.
*/
function wrapInternal(obj, cmd, args, handler) {
    return new Promise(function (resolve, reject) {
        var cb = function (err, data) {
            handler(resolve, reject, err, data);
        };
        args.push(cb);
        var applyCmd = function () {
            var ret = cmd.apply(obj, args);
            if (ret instanceof Promise) {
                // whoops, someone wrapped an async function; almost certainly that was an accident
                unwrap(ret, cb);
            }
        };
        // run non-promise code in a domain to catch async exceptions
        if (domain) {
            var d = domain.create();
            d.on('error', reject);
            d.run(applyCmd);
        }
        else {
            applyCmd();
        }
    });
}
function throwErrHandler(resolve, reject, err, data) {
    if (err) {
        reject(err);
    }
    else {
        resolve(data);
    }
}
function returnErrHandler(resolve, _reject, err, data) {
    resolve({ err: err, data: data });
}
function wrap() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var cmd = args.shift();
    return wrapInternal({}, cmd, args, throwErrHandler);
}
exports.wrap = wrap;
function wrapMember(obj, cmd) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return wrapInternal(obj, cmd, args, throwErrHandler);
}
exports.wrapMember = wrapMember;
function wrapReturnError() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var cmd = args.shift();
    return wrapInternal({}, cmd, args, returnErrHandler);
}
exports.wrapReturnError = wrapReturnError;
function wrapMemberReturnError(obj, cmd) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return wrapInternal(obj, cmd, args, returnErrHandler);
}
exports.wrapMemberReturnError = wrapMemberReturnError;
/*
* unwrap is used to interface Promise-based code back out to a caller that wants a traditional cb(err, data) callback.
*/
function unwrap(p, cb) {
    var d;
    if (domain) {
        d = domain.active;
    }
    function onResult(err, val) {
        // use nextTick to escape the Promise exception catching and allow errors in cb() to be caught by the domain error handler
        setTimeout(function () {
            d && d.enter();
            cb(err, val);
            d && d.exit();
        }, 0);
    }
    p.then(onResult.bind(undefined, null), onResult);
}
exports.unwrap = unwrap;
function unwrapBind(asyncFunc) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cb = args.pop();
        var p = asyncFunc.apply(null, args);
        unwrap(p, cb);
    };
}
exports.unwrapBind = unwrapBind;
/*
* waits for all promises passed in to complete or error (unlike Promise.all, which will reject immediately upon first error)
*/
function parallel(promises) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parallelReturnErrors(promises)];
                case 1:
                    res = _a.sent();
                    if (res.firstErr) {
                        throw res.firstErr;
                    }
                    return [2 /*return*/, res.data];
            }
        });
    });
}
exports.parallel = parallel;
/*
* waits for all promises passed in to complete or error (unlike Promise.all, which will reject immediately upon first error)
* returns errors instead of throwing them, so caller can cleanup anything that succeeded
*/
function parallelReturnErrors(promises) {
    return __awaiter(this, void 0, void 0, function () {
        function onResult(resolve, i, err, val) {
            if (err) {
                errs[i] = err;
                if (!firstErr) {
                    firstErr = err;
                }
            }
            data[i] = val;
            resolve();
        }
        var count, data, errs, firstErr, ps, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = promises.length;
                    data = new Array(count);
                    errs = new Array(count);
                    ps = [];
                    _loop_1 = function (i) {
                        var p = new Promise(function (resolve) {
                            promises[i].then(onResult.bind(undefined, resolve, i, undefined), onResult.bind(undefined, resolve, i));
                        });
                        ps.push(p);
                    };
                    for (i = 0; i < count; ++i) {
                        _loop_1(i);
                    }
                    return [4 /*yield*/, Promise.all(ps)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            data: data,
                            firstErr: firstErr,
                            errs: firstErr ? errs : undefined,
                        }];
            }
        });
    });
}
exports.parallelReturnErrors = parallelReturnErrors;
var ParallelQueue = /** @class */ (function () {
    function ParallelQueue() {
        this.queue = [];
        this.results = {};
    }
    ParallelQueue.prototype.add = function (cmd) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.queue.push({ cmd: cmd, args: args });
    };
    ParallelQueue.prototype.collate = function (key, cmd) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.queue.push({ key: key, cmd: cmd, args: args });
    };
    ParallelQueue.prototype.runThread = function () {
        return __awaiter(this, void 0, void 0, function () {
            var entry, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(entry = this.queue.shift())) return [3 /*break*/, 2];
                        return [4 /*yield*/, entry.cmd.apply(entry, entry.args)];
                    case 1:
                        res = _a.sent();
                        if (entry.key) {
                            this.results[entry.key] = res;
                        }
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ParallelQueue.prototype.run = function (parallelCount) {
        if (parallelCount === void 0) { parallelCount = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var ps, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ps = [];
                        for (i = 0; i < parallelCount; ++i) {
                            ps.push(this.runThread());
                        }
                        return [4 /*yield*/, parallel(ps)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.results];
                }
            });
        });
    };
    return ParallelQueue;
}());
exports.ParallelQueue = ParallelQueue;
/*
* forever returns a Promise that never resolves; used in cases where you want to enter an infinite event-handling loop.
*/
function forever() {
    return new Promise(function () {
        // never resolves
    });
}
exports.forever = forever;
/*
* sleep is a Promise-wrapped version of setTimeout.
*/
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
/*
* ActionTimeout runs the action but early-out rejects if it takes longer than ms time
*/
var ActionTimeout = /** @class */ (function () {
    function ActionTimeout(ms, timeoutMsg, onTimeout) {
        if (timeoutMsg === void 0) { timeoutMsg = 'timed out'; }
        this.ms = ms;
        this.timeoutMsg = timeoutMsg;
        this.onTimeout = onTimeout;
        this.noTimeoutFail = false;
    }
    ActionTimeout.prototype.timeout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sleep(this.ms)];
                    case 1:
                        _a.sent();
                        if (!!this.noTimeoutFail) return [3 /*break*/, 4];
                        this.noTimeoutFail = true;
                        if (!this.onTimeout) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.onTimeout()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: throw this.timeoutMsg;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ActionTimeout.prototype.run = function (action) {
        var _this = this;
        var succeed = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action()];
                    case 1:
                        result = _a.sent();
                        this.noTimeoutFail = true;
                        return [2 /*return*/, result];
                }
            });
        }); };
        return Promise.race([this.timeout(), succeed()]);
    };
    ActionTimeout.prototype.clearTimeout = function () {
        this.noTimeoutFail = true;
    };
    return ActionTimeout;
}());
exports.ActionTimeout = ActionTimeout;
function ignoreError(p) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        p.then(resolve).catch(function (err) {
            var errStr = ErrorUtils.errorToString(err, false);
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var arg = args_1[_i];
                if (arg === errStr) {
                    resolve(undefined);
                    return;
                }
            }
            reject(err);
        });
    });
}
exports.ignoreError = ignoreError;
