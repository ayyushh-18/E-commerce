// ELEMENTS
const elements = {
    policySections:
        document.querySelectorAll(
            "#privacy-policy h3"
        )
};

// HOVER EFFECTS
elements.policySections.forEach(
    (section) => {
        section.addEventListener(
            "mouseenter",
            () => {
                section.style.color =
                    "#088178";
                section.style.transition =
                    "0.3s ease";
            }
        );
        section.addEventListener(
            "mouseleave",
            () => {
                section.style.color =
                    "#222";
            }
        );
    }
);