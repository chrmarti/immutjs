/// <reference path="typings/index.d.ts" />

const babel = require('babel-core');
const t = require('babel-types');
const template = require('babel-template');

const code = `
var c = { a: 'b' };
var c2 = c.d = 1;
`;

const objectExpression = template(`Immutable.Map(OBJECT_EXPRESSION)`);
const assignmentExpression = template(`OBJECT.set(PROPERTY, EXPRESSION)`);

function plugin({ types: t }) {
    const seen = new Set();
    return {
        visitor: {
            ObjectExpression(path) {
                if (!seen.has(path.node)) {
                    seen.add(path.node);
                    path.replaceWith(objectExpression({ OBJECT_EXPRESSION: path.node }));
                }
            },
            AssignmentExpression(path) {
                const left = path.node.left;
                if (t.isMemberExpression(left)) {
                    path.replaceWith(assignmentExpression({
                        OBJECT: left.object,
                        PROPERTY: t.stringLiteral(left.property.name),
                        EXPRESSION: path.node.right
                    }));
                }
            }
        }
    };
}

const result = babel.transform(code, {
    plugins: [plugin]
});

console.log(result.code);
