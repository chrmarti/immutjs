const map1 = { a: 1, b: 2, c: 3 };
const map2 = map1.b = 42;
map1.a;
map2.b;