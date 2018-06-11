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
let statusDiv;
window.addEventListener('load', () => {
  initPage();
});


function handleFalseSucces(action, response) {
  showStatusOnFailed(statusDiv, response);
}

function handlePass(action, result) {
  localStorage.setItem('loginToken', result.data.token);
  const loggedUser = getParameterByName('user');
  if (loggedUser === 'engineer') location = 'engineerRequestsPage.html';
  else {
    location = 'requestsPage.html';
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
  statusDiv = event.target.querySelector('div[name=status] ,textarea[name=status] ');

  if (action === 'signup' || action === 'login') {
    const form = document.getElementById(action);
    const data = getDataFromForm(form);
    if (user === 'engineer') data.userType = 'engineer';
    else {
      data.userType = 'client';
    }
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
        if (result.success === false) {
          handleFalseSucces(action, result);
        } else {
          handlePass(action, result, form.action);
        }
      }, (error) => {
        handleError(error, statusDiv);
      });
    } else {
      statusDiv.className = 'status-div failedStatus';
      statusDiv.textContent = 'The two passwords are not the same';
      setTimeout(() => {
        statusDiv.className = 'status-hide';
      }, 7000);
    }
  }
}

