
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
       await downloadInvoice();

       async function downloadInvoice(){
        function downloadInvoiceAsPDF() {
            const element = document.querySelector('.invoice'); // Select the element containing your invoice content
            const opt = {
                margin:       0.5,
                filename:     'ReservationPayment.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            // Use html2pdf library to generate PDF
            html2pdf().from(element).set(opt).save();
        }
        downloadInvoiceAsPDF();
       }

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
                document.getElementById('trainname').innerHTML = data.trainName
            }).catch(error => {
                console.error(error);
            });
          }

        
          async function fetchReservationDetail() {
            await fetch(`http://localhost:5062/api/User/GetReservationById`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(localStorage.getItem('ReservationId'))
            }).then(async (response) => {
                var data = await response.json();
                console.log(data)
                document.getElementById('departure').innerHTML = data.startingPoint
                document.getElementById('destination').innerHTML = data.endingPoint
                document.getElementById('total').innerHTML = `INR ${data.amount}`
                document.getElementById('totals').innerHTML = `INR ${data.amount}`
                document.getElementById('totalg').innerHTML = `INR ${data.amount}`
                document.getElementById('class').innerHTML = `${data.trainClassName}`
                await dateconvertion(data.reservationDate,data.reservationId)
            }).catch(error => {
                console.error(error);
            });
          }
    }
})

// Step 1: Parse the date string
async function dateconvertion(date,id){
    const dateString = date;
    const dateObj = new Date(dateString);

    // Step 2: Format the date as "1st July, 2024"
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-us', { month: 'long' });
    const year = dateObj.getFullYear();

    // Function to add ordinal suffix to day (st, nd, rd, th)
    function addOrdinalSuffix(day) {
        if (day >= 11 && day <= 13) {
            return day + 'th';
        }
        switch (day % 10) {
            case 1:  return day + 'st';
            case 2:  return day + 'nd';
            case 3:  return day + 'rd';
            default: return day + 'th';
        }
    }

    const formattedDate = `${addOrdinalSuffix(day)} ${month}, ${year}`;
    document.getElementById('date').innerHTML = `ReservationID:${id} <br>    ${formattedDate}`
    console.log(formattedDate);
}



// document.addEventListener("DOMContentLoaded", function() {
//     // Function to trigger PDF download
//     function downloadInvoiceAsPDF() {
//         const element = document.querySelector('.invoice'); // Select the element containing your invoice content
//         const opt = {
//             margin:       0.5,
//             filename:     'ReservationPayment.pdf',
//             image:        { type: 'jpeg', quality: 0.98 },
//             html2canvas:  { scale: 2 },
//             jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//         };
//         // Use html2pdf library to generate PDF
//         html2pdf().from(element).set(opt).save();
//     }
//     downloadInvoiceAsPDF();
//     // Add click event listener to the download button
//     // const downloadBtn = document.getElementById('downloadpdf');
//     // downloadBtn.addEventListener('click', function() {
//     //     downloadInvoiceAsPDF();
//     // });
// });


