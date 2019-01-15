
//  Section for editing profile information
const editProfileBtn = document.getElementById('edit-profile');
const toggleEditImage = document.getElementById('toggle-edit-profile-image');
const nameInfo = document.getElementById('name-info');
const nameInfoInputs = document.getElementById('name-info-inputs');
const emailInfo = document.getElementById('email-phone-info');
const emailInfoInputs = document.getElementById('email-info-inputs');
const saveInfoBtn = document.getElementById('save-info');
const toggleSaveBtnDiv = document.getElementById('save-btn-toggle-div');

//  Function is onClick for edit profile button
const toggleEditProfile = function togglesEditProfileForm() {
    //  Toggles correct style for button
    editProfileBtn.classList.toggle('edit-profile-btn-clicked');
    //  Reveal all of hidden divs
    toggleEditImage.classList.toggle('show-edit-profile-image');
    toggleEditImage.classList.toggle('hidden-edit-profile-image');
    toggleSaveBtnDiv.classList.toggle('show-save-btn-container');
    toggleSaveBtnDiv.classList.toggle('hidden-save-btn-container');
    //  Turn the headers into inputs
    nameInfo.classList.toggle('hide-this-div');
    emailInfo.classList.toggle('hide-this-div');
    nameInfoInputs.classList.toggle('showing-name-info-inputs');
    nameInfoInputs.classList.toggle('hidden-name-info-inputs');
    emailInfoInputs.classList.toggle('showing-email-info-inputs');
    emailInfoInputs.classList.toggle('hidden-email-info-inputs');
}
const firstNameIn = document.getElementById('value-firstName-input');
const lastNameIn = document.getElementById('value-lastName-input');
const emailIn = document.getElementById('value-email-input');
const phoneNumberIn = document.getElementById('value-phoneNumber-input');
const venmoIn = document.getElementById('value-venmoUsername-input');
const thisUserId = document.getElementById('hidden-uid');
const profileImageIn = document.getElementById('profile-image-input');
const firstNameP = document.getElementById('firstName-p');
const lastNameP = document.getElementById('lastName-p');
const emailP = document.getElementById('email-p');
const phoneNumberP = document.getElementById('phoneNumber-p');
const venmoP = document.getElementById('venmo-p');
//  function to post data to backend 
const editUserInfo = function updatesUserInfoAndSaves() {
    const userId = thisUserId.value;

    const user = {
        firstName: firstNameIn.value,
        lastName: lastNameIn.value,
        email: emailIn.value,
        phoneNumber: phoneNumberIn.value,
    };
    axios({
        method: 'put',
        url: `/users/${userId}`,
        data: user
    })
    .then((user) => {
        window.location.reload();
        // firstNameP.innerHTML = user.firstName;
        // lastNameP.innerHTML = `${ user.lastName }`;
        // emailP.innerHTML = `${ user.email }`;
        // phoneNumberP.innerHTML = `${ user.phoneNumber }`;

    })
    .catch(err => console.log(err))
}