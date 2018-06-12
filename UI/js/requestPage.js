function handleItemClick(event, user) {

  let link;
  if (event.target.tagName.toLowerCase() == 'a') {
    event.preventDefault();
    const id = event.target.dataset.id;
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

