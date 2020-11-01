let windowLocation = window.location.toString();
let isScrolledToEdited = /#\w{24}/; // mongo objId is always 24 characters
let isScrolled = isScrolledToEdited.test(windowLocation)
if(isScrolled){
    let navBar = document.querySelector(".navigation");
    let navBarHeight = parseFloat(getComputedStyle(navBar).height);
    let yOffset = 35;
    setTimeout(() => {
        window.scrollBy(0, - (navBarHeight + yOffset));
    }, 0);
}

