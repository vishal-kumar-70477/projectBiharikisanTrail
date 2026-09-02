// ==========================================
// BIHARI KISAN - GMAIL OTP VERIFICATION
// ==========================================

let registeredEmail = "";
let selectedRole = null;


// ==========================================
// ROLE SELECTION
// ==========================================

document.querySelectorAll(".role-card").forEach(card => {

    card.addEventListener("click", () => {

        document.querySelectorAll(".role-card").forEach(c => {
            c.classList.remove("selected");
            c.setAttribute("aria-checked", "false");
        });

        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");

        selectedRole = card.dataset.role;

        const roleContinue = document.getElementById("roleContinue");

        if (roleContinue) {
            roleContinue.disabled = false;
        }

    });

});


// ==========================================
// REGISTER FORM
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData(registerForm);

        const fullName = formData.get("fullName");
        const email = formData.get("email");
        const mobileNo = formData.get("mobile");

        if (!fullName || !email || !mobileNo) {

            alert("Please fill all required fields.");

            return;
        }

        if (!selectedRole) {

            alert("Please select your role.");

            return;
        }


        try {

            const response = await fetch(
                "/biharikisan/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        fullName: fullName,

                        email: email,

                        mobileNo: mobileNo,

                        role: selectedRole

                    })
                }
            );


            const result = await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Registration failed"
                );

                return;
            }


            // Save email for OTP verification
            registeredEmail = email;


            // Show email on verification screen
            const emailTarget =
                document.querySelector(
                    '[data-target="email"]'
                );

            if (emailTarget) {

                emailTarget.textContent =
                    `(${registeredEmail})`;

            }


            alert(
                "OTP has been sent to your Gmail 📧"
            );


            // Go to Step 2
            if (typeof goToStep === "function") {

                goToStep(2);

            }


        } catch (error) {

            console.error(
                "Register Error:",
                error
            );

            alert(
                "Server error. Please try again."
            );

        }

    });

}


// ==========================================
// OTP INPUT
// ==========================================

const emailOtpInputs =
    document.querySelectorAll(
        '[data-otp="email"] .otp__box'
    );


emailOtpInputs.forEach((input, index) => {


    // Only numbers
    input.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 1);


            // Move to next box
            if (
                this.value &&
                index < emailOtpInputs.length - 1
            ) {

                emailOtpInputs[
                    index + 1
                ].focus();

            }

        }
    );


    // Backspace
    input.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Backspace" &&
                !this.value &&
                index > 0
            ) {

                emailOtpInputs[
                    index - 1
                ].focus();

            }

        }
    );

});


// ==========================================
// VERIFY EMAIL OTP
// ==========================================

const verifyEmailBtn =
    document.querySelector(
        '[data-verify="email"]'
    );


if (verifyEmailBtn) {

    verifyEmailBtn.addEventListener(
        "click",
        async function () {


            // Check email
            if (!registeredEmail) {

                alert(
                    "Please register your account first."
                );

                return;
            }


            // Collect OTP
            let otp = "";

            emailOtpInputs.forEach(input => {

                otp += input.value;

            });


            // Current HTML has 4 OTP boxes
            if (otp.length !== 4) {

                alert(
                    "Please enter complete 4 digit OTP."
                );

                return;
            }


            try {

                verifyEmailBtn.disabled = true;

                verifyEmailBtn.textContent =
                    "Verifying...";


                const response =
                    await fetch(
                        "/biharikisan/auth/verify-otp",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email:
                                    registeredEmail,

                                otp: otp

                            })
                        }
                    );


                const result =
                    await response.json();


                // Invalid OTP
                if (!response.ok) {

                    alert(
                        result.message ||
                        "Invalid OTP"
                    );

                    verifyEmailBtn.disabled =
                        false;

                    verifyEmailBtn.textContent =
                        "Verify Email";

                    return;
                }


                // ==================================
                // EMAIL VERIFIED
                // ==================================

                const emailBadge =
                    document.querySelector(
                        '[data-badge="email"]'
                    );


                if (emailBadge) {

                    emailBadge.textContent =
                        "Verified";

                    emailBadge.classList.add(
                        "verified"
                    );

                }


                verifyEmailBtn.textContent =
                    "Email Verified ✓";


                // Enable Continue button
                const verifyContinue =
                    document.getElementById(
                        "verifyContinue"
                    );


                if (verifyContinue) {

                    verifyContinue.disabled =
                        false;

                }


                alert(
                    "Email verified successfully ✅"
                );


            } catch (error) {

                console.error(
                    "OTP Verification Error:",
                    error
                );


                alert(
                    "Server error. Please try again."
                );


                verifyEmailBtn.disabled =
                    false;


                verifyEmailBtn.textContent =
                    "Verify Email";

            }

        }
    );

}