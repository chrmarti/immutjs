/// <reference path="typings/index.d.ts" />

const babel = require('babel-core');
const t = require('babel-types');
const template = require('babel-template');

const code = `
var map1 = { a: 1, b: 2, c: 3 };
var map2 = map2.b = 50;
map1.b;
map2.b;
`;

const objectExpression = template(`Immutable.Map(OBJECT_EXPRESSION)`);
const assignmentExpression = template(`OBJECT.set(PROPERTY, EXPRESSION)`);
const memberExpression = template(`OBJECT.get(PROPERTY)`);

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
            },
            MemberExpression(path) {
                if (!t.isCallExpression(path.parentPath.node)) {
                    path.replaceWith(memberExpression({
                        OBJECT: path.node.object,
                        PROPERTY: t.stringLiteral(path.node.property.name)
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
