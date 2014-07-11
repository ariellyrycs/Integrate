var functionIntegrate = (function () {
    "use strict";
    var from,
        to,
        originalFunction,
        varToIntegrate,
        arraySeparated,
        removeParentheses = function (string) {
            return string.slice(1, string.length - 1);
        },
        createParentheses = function (a, b, character) {
            return '(' + a + character + b + ')';
        },
        power = function (base, exponent) {
            if (exponent === 0) {
                return 1;
            }
            return base * power(base, exponent - 1);
            //example console.log(power(2,2) === 4);
        },
        /**
         * @return {boolean}
         */
        detectSpecificSymbol = function (string, symbol) {
            return string.indexOf(symbol) !== -1;
        },
        detectSymbols = function (string) {
            return (/^(\^)|(\/)/g.test(string));
        },
        /**
         * @return {string}
         */
        findExponentsDigits = function (string) {
            if (/^(\^)((\-|\+)*?[0-9])/g.test(string)) {
                var arrayString = string.split(''),
                    concatString = '',
                    i;
                for (i = 1; i < arrayString.length; i += 1) {
                    if (/(\-|\+)|[0-9]/g.test(arrayString[i])) {
                        concatString = concatString.concat(arrayString[i]);
                    } else {
                        break;
                    }
                }
                return concatString;
            }
            return '';
        },
        /**
         * @return {boolean}
         */
        exponent = function (string) { // syntax of exponent there?
            return string.indexOf('^') !== -1;
        },
        /**
         * @return {boolean}
         */
        /*var onlyNumbers = function (string) {
            return !/[\+\-0-9\.]/g.test(string);
        };*/
        /**
         * @return {boolean}
         */
        /*var onlyletters = function (string) {
            return !/[a-zA-Z]/g.test(string);

        }*/
        /**
         * @return {boolean}
         */
        /*var atLeastaLetterOrNumber = function (string){
            return /[a-zA-z0-9]/g.test(string);
        };*/
        /*var inizializeArray = function (lenght, contain) {
         var array =[];
         for(var i= 0; i < lenght; i++){
         array[i]=contain;
         }
         return array;
         };*/
        validate = function () {
            return {
                /**
                 * @return {boolean}
                 */
                validateVar: function () {
                    return originalFunction.indexOf(varToIntegrate) === -1;
                },
                /**
                 * @return {boolean}
                 */
                parenthesesCheck: function () {
                    return originalFunction.split(/[\[\(]/).length !== originalFunction.split(/[\]\)]/).length;
                },
                /**
                 * @return {boolean}
                 */
                validateOperators: function () {
                    var separators = ['\\*', '/'],
                        tokens = originalFunction.split(new RegExp(separators.join('|'), 'g'));
                    return tokens.indexOf('') !== -1;
                }
            };
        },
        separate = function () {
            //convert equation in arrays
            var ConvertArray = function (arrayEquation) {
                var functionSort = [],
                    countMax = [],
                    statusCount = false,
                    i = 0,
                    j = 0,
                    a = '(',
                    b = ')',
                    count = 0;
                while (i < arrayEquation.length) {
                    countMax[j] = false;
                    while (i < arrayEquation.length && (statusCount || arrayEquation[i] === a)) {
                        functionSort[j] = (functionSort[j]) ? functionSort[j] + arrayEquation[i] : arrayEquation[i];
                        if (count === 0) {
                            b = [a, a = b][0];
                            count += 1;
                            countMax[j] = true;
                        } else if (arrayEquation[i] === b && b === '(') {
                            count += 1;
                        } else if (statusCount && arrayEquation[i] === a && a === ')') {
                            count -= 1;
                        }
                        if (count) {
                            statusCount = true;
                        } else {
                            b = [a, a = b][0];
                            j += 1;
                            statusCount = false;
                        }
                        i += 1;
                    }
                    while (arrayEquation[i] && arrayEquation[i] !== '(') {
                        if (functionSort[j] === undefined) {
                            functionSort[j] = arrayEquation[i];
                            countMax[j] = false;
                        } else {
                            functionSort[j] = (functionSort[j]) ? functionSort[j] + arrayEquation[i] : arrayEquation[i];
                        }
                        i += 1;
                        if (arrayEquation[i] === '(') {
                            j += 1;
                        }
                    }
                }
                return [functionSort, countMax];
            },
                /**
                 * @return {string}
                 */
                unpackArray = function (array) {
                    var string;
                    if (typeof array === 'string') {
                        string = array;
                    } else {
                        string = unpackArray(array[0]);
                    }
                    return string;
                },
                unpackArrayBoolean = function (array, i) {
                    var boolean,
                        filtered;

                    function hello(value) {
                        return value;
                    }
                    if (array[1][i]) {
                        boolean = array[1][i];
                    } else {
                        filtered = array[0][i][1].filter(hello);
                    }
                    return boolean;
                },
                spliceMe = function () {
                    var i;
                    for (i in this) {
                        if (this.hasOwnProperty(i)) {
                            Array.prototype.splice.apply(this[i], arguments[i]);
                        }
                    }
                    return this;
                },
                separateByCharacter = function (i, character) {

                    var indexSlash = arraySeparated[0][i].indexOf(character),
                        //exponential = findExponentsDigits(arraySeparated[0][i]) || 0,
                        divisionWithParentheses = '',
                        condition1 = arraySeparated[0][i].charAt(indexSlash + 1) === '', //end of statement after the slash sign
                        condition2 = !indexSlash, //statement before slash sign
                        condition_1 = !arraySeparated[0][i].slice(0, indexSlash - 1),// (characters between de first character and the slash) === 0
                        condition_2 = !arraySeparated[0][i].slice(indexSlash + 2),// (characters between de slash and the next sentence) === 0
                        spliceFormula,
                        spliceBoolean,
                        lastParentheses,
                        firstParentheses;
                    // spliceMe
                    //case 1 (a*a)/(a*a)
                    if (condition1 && condition2) {
                        divisionWithParentheses = createParentheses(unpackArray(arraySeparated[0][i - 1]), unpackArray(arraySeparated[0][i + 1]), character);
                        spliceFormula = [i - 1, 3, divisionWithParentheses];
                        spliceBoolean = [i - 1, 3, true];
                        lastParentheses = arraySeparated[0][i - 1];
                        firstParentheses = arraySeparated[0][i + 1];
                    //case 2 (a*a)/a(a*a)
                    } else if (!condition1 && condition2) {
                        divisionWithParentheses = createParentheses(unpackArray(arraySeparated[0][i - 1]), arraySeparated[0][i].charAt(indexSlash + 1), character);

                        //case 1: (b*b)/b(b)
                        if (condition_2) {
                            spliceFormula = [i - 1, 2, divisionWithParentheses];
                            spliceBoolean = [i - 1, 2, true];
                        //case 1: (b*b)/bb(b)
                        } else {
                            spliceFormula = [i - 1, 2, divisionWithParentheses, arraySeparated[0][i].slice(2)];
                            spliceBoolean = [i - 1, 2, true, false];
                        }
                        lastParentheses = arraySeparated[0][i - 1];
                    //case 3 (a*a)a/(a*a)
                    } else if (condition1 && !condition2) {
                        divisionWithParentheses = createParentheses(arraySeparated[0][i].charAt(indexSlash - 1), unpackArray(arraySeparated[0][i + 1]), character);

                        //case 1: (b*b)b/(b*b)
                        if (condition_1) {
                            spliceFormula = [i, 2, divisionWithParentheses];
                            spliceBoolean = [i, 2, true];
                        //case 2: (b*b)bb/(b*b)
                        } else {
                            spliceFormula = [i, 2, arraySeparated[0][i].slice(0, indexSlash - 1), divisionWithParentheses];
                            spliceBoolean = [i, 2, false, true];
                        }
                        firstParentheses = arraySeparated[0][i + 1];
                    //case 2 (a*a)a/a(a*a)
                    } else if (!condition1 && !condition2) {
                        divisionWithParentheses = createParentheses(arraySeparated[0][i].charAt(indexSlash - 1), arraySeparated[0][i].charAt(indexSlash + 1), character);

                        //case 1: (b*b)b/b(b*b)
                        if (condition_1 && condition_2) {
                            spliceFormula = [i, 1, divisionWithParentheses];
                            spliceBoolean = [i, 1, true];
                        //case 2: (b*b)bb/b(b*b)
                        } else if (!condition_1 && condition_2) {
                            spliceFormula = [i, 1, arraySeparated[0][i].slice(0, indexSlash - 1), divisionWithParentheses];
                            spliceBoolean = [i, 1, false, true];
                        //case 3: (b*b)b/bb(b*b)
                        } else if (condition_1 && !condition_2) {
                            spliceFormula = [i, 1, divisionWithParentheses, arraySeparated[0][i].slice(indexSlash + 2)];
                            spliceBoolean = [i, 1, true, false];
                        //case 4: (b*b)bb/bb(b*b)
                        } else if (!condition_1 && !condition_2) {
                            spliceFormula = [i, 1, arraySeparated[0][i].slice(0, indexSlash - 1), divisionWithParentheses, arraySeparated[0][i].slice(indexSlash + 2)];
                            spliceBoolean = [i, 1, false, true, false];
                        }
                    }
                    arraySeparated = spliceMe.apply(arraySeparated, [spliceFormula, spliceBoolean]);
                    return true;
                },
                loopSeparateSymbols = function (character, newSectionArray) {
                    var i = 0,
                        withoutParentheses,
                        arraySplited;

                    newSectionArray = newSectionArray || arraySeparated;
                    while (i < newSectionArray[1].length - 1) {
                        if (newSectionArray[1][i]) {
                           /* withoutParentheses = removeParentheses(newSectionArray[0][i]);*/
                            loopSeparateSymbols(character, newSectionArray[0][i]);
                        } else if (newSectionArray[0][i].indexOf(character) !== -1) {
                            arraySplited = separateByCharacter(i, character);
                        }
                        i += 1;
                        /*if (newSectionArray[1][i]) {

                            newSectionArray[0][i] = [newSectionArray[0][i], loopSeparateSymbols(character, withoutParentheses)];
                        }*/
                    }
                    return arraySplited;
                };
            return {
                loopByParentheses: function (tmpArray) {
                    var arrayEquation = tmpArray || originalFunction,
                        i = 0,
                        arrayEq = arrayEquation.split(''),
                        functionInArray = new ConvertArray(arrayEq),
                        withoutParentheses;
                    do {
                        if (functionInArray[1][i]) {
                            withoutParentheses = removeParentheses(functionInArray[0][i]);
                            functionInArray[0][i] = [functionInArray[0][i], this.loopByParentheses(withoutParentheses)];
                        }
                        i += 1;
                    } while (functionInArray[1].length > i);
                    return functionInArray;
                },
                separateBySymbols: function () {
                    //control of symbols and order by priority
                    arraySeparated = /(\^)/g.test(originalFunction) ? loopSeparateSymbols('^') : originalFunction;
                    arraySeparated = /(\/)/g.test(originalFunction) ? loopSeparateSymbols('/') : originalFunction;
                }
            };
        };
    return {
        integrateIndex: function (tryEq, variable, fromParam, toParam) {
            from = parseFloat(fromParam) || '';
            to   = parseFloat(toParam) ||  '';
            originalFunction = tryEq;
            varToIntegrate = variable;
            //check variables
            var validateFunction = validate(),
                separateFunction;
            if (variable === '') {
                return "Define variable to integrate";
            }
            if (validateFunction.validateVar()) {
                return variable + " isn't in " + tryEq;
            }
            if (validateFunction.validateOperators()) {
                return "It's not valid";
            }
            if (validateFunction.parenthesesCheck()) { //separate formula
                return "There is 1 more opening parenthesis";
            }
            //Separate by parenthesis
            separateFunction = separate();
            arraySeparated = separateFunction.loopByParentheses();
            arraySeparated = (detectSymbols(originalFunction)) ? separateFunction.separateBySymbols() : arraySeparated;
            //console.log(arraySeparated);

            return from;
        }
    };
}());