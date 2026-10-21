
let companyInformationForContact = async () => {
    companyAddressLoad();
    companyMailLinkLoad();
    companyPhoneLinkLoad();
    parentCompanyName();
    contactFormInit();
}

let contactFormInit = async () =>{
    if(!companyFooterData)
        await fetchCompanyFooterData();

    // contact form submission
    const form = document.querySelector("#contactForm");
    const statusText = document.getElementById("form-status");
    //phone and email according to the country
    let contact = companyFooterData.contact[0];
    const companyPhoneNumbersHtml = (contact.phone || []).map(phone => `<p>📞 <a href="tel:${phone}">${phone}</a></p>`).join('');

    let phoneLinks = document.getElementsByClassName("phone-link");

    // Update all phone links
    Array.from(phoneLinks).forEach(element => {
        element.innerHTML = companyPhoneNumbersHtml;
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        statusText.textContent = "Sending message...";
        statusText.className = "form-status";

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            });

            if (response.ok) {
            statusText.textContent = "✅ Form submit successfully!";
            statusText.classList.add("success");
            form.reset();
            } else {
            throw new Error("Something went wrong");
            }
        } catch (error) {
            statusText.textContent = "❌ Failed to submit the form. Please try again.";
            statusText.classList.add("error");
            form.reset();
        }

        // Fade out message after 4 seconds
        setTimeout(() => {
            statusText.textContent = "";
            statusText.className = "form-status";
        }, 4000);
    });

    document.getElementById("whatsappBtn").addEventListener("click", () => {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const message = form.message.value.trim();

        // ✅ Validation
        if (!name || !email || !message) {
            Swal.fire({
                title: "Please fill in all required fields (Name, Email, and Message) before sending via WhatsApp.",
                icon: "error",
                draggable: true
            });
            return; // stop execution
        }

        // Optional: basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // ✅ Build WhatsApp message
        const waMessage = `New Product Enquiry

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:${message}`;

        const waUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, "_blank");
        form.reset();
    });

}