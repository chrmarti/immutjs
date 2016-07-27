/// <reference path="../typings/index.d.ts" />

const assert = require('chai').assert;
const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
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

    describe('file', () => {

        it('should add library import', done => {
            transformFile(path.join(__dirname, 'test-source.immut.js'), (err, result) => {
                assert.notOk(err);
                assert.equal(result.code, fs.readFileSync(path.join(__dirname, 'test-expected.js'), 'utf-8'));
                done();
            });
        });
    });
});

function transform(code) {
    return babel.transform(code, {
        plugins: [plugin]
    }).code;
}

function transformFile(filepath, callback) {
    return babel.transformFile(filepath, {
        plugins: [[plugin, { libraryImport: true }]]
    }, callback);
}