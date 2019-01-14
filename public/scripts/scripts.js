
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
        alert('Payment Request sent to client\'s email!');
        billBtnContainer.innerHTML = '<small class="bill-sent-text"><i class="fas fa-check"></i> Bill Sent</small>'
    });
}


//  Function to toggle Service Form
const formBtn = document.getElementById('toggle-form-btn');
const dropDownForm = document.getElementById('service-form-dropdown');

const toggleForm = function ToggleServicesDropDownForm() {
    dropDownForm.classList.toggle('showing');
    formBtn.classList.toggle('btn-in-use');
};

//  Onclick method for updating Payment.paid from false to true
const paymentPaidBtn = document.getElementById('paid-btn');
const paymentPaidId = document.getElementById('payment-paid-id');
const paidBtnContainer = document.getElementById('paid-btn-container');

const updatePayment = function updatePaymentsPaidProperty(id) {
    const paymentId = paymentPaidId.value;

    axios({
        method: 'patch',
        url: `/payments/${ paymentId }`,
    })
    .then(() => {
        paidBtnContainer.innerHTML = '<small class="bill-sent-text"><i class="fas fa-check"></i> Paid</small>'
    })
    .catch(err => console.log(err))
};

