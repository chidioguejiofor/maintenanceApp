function handleItemClick(event, user){
    const id = event.target.dataset.id;
    let link; 
    if(user === 'engineer') link =`../html/manageRequest.html?id=${id}`;
    else {
        link =`../html/requestStatus.html?id=${id}`;
    }
    
    window.location.href = link;

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


function handleControlsClick(event){
    let button = event.target;
    if(button.name === 'manage-request'){
        let currentOpacity = 
            event.currentTarget
                .querySelector('.controls-li')
                .style
                .opacity ;
        currentOpacity++;
        event.currentTarget
            .querySelector('.controls-li')
            .style
            .opacity = currentOpacity %2; 

    } else if( button.name === 'approve'){
        document.getElementById('approved-controls').style.opacity = 1;
        document.getElementById('initial-controls').hidden = 'hidden';
        
    }
}
