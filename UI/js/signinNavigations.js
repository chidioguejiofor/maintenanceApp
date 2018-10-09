/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

let user;
let statusDiv;

function initPage(url) {
  statusDiv = document.getElementById('status');

  user = getParameterByName('user', url);
  let action = getParameterByName('action', url);
  user = user === 'engineer' ? user : 'user';

  action = action === 'signup' || action === 'reset' ? action : 'signin';


  document.body.className = `${user} ${action}`;

  document.querySelectorAll('a[href]')
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


function handleFalseSucces(action, response) {
  showStatusOnFailed(statusDiv, response);
}

function handlePass(action, result) {
  if (action === 'login') {
    localStorage.setItem('loginToken', result.data.token);
    const loggedUser = getParameterByName('user');
    if (loggedUser === 'engineer') window.location = 'engineerRequestsPage.html';
    else {
      window.location = 'requestsPage.html';
    }
  } else {
    statusDiv.className = 'status-div okayStatus';
    statusDiv.textContent = result.message;
    setTimeout(() => {
      statusDiv.className = 'status-hide';
    }, 7000);
  }
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

  const form = document.getElementById(action);
  const data = getDataFromForm(form);
  if (user === 'engineer') data.userType = 'engineer';
  else {
    data.userType = 'client';
  }
  if (action === 'login' || action === 'reset' || (action === 'signup' && data.password === data.confirmPassword)) {
    const options = {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        Accept: '*/*',
      }),
      mode: 'cors',
      body: JSON.stringify(data),
    };
    statusDiv.textContent = 'Sending Request...';
    statusDiv.className = 'status-div okayStatus';
    consumeAPI(`/auth/${action}`, options, (result) => {
      if (result.success === false) {
        handleFalseSucces(action, result);
      } else {
        handlePass(action, result, form.action);
      }
    }, (error) => {
      handleError(error, statusDiv);
    }, false);
  } else {
    statusDiv.className = 'status-div failedStatus';
    statusDiv.textContent = 'The two passwords are not the same';
    setTimeout(() => {
      statusDiv.className = 'status-hide';
    }, 7000);
  }
}

