
window.addEventListener('load', (event)=> {
    getAllRequests();
})

function getAllRequests(){
    const options ={
        method: 'GET',
        headers:new Headers({
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('loginToken'),
        }),
        mode: 'cors',
    }
    consumeAPI('/users/requests', options, (response)=> {
        if(response.success){
            handleSuccess(response);
        } else {
            handleFailed(response);
        }
    }, handleError);
}

function handleSuccess(response){
    
    response.data.forEach(request => {
        const li = document.createElement('li');
        li.dataset.id =request.id;
        li.innerHTML = ` ${request.title} <a data-id = ${request.id} href="">View Details</a>`
        
        document.getElementById('requests-ul')
            .appendChild(li);

        console.log(request);
    });
    
}

function handleFailed(response){
    console.log(response);
}
function handleError(error){
    console.log(error);
}