const form = document.querySelector('#form')
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const phonenumber = document.querySelector('#phonenumber');
const address = document.querySelector('#address');
const disability = document.querySelector('#disability');
const gender = document.querySelector('#gender');

async function populateDetails(element){
    username.value = element.name
    email.value = element.email
    phonenumber.value = element.phoneNumber
    address.value = element.address
    if(element.disability===false){
        disability.value = "No"
    }else{
        disability.value = "Yes"
    }
    gender.value = element.gender
}

document.addEventListener('DOMContentLoaded', async function() {

    const userid = localStorage.getItem('userid')
    if(userid == null){
        Toastify({
            text: "Hey Admin, Login to See Profile! Redirecting...",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            callback: function() {
                window.open('AdminHome.html'); // Redirect after toast disappears
            }
        }).showToast();
    }else{
    // Fetch Profile from backend
    await fetchClasses();

    // Function to fetch classes from backend
    async function fetchClasses() {

        const adminid = localStorage.getItem('userid')
        console.log(parseInt(adminid))
        await fetch('http://localhost:5062/api/Admin/AdminProfile', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parseInt(adminid))
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await res.json();
            console.log(data)
            await populateDetails(data)
            // classesn = await populateClassesDropdown(data); // Populate dropdown with fetched data

        })
        .catch(error => {
            console.error('Error fetching User:', error);
            alert('Failed to fetch User. Please try again later.');
        });
    }
}
})




function addRegister(){
    if(disability.value == "Yes"){
        disability.value = true
    }else{
        disability.value = false
    }
    console.log("dis value"+disability.value)
    fetch('http://localhost:5062/api/Admin/AdminRegister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            "name": username.value.trim(),
            "email": email.value.trim(),
            "phoneNumber": phonenumber.value.trim(),
            "gender": gender.value,
            "disability": disability.value === 'Yes',
            "address": address.value.trim(),
            "password": password.value.trim()
        })
    })
    .then(async res => {
        const data = await res.json();
        console.log(data)
        if (!res.ok) {
            console.log(data.errorCode)
            // alert(data.message);
            Toastify({
                text: data.message,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            // alert('Hey User, Registered Successfully!');
            Toastify({
                text: "Hey User, Profile Updated Successfully! Redirecting...",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                  window.open('AdminHome.html'); // Redirect after toast disappears
                }
            }).showToast();
        }
    })
    .catch(error => {
        alert(error);
    });
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(gender.value+" "+disability.value)
    if(!validateInputs()){
        console.log('1')
        return
    }else{
        console.log('2')
        addRegister();
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