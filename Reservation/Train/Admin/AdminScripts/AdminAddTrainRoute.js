const form = document.querySelector('#form')
const routstartdate = document.querySelector('#routestartdatetime');
const routeenddate = document.querySelector('#routeenddatetime');
const routearrivaltime = document.querySelector('#routearrivaltime');
const routedeparturetime = document.querySelector('#routedeparturetime');
const stopnumber = document.querySelector('#stopnumber');
const kmdistance = document.querySelector('#kmdistance');
const trainid = document.querySelector('#trainid');
const stationid = document.querySelector('#stationid');
const trackid = document.querySelector('#trackid');
const tracknumber = document.querySelector('#tracknumber');


async function addTrainRoute(){
    const convertedstartdate = await extractDateTime(routstartdate.value)
    const convertedenddate = await extractDateTime(routeenddate.value)
    const convertedarrivalTime = await extractDateTime(routearrivaltime.value)
    const convertedDepartureTime = await extractDateTime(routedeparturetime.value)

    fetch('http://localhost:5062/api/Admin/AddTrainRouteByAdmin', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            "routeStartDate": convertedstartdate,
            "routeEndDate": convertedenddate,
            "arrivalTime": convertedarrivalTime,
            "departureTime": convertedDepartureTime,
            "stopNumber": stopnumber.value,
            "kilometerDistance": kmdistance.value.trim(),
            "trainId": trainid.value,
            "stationId": stationid.value,
            "trackId": trackid.value,
            "trackNumber": tracknumber.value
        })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            console.log(data.errorCode)
            alert(data.message);
        }else{
            alert('Hey Admin, Train Added Successfully!');
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
        addTrainRoute()
    }
})

function convertToDatetimeFormat(dateStr, timeStr) {
    // Parse the date string "2024-06-21" to a Date object
    const [year, month, day] = dateStr.split('-');
    let date = new Date(Date.UTC(year, month - 1, day)); // Month is 0-indexed in JavaScript Date

    // Parse the time string "01:30 PM" to get hours and minutes
    const timeRegex = /(\d{1,2}):(\d{2}) (AM|PM)/;
    const match = timeStr.match(timeRegex);
    if (!match) {
        throw new Error('Invalid time format');
    }
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    // Adjust hours if PM
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    // Set hours and minutes in UTC
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    // Format the date object to ISO 8601 format
    const isoString = date.toISOString();

    return isoString;
}


async function extractDateTime(dateTimeStr) {
    // Split the string by whitespace (space)
    const parts = dateTimeStr.split(" ");
  
    // Extract date part (YYYY-MM-DD)
    const dateStr = parts[0];
  
    // Extract time part (optional)
    let timeStr = null;

    if (parts.length === 3) {
      timeStr = parts[1]+" "+parts[2];
    }

    // return { date: dateStr, time: timeStr };
    const convertedDate = await convertToDatetimeFormat(dateStr,timeStr)
    return convertedDate;
  }

function validateInputs(){
    const routstartdateVal = routstartdate.value.trim()
    const routeenddateVal = routeenddate.value.trim()
    const routearrivaltimeVal = routearrivaltime.value.trim();
    const routedeparturetimeVal = routedeparturetime.value.trim();
    const stopnumberVal = stopnumber.value;
    const kmdistanceVal = kmdistance.value.trim();
    const trainidVal = trainid.value;
    const stationidVal = stationid.value;
    const trackidVal = trackid.value;
    const tracknumberVal = tracknumber.value;

    let success = true

    const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (?:[AP]M)$/i;
    // 2023-11-19 03:22 PM
    if (pattern.test(routearrivaltimeVal)) {
        setSuccess(routearrivaltime)
    }
    else {
        success = false;
        setError(routearrivaltime,'Invalid Route Arrival Time format')
    }

    if (pattern.test(routedeparturetimeVal)) {
        setSuccess(routedeparturetime)
    }
    else {
        success = false;
        setError(routedeparturetime,'Invalid Route Departure Time format')
    }

    if (pattern.test(routstartdateVal)) {
        setSuccess(routstartdate)
    }
    else {
        success = false;
        setError(routstartdate,'Invalid Route Start Date and Time format')
    }

    if (pattern.test(routeenddateVal)) {
        setSuccess(routeenddate)
    }
    else {
        success = false;
        setError(routeenddate,'Invalid Route End Date and Time format')
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

