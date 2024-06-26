const form = document.querySelector('#form')
const priceperkm = document.querySelector('#priceperkm');
// const trainid = document.querySelector('#trainid');

async function updatePricePerKm(){
    const trainid = localStorage.getItem('TrainIdDetails')
    await fetch('http://localhost:5062/api/Admin/UpdatePricePerKMByAdmin', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            "trainId": parseInt(trainid),
            "pricePerKm": priceperkm.value
        })
    })
    .then(async res => {
        const data = await res.json();
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
            // alert('Hey Admin, Train Price Updated Successfully!');
            Toastify({
                text: "Hey Admin, Train Price Updated Successfully! Redirecting...",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                  window.open('TrainDetails.html'); // Redirect after toast disappears
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
    if(!validateInputs()){
        return
    }else{
        const userid = localStorage.getItem('userid')
        if(userid == null){
            Toastify({
                text: "Hey Admin, Login to Update Train Price",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
           updatePricePerKm()
        }
    }
})

function validateInputs(){

    const priceperkmVal = priceperkm.value.trim();
    // const trainidVal = trainid.value

    let success = true

    function validateNumber(input) {
        const numberDotRegex = /^\d+(\.\d*)?$/;
        return numberDotRegex.test(input);
    }

    if(priceperkmVal===''){
        success=false;
        setError(priceperkm,'PricePerKm is required')
    }else if(!validateNumber(priceperkmVal)){
        success= false;
        setError(priceperkm,'Only Numbers are allowed')
    }
    else{
        setSuccess(priceperkm)
    }

    // if(trainidVal === ''){
    //     success=false;
    //     setError(trainid,'Train ID is required')
    // }else if(trainidVal == 0){
    //     success=false;
    //     setError(trainid,'Train ID cannot be equal to zero')
    // }else if(trainidVal < 0){
    //     success=false;
    //     setError(trainid,'Train ID cannot be less to zero');
    // }else{
    //     setSuccess(trainid)
    // }

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

