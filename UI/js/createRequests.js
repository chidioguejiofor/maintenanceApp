const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/chidioguejiofor/image/upload';
const CLOUDINARY_PRESET = 'wnqidleo';
const DEFAULT_IMAGE = 'http://no_image.png';
let statusDiv;
window.addEventListener('load', (event) => {
  if (!localStorage.getItem('loginToken')) {
    location.href = 'signinSignup.html?action=login';
  }
  statusDiv = document.getElementById('status');
});

function createRequest(event) {
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
  consumeAPI('/users/requests', options, (response) => {
    handleCreateSuccess(response);
  }, (error) => {
    handleError(error, statusDiv);
  });
}


function updateRequest(event) {
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
  console.dir(options.body);
  consumeAPI(`/users/requests/${id}`, options, (response) => {
    handleCreateSuccess(response);
  }, (error) => {
    handleError(error, statusDiv);
  });
}
function handleCreateSuccess(response) {
  const className = statusDiv.className;
  if (response.success) {
    statusDiv.className = 'status-div okayStatus';

    statusDiv.innerText = 'Successfully created the new request';
    setTimeout(() => {
      statusDiv.className = 'status-hide';
      location.href = 'requestsPage.html';
    }, 3000);
  } else if (response.statusCode === 404) {
    location.href = 'signinSignup.html?user=client';
  } else if (response.statusCode === 400) {
    showStatusOnFailed(statusDiv, response);
  }
}

function resetClass(event) {
  if (!event.target.tagName.match(/button/i)) event.target.className = '';
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

