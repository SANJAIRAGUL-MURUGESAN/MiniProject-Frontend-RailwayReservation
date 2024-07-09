const username = document.getElementById('username');
const username1 = document.getElementById('username1');
const useremail = document.getElementById('useremail');
const gender = document.getElementById('gender');
const phone = document.getElementById('phone');
const disability = document.getElementById('disability');
const address = document.getElementById('address');
const email1 = document.getElementById('email1');
const sc = document.getElementById('sc')


async function populateDetails(element){
    username.innerHTML = element.name
    email1.innerHTML = element.email
    username1.innerHTML = `<p><span><strong> User Name</strong></span>: ${element.name}</p>`
    useremail.innerHTML = `<p><span><strong> User Email</strong></span>: ${element.email}</p>`
    gender.innerHTML = `<p><span><strong> User Gender</strong></span>: ${element.gender}</p>`
    phone.innerHTML = `<p><span><strong> User Mobile</strong></span>: (+91) ${element.phoneNumber}</p>`
    if(element.disability === false){
        disability.innerHTML = `<p><span><strong> Disability</strong></span>: No</p>`
    }else{
        disability.innerHTML = `<p><span><strong> Disability</strong></span>: Yes</p>`
    }
    address.innerHTML = `<p><span><strong> User Address</strong></span>: ${element.address}</p>`
}

async function getUserDetails() {

    const userid = localStorage.getItem('userid')
    if(userid == null){
        Toastify({
            text: "Hey User, Login to See Profile! Redirecting...",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            callback: function() {
                window.open('index.html'); // Redirect after toast disappears
            }
        }).showToast();
    }else{
    // Fetch Profile from backend
    await fetchClasses();
    await fetchScheduleCount();

    // Function to fetch classes from backend
    async function fetchClasses() {
        await fetch('http://localhost:5062/api/User/UserProfile', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(localStorage.getItem('userid'))
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await res.json();
            console.log(data)
            await populateDetails(data)
            // classesn = await populateClassesDropdown(data); // Populate dropdown with fetched data

        })
        .catch(error => {
            console.error('Error fetching User:', error);
            alert('Failed to fetch User. Please try again later.');
        });
    }

    async function fetchScheduleCount() {
        await fetch('http://localhost:5062/api/User/GetUserSchedule', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(localStorage.getItem('userid'))
        })
        .then(async res => {
            if (!res.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await res.json();
            console.log(data)
            sc.innerHTML = data
        })
        .catch(error => {
            console.error('Error fetching User:', error);
            alert('Failed to fetch User. Please try again later.');
        });
    }
}
}

getUserDetails()




 
 


 

