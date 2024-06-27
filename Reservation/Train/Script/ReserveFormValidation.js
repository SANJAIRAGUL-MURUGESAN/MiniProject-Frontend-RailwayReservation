const form = document.querySelector('#form')
const startingpoint = document.querySelector('#startingpoint');
const endingpoint = document.querySelector('#endingpoint');
const traindate = document.querySelector('#traindate');
const seats = document.querySelector('#seats');

async function populateClassesDropdown(classes) {
    const dropdown = document.getElementById('classname');

    // Clear existing options
    dropdown.innerHTML = '';

    // Create and append options
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.className; 
        option.textContent = cls.className; 
        dropdown.appendChild(option);

        // populateCheckboxes(cls.startingSeatNumber,cls.endingSeatNumber)
    });
    
    return classes;
}

async function fetchSeatData() {
    const response = await fetch(`http://localhost:5062/api/User/CheckSeatDetailsofTrain`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
    })
    var data = await response.json();
    console.log(data);
    return data.reservedSeats
  }

const checkboxesContainer = document.getElementById('checkboxes-container');
const checkboxesPerLine = 5; // Number of checkboxes per line

async function populateCheckboxes(s,e) {
  try {

    const reservedSeats = await fetchSeatData();
    
    // Clear existing checkboxes
    checkboxesContainer.innerHTML = '';

    for (let i = s; i <= e; i++) {
      const isReserved = reservedSeats.includes(i);
      if(!isReserved){
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = i; // Adjust based on your data structure
            checkbox.name = 'checkbox-group'; // Set a common name for the checkbox group
            checkbox.value = i; // Set the value to an ID from the data

            const label = document.createElement('label');
            label.textContent = i; // Set label text from data

            // Associate label with checkbox
            label.setAttribute('for', checkbox.id);

            // Append checkbox and label to checkboxesContainer
            checkboxesContainer.appendChild(checkbox);
            checkboxesContainer.appendChild(label);

            // Add newline every `checkboxesPerLine` iterations
            if (i % checkboxesPerLine === checkboxesPerLine - 1) {
                checkboxesContainer.appendChild(document.createElement('br'));
            }
        }
    }

    // Final newline if needed (optional)
    if (30 % checkboxesPerLine !== 0) {
      checkboxesContainer.appendChild(document.createElement('br'));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors gracefully (optional)
  }
}

async function makeChange(){
    console.log('asd')
        const className = document.getElementById('classname')
        console.log('first'+className.value)
        await fetch('http://localhost:5062/api/User/GetTrainClasses', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await res.json();
            console.log(data)
            data.forEach(async element => {
               if(element.className === className.value){
                await populateCheckboxes(element.startingSeatNumber,element.endingSeatNumber)
               } 
            });
        })
        .catch(error => {
            console.error('Error fetching classes:', error);
            alert('Failed to fetch classes. Please try again later.');
        });
}

document.getElementById('classname').addEventListener('change', makeChange);


document.addEventListener('DOMContentLoaded', async function() {

    const userid = localStorage.getItem('userid')
    if(userid == null){
        Toastify({
            text: "Hey User, Login to Reserve Train! Redirecting...",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            callback: function() {
                window.open('index.html'); // Redirect after toast disappears
            }
        }).showToast();
    }else{
    // Fetch classes from backend
    await routeDetailsDropDown();
    await fetchClasses();
    await makeChange();
    

    // Function to fetch classes from backend
    async function fetchClasses() {
        await fetch('http://localhost:5062/api/User/GetTrainClasses', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await res.json();
            console.log(data)
            classesn = await populateClassesDropdown(data); // Populate dropdown with fetched data

        })
        .catch(error => {
            console.error('Error fetching classes:', error);
            alert('Failed to fetch classes. Please try again later.');
        });
    }
}
})



async function fetchTrainDetail() {
    await fetch(`http://localhost:5062/api/User/GetTrainById`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
    }).then(async (response) => {
        var data = await response.json();
        console.log(data)
        return data;
    }).catch(error => {
        console.error(error);
    });
}
  

async function addReservation(list,classname){
    console.log(classname)
    await fetch('http://localhost:5062/api/User/BookTrainByUser', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({
            "startingPoint": startingpoint.value.trim(),
            "endingPoint": endingpoint.value.trim(),
            "trainDate": traindate.value,
            "userId": localStorage.getItem('userid'),
            "trainId": localStorage.getItem('TrainIdDetails'),
            "className" : classname,
            "seats": list
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
            // alert('Hey User, Reservation Details Added Successfully!');
            Toastify({
                text: "Hey User, Reservation Successful! Redirecting...",
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
                text: "Hey User, Login to Reserve Train!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                callback: function() {
                    window.open('index.html'); // Redirect after toast disappears
                }
            }).showToast();
        }else{
            const classnameVal = document.getElementById('classname');
            const checkboxes = document.querySelectorAll('#checkboxes-container input[type="checkbox"]'); // Adjust selector as needed
            var seatlist = [];
            for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                console.log(checkbox.value);
                seatlist.push(checkbox.value)
            }
            }
            if(seatlist.length===0){
                Toastify({
                    text: "Hey User, Select seat to Reserve!",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }else{
                addReservation(seatlist,classnameVal.value.trim())
            }
        }
    }
})


async function routeDetailsDropDown(){

    const RouteDetails = []

    async function createDate(stationName,startDate){
        const routeObject = {
            stationName: stationName,
            startDate: startDate
        };
        RouteDetails.push(routeObject)
    }

    async function fetchTrainDetail() {
        await fetch(`http://localhost:5062/api/User/GetTrainById`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token'),
                'Content-Type': 'application/json',
             },
             body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
        }).then(async (response) => {
            var data = await response.json();
            await createDate(data.startingPoint, data.trainStartDate)
            // renderProducts(data.startingPoint,data.trainStartDate,data.arrivalTime,data.departureTime);
        }).catch(error => {
            console.error(error);
        });
    }
    
    async function fetchTrainData() {
        await fetch(`http://localhost:5062/api/User/GetTrainRoutes`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+localStorage.getItem('token'),
                'Content-Type': 'application/json',
             },
             body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
        }).then(async (response) => {
            var data = await response.json();
            console.log(data);
            data.forEach(async(element, index)=> {
                console.log(element);
                await createDate(element.stationName, element.routeEndDate)
                // await renderProducts(element.stationName,element.routeEndDate,element.arrivalTime,element.departureTime);
            });
            // await fetchTrainDetail()
        }).catch(error => {
            console.error(error);
        });
    }

      await fetchTrainDetail()
      await fetchTrainData()

      await populateRouteDropdowns(RouteDetails)
      await changeEndingPoint()
    //   await populateRouteDropdowne(RouteDetails)

      async function populateRouteDropdowns(RouteDetails) {

        const sdropdown = document.getElementById('startingpoint');
    
        // Clear existing options
        sdropdown.innerHTML = '';

        console.log(RouteDetails)

        for (let i = 0; i < RouteDetails.length; i++) {
            const route = RouteDetails[i];
            console.log("Station:", route.stationName, " Start Date:", route.startDate);
            const option = document.createElement('option');
            option.value = route.stationName; 
            option.textContent = route.stationName; 
            sdropdown.appendChild(option);
        }

        const initialstation = document.getElementById('startingpoint')
        for (let i = 0; i < RouteDetails.length; i++) {
            const route = RouteDetails[i];
            if(route.stationName === initialstation.value){
                const fullDate = route.startDate;
                const dateString = fullDate.slice(0, 10);
                document.getElementById('traindate').value = dateString
            }
        }
        
    }

    document.getElementById('startingpoint').addEventListener('change',changeEndingPoint);

    async function populateRouteDropdowne(RouteDetails) {

        console.log('down')

        const edropdown = document.getElementById('endingpoint');
    
        // Clear existing options
        edropdown.innerHTML = '';

        console.log(RouteDetails)

        for (let i = 0; i < RouteDetails.length; i++) {
            const route = RouteDetails[i];
            console.log("Station:", route.stationName, " Start Date:", route.startDate);
            const option = document.createElement('option');
            option.value = route.stationName; 
            option.textContent = route.stationName; 
            edropdown.appendChild(option);
        }
    }
        
    async function changeEndingPoint(){
        const startingPointinput = document.getElementById('startingpoint')
        const RouteEndDetails = [];
        let flag = 0;
        for (let i = 0; i < RouteDetails.length; i++) {
            const route = RouteDetails[i];
            if(route.stationName === startingPointinput.value){
                flag = 1;
                continue;
            }
            if(flag==1){
                const routeObject2 = {
                    stationName: route.stationName,
                    startDate: route.startDate
                };
                RouteEndDetails.push(routeObject2)
            }
        }
        const edropdown2 = document.getElementById('endingpoint');
        console.log(RouteEndDetails)
        edropdown2.innerHTML = '';
        for (let i = 0; i < RouteEndDetails.length; i++) {
            const route = RouteEndDetails[i];
            console.log("Station:", route.stationName, " Start Date:", route.startDate);
            const option = document.createElement('option');
            option.value = route.stationName; 
            option.textContent = route.stationName; 
            edropdown2.appendChild(option);
        }
        const initialstation = document.getElementById('startingpoint')
        for (let i = 0; i < RouteDetails.length; i++) {
            const route = RouteDetails[i];
            if(route.stationName === initialstation.value){
                const fullDate = route.startDate;
                const dateString = fullDate.slice(0, 10);
                document.getElementById('traindate').value = dateString
            }
        }
    }  
}


function validateInputs(){
    const startingpointVal = startingpoint.value.trim()
    const  endingpointVal = endingpoint.value.trim();
    // const traindateVal = traindate.value;
    // const useridVal = userid.value.trim();
    // const trainidVal = trainid.value.trim();
    // const seatsVal = seats.value.trim();
    // const classnameVal = classname.value.trim();

    let success = true

    if(startingpointVal===''){
        success=false;
        setError(startingpoint,'StartingPoint is required')
    }
    else{
        setSuccess(startingpoint)
    }

    if(endingpointVal===''){
        success=false;
        setError(endingpoint,'EndingPoint is required')
    }
    else{
        setSuccess(endingpoint)
    }

    // const today = new Date();
    // if(traindateVal===''){
    //     success=false;
    //     setError(traindate,'TrainDate is Required')
    // }else if(traindateVal<today){
    //     success=false;
    //     setError(traindate,'Invalid Date Selection')
    // }else{
    //     console.log(today)
    //     console.log(traindate)
    //     setSuccess(traindate)
    // }

    // if(useridVal === ''){
    //     success=false;
    //     setError(userid,'User ID is required')
    // }else if(useridVal == 0){
    //     success=false;
    //     setError(userid,'User ID cannot be equal to zero')
    // }else if(useridVal < 0){
    //     success=false;
    //     setError(userid,'User ID cannot be less to zero');
    // }else{
    //     setSuccess(userid)
    // }

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


    // const numbers = seatsVal.split(',').map(num => parseInt(num));
    // if (seatsVal === '') {
    //     success= false;
    //     setError(seats,'Seats are Required')
    // }else if(seatsVal != ''){
    //     if (numbers.some(num => isNaN(num))) {
    //         success= false;
    //         setError(seats,'Only Numbers are allowed')
    //     }
    // }
    // else{
    //     setSuccess(seats)
    // }

    // if(classnameVal === ''){
    //     success= false;
    //     setError(classname,'ClassName is required')
    // }
    // else if(classnameVal.length<3){
    //     success = false;
    //     setError(classname,'ClassName must be atleast 3 characters long')
    // }
    // else{
    //     setSuccess(classname)
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

// getClass()

