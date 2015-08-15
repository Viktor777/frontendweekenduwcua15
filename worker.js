self.addEventListener('message', function(event) {
    var result = 0;

    for (var i = 0; i < 10000000; i++) {
        result += factorial(event.data)
    }

    self.postMessage(result);
}, false);

function factorial(n) {

    if (n !== 1) {
        return n * factorial(n - 1);
    } else {
        return 1;
    }
}