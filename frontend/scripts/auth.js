const elements = {
    signupForm: document.getElementById("signup-form"),
    signinForm: document.getElementById("signin-form"),

    signupName: document.getElementById("signup-name"),
    signupEmail: document.getElementById("signup-email"),
    signupPassword: document.getElementById("signup-password"),

    signinEmail: document.getElementById("signin-email"),
    signinPassword: document.getElementById("signin-password"),

    authLink: document.getElementById("auth-link"),
    dropdown: document.getElementById("profile-dropdown"),
    logoutBtn: document.getElementById("logout-btn")
};

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// BACKEND AUTH FUNCTIONS
const signupUser = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });
    return await res.json();
};

const loginUser = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    return await res.json();
};

function toggleFormLoading(button, isLoading, loadingText = "Please wait...") {
    if(!button) return;

    if(isLoading){
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = loadingText;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || "Submit";
    }
}

const clearAuthData = () => {
    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "refreshToken"
    );

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "cart"
    );

    localStorage.removeItem(
        "wishlist"
    );
};

// EMAIL SIGNUP
if(elements.signupForm){
    elements.signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if(
            e.submitter?.disabled
        ){
            return;
        }
        const name = elements.signupName.value.trim();
        const email = elements.signupEmail.value.trim();
        const password = elements.signupPassword.value;
        if (!name) {
            notify("Name is required", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            notify("Enter a valid email", "error");
            return;
        }

        if (!passwordRegex.test(password)) {
            notify(
                "Password must contain uppercase, lowercase, number and 8 characters",
                "error"
            );
            return;
        }
        const submitBtn = elements.signupForm.querySelector("button[type='submit']");
        toggleFormLoading(submitBtn, true, "Creating Account...");
        try {
            const response = await signupUser(name, email, password);
            if(response.success){
                notify("Account Created Successfully!", "success");
                window.location.href = "signin.html";
            } else {
                notify(response.message, "error");
            }
        } catch(error){
            console.error(error);
            notify("Signup failed. Please try again.", "error");
        } finally {
            toggleFormLoading(submitBtn, false);
        }
    });
}

// EMAIL SIGNIN
if(elements.signinForm){
    elements.signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if(
            e.submitter?.disabled
        ){
            return;
        }
        const email = elements.signinEmail.value.trim();
        const password = elements.signinPassword.value.trim();
        if (!emailRegex.test(email)) {
            notify(
                "Enter a valid email",
                "error"
            );
            return;
        }
        if (!password) {
            notify(
                "Password is required",
                "error"
            );
            return;
        }
        const submitBtn = elements.signinForm.querySelector("button[type='submit']");
        toggleFormLoading(submitBtn, true, "Signing In...");

        try {
            const response = await loginUser(email, password);
            if(response.success){
                // Store auth data
                localStorage.setItem("token", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                setJSON("user", response.user);

                notify("Login Successful!", "success");

                window.location.href = "index.html";
            } else {
                notify(response.message, "error");
            }
        } catch(error){
            console.error(error);
            notify("Login failed. Please try again.", "error");
        } finally {
            toggleFormLoading(submitBtn, false);
        }
    });
}

// AUTH NAVBAR PROFILE SYSTEM (JWT)
const token =
    getJSON("token") ||
    localStorage.getItem("token");

if(elements.authLink){
    if(token){
        elements.authLink.innerHTML = `<i class="fas fa-user"></i>`;
        elements.authLink.href = "#";
        elements.authLink.classList.add("profile-active");

        // Toggle Dropdown
        elements.authLink.addEventListener("click", (e) => {
            e.preventDefault();
            if(elements.dropdown){
                elements.dropdown.classList.toggle("active");
            }
        });

        // Logout
        if(elements.logoutBtn){
            elements.logoutBtn.addEventListener("click", () => {
                clearAuthData();
                if(elements.dropdown){
                    elements.dropdown.classList.remove("active");
                }
                notify("Logged out successfully", "success");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 800);
            });
        }

        // Close Dropdown on outside click
        document.addEventListener("click", (e) => {
            if(!e.target.closest(".profile-wrapper")){
                if(elements.dropdown){
                    elements.dropdown.classList.remove("active");
                }
            }
        });
        document.addEventListener(
            "keydown",
            (e) => {
                if(
                    e.key === "Escape" &&
                    elements.dropdown
                ){        
                    elements.dropdown.classList.remove(
                        "active"
                    );
                }
            }
        );
    } else {
        elements.authLink.innerHTML = "Sign In";
        elements.authLink.href = "signin.html";
        elements.authLink.classList.remove("profile-active");

        if(elements.dropdown){
            elements.dropdown.classList.remove("active");
        }
    }
}