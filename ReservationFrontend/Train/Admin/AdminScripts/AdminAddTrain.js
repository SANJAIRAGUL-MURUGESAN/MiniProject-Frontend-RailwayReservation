const form = document.querySelector('#form')
const trainname = document.querySelector('#trainname');
const trainnumber = document.querySelector('#trainnumber');
const startingpoint = document.querySelector('#startingpoint');
const endingpoint = document.querySelector('#endingpoint');
const starttime = document.querySelector('#trainstarttime');
const endtime = document.querySelector('#trainendtime');
const totalseats = document.querySelector('#totalseats');
const priceperkm = document.querySelector('#priceperkm');
const trainstatus = document.querySelector('#trainstatus');
const trainstartdate = document.querySelector('#trainstartdatetime');
const trainenddate = document.querySelector('#trainenddatetime');



async function addTrain(){
    const convertedstarttime = await extractDateTime(starttime.value)
    const convertedendtime = await extractDateTime(endtime.value)
    const convertedTrainStartDate = await extractDateTime(trainstartdate.value)
    const convertedTrainEndDate = await extractDateTime(trainenddate.value)

    console.log(convertedTrainStartDate)

    fetch('http://localhost:5062/api/Admin/AddTrainByAdmin', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            "trainName": trainname.value.trim(),
            "trainNumber": trainnumber.value,
            "startingPoint": startingpoint.value.trim(),
            "endingPoint": endingpoint.value.trim(),
            "trainStartDate": convertedTrainStartDate,
            "trainEndDate": convertedTrainEndDate,
            "arrivalTime": convertedstarttime,
            "departureTime": convertedendtime,
            "totalSeats": totalseats.value,
            "pricePerKM": priceperkm.value,
            "trainStatus": trainstatus.value
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
            // alert('Hey Admin, Train Added Successfully!');
            Toastify({
                text: "Hey Admin, Train Added Successfully!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
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
    console.log(trainstartdate.value)
    console.log(starttime.value)
    if(!validateInputs()){
        return
    }else{
        const userid = localStorage.getItem('userid')
        if(userid == null){
            Toastify({
                text: "Hey Admin, Login to Add Train!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            addTrain()
        }
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
    const trainnameVal = trainname.value.trim()
    const trainnumberVal = trainnumber.value
    const startingpointVal = startingpoint.value.trim();
    const endingpointVal = endingpoint.value.trim();
    const starttimeVal = starttime.value.trim();
    const endtimeVal = endtime.value.trim();
    const totalseatsVal = totalseats.value;
    const priceperkmVal = priceperkm.value.trim();
    const trainstatusVal = trainstatus.value.trim();

    let success = true

    if(trainnameVal===''){
        success=false;
        setError(trainname,'TrainName is required')
    }
    else if(trainnameVal.length<3){
        success = false;
        setError(trainname,'Train Name cannot be less than 3 characters long')
    }
    else{
        setSuccess(trainname)
    }

    if(trainnumberVal === ''){
        success=false;
        setError(trainnumber,'TrainNumber is required')
    }else if(trainnumberVal == 0){
        success=false;
        setError(trainnumber,'TrainNumber cannot be equal to zero')
    }else if(trainnumberVal < 0){
        success=false;
        setError(trainnumber,'TrainNumber cannot be less to zero');
    }else{
        setSuccess(trainnumber)
    }

    if(startingpointVal===''){
        success=false;
        setError(startingpoint,'StartingPoint is required')
    }
    else if(startingpointVal.length<3){
        success = false;
        setError(startingpoint,'Starting Point cannot be less than 3 characters long')
    }
    else{
        setSuccess(startingpoint)
    }

    if(endingpointVal===''){
        success=false;
        setError(endingpoint,'EndingPoint is required')
    }
    else if(endingpointVal.length<3){
        success = false;
        setError(endingpoint,'Ending Point cannot be less than 3 characters long')
    }
    else{
        setSuccess(endingpoint)
    }

    const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (?:[AP]M)$/i;
    // 2023-11-19 03:22 PM
    if (pattern.test(starttimeVal)) {
        setSuccess(starttime)
    }
    else {
        success = false;
        setError(starttime,'Invalid Start Time format')
    }

    if (pattern.test(endtimeVal)) {
        setSuccess(endtime)
    }
    else {
        success = false;
        setError(endtime,'Invalid End Time format')
    }

    if(pattern.test(trainstartdate.value)){
        setSuccess(trainstartdate)
    }
    else {
        success = false;
        setError(trainstartdate,'Invalid Train Start Date and Time format')
    }

    if(pattern.test(trainenddate.value)){
        setSuccess(trainenddate)
    }
    else {
        success = false;
        setError(trainenddate,'Invalid Train End Date and Time format')
    }

    if(totalseatsVal === ''){
        success=false;
        setError(totalseats,'TotalSeats is required')
    }else if(totalseatsVal == 0){
        success=false;
        setError(totalseats,'TotalSeats cannot be equal to zero')
    }else if(totalseatsVal < 0){
        success=false;
        setError(totalseats,'TotalSeats cannot be less to zero');
    }else{
        setSuccess(totalseats)
    }

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

    if(trainstatusVal===''){
        success=false;
        setError(trainstatus,'TrainStatus is required')
    }
    else if(trainstatusVal.length<3){
        success = false;
        setError(trainstatus,'Train Status cannot be less than 3 characters long')
    }
    else{
        setSuccess(trainstatus)
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

