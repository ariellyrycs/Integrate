function integrate(func, variable, from, to) {
    "use strict";
    var functionIntegrate = (function (func, variable, from, to) {
        from = parseFloat(from) || '';
        to   = parseFloat(to) ||  '';
        var originalFunction = func,
            varToIntegrate   = variable,
            removeParentheses = function (string) {
                return string.slice(1, string.length - 1);
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
            detectParentheses = function (string) {
                return string.indexOf('(') !== -1;
            },
            /**
             * @return {string}
             */
            findExponents = function (string) {
                if (/^(\^)((\-|\+)*?[0-9])/g.test(string)) {
                    var arrayString = string.split(''),
                        concatString = '',
                        i;
                    for (i = 1; i < arrayString.length; i += 1) {
                        if (/(\-|\+)|[0-9]/g.test(arrayString[i])) {
                            concatString.concat(arrayString[i]);
                        } else {
                            break;
                        }
                    }
                    return concatString;
                }
                return false;
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
                        functionSort[j] = '';
                        countMax[j] = false;
                        while (i < arrayEquation.length && (statusCount || arrayEquation[i] === a)) {
                            functionSort[j] = functionSort[j] + arrayEquation[i];
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
                                functionSort[j] = functionSort[j] + arrayEquation[i];
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
                    createParentheses = function (a, b) {
                        return '(' + a + '/' + b + ')';
                    },
                    unpackArray = function (array) {
                        var string;
                        if (typeof array === 'string') {
                            string = array;
                        } else {
                            string = unpackArray(array[0]);
                        }
                        return string;
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
                    separateBySlash = function (equation, i) {

                        var indexSlash = equation[0][i].indexOf('/'),
                            exponential = findExponents(equation[0][i]) || 0,
                            divisionWithParentheses = '',
                            condition1 = equation[0][i].charAt(indexSlash + 1) === '', //end of statement after the slash sign
                            condition2 = !indexSlash, //statement before slash sign
                            condition_1 = !equation[0][i].slice(0, indexSlash - 1),// (characters between de first character and the slash) === 0
                            condition_2 = !equation[0][i].slice(indexSlash + 2),// (characters between de slash and the next sentence) === 0
                            spliceFormula,
                            spliceBoolean;
                        // spliceMe
                        //case 1 (a*a)/(a*a)
                        if (condition1 && condition2) {
                            divisionWithParentheses = createParentheses(unpackArray(equation[0][i - 1]), unpackArray(equation[0][i + 1]));
                            spliceFormula = [i - 1, 3, divisionWithParentheses];
                            spliceBoolean = [i - 1, 3, true];
                        //case 2 (a*a)/a(a*a)
                        } else if (!condition1 && condition2) {
                            divisionWithParentheses = createParentheses(unpackArray(equation[0][i - 1]), equation[0][i].charAt(indexSlash + 1));

                            //case 1: (b*b)/b(b)
                            if (condition_2) {
                                spliceFormula = [i - 1, 2, divisionWithParentheses];
                                spliceBoolean = [i - 1, 2, true];
                            //case 1: (b*b)/bb(b)
                            } else {
                                spliceFormula = [i - 1, 2, divisionWithParentheses, equation[0][i].slice(2)];
                                spliceBoolean = [i - 1, 2, true, false];
                            }
                        //case 3 (a*a)a/(a*a)
                        } else if (condition1 && !condition2) {
                            divisionWithParentheses = createParentheses(equation[0][i].charAt(indexSlash - 1), unpackArray(equation[0][i + 1]));

                            //case 1: (b*b)b/(b*b)
                            if (condition_1) {
                                spliceFormula = [i, 2, divisionWithParentheses];
                                spliceBoolean = [i, 2, true];
                            //case 2: (b*b)bb/(b*b)
                            } else {
                                spliceFormula = [i, 2, equation[0][i].slice(0, indexSlash - 1), divisionWithParentheses];
                                spliceBoolean = [i, 2, false, true];
                            }
                        //case 2 (a*a)a/a(a*a)
                        } else if (!condition1 && !condition2) {
                            divisionWithParentheses = createParentheses(equation[0][i].charAt(indexSlash - 1), equation[0][i].charAt(indexSlash + 1));

                            //case 1: (b*b)b/b(b*b)
                            if (condition_1 && condition_2) {
                                spliceFormula = [i, 1, divisionWithParentheses];
                                spliceBoolean = [i, 1, true];
                            //case 2: (b*b)bb/b(b*b)
                            } else if (!condition_1 && condition_2) {
                                spliceFormula = [i, 1, equation[0][i].slice(0, indexSlash - 1), divisionWithParentheses];
                                spliceBoolean = [i, 1, false, true];
                            //case 3: (b*b)b/bb(b*b)
                            } else if (condition_1 && !condition_2) {
                                spliceFormula = [i, 1, divisionWithParentheses, equation[0][i].slice(indexSlash + 2)];
                                spliceBoolean = [i, 1, true, false];
                            //case 4: (b*b)bb/bb(b*b)
                            } else if (!condition_1 && !condition_2) {
                                spliceFormula = [i, 1, equation[0][i].slice(0, indexSlash - 1), divisionWithParentheses, equation[0][i].slice(indexSlash + 2)];
                                spliceBoolean = [i, 1, false, true, false];
                            }
                        }
                        equation = spliceMe.apply(equation, [spliceFormula, spliceBoolean]);
                        return equation;
                    },
                    separateBycircumflex = function (equation, i) {
                        var indexPower = equation[0][i].indexOf('^');



                    };
                return {
                    loopByParentheses: function (tmpArray) {
                        var arrayEquation = tmpArray || originalFunction,
                            i = 0,
                            arrayEq = arrayEquation.split(''),
                            functionInArray = new ConvertArray(arrayEq),
                            withoutParentheses,
                            power;
                        do {
                            if (functionInArray[1][i]) {
                                power = findExponents(functionInArray[1][i]);
                                if (power) {
                                    separateBycircumflex(functionInArray, i, power);
                                }
                                separateBycircumflex(functionInArray, i);
                                withoutParentheses = removeParentheses(functionInArray[0][i]);
                                functionInArray[0][i] = [functionInArray[0][i], this.loopByParentheses(withoutParentheses)];
                            } else if (functionInArray[0][i].indexOf('/') !== -1) {
                                functionInArray = separateBySlash(functionInArray, i);
                                //console.log(functionInArray);
                            }
                            i += 1;
                        } while (functionInArray[1].length > i);
                        return functionInArray;
                    }
                };
            };
        return {
            index: function () {
                //check variables
                var validateFunction = validate(),
                    separateFunction,
                    arraySeparated;
                if (variable === '') {
                    return "Define variable to integrate";
                }
                if (validateFunction.validateVar()) {
                    return variable + " isn't in " + func;
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
                //console.log(arraySeparated);

                return from;
            }
        };
    }(func, variable, from, to));
    return functionIntegrate.index();
}