// async function getTodayDateTime() {
//     const today = new Date();
  
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
//     const day = String(today.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
//     const hours = String(today.getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
//     const minutes = String(today.getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
//     const seconds = String(today.getSeconds()).padStart(2, '0'); // Add leading zero for single-digit seconds
//     const milliseconds = today.getMilliseconds();
  
//     // Combine and format the date and time
//     const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  
//     return formattedDateTime;
//   }


  document.addEventListener("DOMContentLoaded", function() {
    Toastify({
      text: "Hey User, Its a Successful Payment! Hold on, Redirecting...",
      style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      callback: function() {
        window.open('Invoice.html'); // Redirect after toast disappears
      }
  }).showToast();
});

// async function addUnReservation(){

//     const amountString = localStorage.getItem('amount');
//     const reservationid = localStorage.getItem('ReservationId')
//     const userid = localStorage.getItem('userid');

//     const paymentDate = await getTodayDateTime();

//     await fetch('http://localhost:5062/api/User/ReservationPayment', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer '+localStorage.getItem('token'),
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//                 "paymentDate": paymentDate,
//                 "amount": parseFloat(amountString),
//                 "paymentMethod": "UPI",
//                 "status": "Success",
//                 "reservationId": parseInt(reservationid)
//         })
//     })
//     .then(async res => {
//         const data = await res.json();
//         console.log(data)
//         if (!res.ok) {
//             // console.log(data.errorCode)
//             console.log('hi')
//             // alert(data.message);
//             Toastify({
//                 text: data.message,
//                 style: {
//                     background: "linear-gradient(to right, #00b09b, #96c93d)",
//                 }
//             }).showToast();
//         }else{
//             Toastify({
//                 text: "Hey User, Payment Successful! Redirecting...",
//                 style: {
//                     background: "linear-gradient(to right, #00b09b, #96c93d)",
//                 },
//                 callback: function() {
//                   window.open('index.html'); // Redirect after toast disappears
//                 }
//             }).showToast();
//         }
//     })
//     .catch(error => {
//         // alert(error);
//         Toastify({
//             text: error.message,
//             style: {
//                 background: "linear-gradient(to right, #00b09b, #96c93d)",
//             }
//         }).showToast();
//     });
// }
