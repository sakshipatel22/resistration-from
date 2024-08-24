var form = document.querySelector("#userForm");
let allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];

// ------------------function to reset the form------------------
const resetForm = function () {
  form.classList.remove('was-validated')
  const name = document.getElementById('name');
  name.value = "";

  const email = document.getElementById('email');
  email.value = "";

  const website = document.getElementById('website');
  website.value = "";

  const image = document.getElementById('image');
  image.value = "";

  const genderEl = document.querySelectorAll('input[name="gender"]');
  for (const rb of genderEl) {
    rb.checked = false;
  }

  const skillEl = document.querySelectorAll('input[name="skill"]');
  for (const rb of skillEl) {
    rb.checked = false;
  }
};

// --------------------function to get the data of the form----------------------

const getData = function () {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const website = document.getElementById('website').value;

  let image = null;
  const imageFile = document.getElementById('image').files[0];
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
      image = event.target.result; // Get base64 encoded image data
      const userData = { name, email, website, image, gender, skills };
      allUsersData.push(userData);
      printResult(userData, allUsersData.length - 1);
      saveToLocalStorage();
      resetForm();
    };
    reader.readAsDataURL(imageFile); // Convert image file to base64 string
  }

  let gender;
  let skills = [];

  const genderEl = document.querySelectorAll('input[name="gender"]');
  for (const rb of genderEl) {
    if (rb.checked) {
      gender = rb.value;
      break;
    }
  };

  const skillEl = document.querySelectorAll('input[name="skill"]');
  for (const rb of skillEl) {
    if (rb.checked) {
      skills.push(rb.value);
    }
  }
};

// ----------------- Save Data to Local Storage -----------------
const saveToLocalStorage = function() {
  localStorage.setItem('allUsersData', JSON.stringify(allUsersData));
};

// ------------------ Load Data from Local Storage -------------------
const loadFromLocalStorage = function() {
  const storedData = JSON.parse(localStorage.getItem('allUsersData'));
  if (storedData && storedData.length > 0) {
    allUsersData = storedData;
    storedData.forEach((data, index) => {
      printResult(data, index);
    });
  }
};

//-----------------------adding event listener to the "enroll student" button with type submit to submit the form
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (form.checkValidity()) {
    getData(); // Get data and process it within the FileReader callback
  } else {
    form.classList.add('was-validated');
  };
  removeSpan();
});

// --------------function to remove the span tag ("fill the form to enroll the students")
function removeSpan() {
  var span = document.getElementById("span");
  if (span) {
    span.remove();
  }
};

// ------------------function to print the form data in the right side of div by generating html elements inside the div.
function printResult(data, index) {
  const resultEl = document.getElementById('enrolled-students');
  let sectionHeading = null;

  if (allUsersData.length == 1) {
    sectionHeading = document.createElement('div');
    const description = document.createElement('p');
    description.innerHTML = "Description";
    description.className = "description";

    const image = document.createElement('p');
    image.innerHTML = "Image";
    image.className = "Image";

    sectionHeading.className = "sectionHeading";
    sectionHeading.append(description, image);
  };

  const wrapper = document.createElement('div');
  wrapper.className = "wrapper";
  wrapper.dataset.index = index;

  wrapper.addEventListener('click', function (e) {
    if (e.target.className.includes('userDeleteBtn')) {
      const indexToDelete = wrapper.dataset.index;
      allUsersData.splice(indexToDelete, 1);
      saveToLocalStorage(); // Update localStorage
      reloadResults(); // Reload the entire result
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = "+";
  deleteBtn.className = "userDeleteBtn";

  const textInfoContainer = document.createElement('div');
  textInfoContainer.className = "textInfoContainer";

  const imageContainer = document.createElement('div');
  imageContainer.className = "imageContainer";

  let name = document.createElement('p');
  name.className = "infoText userName";
  name.innerHTML = data.name;

  let gender = document.createElement('p');
  gender.className = "infoText gender";
  gender.innerHTML = data.gender;

  let email = document.createElement('p');
  email.className = "infoText email";
  email.innerHTML = data.email;

  let website = document.createElement('a');
  website.className = "infoText website";
  website.innerHTML = data.website;
  website.href = data.website;
  website.target = "_blank";

  let skills = document.createElement('p');
  skills.className = "infoText skills";
  skills.innerHTML = data.skills.join(', ');

  let userImage = document.createElement('img');
  userImage.className = "userImage";
  userImage.src = data.image; // Image from base64 data
  userImage.alt = `${data.name}'s image`;

  textInfoContainer.append(name, gender, email, website, skills);
  imageContainer.appendChild(userImage);

  wrapper.append(textInfoContainer, imageContainer, deleteBtn);

  if (sectionHeading == null) {
    resultEl.append(wrapper);
  } else {
    resultEl.append(sectionHeading, wrapper)
  };
}

// Function to reload results after data changes (e.g., deletion)
function reloadResults() {
  const resultEl = document.getElementById('enrolled-students');
  resultEl.innerHTML = ""; // Clear existing results

  allUsersData.forEach((data, index) => {
    printResult(data, index);
  });

  if (allUsersData.length === 0) {
    const sectionHeading = document.querySelector('.sectionHeading');
    if (sectionHeading) {
      sectionHeading.remove();
    }
  }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function () {
  loadFromLocalStorage();
});
