function handleItemClick(event, user){
   
    let link; 
    if(event.target.tagName.toLowerCase() == 'a'){
        event.preventDefault();
        const id = event.target.dataset.id;
        if(user === 'engineer') link =`../html/manageRequest.html?id=${id}`;
        else {
            link =`../html/requestStatus.html?id=${id}`;
        }
        
        window.location.href = link;
    }
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
        const controls =document.getElementById('approved-controls');
        console.dir(controls);
        controls.hidden = false;
        document.getElementById('initial-controls').hidden = 'hidden';
        controls.style.opacity = 01;
        
        
    } else if (button.name ==='begin'){
        button.hidden = true;
        const beginControls = document.getElementById('begin-controls');
        beginControls.hidden= false;
        beginControls.opacity =1;
    } else if( button.name == 'reject'){
        window.location.href = 'rejectRequest.html';
    }
}

