// BASE API URL
const API_BASE = "http://localhost:5000/api";

// NOTIFICATION HELPER
const notify = (message, type = "info") => {
    if (typeof showToast === "function") showToast(message, type);
    else alert(message);
};

// SAFE LOCALSTORAGE GET
const getJSON = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`getJSON error for key "${key}":`, error);
        return null;
    }
};

// SAFE LOCALSTORAGE SET
const setJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`setJSON error for key "${key}":`, error);
    }
};

// API REQUEST WRAPPER
const apiRequest = async (url, options = {}) => {
    try {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        };
        const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
        // HANDLE TOKEN EXPIRY
        if(res.status === 401){
        
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        
            notify("Session expired. Please login again.", "error");
        
            setTimeout(() => {
                window.location.href = "signin.html";
            }, 1000);
        
            return {
                success: false,
                message: "Unauthorized"
            };
        }

        if (!res.ok){
            throw new Error(`Request failed: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`API request error (${url}):`, error);
        notify("Something went wrong with the request", "error");
        return { success: false, message: error.message };
    }
};

// SAFE ELEMENT SELECTOR
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// PRICE FORMAT HELPER
const formatPrice = (price) => `₹${parseFloat(price || 0).toFixed(2)}`;

// AUTH CHECK HELPER
const requireAuth = () => {
    const token = localStorage.getItem("token");
    const user = getJSON("user");
    if (!token || !user) {
        notify("Please sign in to continue", "error");
        setTimeout(() => {
            window.location.href = "signin.html";
        }, 800);

        return null;
    }
    return user;
};

// DEFAULT IMAGE FALLBACK
const defaultImage = (url) => {
    return url && url.trim()
        ? url
        : "images/default-product.png";
};

// SAFE ARRAY MAP/FOREACH
const safeForEach = (arr, callback) => {
    if (Array.isArray(arr)) arr.forEach(callback);
};
const safeMap = (arr, callback) => (Array.isArray(arr) ? arr.map(callback) : []);

// GLOBAL HELPERS AVAILABLE ACROSS PROJECT
window.API_BASE = API_BASE;
window.notify = notify;
window.getJSON = getJSON;
window.setJSON = setJSON;
window.apiRequest = apiRequest;
window.$ = $;
window.$$ = $$;
window.formatPrice = formatPrice;
window.requireAuth = requireAuth;
window.defaultImage = defaultImage;
window.safeForEach = safeForEach;
window.safeMap = safeMap;