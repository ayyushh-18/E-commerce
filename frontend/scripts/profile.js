// AUTH PROTECTION
const user = requireAuth();

if(user){
    loadUserProfile(user);
}

const elements = {
    sidebarName:
        document.getElementById(
            "sidebar-name"
        ),

    sidebarEmail:
        document.getElementById(
            "sidebar-email"
        ),

    profileName:
        document.getElementById(
            "profile-name"
        ),

    profileEmail:
        document.getElementById(
            "profile-email"
        ),

    profilePhone:
        document.getElementById(
            "profile-phone"
        ),

    profileAddress:
        document.getElementById(
            "profile-address"
        ),

    profileBio:
        document.getElementById(
            "profile-bio"
        ),

    profilePreview:
        document.getElementById(
            "profile-preview"
        ),

    profileForm:
        document.getElementById(
            "profile-form"
        ),

    avatarInput:
        document.getElementById(
            "avatar-input"
        )
};

const getStorageValue = (key) =>
    localStorage.getItem(key) || "";

// LOAD PROFILE
function loadUserProfile(user){
    if (elements.sidebarName) {
        elements.sidebarName.innerText =
            user.name || "User";
    }

    if (elements.sidebarEmail) {
        elements.sidebarEmail.innerText =
            (user.email || "").trim();
    }

    if (elements.profileName) {
        elements.profileName.value =
            getStorageValue(
                "profileName"
            ) ||
            user.name ||
            "";
    }

    if (elements.profileEmail) {
        elements.profileEmail.value =
            user.email || "";
    }

    if (elements.profilePhone) {
        elements.profilePhone.value =
            getStorageValue(
                "profilePhone"
            ) || "";
    }

    if (elements.profileAddress) {
        elements.profileAddress.value =
            getStorageValue(
                "profileAddress"
            ) || "";
    }

    if (elements.profileBio) {
        elements.profileBio.value =
            getStorageValue(
                "profileBio"
            ) || "";
    }

    const savedAvatar =
        getStorageValue(
            "profileAvatar"
        );

    if (
        savedAvatar &&
        elements.profilePreview
    ) {
        elements.profilePreview.src =
            savedAvatar;
    }
}

if (elements.profileForm) {
    elements.profileForm.addEventListener(
        "submit",
        (e) => {
            e.preventDefault();
            if(
                !elements.profileName.value.trim()
            ){
                notify(
                    "Name cannot be empty",
                    "error"
                );
                return;
            }
            localStorage.setItem(
                "profileName",
                elements.profileName.value.trim()
            );

            localStorage.setItem(
                "profilePhone",
                elements.profilePhone.value.trim()
            );

            localStorage.setItem(
                "profileAddress",
                elements.profileAddress.value.trim()
            );

            localStorage.setItem(
                "profileBio",
                elements.profileBio.value.trim()
            );

            if(elements.sidebarName){
                elements.sidebarName.innerText =
                    elements.profileName.value.trim();
            }
            const updatedUser = {
                ...user,
                name:
                    elements.profileName.value.trim()
            };

            setJSON(
                "user",
                updatedUser
            );

            notify(
                "Profile updated successfully!",
                "success"
            );
        }
    );
}

if (elements.avatarInput) {
    elements.avatarInput.addEventListener(
        "change",
        (e) => {
            const file =
                e.target.files[0];

            if(!file) return;
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];
            if(
                !allowedTypes.includes(file.type)
            ){
                notify(
                    "Please upload a valid image",
                    "error"
                );
                return;
            }
            const maxSize =
                2 * 1024 * 1024;
            if(file.size > maxSize){
                notify(
                    "Image must be under 2MB",
                    "error"
                );
                return;
            }

            const reader =
                new FileReader();

            reader.onload = function(event){

                const image =
                    event.target.result;

                if (elements.profilePreview) {
                    elements.profilePreview.src =
                        image;
                }

                localStorage.setItem(
                    "profileAvatar",
                    image
                );
            };
            reader.readAsDataURL(file);
        }
    );
}