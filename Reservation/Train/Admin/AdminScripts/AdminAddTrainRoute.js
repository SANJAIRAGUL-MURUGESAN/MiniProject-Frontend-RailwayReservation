const form = document.querySelector('#form')
// const routstartdate = document.querySelector('#routestartdatetime');
// const routeenddate = document.querySelector('#routeenddatetime');
// const routearrivaltime = document.querySelector('#routearrivaltime');
// const routedeparturetime = document.querySelector('#routedeparturetime');
const stopnumber = document.querySelector('#stopnumber');
const kmdistance = document.querySelector('#kmdistance');
const trainid = document.querySelector('#trainid');
const stationid = document.querySelector('#stationid');
const trackid = document.querySelector('#trackid');
const tracknumber = document.querySelector('#tracknumber');


async function populateStationTrackDropdown(classes) {
    const dropdown = document.getElementById('trackid');

    // Clear existing options
    dropdown.innerHTML = '';

    // Create and append options
    classes.forEach(cls => {
        console.log(cls)
        const option = document.createElement('option');
        option.value = cls; 
        option.textContent = cls; 
        dropdown.appendChild(option);

        // populateCheckboxes(cls.startingSeatNumber,cls.endingSeatNumber)
    });

    console.log("Trackid",trackid.value)
    
    await fetch('http://localhost:5062/api/Admin/GetTrack', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackid.value)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            // throw new Error('Failed to fetch Tracks');
            Toastify({
                text: data.message,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            console.log(data)
            document.getElementById('tracknumber').value = data.trackNumber
        }
    })
    .catch(error => {
        console.error('Error fetching clasTracksses:', error);
        // alert('Failed to fetch classes. Please try again later.');
        Toastify({
            text: error.message,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    });

    return classes;
}

async function fetchTracks() {
    await fetch('http://localhost:5062/api/Admin/CheckReservedTracksofStation', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stationid.value)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            // throw new Error('Failed to fetch Tracks');
            Toastify({
                text: data.message,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            console.log(data.availableTracks)
            if(data===undefined || data.availableTracks.length === 0){
                Toastify({
                    text: "Hey Admin, No Available Tracks Found for your selected station!...",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }else{
                classesn = await populateStationTrackDropdown(data.availableTracks); // Populate dropdown with fetched data
            }
        }

    })
    .catch(error => {
        console.error('Error fetching classes:', error);
        // alert('Failed to fetch classes. Please try again later.');
        Toastify({
            text: error.message,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    });
}

// document.getElementById('stationid').addEventListener('change', fetchTracks);

document.getElementById('stationid').addEventListener("keyup", async function() {
    // const value = this.value;
    // // Call your function here with the value
    // yourFunction(value);
    const v = document.getElementById('stationid')
    if(v.value > 0){
        console.log('yes')
        await fetchTracks()
    }else{
        console.log('no')
    }
  });


async function addTrainRoute(){

    const routeStartDate = document.getElementById("routestartdate");
    const routeStartTime = document.getElementById("routestarttime");
    const routeEndDate = document.getElementById("routeenddate");
    const routeEndTime = document.getElementById("routeendtime");
    const routeArrivalDate = document.getElementById("routearrivaldate");
    const routeArrivalTime = document.getElementById("routearrivaltime");
    const routeDepartureDate = document.getElementById("routedeparturedate");
    const routeDeparuteTime = document.getElementById("routedeparturetime");

    const routestartdatetime = await timefunction(routeStartDate.value,routeStartTime.value)
    const routeendatetime = await timefunction(routeEndDate.value,routeEndTime.value)
    const routearrivaldatetime = await timefunction(routeArrivalDate.value,routeArrivalTime.value)
    const routedeparturedatetime = await timefunction(routeDepartureDate.value,routeDeparuteTime.value)


    const convertedstartdate = await extractDateTime(routestartdatetime)
    const convertedenddate = await extractDateTime(routeendatetime)
    const convertedarrivalTime = await extractDateTime(routearrivaldatetime)
    const convertedDepartureTime = await extractDateTime(routedeparturedatetime)

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
                text: "Hey Admin, Train Route Added Successfully!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
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


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!validateInputs()){
        return
    }else{
        const userid = localStorage.getItem('userid')
        if(userid == null){
            Toastify({
                text: "Hey Admin, Login to Add Train Route!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            addTrainRoute()
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
    // const routstartdateVal = routstartdate.value.trim()
    // const routeenddateVal = routeenddate.value.trim()
    // const routearrivaltimeVal = routearrivaltime.value.trim();
    // const routedeparturetimeVal = routedeparturetime.value.trim();
    const stopnumberVal = stopnumber.value;
    const kmdistanceVal = kmdistance.value.trim();
    const trainidVal = trainid.value;
    const stationidVal = stationid.value;
    // const trackidVal = trackid.value;
    // const tracknumberVal = tracknumber.value;

    let success = true

    // const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (?:[AP]M)$/i;
    // // 2023-11-19 03:22 PM
    // if (pattern.test(routearrivaltimeVal)) {
    //     setSuccess(routearrivaltime)
    // }
    // else {
    //     success = false;
    //     setError(routearrivaltime,'Invalid Route Arrival Time format')
    // }

    // if (pattern.test(routedeparturetimeVal)) {
    //     setSuccess(routedeparturetime)
    // }
    // else {
    //     success = false;
    //     setError(routedeparturetime,'Invalid Route Departure Time format')
    // }

    // if (pattern.test(routstartdateVal)) {
    //     setSuccess(routstartdate)
    // }
    // else {
    //     success = false;
    //     setError(routstartdate,'Invalid Route Start Date and Time format')
    // }

    // if (pattern.test(routeenddateVal)) {
    //     setSuccess(routeenddate)
    // }
    // else {
    //     success = false;
    //     setError(routeenddate,'Invalid Route End Date and Time format')
    // }

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

    // if(trackidVal === ''){
    //     success=false;
    //     setError(trackid,'Track ID is required')
    // }else if(trackidVal == 0){
    //     success=false;
    //     setError(trackid,'Track ID cannot be equal to zero')
    // }else if(trackidVal < 0){
    //     success=false;
    //     setError(trackid,'Track ID cannot be less to zero');
    // }else{
    //     setSuccess(trackid)
    // }

    // if(tracknumberVal === ''){
    //     success=false;
    //     setError(tracknumber,'Track Number is required')
    // }else if(tracknumberVal == 0){
    //     success=false;
    //     setError(tracknumber,'Track Number cannot be equal to zero')
    // }else if(tracknumberVal < 0){
    //     success=false;
    //     setError(tracknumber,'Track Number cannot be less to zero');
    // }else{
    //     setSuccess(tracknumber)
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

