(function () {
  'use strict';

  /* ============ API CONFIG ============

     Adjust these to match how your Express routes are mounted, e.g.
     app.use('/api/buyer', buyerRoutes)  ->  router.post('/register', register); router.post('/verify-otp', otpVerification);
  ============================================= */
  var API_BASE_URL = 'https://biharikisan.onrender.com';
  var ENDPOINTS = {
    register: '/biharikisan/auth/register',
    verifyOtp: '/biharikisan/auth/otp-verification'
  };
  var OTP_LENGTH = 6; // change to match whatever generateOtp() in utils.js actually produces

  function apiPost(path, body) {
    return fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // needed so the httpOnly refreshToken cookie set by /register is stored
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }
  function hideError(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  /* ============ TABS ============ */
  var tabLogin = document.getElementById('tabLogin');
  var tabRegister = document.getElementById('tabRegister');
  var panelLogin = document.getElementById('panelLogin');
  var panelRegister = document.getElementById('panelRegister');
  var goRegisterBtn = document.getElementById('goRegister');
  var navAuthBtn = document.getElementById('navAuthBtn');

  function activateTab(which) {
    var loginActive = which === 'login';
    tabLogin.classList.toggle('is-active', loginActive);
    tabRegister.classList.toggle('is-active', !loginActive);
    tabLogin.setAttribute('aria-selected', loginActive);
    tabRegister.setAttribute('aria-selected', !loginActive);
    panelLogin.classList.toggle('is-active', loginActive);
    panelRegister.classList.toggle('is-active', !loginActive);
  }

  tabLogin.addEventListener('click', function () { activateTab('login'); });
  tabRegister.addEventListener('click', function () { activateTab('register'); });
  if (goRegisterBtn) goRegisterBtn.addEventListener('click', function () { activateTab('register'); });
  if (navAuthBtn) navAuthBtn.addEventListener('click', function () {
    document.querySelector('.frame').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ============ PASSWORD VISIBILITY ============ */
  document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.previousElementSibling;
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });

  /* ============ LOGIN SUBMIT ============
     There is no login endpoint in the backend yet (buyer.model has no
     password field and buyer.controller only exports register/otpVerification),
     so this just surfaces that honestly instead of pretending to log in. */
   /* ============ LOGIN SUBMIT ============ */

  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    hideError(loginError);

    var email = loginForm.querySelector('[name="loginId"]').value.trim();
    var password = loginForm.querySelector('[name="password"]').value;

    if (!email || !password) {
      showError(loginError, 'Email and password are required.');
      return;
    }

    var loginButton = loginForm.querySelector('button[type="submit"]');
    var originalText = loginButton.textContent;

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    apiPost('/biharikisan/auth/login', {
      email: email,
      password: password
    }).then(function (result) {

      loginButton.disabled = false;
      loginButton.textContent = originalText;

      if (!result.ok) {
        showError(
          loginError,
          (result.data && result.data.message) || 'Login failed.'
        );
        return;
      }

      var role = result.data.role;

      // Role ke according dashboard
      if (role === 'buyer') {
        window.location.href = '/buyerDash';
      }
      else if (role === 'seller') {
        window.location.href = '/farmerDash';
      }
      else if (role === 'driver') {
        window.location.href = '/driverDash';
      }
      else {
        showError(loginError, 'Invalid user role.');
      }

    }).catch(function (error) {

      console.error('Login error:', error);

      loginButton.disabled = false;
      loginButton.textContent = originalText;

      showError(
        loginError,
        'Could not reach the server. Is the backend running at ' +
        API_BASE_URL + '?'
      );
    });
  });
  /* ============ REGISTER: STEP NAVIGATION ============ */
  var registerForm = document.getElementById('registerForm');
  var formError = document.getElementById('formError');
  var steps = Array.prototype.slice.call(registerForm.querySelectorAll('.step'));
  var progressSteps = Array.prototype.slice.call(document.querySelectorAll('#progress .progress__step'));
  var currentStep = 1;

  function goToStep(n) {
    currentStep = n;
    hideError(formError);
    steps.forEach(function (s) {
      s.classList.toggle('is-active', parseInt(s.getAttribute('data-step'), 10) === n);
    });
    progressSteps.forEach(function (p) {
      var num = parseInt(p.getAttribute('data-step'), 10);
      p.classList.toggle('is-active', num === n);
      p.classList.toggle('is-done', num < n);
    });
    var scrollEl = document.querySelector('.auth__scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  registerForm.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var step = btn.closest('.step');
      if (!validateStep(step)) return;
      var n = parseInt(step.getAttribute('data-step'), 10);
      goToStep(n + 1);
    });
  });

  registerForm.querySelectorAll('[data-back]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var step = btn.closest('.step');
      var n = parseInt(step.getAttribute('data-step'), 10);
      goToStep(n - 1);
    });
  });

  function validateStep(step) {
    var required = step.querySelectorAll('input[required]');
    for (var i = 0; i < required.length; i++) {
      if (!required[i].value.trim()) {
        required[i].focus();
        required[i].style.borderColor = '#c96b6b';
        setTimeout(function (el) { return function () { el.style.borderColor = ''; }; }(required[i]), 1400);
        return false;
      }
    }
    return true;
  }

  /* ============ FIELD REFERENCES ============ */
  var nameInput = registerForm.querySelector('input[name="fullName"]');
  var mobileInput = registerForm.querySelector('input[name="mobile"]');
  var emailInput = registerForm.querySelector('input[name="email"]');
  var villageInput = registerForm.querySelector('input[name="village"]');
  var districtInput = registerForm.querySelector('input[name="district"]');
  var stateInput = registerForm.querySelector('input[name="state"]');
  var passwordInput = registerForm.querySelector('input[name="password"]');

  /* ============ OTP BOXES ============ */
  document.querySelectorAll('.otp').forEach(function (group) {
    var boxes = Array.prototype.slice.call(group.querySelectorAll('.otp__box'));
    boxes.forEach(function (box, idx) {
      box.addEventListener('input', function () {
        box.value = box.value.replace(/[^0-9]/g, '');
        box.classList.toggle('is-filled', !!box.value);
        if (box.value && idx < boxes.length - 1) boxes[idx + 1].focus();
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !box.value && idx > 0) boxes[idx - 1].focus();
      });
    });
  });

  /* ============ STEP 2 -> ROLE SELECTION -> CALL /register ============ */
  var roleCards = Array.prototype.slice.call(document.querySelectorAll('.role-card'));
  var roleContinueBtn = document.getElementById('roleContinue');
  var selectedRole = null;

  roleCards.forEach(function (card) {
    card.addEventListener('click', function () {
      roleCards.forEach(function (c) {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('is-selected');
      card.setAttribute('aria-checked', 'true');
      selectedRole = card.getAttribute('data-role'); // 'seller' | 'buyer' | 'driver'
      roleContinueBtn.disabled = false;
    });
  });

  roleContinueBtn.addEventListener('click', function () {
    if (!selectedRole) return;
    hideError(formError);

    var payload = {
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      mobileNo: mobileInput.value.trim(),
      address: {
        village: villageInput.value.trim(),
        district: districtInput.value.trim(),
        state: stateInput.value.trim(),
      },
      password: passwordInput.value.trim(),
      role: selectedRole
    };

    var originalText = roleContinueBtn.textContent;
    roleContinueBtn.disabled = true;
    roleContinueBtn.textContent = 'Creating account\u2026';

    apiPost(ENDPOINTS.register, payload).then(function (result) {
      roleContinueBtn.textContent = originalText;
      if (result.ok) {
        var target = registerForm.querySelector('[data-step="3"] [data-target="email"]');
        if (target) target.textContent = payload.email;
        goToStep(3);
      } else if (result.status === 409) {
        roleContinueBtn.disabled = false;
        showError(formError, (result.data && result.data.message) || 'This user already exists. Go back and check your mobile/email.');
      } else {
        roleContinueBtn.disabled = false;
        showError(formError, (result.data && result.data.message) || 'Something went wrong while creating your account. Please try again.');
      }
    }).catch(function () {
      roleContinueBtn.disabled = false;
      roleContinueBtn.textContent = originalText;
      showError(formError, 'Could not reach the server. Is the backend running at ' + API_BASE_URL + '?');
    });
  });

  /* ============ STEP 3 -> VERIFY EMAIL OTP -> CALL /verify-otp ============ */
  var emailVerified = false;
  var verifyContinueBtn = document.getElementById('verifyContinue');

  document.querySelectorAll('[data-verify]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      hideError(formError);
      var key = btn.getAttribute('data-verify');
      var group = document.querySelector('.otp[data-otp="' + key + '"]');
      var boxes = group.querySelectorAll('.otp__box');
      var code = Array.prototype.map.call(boxes, function (b) { return b.value; }).join('');
      if (code.length < boxes.length) {
        boxes.forEach(function (b) { if (!b.value) b.focus(); });
        return;
      }

      var originalText = btn.textContent;
      btn.textContent = 'Verifying\u2026';
      btn.disabled = true;

      apiPost(ENDPOINTS.verifyOtp, { email: emailInput.value.trim(), otp: code }).then(function (result) {
        if (result.ok) {
          emailVerified = true;
          var badge = document.querySelector('[data-badge="' + key + '"]');
          badge.textContent = '\u2713 Verified';
          badge.classList.add('is-verified');
          btn.textContent = 'Verified';
          verifyContinueBtn.disabled = false;
        } else {
          btn.textContent = originalText;
          btn.disabled = false;
          showError(formError, (result.data && result.data.message) || 'Invalid OTP. Please try again.');
        }
      }).catch(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        showError(formError, 'Could not reach the server. Is the backend running at ' + API_BASE_URL + '?');
      });
    });
  });

  verifyContinueBtn.addEventListener('click', function () {
    if (!emailVerified) return;
    document.getElementById('sumName').textContent = nameInput.value || '\u2014';
    document.getElementById('sumRole').textContent = selectedRole || '\u2014';
    document.getElementById('sumEmail').textContent = emailInput.value || '\u2014';
    document.getElementById('sumMobile').textContent = mobileInput.value || '\u2014';
    goToStep(4);
  });

  /* ============ STEP 4 : DONE ============ */
var dashboardBtn = document.getElementById('dashboardBtn');

if (dashboardBtn) {
  dashboardBtn.addEventListener('click', function () {

    if (selectedRole === 'buyer') {
      window.location.href = '/buyerDash';
    }

    else if (selectedRole === 'seller') {
      window.location.href = '/farmerDash';
    }

    else if (selectedRole === 'driver') {
      window.location.href = '/driverDash';
    }

    else {
      alert('Role not selected');
    }

  });
}
})();
