const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/maintenance-site/image/upload';
const CLOUDINARY_PRESET = 'vhlxwjgx';

const DEFAULT_IMAGE = '../images/no-image.png';
let statusDiv;
window.addEventListener('load', (event) => {
  if (!localStorage.getItem('loginToken')) {
    window.location.href = 'signinSignup.html?action=login';
  }
  statusDiv = document.getElementById('status');
});

function uploadFile(callback) {
  const form = document.getElementById('request-form');
  const data = getDataFromForm(form);
  const file = document.querySelector('input[type=file]');
  const formData = new FormData();
  if (!file.files[0]) {
    statusDiv.className = 'status-div failedStatus';
    statusDiv.innerText = 'You must select an image';
    setTimeout(() => {
      statusDiv.className = 'status-hide';
    }, 4000);
    return;
  }
  formData.append('file', file.files[0]);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  data.image = DEFAULT_IMAGE;
  statusDiv.className = 'status-div okayStatus';
  statusDiv.innerText = 'Uploading Image...';
  axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'x-www-form-urlencoded',
    },
  }).then((res) => {
    data.image = res.data.secure_url;
    statusDiv.className = 'status-hide';
    callback(data);
  }).catch(() => {
    data.image = DEFAULT_IMAGE;
    callback(data);
  });
}


function handleCreateSuccess(response) {
  if (response.success) {
    statusDiv.className = 'status-div okayStatus';

    statusDiv.innerText = 'Successfully created the new request';
    setTimeout(() => {
      statusDiv.className = 'status-hide';
      window.location.href = 'requestsPage.html';
    }, 3000);
  } else if (response.statusCode === 404) {
    window.location.href = 'signinSignup.html?user=client';
  } else if (response.statusCode === 400) {
    showStatusOnFailed(statusDiv, response);
  }
}

function resetClass(event) {
  if (!event.target.tagName.match(/button/i)) event.target.className = '';
}
function createRequest(event) {
  event.stopPropagation();
  event.preventDefault();
  uploadFile((data) => {
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

    statusDiv.className = 'status-div okayStatus';
    statusDiv.innerText = 'Creating Request...';
    consumeAPI('/users/requests', options, (response) => {
      handleCreateSuccess(response);
    }, (error) => {
      handleError(error, statusDiv);
    });
  });
}

function updateRequest(event) {
  event.stopPropagation();
  event.preventDefault();
  uploadFile((data) => {
    const options = {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: '*/*',
        'x-access-token': localStorage.getItem('loginToken'),
      }),
      mode: 'cors',
      body: JSON.stringify(data),
    };
    const id = getParameterByName('id');
    consumeAPI(`/users/requests/${id}`, options, (response) => {
      handleCreateSuccess(response);
    }, (error) => {
      handleError(error, statusDiv);
    });
  });
}

function hideHeader(event) {
  const input = event.target;
  if (input.tagName.match(/input|textarea/i)) {
    const header = input.parentElement.querySelector('h4');
    header.style.opacity = 0;
    setTimeout(() => {
      header.style.display = 'none';
    }, 401);
  }
}

function showHeader(event) {
  const input = event.target;
  if (input.tagName.match(/input|textarea/i)) {
    const header = input.parentElement.querySelector('h4');
    header.style.display = 'block';


    setTimeout(() => {
      header.style.opacity = 1;
    }, 2);
  }
}


function handleItemClick(event, user) {
  let link;
  if (event.target.tagName.toLowerCase() === 'a') {
    event.preventDefault();
    const { dataset: { id } } = event.target;
    if (user === 'engineer') link = `../html/manageRequest.html?id=${id}`;
    else {
      link = `../html/requestStatus.html?id=${id}`;
    }

    window.location.href = link;
  }
}

function handleImageChange(event) {
  const image = event.target.files[0];
  const imgElem = document.querySelector('img');
  if (image) {
    imgElem.src = URL.createObjectURL(image);
  } else {
    imgElem.src = '../images/no-image.png';
  }
}

