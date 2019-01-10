

//function that redirects user to clients/:id when client card is clicked
function goToClient(id) {
    window.location.replace(`/clients/${id}`);
}


//Function to toggle Serviec Form
const formBtn = document.getElementById('toggle-form-btn');
const dropDownForm = document.getElementById('service-form-dropdown');
formBtn.addEventListener('click', () => {
    dropDownForm.classList.toggle('showing');
    formBtn.classList.toggle('btn-in-use');
})


//  Function to toggle main Nav buttons color/effect
const mainNavBtns = document.querySelectorAll('.main-nav-btn');
console.log(mainNavBtns)
const clientBtn = document.getElementById('btn-a');
const servicesBtn = document.getElementById('btn-b');
const paymentsBtn = document.getElementById('btn-c');
const sel = 'selected'
// mainNavBtns.forEach(function(btn) {
//     btn.addEventListener('click', () => {
//         btn.classList.add(sel);
//         if (btn === clientBtn) {
//             paymentsBtn.classList.remove(sel);
//             servicesBtn.classList.remove(sel);
//         } else if (btn === paymentsBtn) {
//             servicesBtn.classList.remove(sel);
//             clientBtn.classList.remove(sel);
//         } else if (btn === servicesBtn) {
//             paymentsBtn.classList.remove(sel);
//             clientBtn.classList.remove(sel);
//         }
//     })
// })


