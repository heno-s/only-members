import {gear,config,configSelects,postTitle,postBody} from "./getElements.js";

gear.addEventListener("click", event => {
    gear.classList.toggle("rotate-360");
    config.classList.toggle("opacity-1");
    config.classList.toggle("pointer-events-all");
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
            if(select.value === "none"){
                postTitle.style.textShadow = "";
            }
            postTitle.style.textShadow = `.1em .05em 2px ${select.value}`;
        }
        else if(select.id.includes("body-shadow-color")){
            if(select.value === "none"){
                postBody.style.textShadow = "";
            }
            postBody.style.textShadow = `.1em .05em 2px ${select.value}`;
        }
    })
})
