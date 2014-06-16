function integrate(func, variable, from, to){
    var functionIntegrate = (function(func, variable, from, to){
        "use strict";
        var originalFunction = func,
            varToIntegrate   = variable,
            from = parseFloat(from) || '',
            to   = parseFloat(to) ||  '';
        var inizializeArray = function (lenght, contain) {
            var array =[];
            for(var i= 0; i < lenght; i++){
                array[i]=contain;
            }
            return array;
        }
        var removeParentheses = function (string) {
            var withoutPrefixSufix = string.split('').slice(1, string.length-1).join('');
            return withoutPrefixSufix;
        }
        /**
         * @return {string}
         */
        var detectExponentials = function (string){
            if(/^(\^)((\-|\+)*?[0-9])/g.test(string)){
                var arrayString = string.split('');
                var concatString = '';
                for(var i = 1; i < arrayString.length; i++){
                    if(/(\-|\+)|[0-9]/g.test(arrayString[i])){
                        concatString.concat(arrayString[i]);
                    }else{
                        break;
                    }
                }
                return concatString;
            }else{
                return null;
            }
        }
        /**
         * @return {boolean}
         */
        var onlyNumbers = function (string) {
            return !/[\+\-0-9\.]/g.test(string);
        }
        /**
         * @return {boolean}
         */
        var onlyletters = function (string) {
            return !/[a-zA-Z]/g.test(string);

        }
        /**
         * @return {boolean}
         */
        var atLeastaLetterOrNumber = function (string){
            return /[a-zA-z0-9]/g.test(string);
        }

        var validate = function () {
            return{
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
                    var separators = ['\\*', '/'];
                    var tokens = originalFunction.split(new RegExp(separators.join('|'), 'g'));
                    return tokens.indexOf('') != -1;
                }
            }
        };
        var separate = function () {
            //convert equation in arrays
            var ConvertArray = function  (arrayEquation){
                var functionSort = [],
                    countMax = [],
                    statusCount = false;
                for (var i = 0, j = 0, a = '(', b = ')', count = 0; i < arrayEquation.length; ){
                    functionSort[j] = '';
                    countMax[j] = false;
                    while( i < arrayEquation.length && (statusCount || arrayEquation[i] === a)){
                        functionSort[j] = functionSort[j] + arrayEquation[i];
                        if(count === 0){
                            b = [a, a = b][0];
                            count++;
                            countMax[j] = true;
                        }else if (arrayEquation[i] === b && b === '(') {
                            count++;
                        }else if( statusCount && arrayEquation[i] === a && a === ')' ){
                            count--;
                        }
                        if(count){
                            statusCount = true;
                        }else{
                            b = [a, a = b][0];
                            j++;
                            statusCount = false;
                        }
                        i++;
                    }
                    while(arrayEquation[i] && arrayEquation[i] !== '(' ){
                        if(functionSort[j] === undefined ){
                            functionSort[j] = arrayEquation[i];
                            countMax[j] = false;
                        }else{
                            functionSort[j] = functionSort[j]+arrayEquation[i];
                        }
                        i++;
                        if( arrayEquation[i] === '(' ) {
                            j++;
                        }
                    }
                }
                return [functionSort,countMax];
            }

            var createParentheses = function (a, b) {
                return '('+a+'/'+b+')';
            }
            var createParentheses1 = function (varLeft, currentlyPos, nextPos) {
                return '('+varLeft+'/'+ nextPos+')';
            }
            function separateBySlash (equation, i) {
                var indexSlash = equation[0][i].indexOf('/');
                var exponential = detectExponentials( equation[0][i] ) || 0;
                //detectExponentials(equation[0][i]);
                //end of statement after the slash sign
                var condition1 = equation[0][i].charAt( indexSlash + 1) === '';
                //statement before slash sign
                var condition2 = indexSlash === 0;

                if( condition1 && condition2) {
                    var divisionWithParentheses = createParentheses( equation[0][i-1], equation[0][i+1] );
                    equation[0].slice( i-1, i+1, divisionWithParentheses);
                    equation[1].slice( i-1, i+1, true);
                    return equation;

                }else if(!condition1 && condition2 ) {

                    return equation;
                }else if( condition1 && !condition2 ) {
                    var varLeft = indexSlash-1;///Im-here
                    var divisionWithParentheses = createParentheses1(ecuation[0][i].charAt(varLeft), equation[0][i], equation[0][i+1]);

                    var arrayParenthesis = createParentheses( equation[0][i] );
                    equation[0][i] = equation[0][i-1] + '/' + arrayParenthesis[0] + ')';

                    return equation;
                }else if( !condition1 && !condition2 ){
                    return equation;
                }

                return equation;
            }
            return{
                loopByParentheses: function (tmpArray) {
                    var arrayEquation = ( tmpArray )? tmpArray : originalFunction;
                    var i = 0;
                    var arrayEq = arrayEquation.split('');
                    var functionInArray = ConvertArray(arrayEq);
                    console.log(functionInArray);
                    do {
                        if(functionInArray[1][i]){
                            var withoutParentheses = removeParentheses(functionInArray[0][i]);
                            functionInArray[0][i] = [functionInArray[0][i], this.loopByParentheses( withoutParentheses )];
                        }else if( functionInArray[0][i].indexOf('/') != -1 ){
                                functionInArray = separateBySlash(functionInArray, i);
                                console.log(functionInArray);
                        }
                        i++;
                    }
                    while (functionInArray[1].length > i);
                    return functionInArray;
                }

            }
        };
        return {
            index:function(){
                //check variables
                var validateFunction = validate();
                if(variable ===''){
                    return "Define variable to integrate";
                }else if(validateFunction.validateVar()){
                    return variable+" isn't in "+func;
                }else if(validateFunction.validateOperators()){
                    return "It's not valid";
                }else if(validateFunction.parenthesesCheck()){ //separate formula
                    return "There is 1 more opening parenthesis";
                }
                //Separate by parenthesis
                var separateFunction = separate();
                var arraySeparated = separateFunction.loopByParentheses();
                console.log(arraySeparated);

                return from;
            }
        }
    })(func, variable, from, to);
    return functionIntegrate.index();
}