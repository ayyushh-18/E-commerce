// ELEMENTS
const elements = {
    blogBoxes:
        document.querySelectorAll(
            ".blog-box"
        )
};

// HOVER EFFECTS
elements.blogBoxes.forEach(
    (box) => {
        box.addEventListener(
            "mouseenter",
            () => {
                box.style.transform =
                    "translateY(-5px)";

                box.style.transition =
                    "0.3s ease";
            }
        );
        box.addEventListener(
            "mouseleave",
            () => {
                box.style.transform =
                    "translateY(0)";
            }
        );
    }
);