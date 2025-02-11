const form = document.querySelector('#form')
const userid = document.querySelector('#userid');
const productsContainer = document.getElementById('products-container');
const pagination = document.getElementById('pagination');

async function getFormattedDate(date) {
    console.log("date:"+date)
    const year = await date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}
async function calculatetotal() {
    const userSelectedDate = localStorage.getItem('searchdate')
    const userSelectedDate1 = new Date(userSelectedDate);
    const converteddate = await getFormattedDate(userSelectedDate1)
    console.log(converteddate)
    const response = await fetch('http://localhost:5062/api/User/FutureBookingsCount', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(localStorage.getItem('userid'))
    })


    // if (!response.ok) {
    //     const data = await response.json();
    //     console.log(data.errorCode)
    //     alert(data.message);
    // }

    const count = await response.json();
    console.log("Serach Trains Count:", count);
    return count; 
}

async function convertDateTime(date){

    const arrivalDateTimeStr = date;
    const arrivalDateTime = new Date(arrivalDateTimeStr);

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

    const arrivalDate = arrivalDateTime.toLocaleDateString('en-US', dateOptions);
    const arrivalTime = arrivalDateTime.toLocaleTimeString('en-US', timeOptions);

    const userConveyableArrivalDateTime = `on ${arrivalDate}`;

    console.log("ConvertedTime"+userConveyableArrivalDateTime);
    return userConveyableArrivalDateTime;
}

async function convertDateTime2(date){

  const arrivalDateTimeStr = date;
  const arrivalDateTime = new Date(arrivalDateTimeStr);

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

  const arrivalDate = arrivalDateTime.toLocaleDateString('en-US', dateOptions);
  const arrivalTime = arrivalDateTime.toLocaleTimeString('en-US', timeOptions);

  const userConveyableArrivalDateTime = `At ${arrivalTime}`;
  
  console.log("ConvertedTime"+userConveyableArrivalDateTime);
  return userConveyableArrivalDateTime;
}
 
async function fetchData(total) {
    const userSelectedDate = localStorage.getItem('searchdate')
    const userSelectedDate1 = new Date(userSelectedDate);
    const converteddate = await getFormattedDate(userSelectedDate1)
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page') || 1);
    const itemsPerPage = parseInt(urlParams.get('limit') || 3);
    const skip = (currentPage - 1) * itemsPerPage;
    await fetch(`http://localhost:5062/api/User/UpcomingReservations?limit=${itemsPerPage}&skip=${skip}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(localStorage.getItem('userid'))
    }).then(async (response) => {
        const spinnerEl = document.querySelector('.spinner-border');
        spinnerEl.style.display = 'none';
        var data = await response.json();
        // console.log(data);
        data.forEach(element => {
            console.log(element)
            renderProducts(element);
        });
        createPagination(total, currentPage, itemsPerPage);
    }).catch(error => {
        console.error(error);
    });
}

async function createTrainCard(product) {

    const card = document.createElement('div');
    card.classList.add('col', 'mb-3');
  
    const cardInner = document.createElement('div');
    cardInner.classList.add('card');
  
    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top');
    cardImg.src = "./assets/traincard1.jpg"; 
    cardInner.appendChild(cardImg);
  
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
  
    const cardTitle = document.createElement('h5');

    cardTitle.classList.add('card-title');
    cardTitle.textContent = product.trainName; 
    cardBody.appendChild(cardTitle);

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = product.description;
    cardBody.appendChild(cardText);
    
    const textSpan = document.createElement('span');
    textSpan.innerHTML = `<span style="color : red"><i class="bi bi-geo-alt-fill"></i></span> <span style="font-weight: bold;"> Train Departure Platform:</span> <span style="color: red">${product.startingPoint}</span>`;
    const cardText2 = document.createElement('p');
    cardText2.classList.add('card-text');
    cardText2.appendChild(textSpan);
    cardBody.appendChild(cardText2);

    const textSpan2 = document.createElement('span');
    textSpan2.innerHTML = `<span style="color : green"><i class="bi bi-geo-alt-fill"></i></span> <span style="font-weight: bold;"> Train Destination Platform:</span> <span style="color: green">${product.endingPoint}</span>`;
    const cardText3 = document.createElement('p');
    cardText3.classList.add('card-text');
    cardText3.appendChild(textSpan2);
    cardBody.appendChild(cardText3);

    const datestring = await convertDateTime(product.trainDate)
    const textSpan3 = document.createElement('span');
    textSpan3.innerHTML = `<span style="color : red"><i class="bi bi-calendar-check"></i></span> <span style="font-weight: bold;"> Train Date:</span> <span style="color: red">${datestring}</span>`;
    const cardText4 = document.createElement('p');
    cardText4.classList.add('card-text');
    cardText4.appendChild(textSpan3);
    cardBody.appendChild(cardText4);

    if(product.reservationStatus === "PaymentBending"){
        const textSpan4 = document.createElement('span');
        textSpan4.innerHTML = `<span style="color : red"><i class="bi bi-wallet-fill"></i></span> <span style="font-weight: bold;"> Reservation Status:</span> <span style="color: red">${product.reservationStatus}</span>`;
        const cardText5 = document.createElement('p');
        cardText5.classList.add('card-text');
        cardText5.appendChild(textSpan4);
        cardBody.appendChild(cardText5);
    }
    else{
        const textSpan4 = document.createElement('span');
        textSpan4.innerHTML = `<span style="color : green"><i class="bi bi-wallet-fill"></i></span> <span style="font-weight: bold;"> Reservation Status:</span> <span style="color: green">${product.reservationStatus}</span>`;
        const cardText5 = document.createElement('p');
        cardText5.classList.add('card-text');
        cardText5.appendChild(textSpan4);
        cardBody.appendChild(cardText5);
    }
    // const timestring2 = await convertDateTime(product.endDate)
    // const textSpan5 = document.createElement('span');
    // textSpan5.innerHTML = `<span style="color : green"><i class="bi bi-calendar-check-fill"></i></span> <span style="font-weight: bold;"> Arrival Date:</span> <span style="color: green">${timestring2}</span>`;
    // const cardText6 = document.createElement('p');
    // cardText6.classList.add('card-text');
    // cardText6.appendChild(textSpan5);
    // cardBody.appendChild(cardText6);

    // const timestring3 = await convertDateTime2(product.endDate)
    // const textSpan6 = document.createElement('span');
    // textSpan6.innerHTML = `<span style="color : green"><i class="bi bi-clock-fill"></i></span> <span style="font-weight: bold;"> Arrival Time:</span> <span style="color: green">${timestring3}</span>`;
    // const cardText7 = document.createElement('p');
    // cardText7.classList.add('card-text');
    // cardText7.appendChild(textSpan6);
    // cardBody.appendChild(cardText7);
  
    const bottomRow = document.createElement('div');
    bottomRow.classList.add('mb-5', 'd-flex', 'justify-content-between');

    if(product.reservationStatus === "PaymentBending"){
        const buyButton1 = document.createElement('button');
        buyButton1.classList.add('btn', 'btn-primary');
        buyButton1.textContent = 'Pay';
        bottomRow.appendChild(buyButton1);

        buyButton1.addEventListener('click', async function() {
          localStorage.setItem('TrainIdDetails', product.trainId);
          localStorage.setItem('ReservationId', product.reservationId);
          localStorage.setItem('amount', product.amount);
          await addPayment();
          // window.open('https://buy.stripe.com/test_aEUcQP8JpdJKf3a144', '_blank');
         });
    }else{
        const buyButton2 = document.createElement('button');
        buyButton2.classList.add('btn', 'btn-primary');
        buyButton2.textContent = 'Cancel';
        bottomRow.appendChild(buyButton2);

        buyButton2.addEventListener('click', function() {
          localStorage.setItem('ReservationId', product.reservationId);
          localStorage.setItem('amount', product.amount);
        //   window.open('CancelReservation.html', '_blank');
            window.location.href = 'CancelReservation.html'; 
         });

        const textSpan9 = document.createElement('span');
        textSpan9.innerHTML = `<span style="color : green"><i class="bi bi-receipt"></i></span> <span style="font-weight: bold;"> Download Invoice:</span> <span style="color: red"><a href="PaymentSuccess.html" style="color: green;text-decoration: underline">Download</a></span>`;
        const cardText9 = document.createElement('p');
        cardText9.classList.add('card-text');
        cardText9.appendChild(textSpan9);
        cardBody.appendChild(cardText9);

     
    }
    
    const buyButton = document.createElement('button');
    buyButton.classList.add('btn', 'btn-primary');
    buyButton.textContent = 'Info';
    bottomRow.appendChild(buyButton);

    buyButton.addEventListener('click', function() {
        localStorage.setItem('TrainIdDetails', product.trainId);
        // window.location.href = 'TrainDetails.html';
        // window.open('TrainDetails.html', '_blank');
        window.location.href = 'TrainDetails.html'; 
    });
  
    cardBody.appendChild(bottomRow);
    cardInner.appendChild(cardBody);
    card.appendChild(cardInner);
  
    return card;
  }

  async function renderProducts(data) {
    productsContainer.innerHTML = ''; 
    const productCard = await createTrainCard(data);
    console.log(productCard.title)
    productsContainer.appendChild(productCard);
  }

  function createPagination(totalProducts, currentPage, itemsPerPage) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; 
  
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
  
    let prevButton;
    if (currentPage > 1) {
      prevButton = document.createElement('a');
      prevButton.classList.add('page-link');
      prevButton.href = `?page=${currentPage - 1}&limit=${itemsPerPage}`;
      prevButton.textContent = 'Previous';
      paginationContainer.appendChild(prevButton);
    }
  
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.classList.add('page-link');
      pageLink.href = `?page=${i}&limit=${itemsPerPage}`;
      pageLink.textContent = i;
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
      paginationContainer.appendChild(pageLink);
    }
  
    let nextButton;
    if (currentPage < totalPages) {
      nextButton = document.createElement('a');
      nextButton.classList.add('page-link');
      nextButton.href = `?page=${currentPage + 1}&limit=${itemsPerPage}`;
      nextButton.textContent = 'Next';
      paginationContainer.appendChild(nextButton);
    }
  }

  async function run(){
    const userid = localStorage.getItem('userid')
    if(userid == null){
        Toastify({
            text: "Hey User, Login to See Future Reservations!",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            callback: function() {
                window.open('index.html'); // Redirect after toast disappears
            }
        }).showToast();
    }else{
      const total = await calculatetotal();
      console.log("Total:", total);
      if(total>0){
        fetchData(total);
      }else{
        Toastify({
            text: "Hey User, No Future Reservations Found!",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        const spinnerEl = document.querySelector('.spinner-border');
        spinnerEl.style.display = 'none';
        document.getElementById('noresulttext').innerHTML = 'No Upcoming Reservations Found '
      }
    }
  }
  
  run()


  async function getTodayDateTime() {
    const today = new Date();
  
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    const hours = String(today.getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
    const minutes = String(today.getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
    const seconds = String(today.getSeconds()).padStart(2, '0'); // Add leading zero for single-digit seconds
    const milliseconds = today.getMilliseconds();
  
    // Combine and format the date and time
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  
    return formattedDateTime;
  }


async function addPayment(){

    Toastify({
        text: "Please Hold On, Redirecting to Payment Page...",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    const amountString = localStorage.getItem('amount');
    const reservationid = localStorage.getItem('ReservationId')
    const userid = localStorage.getItem('userid');

    const paymentDate = await getTodayDateTime();

    await fetch('http://localhost:5062/api/User/ReservationPayment', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "paymentDate": paymentDate,
                "amount": parseFloat(amountString),
                "paymentMethod": "UPI",
                "status": "Success",
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
            window.location.href = 'https://buy.stripe.com/test_aEUcQP8JpdJKf3a144';
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

