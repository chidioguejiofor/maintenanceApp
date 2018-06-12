let apiHost = 'http://localhost:3232';
if (window.location.href.includes('localhost')) {
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
  fetch(url, requestOptions)
    .then((res) => {
      if (res.status === 204) {
        callback({
          success: true,
          statusCode: 204,
        });
      } else {
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
    data[key] = value;
  });

  return data;
}

function closeModal(event, id = 'modal') {
  document.getElementById(id)
    .style.display = 'none';
}

function showModal(event, id = 'modal') {
  event.preventDefault();
  document.getElementById(id)
    .style.display = 'block';
}

function capitalise(str) {
  const string = str.trim()
    .substring(0, 1)
    .toUpperCase() + str.substring(1);
  return string;
}


function handleError(error, statusDiv) {
  console.log(error);
  statusDiv.className = 'status-div failedStatus';
  statusDiv.innerText = 'Failed to send request please check your connection';
  setTimeout(() => {
    statusDiv.className = 'status-hide';
  }, 7000);
}


function showStatusOnFailed(statusContainer, response) {
  const statusDiv = statusContainer;
  const badList = document.createElement('ul');
  if (response.missingData) {
    response.missingData.forEach((missingItem) => {
      if (missingItem !== 'userType') {
        const li = document.createElement('li');
        const inputElement =
            document.querySelector(`
                input[name=${missingItem}], 
                textarea[ name=${missingItem}]`);
        inputElement.className = 'badData';
        inputElement.innerText = '';
        inputElement.placeholder = `${missingItem} field is required`;

        li.textContent = `${capitalise(missingItem)} field is required`;
        badList.appendChild(li);
      }
    });
  } else if (response.invalidData) {
    Object.keys(response.invalidData).forEach((invalidItem) => {
      if (invalidItem !== 'userType') {
        const li = document.createElement('li');
        const inputElement =
                document.querySelector(`
                    input[name=${invalidItem}], 
                    textarea[ name=${invalidItem}]`);

        inputElement.className = 'badData';
        inputElement.placeholder = `${invalidItem} ${response.invalidData[invalidItem]}`;
        li.textContent = `${capitalise(invalidItem)} ${response.invalidData[invalidItem]}`;
        badList.appendChild(li);
      }
    });
  }


  console.dir(badList);
  statusDiv.className = 'status-div failedStatus';
  const firstList = document.createElement('li');

  firstList.textContent = response.message;
  badList.prepend(firstList);

  statusDiv.textContent = '';
  statusDiv.appendChild(badList);
  setTimeout(() => {
    statusDiv.className = 'status-hide';
  }, 7000);
}


function updateModalHelper(response, buttonsExists = false) {
  const displays = Array.from(document.body.querySelectorAll('*[data-name]'));
  let hideControls;
  let showControls;
  displays.forEach((newDisplay) => {
    const display = newDisplay;
    const property = display.dataset.name;

    let value = response.data[property];
    if (property === 'date') {
      value = new Date(value).toDateString();
    }
    if (display.tagName.match(/input|textarea/i)) {
      display.value =
                `${value}`;
    } else if (property === 'status') {
      display.innerHTML =
            `<a class = "${value}">${value}</a>`;
    } else {
      display.textContent =
      `${value}`;
    }
  });

  if (buttonsExists) {
    if (response.data.status === 'approved') {
      hideControls = document.getElementById('notRespondedControls');
      showControls = document.getElementById('respondedControls');
    } else {
      hideControls = document.getElementById('respondedControls');
      showControls = document.getElementById('notRespondedControls');
    }

    hideControls.style.display = 'none';
    showControls.style.display = 'block';
    showControls.opacity = 1;
    hideControls.opacity = 0;
    showControls.parentElement.dataset.id = response.data.id;
  }
}

function updateStatus(id, status, message = '') {
  const options = {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('loginToken'),
    }),
    mode: 'cors',
    body: JSON.stringify({ message }),
  };

  const endPoint = `/requests/${id}/${status}`;
  consumeAPI(endPoint, options, (response) => {
    if (response.statusCode === 201) {
      updateModalHelper(response, true);
    }
  }, error => handleError(error, statusDiv));
}

