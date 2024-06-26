const trainContainer = document.querySelector(".trains-container");

function createFakeCheckbox(i,reservedSeats) {
  const fakeCheckbox = document.createElement("div");
  fakeCheckbox.classList.add("fake-checkbox");
  fakeCheckbox.innerHTML = `<span>${i}</span>`;
  fakeCheckbox.style.backgroundColor = reservedSeats.includes(i) ? 'grey' : 'white';
  return fakeCheckbox;
}

async function SeatDisplay(totol,reservedSeats){
  for (let i = 1; i <= totol; i++) {
    const fakeCheckbox = createFakeCheckbox(i,reservedSeats);
    trainContainer.appendChild(fakeCheckbox);
  }
}

async function fetchSeatData() {
  fetch(`http://localhost:5062/api/User/CheckSeatDetailsofTrain`, {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer '+localStorage.getItem('token'),
          'Content-Type': 'application/json',
       },
       body: JSON.stringify(localStorage.getItem('TrainIdDetails'))
  }).then(async (response) => {
      var data = await response.json();
      console.log(data);
      await SeatDisplay(data.totalSeat,data.reservedSeats);
      // data.forEach(element => {
      //     console.log(element)
      //     renderProducts(element);
      // });
  }).catch(error => {
      console.error(error);
  });
}


async function convertDateTime(date){

  const arrivalDateTimeStr = date;
  const arrivalDateTime = new Date(arrivalDateTimeStr);

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

  const arrivalDate = arrivalDateTime.toLocaleDateString('en-US', dateOptions);
  const arrivalTime = arrivalDateTime.toLocaleTimeString('en-US', timeOptions);

  const userConveyableArrivalDateTime = `${arrivalDate}`;

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

  const userConveyableArrivalDateTime = `${arrivalTime}`;
  
  console.log("ConvertedTime"+userConveyableArrivalDateTime);
  return userConveyableArrivalDateTime;
}

var startingPoint;
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
      document.getElementById('title').innerHTML = data.trainName
      document.getElementById('titled').innerHTML = `${data.trainName} - Seat Details`
      renderProducts(data.startingPoint,data.trainStartDate,data.arrivalTime,data.departureTime);
  }).catch(error => {
      console.error(error);
  });
}

async function fetchTrainData() {
  fetch(`http://localhost:5062/api/User/GetTrainRoutes`, {
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
          await renderProducts(element.stationName,element.routeEndDate,element.arrivalTime,element.departureTime);
      });
      // await fetchTrainDetail()
  }).catch(error => {
      console.error(error);
  });
}

const productsContainer = document.getElementById('tracking-list');

// Function to create and append a tracking item
async function createProduct(stationName,routeStartDate,arrivalTime,departureTime) {

const card = document.createElement('div');
card.classList.add('tracking-item');

const iconDiv = document.createElement('div');
iconDiv.classList.add('tracking-icon', 'status-inforeceived');

const trainIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
trainIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
trainIcon.setAttribute('width', '16');
trainIcon.setAttribute('height', '16');
trainIcon.setAttribute('fill', 'currentColor');
trainIcon.setAttribute('class', 'bi bi-train-freight-front-fill');
trainIcon.setAttribute('viewBox', '0 0 16 16');
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('d', 'M5.736 0a1.5 1.5 0 0 0-.67.158L1.828 1.776A1.5 1.5 0 0 0 1 3.118v5.51l2-.6V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.028l2 .6v-5.51a1.5 1.5 0 0 0-.83-1.342L10.936.158A1.5 1.5 0 0 0 10.264 0zM15 9.672l-5.503-1.65A.5.5 0 0 0 9.353 8H8.5v8h4a2.5 2.5 0 0 0 2.5-2.5zM7.5 16V8h-.853a.5.5 0 0 0-.144.021L1 9.672V13.5A2.5 2.5 0 0 0 3.5 16zm-1-14h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1M12 5v2.728l-2.216-.665A1.5 1.5 0 0 0 9.354 7H8.5V5zM7.5 5v2h-.853a1.5 1.5 0 0 0-.431.063L4 7.728V5zm-4 5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m9 0a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1M5 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2');
trainIcon.appendChild(path);

iconDiv.appendChild(trainIcon);

card.appendChild(iconDiv);

const convertedDate = await convertDateTime(routeStartDate)
const convertedDate2 = await convertDateTime2(arrivalTime)
const dateDiv = document.createElement('div');
dateDiv.classList.add('tracking-date');
dateDiv.innerHTML = `${convertedDate}<span>${convertedDate2}</span>`;
card.appendChild(dateDiv);

const convertedDate3 = await convertDateTime2(departureTime)
const contentDiv = document.createElement('div');
contentDiv.classList.add('tracking-content');
contentDiv.innerHTML = `${stationName}<span>Departures At : ${convertedDate3}</span>`;
card.appendChild(contentDiv);

productsContainer.appendChild(card);
}

// Example data (replace with data coming from backend)
const exampleData = [
{
 date: 'Aug 10, 2018',
 time: '05:01 PM',
 description: 'DESTROYED PER SHIPPER INSTRUCTION',
 location: 'KUALA LUMPUR (LOGISTICS HUB), MALAYSIA, MALAYSIA'
},
{
  date: 'Jul 0vb6, 2018',
  time: '02:02 PM',
  description: 'Shipment designated to MALAYSIA.',
  location: 'HONG KONG, HONGKONG'
 },
 {
  date: 'Jul 0vb6, 2018',
  time: '02:02 PM',
  description: 'Shipment designated to MALAYSIA.',
  location: 'HONG KONG, HONGKONG'
 }
];

// Loop through example data and create tracking items
// exampleData.forEach(item => {
//  createProduct(item);
// });



async function renderProducts(stationName,routeStartDate,arrivalTime,departureTime) {
  const productCard = await createProduct(stationName,routeStartDate,arrivalTime,departureTime);
  // console.log(productCard.title)
  // productsContainer.appendChild(productCard);
}

// fetchSeatData()
// fetchTrainDetail()
// fetchTrainData()




const userid = localStorage.getItem('userid')
if(userid == null){
    Toastify({
        text: "Hey User, Login to See Train Details! Redirecting...",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        callback: function() {
            window.open('index.html'); // Redirect after toast disappears
        }
    }).showToast();
}else{
  fetchSeatData()
  fetchTrainDetail()
  fetchTrainData()
}