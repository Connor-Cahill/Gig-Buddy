
console.log('hello')
//function that redirects user to clients/:id when client card is clicked
function goToClient(id) {
    window.location.replace(`/clients/${id}`);
};

//  Function to toggle adding service from in clients-show
const addServiceDropdown = document.getElementById('add-service-form-dropdown');
const dropdownBtn = document.getElementById('toggle-add-service-btn');

const toggleAddService = function togglesAddServiceFormForClient() {
    console.log('clicked')
    console.log(addServiceDropdown);
    addServiceDropdown.classList.toggle('showing');
    dropdownBtn.classList.toggle('btn-in-use');
};

//  AJAX POST: creates a new Payment document and changes button content
const postPayBtn = document.getElementById('post-payment-btn');
const billBtnContainer = document.getElementById('bill-btn-container');
const hiddenServiceInput = document.getElementById('service-id');
const clientIdInput = document.getElementById('client-id');

const postPayment = function postsPaymentWithServiceInReq(id) {
    const clientId = clientIdInput.value;
    const paymentData = {
        service: hiddenServiceInput.value,
    }
    axios({
        method: 'post',
        url: `/clients/${ clientId }/payments`,
        data: paymentData,
    })
    .then(() => {
        billBtnContainer.innerHTML = '<small class="bill-sent-text"><i class="fas fa-check"></i> Bill Sent</small>'
    })
}


//  Function to toggle Service Form
const formBtn = document.getElementById('toggle-form-btn');
const dropDownForm = document.getElementById('service-form-dropdown');

const toggleForm = function ToggleServicesDropDownForm() {
    dropDownForm.classList.toggle('showing');
    formBtn.classList.toggle('btn-in-use');
};


