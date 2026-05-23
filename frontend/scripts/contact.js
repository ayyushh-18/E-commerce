// ELEMENTS
const elements = {
    contactForm:
        document.getElementById(
            "contact-form"
        ),

    name:
        document.getElementById(
            "name"
        ),

    email:
        document.getElementById(
            "email"
        ),

    subject:
        document.getElementById(
            "subject"
        ),

    message:
        document.getElementById(
            "message"
        )
};

// CONTACT FORM
if(elements.contactForm){
    elements.contactForm.addEventListener(
        "submit",
        (e) => {
            e.preventDefault();
            const name =
                elements.name.value.trim();

            const email =
                elements.email.value.trim();

            const subject =
                elements.subject.value.trim();

            const message =
                elements.message.value.trim();

            if(
                !name ||
                !email ||
                !subject ||
                !message
            ){
                notify(
                    "Please fill all fields.",
                    "error"
                );
                return;
            }
            const emailRegex =
                /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if(
                !emailRegex.test(email)
            ){
                notify(
                    "Please enter a valid email.",
                    "error"
                );
                return;
            }
            notify(
                "Message submitted successfully!",
                "success"
            );
            elements.contactForm.reset();
        }
    );
}