let requests = {};
window.addEventListener('load', (event)=> {
    getAllRequests();
});

function getAllRequests(regex){
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
            handleFetchSuccess(response, regex);
        } else {
            handleFailed(response);
        }
    }, handleError);
}



function filterRequests(event){
    const status = document.getElementById('status-option').value;
    const requestList = document.getElementById('requests-ul');
    const searchValue = document.getElementById('search-input').value;
    const regex = new RegExp(searchValue, 'i');
    regex.ignoreCase = true;
    regex.ignoreCase = true;
    requestList.innerHTML = '';
    if(status === 'all'){
        getAllRequests(regex);
        return;
    }
   
    const filteredRequests = 
        requests.filter((request)=> 
            request.status === status && regex.test(request.title));
    console.log(requests.filter);
    
    if(filteredRequests.length > 0 ){
        filteredRequests.forEach((request)=> {
        const li = document.createElement('li');
       
        li.innerHTML =`
            ${request.title}
            <span>
                <a data-id=${request.id} class = "update" href="updateRequest?">Update</a>
                <a data-id=${request.id} href="">Details</a>        
            </span>
        `;
        requestList.appendChild(li);    
        });
    } else {
        const li = document.createElement('li');
        li.innerHTML = 'No available requests';
        li.style.textAlign = 'center';
        requestList.appendChild(li);    
    }
    
}
function handleFetchSuccess(response, regex){
    const requestList = document.getElementById('requests-ul');
    if(response.statusCode === 200 ){
        requests = response.data;
        let arr = requests;
        if(regex){
            arr =  requests.filter((request)=> regex.test(request.title));
        }

        if (arr.length === 0 ) {
            const li = document.createElement('li');
            li.innerHTML = 'No available requests';
            li.style.textAlign = 'center';
            requestList.appendChild(li); 
            return;   
        }
        arr.forEach(request => {
            const id = request.id;
            let user = getParameterByName('user');
            let detailsLink = '';
            const updateLink = `updateRequest.html?id=${id}`;
            if(user === 'engineer') detailsLink =`manageRequest.html?id=${id}`;
            else {
                detailsLink =`requestStatus.html?id=${id}`;
            }
            const li = document.createElement('li');
             li.innerHTML =`
                ${request.title}
                <span>
                    <a  class = "update" href="${updateLink}">Update</a>
                    <a onclick = "showRequest(event, ${id}, 'user')" href="">Details</a>        
                </span>
            `;
            requestList.appendChild(li);
        });
    } else if(response.statusCode === 204){
        window.location.href =`../html/createRequest.html`;
    }
    
    
}

function handleFailed(response){
    console.log(response);
}


function showRequest(event, id, user){
    event.preventDefault();
    getById(id);
    showModal(event);
    
}


function handleError(error){
    console.log(error);
}

function getById(id){
    const displays =Array.from(document.body.querySelectorAll('*[data-name]'));
    console.log(displays);
    const options ={
        method: 'GET',
        headers:new Headers({
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('loginToken'),
        }),
        mode: 'cors',
    }
    consumeAPI(`/users/requests/${id}`,options, (response)=> {
        console.log(response);
        if(response.statusCode === 200){
           
            displays.forEach((display)=> {
                const property = display.dataset.name;
                let value = response.data[property];
                if(property === 'date'){
                   value = new Date(value).toDateString();
                }
                if(display.tagName.match(/input|textarea/i) ){
                    display.value = 
                    `${value}`;
                } else {
                     display.textContent = 
                `${capitalise(property)}: ${value}`;
                }
               
            });
        }
    }, handleError );
   
}

