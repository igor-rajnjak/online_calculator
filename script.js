var calc = function(stringInput) {

    // parse input to get numbers (positive, negative, decimals), operators and parenthesis
    var parseAllElements = /([0-9]+\.?[0-9]*)|(\()|(\))|(\+)|(\-)|(\*)|(\/)/,
        stringArray = stringInput.split(parseAllElements),
        stringArray = stringArray.filter(x => ((x !== undefined && x !== "") && x !== " ")),
        positionOfMinus = stringArray.indexOf('-');

    function fixMinuses() {
        var i = 0;
        positionOfMinus = stringArray.indexOf('-')

        if (positionOfMinus === 0) {
            if (/\-/.test(stringArray[1].toString())) {

                stringArray.splice(0, 2, Math.abs(stringArray[1]))

            } else {

                stringArray.splice(0, 2, "-" + stringArray[1])

            }

            positionOfMinus = stringArray.indexOf("-");
            fixMinuses()
        }

        for (i; i < stringArray.length; i++) {
            if (stringArray[i] === "-") {

                if (/^((\+)|(\-)|(\*)|(\/)|(\())$/.test(stringArray[i - 1]) && stringArray[i + 1] !== "(") {

                    if (/\-/.test(stringArray[i + 1].toString())) {

                        stringArray.splice(i, 2, Math.abs(stringArray[i + 1]))

                    } else {

                        stringArray.splice(i, 2, "-" + stringArray[i + 1])
                        positionOfMinus = stringArray.indexOf('-')

                    }
                }
            }
        }
    }

    // functions take part of the array (inside parens) or the whole array
    // and calculate them, returning the result
    function evaluatePrimaryOperators(arrayToBeCalculated) {

        var whereTimesIs = arrayToBeCalculated.indexOf("*"),
            whereDividedIs = arrayToBeCalculated.indexOf("/"),
            result = arrayToBeCalculated.map(function(x) { return x });

        while (whereTimesIs >= 0 || whereDividedIs >= 0) {

            // functions which take two elements beside the operator, 
            // calculate them and replace the previous elements with the result      
            function multiply() {
                result.splice(whereTimesIs - 1, 3, (Number(result[whereTimesIs - 1]) * Number(result[whereTimesIs + 1])))
            }

            function divide() {
                result.splice(whereDividedIs - 1, 3, (Number(result[whereDividedIs - 1]) / Number(result[whereDividedIs + 1])))
            }

            // if there are no multiply operators
            if (whereTimesIs === -1) {
                divide()
                    // if there are no divide operators
            } else if (whereDividedIs === -1) {
                multiply()

                // if there are both operators see which comes first and execute it  
            } else if (whereTimesIs < whereDividedIs) {
                multiply()
            } else if (whereDividedIs < whereTimesIs) {
                divide()
            };

            // set values again     
            whereTimesIs = result.indexOf("*");
            whereDividedIs = result.indexOf("/");

        };

        return result;

    };

    function evaluateSecondaryOperators(arrayToBeCalculated) {

        var wherePlusIs = arrayToBeCalculated.indexOf("+"),
            whereMinusIs = arrayToBeCalculated.indexOf("-"),
            result = arrayToBeCalculated.map(function(x) { return x });

        while (wherePlusIs >= 0 || whereMinusIs >= 0) {

            // functions which take two elements beside the operator, 
            // calculate them and replace the previous elements with the result      
            function add() {
                result.splice(wherePlusIs - 1, 3, (Number(result[wherePlusIs - 1]) + Number(result[wherePlusIs + 1])))
            }

            function subtract() {
                result.splice(whereMinusIs - 1, 3, (Number(result[whereMinusIs - 1]) - Number(result[whereMinusIs + 1])))
            }

            // if there are no plus operators
            if (wherePlusIs === -1) {
                subtract()
                    // if there are no minus operators
            } else if (whereMinusIs === -1) {
                add()

                // if there are both operators see which comes first and execute it  
            } else if (wherePlusIs < whereMinusIs) {
                add()
            } else if (whereMinusIs < wherePlusIs) {
                subtract()
            };

            // set values again     
            wherePlusIs = result.indexOf("+");
            whereMinusIs = result.indexOf("-");

        };

        return result

    };

    // fix the minuses if there are any
    if (positionOfMinus >= 0) {
        fixMinuses()
    }

    // calculate the expression until only one number is left 
    while (stringArray.length > 1) {

        // while there are parens calculate the values inside them first    
        while (stringArray.indexOf("(") >= 0) {

            var openParens = 0,
                closedParens = stringArray.indexOf(")"),
                elementsInsideParens = [],
                resultParens = [],
                elementsInsideParensLength = 0;


            // find the parens coordinates 
            function findParensCoordinates(stringArrayParens) {
                var firstOpenParens = stringArrayParens.indexOf("("),
                    firstClosedParens = stringArrayParens.indexOf(")"),
                    elementsInsideParensTest = stringArrayParens.slice(firstOpenParens + 1, firstClosedParens + 1),
                    anotherOpenParens = elementsInsideParensTest.indexOf("(");

                openParens += firstOpenParens + 1;

                if (anotherOpenParens > -1) {

                    findParensCoordinates(elementsInsideParensTest)

                } else {

                    elementsInsideParens = stringArray.slice(openParens, closedParens)
                    elementsInsideParensLength = elementsInsideParens.map(function(x) { return x }).length

                }

            }

            findParensCoordinates(stringArray)

            // evaluate the expression inside parens  

            if (elementsInsideParens.length === 1) {

                stringArray.splice(openParens - 1, 3, elementsInsideParens[0])
                fixMinuses()

            } else {

                if (elementsInsideParens.indexOf("*") >= 0 || elementsInsideParens.indexOf("/") >= 0) {

                    elementsInsideParens = evaluatePrimaryOperators(elementsInsideParens)


                }

                if (elementsInsideParens.indexOf("+") >= 0 || elementsInsideParens.indexOf("-") >= 0) {

                    elementsInsideParens = evaluateSecondaryOperators(elementsInsideParens)

                }

                stringArray.splice(openParens - 1, elementsInsideParensLength + 2, ...elementsInsideParens)
                fixMinuses()
            }


        }

        if (stringArray.indexOf("*") >= 0 || stringArray.indexOf("/") >= 0) {

            stringArray = evaluatePrimaryOperators(stringArray)

        }

        if (stringArray.indexOf("+") >= 0 || stringArray.indexOf("-") >= 0) {

            stringArray = evaluateSecondaryOperators(stringArray)
        }
    }

    // return the final array item aka result
    console.log(Number(stringArray[0]))
}