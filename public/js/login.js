/* eslint-disable */

// --- HELPER FUNCTIONS (No changes here) ---
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};


// --- API FUNCTIONS (No changes here) ---
const login = async (email, password) => {
  try {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => { location.assign('/'); }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    showAlert('error', 'Error logging in. Please try again.');
  }
};

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, passwordConfirm })
    });
    const data = await res.json();
    if (data.status === 'success') {
      showAlert('success', 'Account created successfully! Welcome!');
      window.setTimeout(() => { location.assign('/'); }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    showAlert('error', 'Error creating account. Please try again.');
  }
};

const logout = async () => {
  try {
    const res = await fetch('/api/v1/users/logout', { method: 'GET' });
    if (res.ok) {
      location.assign('/'); // Redirect to homepage after logout
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};


// --- DOM EVENT LISTENERS (No changes to existing listeners) ---
const loginForm = document.querySelector('.form--login');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const signupForm = document.querySelector('.form--signup');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

const logoutBtn = document.querySelector('.btn--logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}


// =========================================================================
// --- NEW CODE FOR USER SETTINGS (DATA AND PASSWORD) ---
// =========================================================================

// Generic function to update user settings
const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const resData = await res.json();

    if (resData.status === 'success') {
      showAlert('success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
    } else {
      showAlert('error', resData.message);
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};


// Event listener for the password change form
const userPasswordForm = document.querySelector('.form-user-settings');
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const savePasswordBtn = userPasswordForm.querySelector('.btn');
    savePasswordBtn.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    savePasswordBtn.textContent = 'Save password';
  });
}
const updateUserData = async (data) => {
  try {
    const res = await fetch('/api/v1/users/updateMe', {
      method: 'PATCH',
      // DO NOT set Content-Type header when sending FormData.
      // The browser sets it automatically with the correct boundary.
      body: data
    });

    const resData = await res.json();

    if (resData.status === 'success') {
      showAlert('success', 'Data updated successfully!');
      window.setTimeout(() => {
        location.reload(true); // Reload to show the changes
      }, 1500);
    } else {
      showAlert('error', resData.message);
    }
  } catch (err) {
    showAlert('error', 'Something went wrong! ' + err.message);
  }
};

// Find the user data form on the page
const userDataForm = document.querySelector('.form-user-data');

// If the form exists, add an event listener to it
if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const saveButton = userDataForm.querySelector('.btn');
    saveButton.textContent = 'Saving...';

    // Use FormData to handle both text fields and file uploads
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    
    // Check if a file was selected before appending
    const photoFile = document.getElementById('photo').files[0];
    if (photoFile) {
      form.append('photo', photoFile);
    }

    updateUserData(form);
    
    // Restore button text after a short delay
    setTimeout(() => {
      saveButton.textContent = 'Save settings';
    }, 1500);
  });
}

// Event listener for the user data form
