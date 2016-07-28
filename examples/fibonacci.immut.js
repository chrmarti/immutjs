const start = [0, 1];

function next(current) {
    return current.push(current[0] + current[1]).shift();
}

const result = Range(2, 10)
                .reduce(prev => next(prev), start);

console.log(result);
