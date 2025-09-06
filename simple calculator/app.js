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
    return Number(num.replace(/,/g,""))
}
// printOutput("2345234")

// alert(reverseNumberformat(getOutput()))