window.addEventListener('load', (event) => {
    initPage();
});

function initPage(url){
    let user = getParameterByName('user', url); 
    let action = getParameterByName('action', url); 

    user = user === 'engineer' ? user : 'client';
    action =  action === 'signup' || action === 'reset' ?action : 'signin';


    document.body.className = `${user} ${action}`;

    for(let anchor of document.querySelectorAll('a[href]')){
        anchor.href += `&user=${user}`;
    }

    document.getElementById('user-type').value = user;
}

function handleClick(event){
    if(event.target.tagName.toLowerCase() === 'a'){
        event.stopPropagation(); 
        event.preventDefault();
        initPage(event.target.href);
    }
  
}