const form1 = document.querySelector('#form1')
const startingpoint1 = document.querySelector('#startingpoint1');
const endingpoint1 = document.querySelector('#endingpoint1');
const date1 = document.querySelector('#date1');

form1.addEventListener('submit',(e)=>{
    console.log(date1.value)
    // if(!validateInputs()){
        e.preventDefault();
    // }
    console.log()
    localStorage.setItem('startingpoint','');
    localStorage.setItem('endingpoint','');
    localStorage.setItem('searchdate','');
    localStorage.setItem('startingpoint',startingpoint1.value.trim());
    localStorage.setItem('endingpoint',endingpoint1.value.trim());
    localStorage.setItem('searchdate',date1.value);

    form1.reset();
    
    window.open('SearchTrainResult.html', '_blank');

})


