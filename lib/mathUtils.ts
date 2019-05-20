/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/

import { Stash } from './types';

const easingFunctions: Stash<(number) => number> = {
  linear:         function(t) { return t; },
  easeInQuad:     function(t) { return t * t; },
  easeOutQuad:    function(t) { return t * (2 - t); },
  easeInOutQuad:  function(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
  easeInCubic:    function(t) { return t * t * t; },
  easeOutCubic:   function(t) { return (--t) * t * t + 1; },
  easeInOutCubic: function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t  - 2) + 1; },
  easeInQuart:    function(t) { return t * t * t * t; },
  easeOutQuart:   function(t) { return 1 - (--t) * t * t * t; },
  easeInOutQuart: function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
  easeInQuint:    function(t) { return t * t * t * t * t; },
  easeOutQuint:   function(t) { return 1 + (--t) * t * t * t * t; },
  easeInOutQuint: function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; },
  easeOutElastic: function(t) { return Math.pow(2, -10 * t) * Math.sin((t -  0.4 / 4 ) *  ( 2  * Math.PI )  / 0.4) +  1; },
};
export type EasingFunction =
  'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeOutElastic';

// a is start
// b is end
// x is a number
// p is a parameter (mapped to 0 - 1)

export function clamp(min: number, max: number, x: number): number {
  if (x < min) {
    return min;
  } else if (x > max) {
    return max;
  }
  return x;
}

export function sign(x: number): number {
  if (x > 0) {
    return 1;
  } else if (x < 0) {
    return -1;
  }
  return x;
}

export function interp(a: number, b: number, p: number): number {
  return a + (b - a) * p;
}

export function parameterize(a: number, b: number, x: number): number {
  const delta = b - a;
  if (!delta) {
    return (x < a) ? 0 : 1;
  }
  return (x - a) / delta;
}

export function interpEaseClamped(easingFunction: EasingFunction, a: number, b: number, p: number): number {
  // Clamp the param from [0-1]
  if (p <= 0) {
    return a;
  } else if (p >= 1) {
    return b;
  }
  p = easingFunctions[easingFunction](p);
  return a + (b - a) * p;
}

// returns a uniformly distributed float from [min, max)
export function randomFloatRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export interface Point {
  x: number;
  y: number;
}

enum _ScreenSpacePoint {}
export type ScreenSpacePoint = Point & _ScreenSpacePoint;

enum _Vector {}
export type Vector = Point & _Vector;

export interface Dimensions {
  width: number;
  height: number;
}

export function lengthSqrd(v: Readonly<Vector>) {
  return v.x * v.x + v.y * v.y;
}

export function length(v: Readonly<Vector>) {
  return Math.sqrt(lengthSqrd(v));
}

export function distSqrd(p1: Readonly<Point>, p2: Readonly<Point>) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return dx * dx + dy * dy;
}

export function dist(p1: Readonly<Point>, p2: Readonly<Point>) {
  return Math.sqrt(distSqrd(p1, p2));
}

export function normalize(v: Vector) {
  const len = Math.sqrt(lengthSqrd(v));
  if (len) {
    v.x /= len;
    v.y /= len;
  }
}

export function clone(v: Readonly<Vector>): Vector;
export function clone(p: Readonly<Point>): Point;
export function clone(p) {
  return {
    x: p.x,
    y: p.y,
  };
}

export function vectorAdd(...vs: Readonly<Vector|Point>[]): Vector {
  const out = { x: 0, y: 0 } as Vector;
  for (const v of vs) {
    out.x += v.x;
    out.y += v.y;
  }
  return out;
}

export function vectorSub(v1: Readonly<Vector|Point>, v2: Readonly<Vector|Point>): Vector {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  } as Vector;
}

export function vectorMulScalar(v: Readonly<Vector>, s: number) {
  return {
    x: v.x * s,
    y: v.y * s,
  } as Vector;
}

const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;
export function deg2Rad(deg: number) {
  return d2r * deg;
}
export function rad2Deg(rad: number) {
  return r2d * rad;
}

interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export function rectsMatch(oldRect: Rect|undefined, newRect: Rect) {
  if (!oldRect) {
    return false;
  }
  return oldRect.top === newRect.top &&
    oldRect.bottom === newRect.bottom &&
    oldRect.left === newRect.left &&
    oldRect.right === newRect.right;
}

export function mod(a /*:number*/, n /*:number*/) {
  return ((a % n) + n) % n;
}

export function calcInterpParam(a, b, v) {
  return (v - a) / (b - a);
}
