function handleItemClick(event){
    const id = event.target.dataset.id; 
    window.location.href = `../html/index.html?id=${id}`;

}