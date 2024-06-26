const form = document.querySelector('#form')
const stationid = document.querySelector('#stationid');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!validateInputs()){
        e.preventDefault();
    }
})

function validateInputs(){

    const stationidVal = stationid.value;

    let success = true

    if(stationidVal === ''){
        success=false;
        setError(stationid,'Station ID is required')
    }else if(stationidVal == 0){
        success=false;
        setError(stationid,'Station ID cannot be equal to zero')
    }else if(stationidVal < 0){
        success=false;
        setError(stationid,'Station ID cannot be less to zero');
    }else{
        setSuccess(stationid)
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

