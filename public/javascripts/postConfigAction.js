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
        else if(select.id.includes("shadow-color")){
            if(select.value === "none"){
                postBody.style.textShadow = "";
                postTitle.style.textShadow = "";
            }
            postBody.style.textShadow = `3px 1px 2px ${select.value}`;
            postTitle.style.textShadow = `3px 1px 2px ${select.value}`;
        }
    })
})
