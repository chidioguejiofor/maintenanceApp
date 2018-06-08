let apiHost = 'http://localhost:3232';
if(location.href.includes('localhost')){
  apiHost = 'http://localhost:3232';
} else {
  apiHost = 'https://chidiebere-maintenance-api.herokuapp.com';
}
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  const replaceName = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${replaceName}(=([^&#]*)|&|#|$)`);

  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function consumeAPI(endPoint, requestOptions, callback, errorHandler) {
  const url = `${apiHost}/api/v1${endPoint}`;
  console.log(requestOptions.method +  url);
  fetch(url, requestOptions)
    .then((res) => {
      if(res.status === 204){
          callback({
            success: true,
            statusCode: 204,
          });
      } else{
        console.dir(res);
        res.json()
          .then((data) => {
            const finalObj = data;
            finalObj.statusCode = res.status;
            callback(finalObj);
          });
      }
    })
    .catch(error => errorHandler(error, false));
}

function getDataFromForm(form) {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    console.log(key, value);
    data[key] = value;
  });

  return data;
}

function closeModal(event){
  document.getElementById('modal')
    .style.display = 'none';
}

function showModal(event){
  event.preventDefault();
  document.getElementById('modal')
    .style.display = 'block';
}

function capitalise(str){
  const string =  str.trim()
  .substring(0,1)
  .toUpperCase() + str.substring(1);
  return string;
  
}


function showStatusOnFailed(statusDiv, response){
  const badList = document.createElement('ul');
  if (response.missingData) {
    response.missingData.forEach((missingItem) => {
      if (missingItem !== 'userType') {
        const li = document.createElement('li');
        const inputElement = 
            document.querySelector(`
                input[name=${missingItem}], 
                textarea[ name=${missingItem}]`);
        inputElement.className ='badData';
        inputElement.innerText = '';
        inputElement.placeholder = `${missingItem} field is required`;
        
        li.textContent = `${capitalise(missingItem)} field is required`;
        badList.appendChild(li);
      }
    });
  } else if (response.invalidData) {
        Object.keys(response.invalidData).forEach((invalidItem)=> {
          if (missingItem !== 'userType') {
            const li = document.createElement('li');
            const inputElement =
                document.querySelector(`
                    input[name=${invalidItem}], 
                    textarea[ name=${invalidItem}]`);
          
            inputElement.className ='badData';
            inputElement.placeholder = `${invalidItem} ${response.invalidData[invalidItem]}`;
            li.textContent = `${capitalise(invalidItem)} ${response.invalidData[invalidItem]}`;
            badList.appendChild(li);
          }
         
      });
  } 


  console.dir(badList);
  statusDiv.className= 'status-div failedStatus';
  const firstList = document.createElement('li');

  firstList.textContent = response.message;
  badList.prepend(firstList);

  statusDiv.textContent = '';
  statusDiv.appendChild(badList);
  setTimeout(()=> {
      statusDiv.className= 'status-hide';
  }, 7000);
}