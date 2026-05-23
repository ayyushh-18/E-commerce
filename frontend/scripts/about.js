// ELEMENTS
const elements = {
    aboutSections:
        document.querySelectorAll(
            "#about-head, #about-app"
        )
};

// HOVER EFFECTS
elements.aboutSections.forEach(
    (section) => {
        section.addEventListener(
            "mouseenter",
            () => {
                section.style.transform =
                    "translateY(-5px)";

                section.style.transition =
                    "0.3s ease";
            }
        );
        section.addEventListener(
            "mouseleave",
            () => {
                section.style.transform =
                    "translateY(0)";
            }
        );
    }
);