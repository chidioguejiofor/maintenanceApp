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
      res.json()
        .then((data) => {
          const finalObj = data;
          finalObj.statusCode = res.status;
          callback(finalObj, true);
        });
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