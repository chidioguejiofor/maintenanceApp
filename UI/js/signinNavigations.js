/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

let user;
function initPage(url) {
  user = getParameterByName('user', url);
  let action = getParameterByName('action', url);
  user = user === 'engineer' ? user : 'user';

  action = action === 'signup' || action === 'reset' ? action : 'signin';


  document.body.className = `${user} ${action}`;

  Array.from(document.querySelectorAll('a[href]'))
    .forEach((elem) => {
      const anchor = elem;
      anchor.href += `&user=${user}`;
    });

  if (user === 'engineer') {
    document.querySelector('form').action = 'engineerRequestsPage.html';
  }
}
window.addEventListener('load', () => {
  initPage();
});

function getDataFromForm(form) {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    console.log(key, value);
    data[key] = value;
  });

  return data;
}

function handleFalseSucces(action, result) {
  const arr = Array.from(document.getElementById(action).querySelectorAll('div[data-name]'));
  console.log(arr);
  arr.forEach((input) => {
    const status = input;
    status.hidden = true;
    status.className = 'box';
  });

  if (result.missingData) {
    result.missingData.forEach((elem) => {
      const str = `div[data-name=${elem}-status]`;
      if (elem !== 'userType') {
        console.log(action);
        const dataStatus = document.getElementById(action).querySelector(str);
        dataStatus.className = 'badData danger-text';
        dataStatus.innerHTML = `The ${elem} was not specified`;
      }
    });
  } else if (result.invalidData) {
    arr.forEach((input) => {
      const dataStatus = input;
      const [property] = input.dataset.name.split('-');
      const message = result.invalidData[[property]];
      if (message) {
        dataStatus.className = 'badData danger-text';
        dataStatus.innerHTML = `${property} ${message}`;
      }
    });
  } else if (+result.statusCode === 409) {
    const emailInput = document.getElementById(action)
      .querySelector('div[data-name=email-status]');
    emailInput.className = 'box badData danger-text';
    emailInput.innerHTML = 'The username or email you specified already exists';
  } else if (+result.statusCode === 404) {
    const emailInput = document.getElementById(action)
      .querySelector('div[data-name=username-status]');
    emailInput.className = 'box badData danger-text';
    emailInput.innerHTML = 'The username and password combination does not exists';
  }
}
function handlePass(action, result) {
  localStorage.setItem('loginToken', result.data.token);

  location = `requestsPage.html?user=${user}`;
}

function handleClick(event) {
  if (event.target.tagName.toLowerCase() === 'a') {
    event.stopPropagation();
    event.preventDefault();
    initPage(event.target.href);
  }
}


function handleSubmit(event) {
  event.stopPropagation();
  event.preventDefault();
  const action = event.target.id;


  if (action === 'signup' || action === 'login') {
    const form = document.getElementById(action);
    const data = getDataFromForm(form);
    data.userType = 'client';
    if (action === 'login' || (action === 'signup' && data.password === data.confirmPassword)) {
      const options = {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/json',
          Accept: '*/*',
        }),
        mode: 'cors',
        body: JSON.stringify(data),
      };

      consumeAPI(`/auth/${action}`, options, (result) => {
        console.log('success', result);
        if (result.success === false) {
          handleFalseSucces(action, result);
        } else {
          handlePass(action, result, form.action);
        }
      }, (error) => {
        console.log(error);
        alert('Error');
      });
    } else {
      const dataStatus =
        document.getElementById(action)
          .querySelector('div[data-name=password-status]');
      dataStatus.className = 'badData';
      dataStatus.innerHTML = 'The two passwords are not the same ';
    }
  }
}

