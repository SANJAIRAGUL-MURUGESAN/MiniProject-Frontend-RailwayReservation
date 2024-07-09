const form = document.querySelector('#form')
const startingpoint = document.querySelector('#startingpoint');
const date = document.querySelector('#date');
const endingpoint = document.querySelector('#endingpoint');
const trainstarttime = document.querySelector('#trainstarttime');


async function addSchedule(){

    const trainstartdatetime = await timefunction(date.value,trainstarttime.value)

    const convertedstarttime = await extractDateTime(trainstartdatetime)

    const userid = localStorage.getItem('userid');

    await fetch('http://localhost:5062/api/User/AddUserSchedule', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "startingPoint": startingpoint.value,
            "endingPoint": endingpoint.value,
            "trainDate": convertedstarttime,
            "userId": userid,
            "scheduleStatus": "Inline"
        })
    })
    .then(async res => {
        const spinnerEl = document.querySelector('.spinnerborder');
        spinnerEl.style.display = 'none';
        const data = await res.json();
        console.log(data)
        if (!res.ok) {
            // console.log(data.errorCode)
            console.log('hi')
            // alert(data.message);
            Toastify({
                text: data.message,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            Toastify({
                text: "Hey User, Train Scheduling Successful! Redirecting...",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                  window.open('index.html'); // Redirect after toast disappears
                }
            }).showToast();
        }
    })
    .catch(error => {
        // alert(error);
        Toastify({
            text: error.message,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    });
}

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(!validateInputs()){
        return
    }else{
        const spinnerEl = document.querySelector('.spinnerborder');
        spinnerEl.style.display = 'flex';
        addSchedule();
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

    const startingpointVal = startingpoint.value.trim()
    const endingpointVal = endingpoint.value.trim()

    let success = true

    if(startingpointVal===''){
        success=false;
        setError(startingpoint,'Starting Point is required')
    }
    else if(startingpointVal.length < 5){
        success=false;
        setError(startingpoint,'Starting Point must be atleast 3 characters long ')
    }
    else{
        setSuccess(startingpoint)
    }

    if(endingpointVal===''){
        success=false;
        setError(endingpoint,'Ending Point is required')
    }
    else if(endingpointVal.length < 5){
        success=false;
        setError(endingpoint,'Ending Point must be atleast 3 characters long ')
    }
    else{
        setSuccess(endingpoint)
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