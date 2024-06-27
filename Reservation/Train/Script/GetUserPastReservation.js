const form = document.querySelector('#form')
const userid = document.querySelector('#userid');


form.addEventListener('submit',(e)=>{
    
    if(!validateInputs()){
        e.preventDefault();
    }
})

function validateInputs(){

    const useridVal = userid.value.trim();

    let success = true

    if(useridVal === ''){
        success=false;
        setError(userid,'User ID is required')
    }else if(useridVal == 0){
        success=false;
        setError(userid,'User ID cannot be equal to zero')
    }else if(useridVal < 0){
        success=false;
        setError(userid,'User ID cannot be less to zero');
    }else{
        setSuccess(userid)
    }

    return success;
}

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