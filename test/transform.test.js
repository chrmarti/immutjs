/// <reference path="../typings/index.d.ts" />

const assert = require('chai').assert;
const babel = require('babel-core');
const plugin = require('..').plugin;

describe('transform', () => {
    describe('map', () => {

        it('should transform an object literal', () => {
            assert.equal(transform('var m = { a: 1 };'), 'var m = Immutable.Map({ a: 1 });');
        });

        it('should transform property read access by dot', () => {
            assert.equal(transform('m.a;'), 'm.get("a");');
        });

        it('should transform property read access by square brackets', () => {
            assert.equal(transform('m["a"];'), 'm.get("a");');
        });

        it('should transform property write access by dot', () => {
            assert.equal(transform('m.a = 1;'), 'm.set("a", 1);');
        });

        it('should transform property write access by square brackets', () => {
            assert.equal(transform('m["a"] = 1;'), 'm.set("a", 1);');
        });
    });

    describe('array', () => {

        it('should transform an array literal', () => {
            assert.equal(transform('var l = [ "a" ];'), 'var l = Immutable.List(["a"]);');
        });

        it('should transform element read access', () => {
            assert.equal(transform('l[1];'), 'l.get(1);');
        });

        it('should transform element write access', () => {
            assert.equal(transform('l[1] = "a";'), 'l.set(1, "a");');
        });
    });
});

function transform(code) {
    return babel.transform(code, {
        plugins: [plugin]
    }).code;
}