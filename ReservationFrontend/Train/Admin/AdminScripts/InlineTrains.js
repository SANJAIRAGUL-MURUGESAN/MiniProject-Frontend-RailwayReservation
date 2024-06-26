const productsContainer = document.getElementById('products-container');
const pagination = document.getElementById('pagination');

async function calculatetotal() {

    const response = await fetch('http://localhost:5062/api/Admin/GetAllInlineTrainsByAdminTotal', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
    })

    if (!response.ok) {
        const data = await res.json();
        console.log(data.errorCode)
        alert(data.message);
    }

    const count = await response.json();
    console.log("Total Inline Trains:", count);
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
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page') || 1);
    const itemsPerPage = parseInt(urlParams.get('limit') || 3);
    const skip = (currentPage - 1) * itemsPerPage;
    fetch(`http://localhost:5062/api/Admin/GetAllInlineTrainsByAdmin?limit=${itemsPerPage}&skip=${skip}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
         },
    }).then(async (response) => {
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
    cardImg.src = "../assets/traincard1.jpg"; 
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
    // <i class="far fa-map-marker-alt"></i>

    // const iconElement = document.createElement('i');
    // iconElement.classList.add('far', 'fa-map-marker-alt');

    // const cardText2 = document.createElement('p');
    // cardText2.classList.add('card-text')
    // cardText2.textContent = "Train Departure platform : "+product.startingPoint;
    // cardBody.appendChild(iconElement)
    // cardBody.appendChild(cardText2);

    // Create a <span> element to wrap the text
    // const iconElement = document.createElement('i');
    // iconElement.classList.add('bi','bi-geo-alt-fill')
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

    const datestring = await convertDateTime(product.arrivalTime)
    const textSpan3 = document.createElement('span');
    textSpan3.innerHTML = `<span style="color : red"><i class="bi bi-calendar-check"></i></span> <span style="font-weight: bold;"> Departure Date:</span> <span style="color: red">${datestring}</span>`;
    const cardText4 = document.createElement('p');
    cardText4.classList.add('card-text');
    cardText4.appendChild(textSpan3);
    cardBody.appendChild(cardText4);

    const timestring = await convertDateTime2(product.arrivalTime)
    const textSpan4 = document.createElement('span');
    textSpan4.innerHTML = `<span style="color : red"><i class="bi bi-clock"></i></span> <span style="font-weight: bold;"> Departure Time:</span> <span style="color: red">${timestring}</span>`;
    const cardText5 = document.createElement('p');
    cardText5.classList.add('card-text');
    cardText5.appendChild(textSpan4);
    cardBody.appendChild(cardText5);

    const timestring2 = await convertDateTime(product.trainEndDate)
    const textSpan5 = document.createElement('span');
    textSpan5.innerHTML = `<span style="color : green"><i class="bi bi-calendar-check-fill"></i></span> <span style="font-weight: bold;"> Arrival Date:</span> <span style="color: green">${timestring2}</span>`;
    const cardText6 = document.createElement('p');
    cardText6.classList.add('card-text');
    cardText6.appendChild(textSpan5);
    cardBody.appendChild(cardText6);

    const timestring3 = await convertDateTime2(product.trainEndDate)
    const textSpan6 = document.createElement('span');
    textSpan6.innerHTML = `<span style="color : green"><i class="bi bi-clock-fill"></i></span> <span style="font-weight: bold;"> Arrival Time:</span> <span style="color: green">${timestring3}</span>`;
    const cardText7 = document.createElement('p');
    cardText7.classList.add('card-text');
    cardText7.appendChild(textSpan6);
    cardBody.appendChild(cardText7);



  
    const bottomRow = document.createElement('div');
    bottomRow.classList.add('mb-5', 'd-flex', 'justify-content-between');
  
    // const price = document.createElement('h4');
    // price.textContent = `Status : ${product.trainStatus}`;
    // bottomRow.appendChild(price);

    // const buyButton1 = document.createElement('button');
    // buyButton1.classList.add('btn', 'btn-primary');
    // buyButton1.textContent = 'More';
    // bottomRow.appendChild(buyButton1);
  
    const buyButton = document.createElement('button');
    buyButton.classList.add('btn', 'btn-primary');
    buyButton.textContent = 'Edit';
    bottomRow.appendChild(buyButton);

    buyButton.addEventListener('click', function() {
      // Store trainName in localStorage
      localStorage.setItem('reservedTrainName', product.trainName);
      localStorage.setItem('TrainIdDetails', product.trainId);
      window.open('TrainDetails.html', '_blank');
      // You can also redirect or perform other actions here if needed
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
            text: "Hey Admin, Login to See Inline Trains! Redirecting...",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            callback: function() {
              window.open('AdminHome.html'); // Redirect after toast disappears
            }
        }).showToast();
    }else{
      const total = await calculatetotal();
      console.log("Total:", total);
      if(total>0){
        fetchData(total);
      }else{
        document.getElementById('noresulttext').innerHTML = 'No Upcoming Reservations Found '
      }
    }
    
    // fetchData(total);
  }
  
  run()


