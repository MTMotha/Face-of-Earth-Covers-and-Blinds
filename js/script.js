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

    // 3. FORM VALIDATION AND AJAX SUBMISSION
    const forms = document.querySelectorAll("form");

    forms.forEach(function (form) {
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');

        // Validate email input.
        if (emailInput) {
            emailInput.addEventListener("input", function () {
                emailInput.setCustomValidity("");
            });
        }

        // Validate phone number input.
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

        // Handle form submission.
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Check required fields and input validity.
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Find or create a message area.
            let statusMessage = form.querySelector(".form-status");

            if (!statusMessage) {
                statusMessage = document.createElement("p");
                statusMessage.className = "form-status";
                statusMessage.setAttribute("role", "status");
                statusMessage.setAttribute("aria-live", "polite");
                form.appendChild(statusMessage);
            }

            const submitButton = form.querySelector(
                'button[type="submit"]'
            );

            if (!form.hasAttribute("data-netlify")) {
                statusMessage.textContent =
                    "This form is not connected to a submission service.";
                return;
            }

            // Prevent multiple submissions.
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            statusMessage.textContent = "Sending your message...";

            try {
                // Convert the form data into a format Netlify accepts.
                const formData = new FormData(form);

                const encodedData = new URLSearchParams(formData)
                    .toString();

                // Send the form using AJAX.
                const response = await fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },
                    body: encodedData
                });

                if (!response.ok) {
                    throw new Error("Form submission failed.");
                }

                // Redirect after successful submission.
                window.location.href =
                    form.getAttribute("action") || "/success.html";

            } catch (error) {
                statusMessage.textContent =
                    "Sorry, your message could not be sent. " +
                    "Please try again later.";

                console.error("Form submission error:", error);

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        form.getAttribute("name") === "inquiry"
                            ? "Submit Enquiry"
                            : "Send Message";
                }
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
    // 5. INTERACTIVE MAP USING LEAFLET
    const mapElement = document.getElementById("business-map");

    if (mapElement && typeof L !== "undefined") {
        // Approximate coordinates for Florida, Johannesburg.
        const businessLocation = [-26.17527, 27.92333];

        // Create the interactive map.
        const map = L.map("business-map").setView(
            businessLocation,
            14
        );

        // Load the OpenStreetMap map tiles.
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }
        ).addTo(map);

        // Add a location marker.
        const marker = L.marker(businessLocation).addTo(map);

        // Display information when the marker is clicked.
        marker.bindPopup(
            "<strong>Face of Earth Covers & Blinds</strong><br>" +
            "Florida, Johannesburg<br>" +
            "Call-out service. Visits by appointment."
        );

        console.log("Interactive map loaded successfully.");
    }

    console.log("Face of Earth website JavaScript loaded successfully.");
});