const form = document.querySelector('#form')
const tracknumber = document.querySelector('#tracknumber');
const trackstartingpoint = document.querySelector('#trackstartingpoint');
const trackendingpoint = document.querySelector('#trackendingpoint');
const trackstatus = document.querySelector('#trackstatus');
const stationid = document.querySelector('#stationid');

function addTrack(){
    fetch('http://localhost:5062/api/Admin/AddTrackToStationByAdmin', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            "trackNumber": tracknumber.value,
            "trackStatus": trackstatus.value.trim(),
            "trackStartingPoint": trackstartingpoint.value.trim(),
            "trackEndingPoint": trackendingpoint.value.trim(),
            "stationId": stationid.value
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
            // alert('Hey Admin, Track Added to the Station Successfully!');
            Toastify({
                text: "Hey Admin, Track to Station Added Successfully! Redirecting...",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                  window.open('AdminAddTrain.html'); // Redirect after toast disappears
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
                text: "Hey Admin, Login to Add Track to Station!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            addTrack();
        }
    }
    // form.reset();
})

function validateInputs(){
    const tracknumberVal = tracknumber.value.trim();
    const trackstartingpointVal = trackstartingpoint.value.trim();
    const trackendingpointVal = trackendingpoint.value.trim();
    const trackstatusVal = trackstatus.value.trim();
    const stationidVal = stationid.value.trim();

    let success = true

    if(trackstartingpointVal===''){
        success=false;
        setError(trackstartingpoint,'Track Starting Point is required')
    }
    else if(trackstartingpointVal.length<3){
        success = false;
        setError(trackstartingpoint,'Track Starting Point cannot be less than 3 characters long')
    }
    else{
        setSuccess(trackstartingpoint)
    }

    if(trackendingpointVal===''){
        success=false;
        setError(trackendingpoint,'Track Starting Point is required')
    }
    else if(trackendingpointVal.length<3){
        success = false;
        setError(trackendingpoint,'Track Ending Point cannot be less than 3 characters long')
    }
    else{
        setSuccess(trackendingpoint)
    }

    if(tracknumberVal === ''){
        success=false;
        setError(tracknumber,'Track Number is required')
    }else if(tracknumberVal == 0){
        success=false;
        setError(tracknumber,'TrackNumber cannot be equal to zero')
    }else if(tracknumberVal < 0){
        success=false;
        setError(tracknumber,'TrainNumber cannot be less to zero');
    }else{
        setSuccess(tracknumber)
    }

    if(trackstatusVal===''){
        success=false;
        setError(trackstatus,'Track Status is required')
    }
    else if(trackstatusVal.length<3){
        success = false;
        setError(trackstatus,'Train Status cannot be less than 3 characters long')
    }
    else{
        setSuccess(trackstatus)
    }

    if(stationidVal === ''){
        success=false;
        setError(stationid,'Station ID is required')
    }else if(stationidVal == 0){
        success=false;
        setError(stationid,'StationID cannot be equal to zero')
    }else if(stationidVal < 0){
        success=false;
        setError(stationid,'StationId cannot be less to zero');
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

