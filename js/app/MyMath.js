/*
/!**
 *
 * gcd and lcm found on
 * http://stackoverflow.com/questions/4201860/how-to-find-gcd-lcm-on-a-set-of-numbers
 *!/
export class MyMath {

    static gcd(a:number, b:number):number {
        while (b > 0) {
            var temp = b;
            b = a % b; // % is remainder
            a = temp;
        }
        return a;
    }

    static gcda(input:number[]):number {
        var result = input[0];
        for (var i = 1; i < input.length; i++) {
            result = MyMath.gcd(result, input[i]);
        }
        return result;
    }

    static lcm(a:number, b:number):number {
        return a * (b / MyMath.gcd(a, b));
    }

    static lcma(input:number[]):number {
        var result = input[0];
        for (var i = 1; i < input.length; i++) {
            result = MyMath.lcm(result, input[i]);
        }
        return result;
    }
}
*/
//# sourceMappingURL=MyMath.js.map