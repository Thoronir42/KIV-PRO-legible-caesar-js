(function (window, document) {

    MyMath = function() {
    };

    MyMath.gcd = function (a, b) {
        while (b > 0) {
            var temp = b;
            b = a % b; // % is remainder
            a = temp;
        }
        return a;
    };
    MyMath.gcda = function (input) {
        var result = input[0];
        for (var i = 1; i < input.length; i++) {
            result = MyMath.gcd(result, input[i]);
        }
        return result;
    };
    MyMath.lcm = function (a, b) {
        return a * (b / MyMath.gcd(a, b));
    };
    MyMath.lcma = function (input) {
        var result = input[0];
        for (var i = 1; i < input.length; i++) {
            result = MyMath.lcm(result, input[i]);
        }
        return result;
    };
    return MyMath;
})(window, document);
