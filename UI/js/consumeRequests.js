

let requests = {};
const user = window.location.href.includes('engineer') ? 'engineer' : 'client';
let requestList = {};
let statusDiv;
function addRequestToList(request) {
  const { id } = request;

  const updateLink = `updateRequest.html?id=${id}`;

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


function handleFetchSuccess(response, regex) {
  if (response.statusCode === 200) {
    requests = response.data;
    let arr = requests;
    if (regex) {
      arr = requests.filter(request => regex.test(request.title));
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
    window.location.href = '../html/createRequest.html';
  }
}

function handleFailed(response) {
  console.log(response);
}
function getAllRequests(regex, date = new Date()) {
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
  consumeAPI(endPoint, options, (response) => {
    if (response.success) {
      handleFetchSuccess(response, regex);
    } else {
      handleFailed(response);
    }
  }, error => handleError(error, statusDiv));
}


function filterRequests(event) {
  const status = document.getElementById('status-option').value;
  const requestList = document.getElementById('requests-ul');
  const searchValue = document.getElementById('search-input').value;
  const regex = new RegExp(searchValue, 'i');
  regex.ignoreCase = true;
  regex.ignoreCase = true;
  requestList.innerHTML = '';
  if (status === 'all') {
    getAllRequests(regex);
    return;
  }

  const filteredRequests =
          requests.filter(request =>
            request.status === status && regex.test(request.title));

  if (filteredRequests.length > 0) {
    filteredRequests.forEach((request) => {
      addRequestToList(request);
    });
  } else {
    const li = document.createElement('li');
    li.innerHTML = 'No available requests';
    li.style.textAlign = 'center';
    requestList.appendChild(li);
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
  }, error => handleError(error, statusDiv));
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
    window.location.href = `manageRequest.html?id=${id}&action=${button.name}`;
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
  });
  showModal(event, 'stats-modal');
}
// event listeners
window.addEventListener('load', () => {
  requestList = document.getElementById('requests-ul');
  getAllRequests();
  statusDiv = document.getElementById('status');
});
