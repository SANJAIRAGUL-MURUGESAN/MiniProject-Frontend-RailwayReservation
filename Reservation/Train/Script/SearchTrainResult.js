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
    const response = await fetch('http://localhost:5062/api/User/SerachTrainCount', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "startingPoint": localStorage.getItem('startingpoint'),
            "endingPoint": localStorage.getItem('endingpoint'),
            "trainStartDate": converteddate
        })
    })

    if (!response.ok) {
        const data = await response.json();
        console.log(data.errorCode)
        alert(data.message);
    }

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
    fetch(`http://localhost:5062/api/User/SearchTrainByUser/Location?limit=${itemsPerPage}&skip=${skip}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "startingPoint": localStorage.getItem('startingpoint'),
            "endingPoint": localStorage.getItem('endingpoint'),
            "trainStartDate": converteddate
        })
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

    const datestring = await convertDateTime(product.startDate)
    const textSpan3 = document.createElement('span');
    textSpan3.innerHTML = `<span style="color : red"><i class="bi bi-calendar-check"></i></span> <span style="font-weight: bold;"> Departure Date:</span> <span style="color: red">${datestring}</span>`;
    const cardText4 = document.createElement('p');
    cardText4.classList.add('card-text');
    cardText4.appendChild(textSpan3);
    cardBody.appendChild(cardText4);

    const timestring = await convertDateTime2(product.startDate)
    const textSpan4 = document.createElement('span');
    textSpan4.innerHTML = `<span style="color : red"><i class="bi bi-clock"></i></span> <span style="font-weight: bold;"> Departure Time:</span> <span style="color: red">${timestring}</span>`;
    const cardText5 = document.createElement('p');
    cardText5.classList.add('card-text');
    cardText5.appendChild(textSpan4);
    cardBody.appendChild(cardText5);

    const timestring2 = await convertDateTime(product.endDate)
    const textSpan5 = document.createElement('span');
    textSpan5.innerHTML = `<span style="color : green"><i class="bi bi-calendar-check-fill"></i></span> <span style="font-weight: bold;"> Arrival Date:</span> <span style="color: green">${timestring2}</span>`;
    const cardText6 = document.createElement('p');
    cardText6.classList.add('card-text');
    cardText6.appendChild(textSpan5);
    cardBody.appendChild(cardText6);

    const timestring3 = await convertDateTime2(product.endDate)
    const textSpan6 = document.createElement('span');
    textSpan6.innerHTML = `<span style="color : green"><i class="bi bi-clock-fill"></i></span> <span style="font-weight: bold;"> Arrival Time:</span> <span style="color: green">${timestring3}</span>`;
    const cardText7 = document.createElement('p');
    cardText7.classList.add('card-text');
    cardText7.appendChild(textSpan6);
    cardBody.appendChild(cardText7);
  
    const bottomRow = document.createElement('div');
    bottomRow.classList.add('mb-5', 'd-flex', 'justify-content-between');
    
    const buyButton = document.createElement('button');
    buyButton.classList.add('btn', 'btn-primary');
    buyButton.textContent = 'Reserve';
    bottomRow.appendChild(buyButton);

    buyButton.addEventListener('click', function() {
        localStorage.setItem('TrainIdDetails', product.trainId);
        // window.location.href = 'TrainDetails.html';
        window.open('TrainDetails.html', '_blank');
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
    const total = await calculatetotal();
    console.log("Total:", total);
    if(total>0){
      fetchData(total);
    }else{
      document.getElementById('noresulttext').innerHTML = 'No Trains Found for your Search'
    }
  }
  
  run()


