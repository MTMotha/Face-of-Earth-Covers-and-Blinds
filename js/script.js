document.addEventListener("DOMContentLoaded", function () {
    // 1. PRODUCT SEARCH AND FILTER
    const productSection = document.querySelector(".products");

    if (productSection) {
        const productCards = productSection.querySelectorAll(".product-card");

        if (productCards.length > 0) {
            const searchContainer = document.createElement("div");
            searchContainer.className = "product-search";

            const searchLabel = document.createElement("label");
            searchLabel.htmlFor = "productSearch";
            searchLabel.textContent = "Search our products:";

            const searchInput = document.createElement("input");
            searchInput.type = "search";
            searchInput.id = "productSearch";
            searchInput.placeholder = "e.g. roller blinds";
            searchInput.setAttribute(
                "aria-label",
                "Search products by name or description"
            );

            const resultMessage = document.createElement("p");
            resultMessage.setAttribute("aria-live", "polite");

            searchContainer.append(searchLabel, searchInput, resultMessage);
            productSection.before(searchContainer);

            function filterProducts() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                let visibleCount = 0;

                productCards.forEach(function (card) {
                    const productText = card.textContent.toLowerCase();
                    const matches = productText.includes(searchTerm);

                    card.hidden = !matches;

                    if (matches) {
                        visibleCount++;
                    }
                });

                resultMessage.textContent =
                    visibleCount + (visibleCount === 1
                        ? " product found."
                        : " products found.");
            }

            searchInput.addEventListener("input", filterProducts);
            filterProducts();
        }
    }

    // 2. IMAGE LIGHTBOX
    const lightbox = document.createElement("dialog");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-label", "Enlarged image viewer");

    const enlargedImage = document.createElement("img");
    enlargedImage.alt = "";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Close image";
    closeButton.setAttribute("aria-label", "Close enlarged image");

    lightbox.append(enlargedImage, closeButton);
    document.body.appendChild(lightbox);

    const galleryImages = document.querySelectorAll(
        ".product-card img, .comparison-grid img"
    );

    galleryImages.forEach(function (img) {
        img.style.cursor = "zoom-in";
        img.title = "Click to enlarge image";

        img.addEventListener("click", function () {
            enlargedImage.src = img.src;
            enlargedImage.alt = img.alt;
            lightbox.showModal();
        });
    });

    closeButton.addEventListener("click", function () {
        lightbox.close();
    });

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            lightbox.close();
        }
    });

    // 3. FORM VALIDATION AND FEEDBACK
    const forms = document.querySelectorAll("form");

    forms.forEach(function (form) {
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');

        // Check the email and phone when the visitor leaves each field.
        if (emailInput) {
            emailInput.addEventListener("input", function () {
                emailInput.setCustomValidity("");
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener("input", function () {
                phoneInput.setCustomValidity("");

                const phone = phoneInput.value.trim();
                const phonePattern = /^[0-9+\s().-]{7,20}$/;

                if (phone && !phonePattern.test(phone)) {
                    phoneInput.setCustomValidity(
                        "Please enter a valid phone number."
                    );
                }
            });
        }

        form.addEventListener("submit", function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
                return;
            }

            // Only show this message if the form has no submission
            // destination configured yet.
            if (
                !form.hasAttribute("action") ||
                form.getAttribute("action") === "#"
            ) {
                event.preventDefault();

                let statusMessage = form.querySelector(".form-status");

                if (!statusMessage) {
                    statusMessage = document.createElement("p");
                    statusMessage.className = "form-status";
                    statusMessage.setAttribute("role", "status");
                    form.appendChild(statusMessage);
                }

                statusMessage.textContent =
                    "Your details are valid, but this form is not connected " +
                    "to a submission service yet. Please try again after " +
                    "the website form setup is complete.";
            }
        });
    });

    // 4. ACCORDIONS
    // Any element with data-accordion-toggle can open or close
    // the content element identified by its data-target attribute.
    const accordionButtons = document.querySelectorAll(
        "[data-accordion-toggle]"
    );

    accordionButtons.forEach(function (button) {
        const targetSelector = button.getAttribute("data-target");
        const panel = targetSelector
            ? document.querySelector(targetSelector)
            : null;

        if (!panel) {
            return;
        }

        button.setAttribute("aria-expanded", "false");
        panel.hidden = true;

        button.addEventListener("click", function () {
            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isExpanded));
            panel.hidden = isExpanded;
        });
    });

    console.log("Face of Earth website JavaScript loaded successfully.");
});