const form = document.querySelector('#form')
const cancelreason = document.querySelector('#cancelreason');
const reservationid = document.querySelector('#reservationid');

const checkboxesContainer = document.getElementById('checkboxes-container');
const checkboxesPerLine = 5; // Number of checkboxes per line

async function populateCheckboxes(i) {
    
    try {
      
      // Clear existing checkboxes
      checkboxesContainer.innerHTML = '';
  
    //   for (let i = s; i <= e; i++) {
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
    //   }
  
      // Final newline if needed (optional)
      if (30 % checkboxesPerLine !== 0) {
        checkboxesContainer.appendChild(document.createElement('br'));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors gracefully (optional)
    }
  }

document.addEventListener('DOMContentLoaded', async function() {

    const userid = localStorage.getItem('userid')
    if(userid == null){
        Toastify({
            text: "Hey User, Login to Unreserve Train!",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            callback: function() {
                window.open('index.html'); // Redirect after toast disappears
            }
        }).showToast();
    }else{
    document.getElementById('refundamount').value = localStorage.getItem('amount')
    // Fetch classes from backend
    await fetchSeats();

    // Function to fetch classes from backend
    async function fetchSeats() {
        await fetch('http://localhost:5062/api/User/ReservedSeats', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(localStorage.getItem('ReservationId'))
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await res.json();
            // console.log(data)
            data.forEach( async element => {
                console.log(element.seatNumber)
                await populateCheckboxes(element.seatNumber)
             });
            // await populateCheckboxes(1,10) // Populate dropdown with fetched data
        })
        .catch(error => {
            console.error('Error fetching classes:', error);
            alert('Failed to fetch classes. Please try again later.');
        });
    }
}
})

async function addUnReservation(seatlist){

    const amountString = localStorage.getItem('amount');
    const reservationid = localStorage.getItem('ReservationId')
    const userid = localStorage.getItem('userid');

    await fetch('http://localhost:5062/api/User/CancelReservation', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "reservationCancelReason": cancelreason.value.trim(),
            "seatNumber": seatlist,
            "refundAmount": parseFloat(amountString),
            "userId": parseInt(userid),
            "reservationId": parseInt(reservationid)
        })
    })
    .then(async res => {
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
                text: "Hey User, Reservation Cancel Successful! Redirecting...",
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
        const checkboxes = document.querySelectorAll('#checkboxes-container input[type="checkbox"]'); // Adjust selector as needed
        var seatlist = [];
        for (const checkbox of checkboxes) {
          if (checkbox.checked) {
            console.log(checkbox.value);
            seatlist.push(checkbox.value)
          }
        }
        if(seatlist.length === 0){
            Toastify({
                text: "Hey User, Select Seats to Unreserve!",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }else{
            await addUnReservation(seatlist);
        }
    }
})

function validateInputs(){

    const cancelreasonVal = cancelreason.value.trim()

    let success = true

    if(cancelreasonVal===''){
        success=false;
        setError(cancelreason,'Cancelling Reason is required')
    }
    else if(cancelreasonVal.length < 5){
        success=false;
        setError(cancelreason,'Cancelling Reason must be atleast 3 characters long ')
    }
    else{
        setSuccess(cancelreason)
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