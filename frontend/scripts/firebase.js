// firebase app state
let firebaseInitialized = false;

// validate firebase sdk
if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded");
} else if (!window.APP_CONFIG || !window.APP_CONFIG.firebase) {
    console.error("Firebase config missing");
} else {
    try {
        // firebase config
        const firebaseConfig = window.APP_CONFIG.firebase;

        // prevent duplicate initialization
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
        }

        firebaseInitialized = true;

        // auth instance
        const firebaseAuth = firebase.auth();

        // auth provider
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        // provider settings
        googleProvider.setCustomParameters({
            prompt: "select_account"
        });

        // persistence
        firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log("Firebase persistence enabled");
            })
            .catch((error) => {
                console.error("Firebase persistence error:", error);
            });

        // auth state listener
        firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Firebase user authenticated:", user.email);
            } else {
                console.log("Firebase user signed out");
            }
        });

        // expose globally
        window.firebaseInitialized = firebaseInitialized;
        window.firebaseAuth = firebaseAuth;
        window.googleProvider = googleProvider;

        // helper
        window.isFirebaseReady = () => {
            return (firebaseInitialized && !!window.firebaseAuth);
        };

    } catch (error) {
        console.error("Firebase initialization failed:", error);
        window.firebaseInitialized = false;
    }
}

// ==========================================
// ACTION TRIGGERS (LOGIN / SIGNUP FUNCTIONS)
// ==========================================

// 1. GOOGLE LOGIN
window.handleGoogleLogin = () => {
    if (!window.isFirebaseReady()) {
        console.error("Firebase is not ready yet!");
        return;
    }

    window.firebaseAuth.signInWithPopup(window.googleProvider)
        .then((result) => {
            const user = result.user;
            console.log("Google login successful!", user.email);
            // Yahan redirect logic daal sakti ho (e.g., window.location.href = '/home.html')
        })
        .catch((error) => {
            console.error("Google login failed:", error.message);
        });
};

// 2. EMAIL/PASSWORD SIGN UP
window.handleEmailSignUp = (email, password) => {
    if (!window.isFirebaseReady()) return;

    window.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Account created successfully!", user.email);
        })
        .catch((error) => {
            console.error("Sign up error:", error.message);
        });
};

// 3. EMAIL/PASSWORD LOGIN
window.handleEmailLogin = (email, password) => {
    if (!window.isFirebaseReady()) return;

    window.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Login successful!", user.email);
        })
        .catch((error) => {
            console.error("Login error:", error.message);
        });
};

// 4. LOGOUT
window.handleLogout = () => {
    if (!window.isFirebaseReady()) return;

    window.firebaseAuth.signOut()
        .then(() => {
            console.log("User logged out successfully");
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
        });
};