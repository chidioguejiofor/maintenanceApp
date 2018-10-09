

let requests = {};
const user = window.location.href.includes('engineer') ? 'engineer' : 'client';

function addRequestToList(request) {
  const { id } = request;

  const updateLink = `update.html?id=${id}`;

  const li = document.createElement('li');
  if (user === 'client') {
    let firstAnchor = `<a  class = "pending" href="${updateLink}" >Update</a>`;
    if (request.status !== 'pending') firstAnchor = `<a  class = "${request.status}" >${capitalise(request.status)}</a>`;
    li.innerHTML = `
                    ${request.title}
                    <span>
                      
                        <a onclick = "showRequest(event, ${id}, 'user')" href="">Details</a>        
                        ${firstAnchor}
                    </span>
                `;
  } else {
    li.innerHTML =
          `
              ${request.title}
              <span>
              <a onclick = "showRequest(event, ${id})" href="">Details</a>        
                  <a  class = "${request.status}" >${capitalise(request.status)}</a>
                 
              </span>
          `;
  }

  requestList.appendChild(li);
}


function handleFetchSuccess(response, regex, status) {
  if (response.statusCode === 200) {
    requests = response.data;
    let arr = requests;
    if (regex) {
      arr = requests.filter((request) => {
        console.log(status);
        if (status) {
          return regex.test(request.title) &&
          status === request.status;
        }
        return regex.test(request.title);
      });
    }

    if (arr.length === 0) {
      const li = document.createElement('li');
      li.innerHTML = 'No available requests';
      li.style.textAlign = 'center';
      requestList.appendChild(li);
      return;
    }
    arr.forEach((request) => {
      addRequestToList(request);
    });
  } else if (response.statusCode === 204 && user === 'client') {
    window.location.href = '../html/create.html';
  }
}

function handleFailed(response) {
  statusDiv.className = 'status-div failedStatus';
  statusDiv.innerText = response.message;
  setTimeout(() => {
    statusDiv.className = 'status-hide';
  }, 7000);
}
function getRequest(regex = new RegExp('', 'i'), date = new Date(), status) {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('loginToken'),
    }),
    mode: 'cors',
  };
  let endPoint = `/users/requests/date/${date.toDateString()}`;
  if (user === 'engineer') endPoint = `/requests/date/${date.toDateString()}`;

  statusDiv.textContent = 'Retrieving Requests...';
  statusDiv.className = 'status-div okayStatus';
  consumeAPI(endPoint, options, (response) => {
    if (response.success) {
      handleFetchSuccess(response, regex, status);
      statusDiv.className = 'status-hide';
    } else {
      handleFailed(response);
    }
  }, error => handleError(error, statusDiv), true, user);
}

function filterRequests(event, filterBy) {
  let status = document.getElementById('status-option').value;
  const searchValue = document.getElementById('search-input').value;
  const sinceValue = document.getElementById('since-option').value;
  const regex = new RegExp(searchValue, 'i');
  const searchDate = new Date();
  searchDate.setDate(searchDate.getDate() - (+sinceValue));
  requestList.innerHTML = '';
  if (status === 'all') status = undefined;
  if (filterBy === 'date') {
    getRequest(regex, searchDate, status);
  } else {
    let arr = requests;
    if (status) {
      arr = requests.filter(request =>
        request.status === status &&
        regex.test(request.title));
    } else {
      arr = requests.filter(request =>
        regex.test(request.title));
    }


    if (arr.length === 0) {
      const li = document.createElement('li');
      li.innerHTML = 'No available requests';
      li.style.textAlign = 'center';
      requestList.appendChild(li);
    } else {
      arr.forEach((request) => {
        addRequestToList(request);
      });
    }
  }
}


function getById(id) {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('loginToken'),
    }),
    mode: 'cors',
  };

  let endPoint = `/users/requests/${id}`;
  let updateButtons = false;
  if (user === 'engineer') {
    endPoint = `/requests/${id}`;
    updateButtons = true;
  }
  consumeAPI(endPoint, options, (response) => {
    if (response.statusCode === 200) {
      updateModalHelper(response, updateButtons);
    }
  }, error => handleError(error, statusDiv), true, user);
}

function showRequest(event, id) {
  event.preventDefault();
  getById(id);
  showModal(event);
}


function handleControlsClick(event) {
  const { dataset: { id } } = event.currentTarget;
  const button = event.target;
  if (button.name.match(/resolve|disapprove/i)) {
    window.location.href = `manage.html?id=${id}&action=${button.name}`;
  } else {
    const status = button.name;
    updateStatus(id, status);
  }
}

function showStats(event) {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('loginToken'),
    }),
    mode: 'cors',
  };
  consumeAPI('/requests/stats', options, (response) => {
    updateModalHelper(response);
  }, error => handleError(error, statusDiv), true, 'engineer');
  showModal(event, 'stats-modal');
}
