const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");
// set password length
function handleSlider(){
     inputSlider.value=passwordLength;
     lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadwo=`0px 0px 12px 1px ${color}`;
}
//get random integer
function getRndInteger(min, max) {
       return Math.floor(Math.random()*(max-min))+min;
}
//get random number
function generateRandomNumber(){
    return getRndInteger(0,9);
}
// get random lower case alphabate
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
// get random upper case alphabate
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
// get random symbol
function generateSymbol() {
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
// strength calculation
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
//copy to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}
// handle input of input slider 
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
// handle copy button
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    })
    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
//check boxes handling
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
// shuffling the password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// main generate button wala function
generateBtn.addEventListener('click',()=>{
    if(checkCount <= 0) 
    return;

    if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
    }
    // let's start the jouney to find new password
    
    //remove old password
    password = "";

    let funcArray=[];
    
    if(uppercaseCheck.checked)
        funcArray.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArray.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArray.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArray.push(generateSymbol);
    //compulsory addition
    for(let i=0; i<funcArray.length; i++) {
        password += funcArray[i]();
    }
    // remaining addition
    for(let i=0; i<passwordLength-funcArray.length; i++) {
        let randIndex = getRndInteger(0 , funcArray.length);
        // console.log("randIndex" + randIndex);
        password += funcArray[randIndex]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));
    // set password in the ui 
    passwordDisplay.value=password;
    // calculate strength
    calcStrength();
})