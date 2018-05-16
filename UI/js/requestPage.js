function handleItemClick(event){
    const id = event.target.dataset.id; 
    window.location.href = `../html/requestStatus.html?id=${id}`;

}

function handleImageChange(event){
    let image = event.target.files[0];
    let imgElem = document.querySelector('img');
    if(image){
        imgElem.src = URL.createObjectURL(image);
    } else {
        imgElem.src ='../images/no-image.png';
    }
	
   
}

