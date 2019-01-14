
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

//  Post Subscriber to backend
const subInput = document.getElementById('email-sub-input');
const subBtn = document.getElementById('email-sub-btn');
const seperatorDiv = document.querySelector('.seperator-div');


const postSub = function postsToEmailList() {
    const sub = {
        email: subInput.value,
    };
    console.log(sub);
    axios({
        method: 'post',
        url: '/subscribe',
        data: sub,
    })
    .then(() => {
        seperatorDiv.innerHTML = '<h3 class="landing-subscribe-header">Subscribe For Product Updates</h3><p class="seperator-icon"><i class="far fa-envelope"></i></p><label for="subscribe" class="sub-label">Subscribe</label><p class="subscribed">Thank you for subscribing!</p>';
    }).catch(err => console.log(err))

}

