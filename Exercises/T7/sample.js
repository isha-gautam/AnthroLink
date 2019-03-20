var a = Number(process.argv[2]);
var b = Number(process.argv[3]);

var ans = add(a, b);
console.log(a + " + " + b + " = " + ans);

function add(a, b) {
    return a + b;
}

