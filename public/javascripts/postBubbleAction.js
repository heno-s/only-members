import {bubble,postForm,modal} from "./getElements.js";


/*  action */
bubble.addEventListener("click", event =>{
    modal.classList.toggle("display-show");
    postForm.classList.toggle("display-show");
})

modal.addEventListener("click", event =>{
    if(event.target === modal){
        modal.classList.remove("display-show");
        postForm.classList.remove("display-show");
    }
})

window.addEventListener("keyup", event =>{
    if(event.key !== "Escape")
        return;

    postForm.classList.remove("display-show");
    modal.classList.remove("display-show");
});