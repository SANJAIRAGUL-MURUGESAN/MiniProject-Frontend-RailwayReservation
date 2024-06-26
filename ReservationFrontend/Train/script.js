// Toggle mobile navigation menu
const menuButton = document.querySelector('.btn2');
const mobileNavLinks = document.querySelector('.nav__links--mobile');

menuButton.addEventListener('click', () => {
mobileNavLinks.style.display =
  mobileNavLinks.style.display === 'flex' ? 'none' : 'flex';
});

const loggedInLinks = document.querySelector('.nav__links');
const loggedInLinksMobile = document.querySelector('.nav__links--mobile');

async function clearAllLocalStorage() {
  const storage = window.localStorage;
  const keys = Object.keys(storage); // Get all keys as an array

  for (const key of keys) {
    storage.removeItem(key);
  }
}

async function updateNavLinks() {
  const userId = localStorage.getItem('userid');
  if (userId) {

    const loggedInLinkHome = document.createElement('li');
    loggedInLinkHome.classList.add('link');
    loggedInLinkHome.innerHTML = `<a href="index.html">Home</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkHome);

    const loggedInLinkTrain = document.createElement('li');
    loggedInLinkTrain.classList.add('link');
    loggedInLinkTrain.innerHTML = `<a href="GetUserFutureReservations.html">Trains</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkTrain);

    const loggedInLinkprofile = document.createElement('li');
    loggedInLinkprofile.classList.add('link');
    loggedInLinkprofile.innerHTML = `<a href="UserProfile.html">Profile</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkprofile);

    const loggedInLinkOut = document.createElement('li');
    loggedInLinkOut.classList.add('link');
    loggedInLinkOut.innerHTML = `<a href="#">Logout</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkOut);

    loggedInLinkOut.addEventListener('click', async(event) => {
      console.log('Logout')
      await clearAllLocalStorage();
      window.open('index.html', '_blank');
    });

    const loggedInLinkHomem = document.createElement('li');
    loggedInLinkHomem.classList.add('link');
    loggedInLinkHomem.innerHTML = `<a href="index.html">Home</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkHomem)

    const loggedInLinkTrainm = document.createElement('li');
    loggedInLinkTrainm.classList.add('link');
    loggedInLinkTrainm.innerHTML = `<a href="GetUserFutureReservations.html">Trains</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkTrainm)

    const loggedInLinkprofilem = document.createElement('li');
    loggedInLinkprofilem.classList.add('link');
    loggedInLinkprofilem.innerHTML = `<a href="UserProfile.html">Profile</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkprofilem)

    const loggedInLinkOutm = document.createElement('li');
    loggedInLinkOutm.classList.add('link');
    loggedInLinkOutm.innerHTML = `<a href="#">Logout</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkOutm)

    loggedInLinkOutm.addEventListener('click', async(event) => {
      console.log('Logout')
      await clearAllLocalStorage();
      window.open('index.html', '_blank');
    });

  }else{

    const loggedInLinkHome = document.createElement('li');
    loggedInLinkHome.classList.add('link');
    loggedInLinkHome.innerHTML = `<a href="index.html">Home</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkHome);

    const loggedInLinkin = document.createElement('li');
    loggedInLinkin.classList.add('link');
    loggedInLinkin.innerHTML = `<a href="UserLogin.html">Login</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkin);

    const loggedInLinkr = document.createElement('li');
    loggedInLinkr.classList.add('link');
    loggedInLinkr.innerHTML = `<a href="UserRegister.html">Register</a>`; // Replace with your desired link
    loggedInLinks.appendChild(loggedInLinkr);
  
    const loggedInLinkHomem = document.createElement('li');
    loggedInLinkHomem.classList.add('link');
    loggedInLinkHomem.innerHTML = `<a href="index.html">Home</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkHomem)

    const loggedInLinkHomein = document.createElement('li');
    loggedInLinkHomein.classList.add('link');
    loggedInLinkHomein.innerHTML = `<a href="UserLogin.html">Login</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkHomein)

    const loggedInLinkrm = document.createElement('li');
    loggedInLinkrm.classList.add('link');
    loggedInLinkrm.innerHTML = `<a href="UserRegister.html">Register</a>`; // Replace with your desired link
    loggedInLinksMobile.appendChild(loggedInLinkrm);

  }
}

updateNavLinks(); // Call the function on page load

