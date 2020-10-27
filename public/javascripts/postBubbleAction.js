import {bubble,postForm,config,modal} from "./getElements.js";


/*  action */
bubble.addEventListener("click", event =>{
    modal.classList.toggle("display-show");
    postForm.classList.toggle("display-show");

    // close configs if they are open and  is clicked
    config.classList.remove("opacity-1");
    config.classList.remove("pointer-events-all");
})

modal.addEventListener("click", event =>{
    if(event.target === modal){
        modal.classList.remove("display-show");
        postForm.classList.remove("display-show");
    }
})


