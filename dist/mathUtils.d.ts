/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/
export type EasingFunction = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeOutElastic';
export declare function clamp(min: number, max: number, x: number): number;
export declare function sign(x: number): number;
export declare function interp(a: number, b: number, p: number): number;
export declare function parameterize(a: number, b: number, x: number): number;
export declare function interpEaseClamped(easingFunction: EasingFunction, a: number, b: number, p: number): number;
export declare function randomFloatRange(min: number, max: number): number;
export interface Point {
    x: number;
    y: number;
}
declare enum _ScreenSpacePoint {
}
export type ScreenSpacePoint = Point & _ScreenSpacePoint;
declare enum _Vector {
}
export type Vector = Point & _Vector;
export interface Dimensions {
    width: number;
    height: number;
}
export declare function lengthSqrd(v: Readonly<Vector>): number;
export declare function length(v: Readonly<Vector>): number;
export declare function distSqrd(p1: Readonly<Point>, p2: Readonly<Point>): number;
export declare function dist(p1: Readonly<Point>, p2: Readonly<Point>): number;
export declare function normalize(v: Vector): void;
export declare function clone(v: Readonly<Vector>): Vector;
export declare function clone(p: Readonly<Point>): Point;
export declare function vectorAdd(...vs: Readonly<Vector | Point>[]): Vector;
export declare function vectorSub(v1: Readonly<Vector | Point>, v2: Readonly<Vector | Point>): Vector;
export declare function vectorMulScalar(v: Readonly<Vector>, s: number): Vector;
export declare function deg2Rad(deg: number): number;
export declare function rad2Deg(rad: number): number;
interface Rect {
    top: number;
    left: number;
    bottom: number;
    right: number;
}
export declare function rectsMatch(oldRect: Rect | undefined, newRect: Rect): boolean;
export declare function mod(a: any, n: any): number;
export declare function calcInterpParam(a: any, b: any, v: any): number;
export {};
