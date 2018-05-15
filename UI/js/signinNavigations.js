window.addEventListener('load', (event)=> {
    let user = getParameterByName('user'); 
    let action = getParameterByName('action'); 

    user = user === 'engineer' ? user : 'client';
    action =  action === 'signup' || action === 'reset' ?action : 'signin';


    document.body.className = `${user} ${action}`;

    for(let anchor of document.querySelectorAll('a[href]')){
        anchor.href += `&user=${user}`;
    }

    document.getElementById('user-type').value = user;
});