

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