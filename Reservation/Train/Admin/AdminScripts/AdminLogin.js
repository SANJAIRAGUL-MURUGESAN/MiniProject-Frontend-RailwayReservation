const form = document.querySelector('#form')
const userid = document.querySelector('#userid');
const password = document.querySelector('#password');


function userlogin(){
            fetch('http://localhost:5062/api/Admin/AdminLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                 },
                body: JSON.stringify({
                    "id": userid.value.trim(),
                    "password": password.value.trim()
                })
            })
            .then(async res => {
                const data = await res.json();
                console.log(data)
                if (!res.ok) {
                    // console.log(data.errorCode)
                    // alert(data.message);
                    Toastify({
                        text: data.message,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                }else{
                    localStorage.setItem('token',data.token);
                    localStorage.setItem('userid',userid.value.trim());
                    localStorage.setItem('usertype','admin')
                    // alert('Hey User, Login Successful!');
                    Toastify({
                        text: "Hey Admin, Login Successful! Redirecting...",
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


form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(!validateInputs()){
        return;
    }else{
        const userid = localStorage.getItem('userid')
        if(userid == null){
            userlogin()
        }else{
            Toastify({
                text: "Hey Admin, You already Logged In!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                    window.open('AdminHome.html'); // Redirect after toast disappears
                }
            }).showToast();
        }
    }
})

function validateInputs(){

    const useridVal = userid.value.trim()
    const passwordVal = password.value.trim();

    let success = true

    if(useridVal===''){
        success=false;
        setError(userid,'UserId is required')
    }
    else{
        setSuccess(userid)
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

