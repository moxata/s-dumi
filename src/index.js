import leftPad from 'left-pad';

const ROD_MUJKI = "ROD_MUJKI";
const ROD_JENSKI = "ROD_JENSKI";
const ROD_X = "ROD_X";

const EXP_TO_ROD = [
    ROD_MUJKI, ROD_X, ROD_X,
    ROD_JENSKI, ROD_X, ROD_X,
    ROD_MUJKI, ROD_X, ROD_X,
    ROD_MUJKI, ROD_X, ROD_X,
    ROD_MUJKI
];

const ci = ['нула','един','две', 'три','четири','пет','шест','седем','осем',
    'девет','десет','единадесет','дванадесет','тринадесет','четиринадесет',
   'петнадесет','шестнадесет','седемнадесет','осемнадесет','деветнадесет'
];
const DESETICI = ['padding', 'padding',
    'двадесет','тридесет','четиридесет',
    'петдесет','шестдесет','седемдесет','осемдесет','деветдесет'
];
const STOTICI = ['padding',
    'сто', 'двеста' ,'триста', 'четиристотин', 'петстотин', 'шестстотин', 
    'седемстотин', 'осемстотин', 'деветстотин'    
];
const TRIEXPONENTS = [
    'padding',
    ['хиляда', 'хиляди'],
    ['милион', 'милиона'],
    ['милиард', 'милиарда'],
    ['трилион', 'трилиона'],
]

function buildTriList(suma) {
    suma = Math.abs(suma);
    let zeroPadded = leftPad(""+suma, 15, "0");
    let triList = [];
    let triLength = Math.floor(zeroPadded.length/3);
    let newTri;
    for (let i=0; i<triLength; i++) {
        newTri = {
            s: zeroPadded.substring(i*3, i*3 + 3),
            exp: (zeroPadded.length - (i*3) - 3),
            hasI: false,
            isPlural: false,
            res: "",
        };
        newTri.isPlural = (parseInt(newTri.s, 10) !== 1);
        if (newTri.s !== "000") {
            triList.push(newTri);
        }
    } 
    return triList;
}

// 0-19
function EDINICI(n, rod) {
    
    switch(n) {
        case 1: 
            if (rod === ROD_JENSKI) {
                return "една";
            } else {
                return "един";
            }
        case 2: 
            if (rod === ROD_JENSKI) {
                return "две";
            } else {
                return "два";
            }
        default:
            return ci[n];
    }
}

function frac(suma) {
    suma = "" + suma;
    let dot = suma.indexOf(".");
    if (dot !== -1) {
        suma = suma.substring(dot+1);
        while (suma.length < 2) {
            suma += "0";
        }
        return suma;
    } else {
        return "0";
    }
}

export function sDumiCialaChast(suma) {
    suma = Math.trunc(suma);
    if (suma === 0) {
        return "нула";
    }
    
    let isPlus = (suma >= 0);
    let triList = buildTriList(suma);
    
    for (let i=0, len=triList.length; i<len; i++) {
        let tri = triList[i];
        let { s } = tri;
        
        if (s[0] === "0") {
            
            if (s[1] <= "1") {
                
                if (tri.exp === 3 && !tri.isPlural) {
                    // не се казва "една хиляда"
                    tri.res = "";  
                } else {
                    tri.res = EDINICI(parseInt(s, 10), EXP_TO_ROD[tri.exp]);
                }
                
            } else {
                
                tri.res = DESETICI[parseInt(s[1], 10)];
                if (s[2] !== "0") {
                    tri.res += " и " + EDINICI(parseInt(s[2], 10), EXP_TO_ROD[tri.exp]);
                    tri.hasI = true;
                }
                
            }
            
        } else {
            
            tri.res = STOTICI[parseInt(s[0], 10)];
            let dvu = parseInt(s[1] + s[2], 10);
            if (dvu > 0) {
                if (s[1] <= "1") {
                    tri.res += " и " + EDINICI(dvu, EXP_TO_ROD[tri.exp]);
                    tri.hasI = true;
                } else {
                    if (s[2] === "0") {
                        tri.res += " и";
                        tri.hasI = true;
                    }
                    tri.res += " " + DESETICI[parseInt(s[1], 10)];
                    if (s[2] !== "0") {
                        tri.res += " и " + EDINICI(parseInt(s[2], 10), EXP_TO_ROD[tri.exp]);
                        tri.hasI = true;
                    }
                }
            }
        }
    }
    
    let res = "";
    for (let i=0, len=triList.length; i<len; i++) {
        res += triList[i].res + " ";
        let triExp = Math.floor(triList[i].exp / 3);
        if (triExp >= 1) {
            let isPluralI = triList[i].isPlural ? 1 : 0;
            res += TRIEXPONENTS[triExp][isPluralI] + " ";
        }
        if (i === triList.length-2 && !triList[i+1].hasI) {
            res += "и ";
        }
    }
    res = res.trim();
    if (!isPlus) {
        res = "минус " + res;
    }
    
    return res;
}

export function sDumi(suma, valuta="лв.") {
    let s = sDumiCialaChast(Math.trunc(suma)) + " " + valuta;
    let stot = frac(suma);
    stot = leftPad(stot, 2, "0");
    s += ` и ${stot} ст.`;
    // first char should be upper case
    if (s.length > 0) {
        s = s.charAt(0).toUpperCase() + s.slice(1);
    }
    return s;
}