window.addEventListener('load', (event) => {
  const action = getParameterByName('action');
  const header = document.querySelector('h1');
  const button = document.querySelector('button');
  if (action === 'resolve') {
    button.textContent = 'Complete';
    button.className = 'primary-btn okay';
  }
  header.textContent = `${action} Request`;
});

function changeStatus(event) {
  event.stopPropagation();
  event.preventDefault();
  const button = event.target;
  const ul = button.parentElement.parentElement;
  const textarea = ul.querySelector('textarea');

  const id = getParameterByName('id');
  const action = getParameterByName('action');
  updateStatus(id, action, textarea.value);
  window.location.href = 'engineerRequestsPage.html';
}
