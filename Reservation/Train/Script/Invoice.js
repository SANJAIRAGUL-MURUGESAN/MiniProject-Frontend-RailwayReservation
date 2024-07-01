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

       await fetchClasses();
       await fetchTrainDetail();
       await fetchReservationDetail();

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
                document.getElementById('username').innerHTML = `Dear ${data.name}, <br> Thank you for Reserving Train along with Presidio Railways.`
            })
            .catch(error => {
                console.error('Error fetching User:', error);
                alert('Failed to fetch User. Please try again later.');
            });
        }

        async function fetchTrainDetail() {
            fetch(`http://localhost:5062/api/User/GetTrainById`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
            }).then(async (response) => {
                var data = await response.json();
                console.log(data)
                document.getElementById('trainname').innerHTML = data.trainName
            }).catch(error => {
                console.error(error);
            });
          }

        
          async function fetchReservationDetail() {
            fetch(`http://localhost:5062/api/User/GetReservationById`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
            }).then(async (response) => {
                var data = await response.json();
                console.log(data)
                document.getElementById('departure').innerHTML = data.startingPoint
                document.getElementById('destination').innerHTML = data.endingPoint
                document.getElementById('total').innerHTML = `INR ${data.amount}`
                document.getElementById('totals').innerHTML = `INR ${data.amount}`
                document.getElementById('totalg').innerHTML = `INR ${data.amount}`
                document.getElementById('class').innerHTML = `${data.trainClassName}`
            }).catch(error => {
                console.error(error);
            });
          }
    }
})