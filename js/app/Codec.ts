/*
import {MyMath} from "./MyMath";

const CODEC_MODE_TO_UPPER : number = 1;
const CODEC_MIN_SET_LENGTH : number = 1;

export class Codec{
    codeSets: string[];
    charToSet: number[];

    private mod: number;
    private mode: number;

    constructor(codeSets : string[]){
        this.codeSets = codeSets;
        this.charToCharset = [];

        let setLengths:number[] = [];

        var n = 0;
        for (var i = 0; i < codeSets.length; i++) {
            let codeSet:string = codeSets[i];
            this.putCodeSet(codeSet, n);
            setLengths[n] = codeSet.length;
            n++;
        }

        this.mod = MyMath.lcma(setLengths);
        this.mode = CODEC_MODE_TO_UPPER;
    }



    static filterNonEmpty(sets : string[], mode : number) : string[] {
        var n = 0, i;
        var set;
        for (i = 0; i < sets.length; i++) {
            set = sets[i];
            n += set.length < CODEC_MIN_SET_LENGTH ? 0 : 1;
        }
        var filtered = [];

        n = 0;
        for (i = 0; i < sets.length; i++) {
            set = sets[i];
            if (set.length < CODEC_MIN_SET_LENGTH) {
                continue;
            }
            filtered[n++] = Codec.normalize(set, mode);
        }

        return filtered;
        }

    static normalize(set : string, mode : number) : string {
            switch (mode) {
                case CODEC_MODE_TO_UPPER:
                    return set.toUpperCase();
                default:
                    return set.toLowerCase();

            }
        }

    putCodeSet(codeSet : string, n : number) : boolean {
    for (var i = 0; i < codeSet.length; i++) {
        let c:string = codeSet.charAt(i);
        if (this.charToCharset.hasOwnProperty(c)) {
            return false;
        }
        this.charToCharset[c] = n;
    }
    return true;
}

    getPossibleCiphers(word:string) : string[]{
    let ciphers:string[] = [];
    for (var i = 0; i < this.mod; i++) {
        ciphers[i] = this.encode(word, i);
    }

    return ciphers;
}

encode(word:string, key:number) :string {
    return this.shiftWord(Codec.normalize(word, this.mode), key);
}

decode(cipher:string, key:number) :string {
    return this.shiftWord(Codec.normalize(cipher, this.mode), this.mod - key);
}

shiftWord(word:string, offset:number):string {

    let shifted:string = "";

    for (let i:number = 0; i < word.length; i++) {
        var p = word[i];
        if (!this.charToCharset.hasOwnProperty(p)) {
            shifted += p;
            continue;
        }

        let charset:string = this.codeSets[this.charToCharset[p]];

        i = charset.indexOf(p);
        i = (i + offset) % charset.length;

        shifted += charset.charAt(i);
    }

    return shifted;
}

getCodeSets() :string[] {
    return this.codeSets;
}

getModulo() :number {
    return this.mod;
}

}
*/
