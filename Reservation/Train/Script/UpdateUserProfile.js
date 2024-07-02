const form = document.querySelector('#form')
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const phonenumber = document.querySelector('#phonenumber');
const address = document.querySelector('#address');


console.log('gvghj')
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!validateInputs()){
        e.preventDefault();
    }
})

function validateInputs(){
    const usernameVal = username.value.trim()
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();
    const phonenumberVal = phonenumber.value.trim();
    const addressVal = address.value.trim();

    let success = true

    if(usernameVal===''){
        success=false;
        setError(username,'Username is required')
    }
    else{
        setSuccess(username)
    }

    if(emailVal===''){
        success = false;
        setError(email,'Email is required')
    }
    else if(!validateEmail(emailVal)){
        success = false;
        setError(email,'Please enter a valid email')
    }
    else{
        setSuccess(email)
    }

    if(passwordVal === ''){
        success= false;
        setError(password,'Password is required')
    }
    else if(passwordVal.length<8){
        success = false;
        setError(password,'Password must be atleast 8 characters long')
    }
    else{
        setSuccess(password)
    }

    function validateNumber(input) {
        const numberRegex = /^\d+$/;
        return numberRegex.test(input);
    }

 
    if(phonenumberVal === ''){
        success= false;
        setError(phonenumber,'Phone Number is required')
    }
    else if (!validateNumber(phonenumberVal)) {
        success= false;
        setError(phonenumber,'Only Numbers are allowed')
    }
    else if(phonenumberVal.length>10){
        success = false;
        setError(phonenumber,'Phone Number should not Exeed 10 Numbers')
    }
    else if(phonenumberVal.length<10){
        success = false;
        setError(phonenumber,'Phone Number should not be less than 10 Numbers')
    }
    else{
        setSuccess(phonenumber)
    }

    if(addressVal === ''){
        success= false;
        setError(address,'Address is required')
    }
    else if(addressVal.length<10){
        success = false;
        setError(address,'Address must be atleast 10 characters long')
    }
    else{
        setSuccess(address)
    }

 



    return success;

}
//element - password, msg- pwd is reqd
function setError(element,message){
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error')

    errorElement.innerText = message;
    inputGroup.classList.add('error')
    inputGroup.classList.remove('success')
}

function setSuccess(element){
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error')

    errorElement.innerText = '';
    inputGroup.classList.add('success')
    inputGroup.classList.remove('error')
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };