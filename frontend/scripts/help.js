// ELEMENTS
const elements = {
    faqBoxes:
        document.querySelectorAll(
            ".faq-box"
        )
};

// FAQ TOGGLE
elements.faqBoxes.forEach(
    (box) => {
        const question =
            box.querySelector(
                ".faq-question"
            );
        if(!question) return;
        question.addEventListener(
            "click",
            () => {
                elements.faqBoxes.forEach(
                    (item) => {
                        if(item !== box){
                            item.classList.remove(
                                "active"
                            );
                        }
                    }
                );
                box.classList.toggle(
                    "active"
                );
            }
        );
    }
);