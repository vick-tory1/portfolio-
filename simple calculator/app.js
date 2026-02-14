function getHistory(){
    return document.getElementById("history-value").innerText;
}
// alert(getHistory())

function printHistory(num){
    document.getElementById("history-value").innerText = num;
}

// printHistory("777777777") 
// alert(getHistory())

function getOutput(){
   return document.getElementById("output-value").innerText
}
// alert (getOutput())

function printOutput(num){
    if(num=="") {
        document.getElementById("output-value").innerText = num;
    }
    else{
        document.getElementById("output-value").innerText = getFormattedNumber(num);
    }
}

// printOutput("")

function getFormattedNumber(num){
    let n = Number(num);
    let value = n.toLocaleString("en");
    return value;
}

// printOutput("")

function reverseNumberformat(num){
    if (num === "" || num === null || num === undefined) return "";
    return num.toString().replace(/,/g,"");
}
// printOutput("2345234")

// alert(reverseNumberformat(getOutput()))

function isOperator(ch){
    return ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '%';
}

function evaluateExpression(expr){
    // normalize unicode operators
    expr = expr.replace(/×/g, '*').replace(/\u00F7/g, '/').replace(/÷/g, '/');
    // allow only safe characters (digits, operators, parentheses, decimal point, spaces)
    if (!/^[0-9+\-*/().%\s]+$/.test(expr)) return NaN;
    try{
        // use Function to evaluate in this context
        return Function('return ' + expr)();
    }catch(e){
        return NaN;
    }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', function(){
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');

    numberButtons.forEach(btn => {
        btn.addEventListener('click', function(){
            const id = this.id;
            if(id === '='){
                // treat as equals
                const hist = getHistory();
                let out = getOutput();
                let expression = hist || '';
                if(out !== ''){
                    expression += reverseNumberformat(out);
                }
                if(expression === '') return;
                // remove trailing operator
                if(isOperator(expression[expression.length-1])){
                    expression = expression.slice(0,-1);
                }
                const result = evaluateExpression(expression);
                printOutput(result === undefined || isNaN(result) ? '' : result.toString());
                printHistory('');
            } else if(id === '.'){
                // add decimal point
                let out = getOutput();
                let raw = reverseNumberformat(out);
                // only add decimal if there isn't one already
                if(!raw.includes('.')){
                    raw = raw === '' ? '0.' : raw + '.';
                    printOutput(raw);
                }
            } else {
                // append digit
                let out = getOutput();
                let raw = reverseNumberformat(out);
                raw = raw === '' ? '' : raw.toString();
                raw = raw + id;
                printOutput(raw);
            }
        });
    });

    operatorButtons.forEach(btn => {
        btn.addEventListener('click', function(){
            const id = this.id;
            if(id === 'clear'){
                printHistory('');
                printOutput('');
            } else if(id === 'backspace'){
                let out = getOutput();
                if(out !== ''){
                    out = reverseNumberformat(out);
                    out = out.toString();
                    out = out.slice(0, -1);
                    printOutput(out);
                }
            } else if(id === 'delete'){
                let out = getOutput();
                if(out !== ''){
                    out = reverseNumberformat(out);
                    out = out.toString();
                    out = out.slice(0, -1);
                    printOutput(out);
                }
            } else if(id === '%'){
                let out = getOutput();
                if(out !== ''){
                    let val = Number(reverseNumberformat(out));
                    val = val / 100;
                    printOutput(val.toString());
                } else {
                    // if no current output but history exists, apply percent to last number
                    let hist = getHistory();
                    if(hist){
                        // attempt to compute
                        const res = evaluateExpression(hist);
                        if(!isNaN(res)){
                            printOutput((res/100).toString());
                            printHistory('');
                        }
                    }
                }
            } else {
                // other operators (+ - * /)
                let out = getOutput();
                let hist = getHistory();
                if(out === '' && hist === '') return;
                if(out === '' && hist !== ''){
                    // replace trailing operator if present
                    if(isOperator(hist[hist.length-1])){
                        hist = hist.slice(0, -1) + id;
                        printHistory(hist);
                    }
                } else if(out !== ''){
                    hist = (hist || '') + reverseNumberformat(out) + id;
                    printHistory(hist);
                    printOutput('');
                }
            }
        });
    });
});