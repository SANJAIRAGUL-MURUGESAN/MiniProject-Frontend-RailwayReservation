const form = document.querySelector('#form')
const trainname = document.querySelector('#trainname');
const trainnumber = document.querySelector('#trainnumber');
const startingpoint = document.querySelector('#startingpoint');
const endingpoint = document.querySelector('#endingpoint');
// const starttime = document.querySelector('#trainstarttime');
// const endtime = document.querySelector('#trainendtime');
const totalseats = document.querySelector('#totalseats');
const priceperkm = document.querySelector('#priceperkm');
const trainstatus = document.querySelector('#trainstatus');
// const trainstartdate = document.querySelector('#trainstartdatetime');
// const trainenddate = document.querySelector('#trainenddatetime');


async function addTrain(){

    const trainStartDate = document.getElementById("traintartdate");
    const trainStartTime = document.getElementById("trainstarttime");
    const trainEndDate = document.getElementById("trainenddate");
    const trainEndTime = document.getElementById("trainendtime");
    const trainArrivalDate = document.getElementById("trainarrivaldate");
    const trainArrivalTime = document.getElementById("trainarrivaltime");
    const trainDepartureDate = document.getElementById("traindeparturedate");
    const trainDeparuteTime = document.getElementById("traindeparturetime");

    const trainstartdatetime = await timefunction(trainStartDate.value,trainStartTime.value)
    const trainendatetime = await timefunction(trainEndDate.value,trainEndTime.value)
    const trainarrivaldatetime = await timefunction(trainArrivalDate.value,trainArrivalTime.value)
    const traindeparturedatetime = await timefunction(trainDepartureDate.value,trainDeparuteTime.value)


    const convertedstarttime = await extractDateTime(trainstartdatetime)
    const convertedendtime = await extractDateTime(trainendatetime)
    const convertedTrainStartDate = await extractDateTime(trainarrivaldatetime)
    const convertedTrainEndDate = await extractDateTime(traindeparturedatetime)

    console.log(convertedTrainStartDate)
    console.log(convertedendtime)

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
            "trainStartDate": convertedstarttime,
            "trainEndDate": convertedendtime,
            "arrivalTime": convertedTrainStartDate,
            "departureTime": convertedTrainEndDate,
            "totalSeats": totalseats.value,
            "pricePerKM": priceperkm.value,
            "trainStatus": trainstatus.value
        })
    })
    .then(async res => {
        const spinnerEl = document.querySelector('.spinnerborder');
        spinnerEl.style.display = 'none';
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
            form.reset();
            // alert('Hey Admin, Train Added Successfully!');
            Toastify({
                text: "Hey Admin, Train Added Successfully!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                    window.open('AdminAddTrainRoute.html'); // Redirect after toast disappears
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
                text: "Hey Admin, Login to Add Train!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            const spinnerEl = document.querySelector('.spinnerborder');
            spinnerEl.style.display = 'flex';
            addTrain()
        }
    }
})

async function timefunction(date,time){
    // Get the value of the input
    let inputValue = time;
    
    // Check if input value is in HH:mm format
    if (/^\d{2}:\d{2}$/.test(inputValue)) {
      // Split hours and minutes
      let [hours, minutes] = inputValue.split(':');
      // Convert hours to integer
      hours = parseInt(hours, 10);
      // Determine AM or PM
      let period = (hours >= 12) ? 'PM' : 'AM';
      // Adjust hours for PM display
      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12; // Midnight (00:00) should display as 12:00 AM
      }
      // Construct the formatted time string
      let formattedTime = `${date} ${hours}:${minutes} ${period}`;
      // Store the formatted time string as needed (e.g., in a variable)
      console.log("Formatted time:", formattedTime);
      return formattedTime;
      
    }
}

  
async function convertToDatetimeFormat(dateStr, timeStr) {
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
    // const starttimeVal = starttime.value.trim();
    // const endtimeVal = endtime.value.trim();
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

    // const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (?:[AP]M)$/i;
    // // 2023-11-19 03:22 PM
    // if (pattern.test(starttimeVal)) {
    //     setSuccess(starttime)
    // }
    // else {
    //     success = false;
    //     setError(starttime,'Invalid Start Time format')
    // }

    // if (pattern.test(endtimeVal)) {
    //     setSuccess(endtime)
    // }
    // else {
    //     success = false;
    //     setError(endtime,'Invalid End Time format')
    // }

    // if(pattern.test(trainstartdate.value)){
    //     setSuccess(trainstartdate)
    // }
    // else {
    //     success = false;
    //     setError(trainstartdate,'Invalid Train Start Date and Time format')
    // }

    // if(pattern.test(trainenddate.value)){
    //     setSuccess(trainenddate)
    // }
    // else {
    //     success = false;
    //     setError(trainenddate,'Invalid Train End Date and Time format')
    // }

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

