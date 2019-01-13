
//  Smoother scroll on Learn More Button 
const learnMoreBtn = document.getElementById('smooth-scroll');


// Smoothly scroll to place when nav buttons are pressed
$(document).ready(function () {
    $('.landing-learn-more').click(function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: ($( $.attr(this, 'href') ).offset().top - (20 * (100 / document.documentElement.clientWidth)))
        }, Math.abs($( $.attr(this, 'href') ).offset().top - $(window).scrollTop()) / 2);
    });
});


//  Function for info boxes on landing page
const containerA = document.getElementById('container-a');
const containerB = document.getElementById('container-b');
const containerC = document.getElementById('container-c');
const iconA = document.getElementById('icon-a');
const iconB = document.getElementById('icon-b');
const iconC = document.getElementById('icon-c');
const divA = document.getElementById('div-a');
const divB = document.getElementById('div-b');
const divC = document.getElementById('div-c');

const setupToggleListener = function setsUpEListenerForStyles(container, icon, div) {
    container.addEventListener('mouseover', () => {
        container.classList.add('container-selected');
        div.classList.add('div-display');
            icon.classList.add('white')
    });
    container.addEventListener('mouseout', () => {
        container.classList.remove('container-selected');
        div.classList.remove('div-display');
        icon.classList.remove('white')
    });
}

setupToggleListener(containerA, iconA, divA);
setupToggleListener(containerB, iconB, divB);
setupToggleListener(containerC, iconC, divC);



