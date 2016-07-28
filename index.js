/// <reference path="typings/index.d.ts" />

const t = require('babel-types');
const template = require('babel-template');
const traverse = require('babel-traverse');

const objectExpression = template(`Immutable.Map(OBJECT_EXPRESSION)`);
const arrayExpression = template(`Immutable.List(ARRAY_EXPRESSION)`);

const assignmentExpression = template(`OBJECT.set(PROPERTY, EXPRESSION)`);
const memberExpression = template(`OBJECT.get(PROPERTY)`);

const libraryImport = template(`{ var Immutable = require('immutable');var Range = Immutable.Range; }`);

const insertLibraryImport = {
    enter(path) {
        const node = libraryImport();
        node.leadingComments = [{
            type: 'CommentBlock',
            value: 'verbatim'
        }];
        path.insertBefore(node);
        path.stop();
    }
};

function plugin({ types: t }) {
    const ignore = new Set();
    return {
        visitor: traverse.visitors.merge([
            {
                ObjectExpression(path) {
                    if (!ignore.has(path.node)) {
                        ignore.add(path.node);
                        path.replaceWith(objectExpression({ OBJECT_EXPRESSION: path.node }));
                    }
                },
                AssignmentExpression(path) {
                    const left = path.node.left;
                    if (t.isMemberExpression(left) && (t.isStringLiteral(left.property) || t.isIdentifier(left.property))) {
                        const property = left.property;
                        const name = t.isStringLiteral(property) ? property.value : property.name;
                        path.replaceWith(assignmentExpression({
                            OBJECT: left.object,
                            PROPERTY: t.stringLiteral(name),
                            EXPRESSION: path.node.right
                        }));
                    }
                },
                MemberExpression(path) {
                    const node = path.node;
                    const property = node.property;
                    if (!t.isCallExpression(path.parentPath.node) && (t.isStringLiteral(property) || t.isIdentifier(property))) {
                        const name = t.isStringLiteral(property) ? property.value : property.name;
                        path.replaceWith(memberExpression({
                            OBJECT: node.object,
                            PROPERTY: t.stringLiteral(name)
                        }));
                    }
                }
            }, {
                ArrayExpression(path) {
                    if (!ignore.has(path.node)) {
                        ignore.add(path.node);
                        path.replaceWith(arrayExpression({ ARRAY_EXPRESSION: path.node }));
                    }
                },
                AssignmentExpression(path) {
                    const left = path.node.left;
                    if (t.isMemberExpression(left) && t.isNumericLiteral(left.property)) {
                        path.replaceWith(assignmentExpression({
                            OBJECT: left.object,
                            PROPERTY: left.property,
                            EXPRESSION: path.node.right
                        }));
                    }
                },
                MemberExpression(path) {
                    const node = path.node;
                    const property = node.property;
                    if (!t.isCallExpression(path.parentPath.node) && t.isNumericLiteral(property)) {
                        path.replaceWith(memberExpression({
                            OBJECT: node.object,
                            PROPERTY: property
                        }));
                    }
                }
            }, {
                Program(path, state) {
                    if (state.opts.libraryImport) {
                        path.traverse(insertLibraryImport);
                    }
                },
                BlockStatement(path) {
                    if ((path.node.leadingComments || []).some(comment => comment.value.trim() === 'verbatim')) {
                        path.skip();
                    }
                }
            }
        ])
    };
}

module.exports = {
    plugin
};