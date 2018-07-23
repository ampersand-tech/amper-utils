"use strict";
/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var easingFunctions = {
    linear: function (t) { return t; },
    easeInQuad: function (t) { return t * t; },
    easeOutQuad: function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeInCubic: function (t) { return t * t * t; },
    easeOutCubic: function (t) { return (--t) * t * t + 1; },
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    easeInQuart: function (t) { return t * t * t * t; },
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t; },
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
    easeInQuint: function (t) { return t * t * t * t * t; },
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t; },
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; },
    easeOutElastic: function (t) { return Math.pow(2, -10 * t) * Math.sin((t - 0.4 / 4) * (2 * Math.PI) / 0.4) + 1; },
};
// a is start
// b is end
// x is a number
// p is a parameter (mapped to 0 - 1)
function clamp(min, max, x) {
    if (x < min) {
        return min;
    }
    else if (x > max) {
        return max;
    }
    return x;
}
exports.clamp = clamp;
function sign(x) {
    if (x > 0) {
        return 1;
    }
    else if (x < 0) {
        return -1;
    }
    return x;
}
exports.sign = sign;
function interp(a, b, p) {
    return a + (b - a) * p;
}
exports.interp = interp;
function parameterize(a, b, x) {
    var delta = b - a;
    if (!delta) {
        return (x < a) ? 0 : 1;
    }
    return (x - a) / delta;
}
exports.parameterize = parameterize;
function interpEaseClamped(easingFunction, a, b, p) {
    // Clamp the param from [0-1]
    if (p <= 0) {
        return a;
    }
    else if (p >= 1) {
        return b;
    }
    p = easingFunctions[easingFunction](p);
    return a + (b - a) * p;
}
exports.interpEaseClamped = interpEaseClamped;
// returns a uniformly distributed float from [min, max)
function randomFloatRange(min, max) {
    return min + Math.random() * (max - min);
}
exports.randomFloatRange = randomFloatRange;
var _ScreenSpacePoint;
(function (_ScreenSpacePoint) {
})(_ScreenSpacePoint || (_ScreenSpacePoint = {}));
var _Vector;
(function (_Vector) {
})(_Vector || (_Vector = {}));
function lengthSqrd(v) {
    return v.x * v.x + v.y * v.y;
}
exports.lengthSqrd = lengthSqrd;
function length(v) {
    return Math.sqrt(lengthSqrd(v));
}
exports.length = length;
function distSqrd(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return dx * dx + dy * dy;
}
exports.distSqrd = distSqrd;
function dist(p1, p2) {
    return Math.sqrt(distSqrd(p1, p2));
}
exports.dist = dist;
function normalize(v) {
    var len = Math.sqrt(lengthSqrd(v));
    if (len) {
        v.x /= len;
        v.y /= len;
    }
}
exports.normalize = normalize;
function clone(p) {
    return {
        x: p.x,
        y: p.y,
    };
}
exports.clone = clone;
function vectorAdd() {
    var vs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vs[_i] = arguments[_i];
    }
    var out = { x: 0, y: 0 };
    for (var _a = 0, vs_1 = vs; _a < vs_1.length; _a++) {
        var v = vs_1[_a];
        out.x += v.x;
        out.y += v.y;
    }
    return out;
}
exports.vectorAdd = vectorAdd;
function vectorSub(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
    };
}
exports.vectorSub = vectorSub;
function vectorMulScalar(v, s) {
    return {
        x: v.x * s,
        y: v.y * s,
    };
}
exports.vectorMulScalar = vectorMulScalar;
var d2r = Math.PI / 180;
var r2d = 180 / Math.PI;
function deg2Rad(deg) {
    return d2r * deg;
}
exports.deg2Rad = deg2Rad;
function rad2Deg(rad) {
    return r2d * rad;
}
exports.rad2Deg = rad2Deg;
function rectsMatch(oldRect, newRect) {
    if (!oldRect) {
        return false;
    }
    return oldRect.top === newRect.top &&
        oldRect.bottom === newRect.bottom &&
        oldRect.left === newRect.left &&
        oldRect.right === newRect.right;
}
exports.rectsMatch = rectsMatch;
function mod(a /*:number*/, n /*:number*/) {
    return ((a % n) + n) % n;
}
exports.mod = mod;
function calcInterpParam(a, b, v) {
    return (v - a) / (b - a);
}
exports.calcInterpParam = calcInterpParam;
