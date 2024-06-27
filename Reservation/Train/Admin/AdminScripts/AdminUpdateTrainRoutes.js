const form = document.querySelector('#form')
const routstartdate = document.querySelector('#routstartdate');
const routeenddate = document.querySelector('#routeenddate');
const routestarttime = document.querySelector('#routestarttime');
const routeendtime = document.querySelector('#routeendtime');
const stopnumber = document.querySelector('#stopnumber');
const kmdistance = document.querySelector('#kmdistance');
const trainid = document.querySelector('#trainid');
const stationid = document.querySelector('#stationid');
const trackid = document.querySelector('#trackid');
const tracknumber = document.querySelector('#tracknumber');
const routeid = document.querySelector('#routeid');



form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!validateInputs()){
        e.preventDefault();
    }
})

function validateInputs(){
    const routstartdateVal = routstartdate.value
    const routeenddateVal = routeenddate.value
    const routestarttimeVal = routestarttime.value.trim();
    const routeendtimeVal = routeendtime.value.trim();
    const stopnumberVal = stopnumber.value;
    const kmdistanceVal = kmdistance.value.trim();
    const trainidVal = trainid.value;
    const stationidVal = stationid.value;
    const trackidVal = trackid.value;
    const tracknumberVal = tracknumber.value;
    const routeidVal = routeid.value;

    let success = true

    const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (?:[AP]M)$/i;
    // 2023-11-19 03:22 PM
    if (pattern.test(routestarttimeVal)) {
        setSuccess(routestarttime)
    }
    else {
        success = false;
        setError(routestarttime,'Invalid Route Start Time format')
    }

    if (pattern.test(routeendtimeVal)) {
        setSuccess(routeendtime)
    }
    else {
        success = false;
        setError(routeendtime,'Invalid Route End Time format')
    }

    if(stopnumberVal === ''){
        success=false;
        setError(stopnumber,'Stop Number is required')
    }else if(stopnumberVal == 0){
        success=false;
        setError(stopnumber,'Stop Number cannot be equal to zero')
    }else if(stopnumberVal < 0){
        success=false;
        setError(stopnumber,'Stop Number cannot be less to zero');
    }else{
        setSuccess(stopnumber)
    }

    function validateNumber(input) {
        const numberDotRegex = /^\d+(\.\d*)?$/;
        return numberDotRegex.test(input);
    }

    if(kmdistanceVal===''){
        success=false;
        setError(kmdistance,'Kilometer Distance is required')
    }else if(!validateNumber(kmdistanceVal)){
        success= false;
        setError(kmdistance,'Only Numbers are allowed')
    }
    else{
        setSuccess(kmdistance)
    }

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

    if(trainidVal === ''){
        success=false;
        setError(trainid,'Train ID is required')
    }else if(trainidVal == 0){
        success=false;
        setError(trainid,'Train ID cannot be equal to zero')
    }else if(trainidVal < 0){
        success=false;
        setError(trainid,'Train ID cannot be less to zero');
    }else{
        setSuccess(trainid)
    }

    if(trackidVal === ''){
        success=false;
        setError(trackid,'Track ID is required')
    }else if(trackidVal == 0){
        success=false;
        setError(trackid,'Track ID cannot be equal to zero')
    }else if(trackidVal < 0){
        success=false;
        setError(trackid,'Track ID cannot be less to zero');
    }else{
        setSuccess(trackid)
    }

    if(tracknumberVal === ''){
        success=false;
        setError(tracknumber,'Track Number is required')
    }else if(tracknumberVal == 0){
        success=false;
        setError(tracknumber,'Track Number cannot be equal to zero')
    }else if(tracknumberVal < 0){
        success=false;
        setError(tracknumber,'Track Number cannot be less to zero');
    }else{
        setSuccess(tracknumber)
    }

    if(routeidVal === ''){
        success=false;
        setError(routeid,'Route ID is required')
    }else if(routeidVal == 0){
        success=false;
        setError(routeid,'Route ID cannot be equal to zero')
    }else if(routeidVal < 0){
        success=false;
        setError(routeid,'Route ID cannot be less to zero');
    }else{
        setSuccess(routeid)
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

