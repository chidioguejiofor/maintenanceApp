const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/chidioguejiofor/image/upload';
const CLOUDINARY_PRESET = 'wnqidleo';
const DEFAULT_IMAGE = 'http://no_image.png';
let statusDiv ;
window.addEventListener('load', (event)=> {
    if(!localStorage.getItem('loginToken')){
        location.href = 'signinSignup.html?action=login';
    }
    statusDiv = document.getElementById('status');
    statusDiv.style.opacity = 0;
});

function createRequest(event){
    event.stopPropagation();
    event.preventDefault();
    const form = document.getElementById('request-form');
    const data = getDataFromForm(form);
    const reader = new FileReader();
    const file = document.querySelector('input[type=file]');
    console.log(file.files[0]);
    // const formData = new FormData();
    // formData.append('file', file.files[0]);
    // formData.append('upload_preset', CLOUDINARY_PRESET);
    // fetch(CLOUDINARY_URL, {
    //     headers:{
    //         'Content-Type': 'x-www-form-urlencoded',
    //     }, 
    //     method: 'POST',
    //     body:formData,
    //     data: formData,
    //     mode: 'cors',
    // })
    // .then((res)=> {
    //     return res.json();
    // })
    // .then(data => {
    //     console.log(data);
    // }); 

    data.image = DEFAULT_IMAGE;
    console.log(data.image);
    const options = {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: '*/*',
          'x-access-token': localStorage.getItem('loginToken'),
        }),
        mode: 'cors',
        body: JSON.stringify(data),
      };

      console.dir(options.body);
        consumeAPI('/users/requests', options, (response)=> {
            handleSuccess(response);

        }, (error)=> {
            handleError(error);
        } )
}

function handleSuccess(response){
    
        const className = statusDiv.className;
    if(response.success){
        statusDiv.style.opacity = 1;
        
        statusDiv.className= 'bottom-div okayStatus';
        statusDiv.innerText = 'Successfully created the new request';
        setTimeout(()=> {
            statusDiv.style.opacity = 0;
            location.href = 'requestsPage.html';
        }, 3000);

    } else {
        
        if(response.missingData){
            console.log(response.missingData);
            response.missingData.forEach((missingItem)=> {
                const inputElement = 
                    document.querySelector(`
                        input[name=${missingItem}], 
                        textarea[ name=${missingItem}]`);
                console.log(missingItem);
                inputElement.className ='badData';
                inputElement.innerText = '';
                inputElement.placeholder = 'This field is required';
            });
        } else if(response.invalidData){
            Object.keys(response.invalidData).forEach((invalidItem)=> {
                const inputElement =
                    document.querySelector(`
                        input[name=${invalidItem}], 
                        textarea[ name=${invalidItem}]`);
               
                inputElement.className ='badData';
                inputElement.value = '';
                inputElement.placeholder = response.invalidData[invalidItem];
                
               
            });
        }
        statusDiv.style.opacity = 1;
        
        statusDiv.className= 'bottom-div failedStatus';
        statusDiv.innerText = response.message;
        setTimeout(()=> {
            statusDiv.style.opacity = 0;
        }, 7000);
    }
}

function  handleError(error){
    statusDiv.style.opacity = 1;
        
    statusDiv.className= 'bottom-div failedStatus';
    statusDiv.innerText = 'Failed to send request please check your connection';
    setTimeout(()=> {
        statusDiv.style.opacity = 0;
    }, 7000);

}

function resetClass(event){
    event.target.className = '';
}