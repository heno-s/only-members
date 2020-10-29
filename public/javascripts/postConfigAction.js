import {gear,config,configSelects,postForm,postTitle,postBody} from "./getElements.js";

gear.addEventListener("click", event => {
    gear.classList.toggle("rotate-360");
    config.classList.toggle("opacity-1");
    config.classList.toggle("pointer-events-all");
});

postForm.addEventListener("click", event =>{
    if(event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA")
        return;
    config.classList.remove("opacity-1");
    config.classList.remove("pointer-events-all");
})

/* config action */
configSelects.forEach(select =>{
    select.addEventListener("change", event =>{
        const select = event.target;
        if(select.id.includes("title-color")){
            postTitle.style.color = select.value;
        }
        else if(select.id.includes("body-color")){
            postBody.style.color = select.value;
        }
        else if(select.id.includes("title-shadow-color")){
            if(!select.value){
                return postTitle.style.textShadow = "";
            }
            postTitle.style.textShadow = `.13em .075em ${select.value}`;
        }
        else if(select.id.includes("body-shadow-color")){
            if(!select.value){
                return postBody.style.textShadow = "";
            }
            postBody.style.textShadow = `.13em .075em ${select.value}`;
        }
    })
})
