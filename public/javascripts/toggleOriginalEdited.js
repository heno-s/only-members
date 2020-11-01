const postsContainer = document.querySelector("#posts-container");

postsContainer.addEventListener("click", event =>{
    if(event.target.dataset.functionality !== "post-unveil")
        return;
    
    const postToShow = document.getElementById(event.target.dataset.show);
    const postToHide = document.getElementById(event.target.dataset.hide);

    postToShow.classList.remove("display-none");
    postToHide.classList.add("display-none");
})