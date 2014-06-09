function integrate(func, variable, from, to){
    var FunctionIntegrate = (function(func, variable, from, to){
        "use strict";
        var OriginalFunction = func;
        var VarToIntegrate = variable;
        var From = parseFloat(from) || '';
        var	To = parseFloat(to) ||  '';
        var Validate = function () {
            return{
                ValidateVar: function () {
                    if (OriginalFunction.indexOf(VarToIntegrate) === -1) {
                        return true;
                    }
                },
                ParenthesesCheck: function () {
                    if (OriginalFunction.split(/[\[\(]/).length !== OriginalFunction.split(/[\]\)]/).length) {
                        return true;
                    }
                },
                ValidateOperators: function () {
                    var separators = ['\\*', '/'];
                    var tokens = OriginalFunction.split(new RegExp(separators.join('|'), 'g'));
                    if (tokens.indexOf("") != -1) {
                        return true;
                    }
                }
            }
        };
        var Separate = function () {
            return{
                ConvertArray : function (ArrayF){
                    var FunctionSort = [];
                    var CountMax= [];
                    var StatusCount = false;
                    for (var i=0, j=0, a="(", b=")",count=0; i < ArrayF.length; i++){
                        FunctionSort[j] = "";
                        CountMax[j] = 0;
                        while( i < ArrayF.length && (StatusCount || ArrayF[i] !== a)){
                            FunctionSort[j] = FunctionSort[j]+ArrayF[i];
                            if (ArrayF[i] === b && b === "(") {
                                count++;
                                CountMax[j]++;
                            }
                            if( StatusCount && ArrayF[i] === a && a === ")" ){
                                count--;
                            }
                            StatusCount = ( count !== 0 )? true: false;
                            i++;
                        }
                        j = ( FunctionSort[j] !== '' )? j+1: j;
                        b = [a, a = b][0];
                    }
                    return [FunctionSort,CountMax];
                },
                LoopByParentheses: function (tmpArray) {
                    console.log(tmpArray)
                    var ArrayEquation =(tmpArray)? tmpArray : OriginalFunction;
                    var i=0;
                    do {
                        var ArrayF = ArrayEquation.split('');
                        var FunctionInArray = this.ConvertArray(ArrayF);
                        console.log(FunctionInArray);
                        console.log(FunctionInArray[1].indexOf(0));
                        if (FunctionInArray[1].indexOf(0) < FunctionInArray.length+1 ) {
                            console.log('callback');
                            this.LoopByParentheses( FunctionInArray[0][i] );
                        }
                       // console.log(FunctionInArray);
                        i++;
                    }
                    while (FunctionInArray.length-1 > i);
                    return FunctionInArray;
                }

            }
        };
        return {
            index:function(){
                //check variables
                var ValidateFunction = Validate();
                if(variable ===''){
                    return "Define variable to integrate";
                }else if(ValidateFunction.ValidateVar()){
                    return variable+" isn't in "+func;
                }else if(ValidateFunction.ValidateOperators()){
                    return "It's not valid";
                }else if(ValidateFunction.ParenthesesCheck()){ //separate formula
                    return "There is 1 more opening parenthesis";
                }
                //Separate by parenthesis
                var SeparateFunction = Separate();
                var ArraySeparated = SeparateFunction.LoopByParentheses();
                console.log(ArraySeparated);




                return From;
            }
        }
    })(func, variable, from, to);
    return FunctionIntegrate.index();
}