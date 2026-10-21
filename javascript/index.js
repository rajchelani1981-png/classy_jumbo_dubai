let companyNameLoad = async () =>{
    if(!companyDataForLogo)
        await fetchCompanyInformation();

    document.querySelectorAll(".company-name").forEach(e =>{
        e.textContent = companyDataForLogo.company_name;

    });
}

let businessQuoteLoad = async () =>{
    if(!companyDataForLogo)
        await fetchCompanyInformation();

    document.querySelectorAll(".business").forEach(e =>{
        e.textContent = companyDataForLogo.manufacture;
    });
}

let companyAddressLoad = async () =>{
    if(!companyDataForLogo)
        await fetchCompanyInformation();

    document.querySelectorAll(".company-address").forEach(e =>{
        e.textContent = companyDataForLogo.address;
    });
}

let companyMailLinkLoad = async () =>{
    if(!companyDataForLogo)
        await fetchCompanyInformation();

    document.querySelectorAll(".email-link").forEach(e => {
        let contactInfo = companyDataForLogo.contact.find(co => co.country == country);
        console.log("contactInfo", contactInfo);
        e.innerHTML = `<a href="mailto:${contactInfo.email}">${contactInfo.email}</a>`
    });
}

let companyPhoneLinkLoad = async () =>{
    if(!companyDataForLogo)
        await fetchCompanyInformation();
    
    document.querySelectorAll(".phone-link").forEach(e => {
        let contactInfo = companyDataForLogo.contact.find(co => co.country == country);
        
        const companyPhoneNumbersHtml = (contactInfo.phone || []).map(phone => `<p>📞 <a href="tel:${phone}">${phone}</a></p>`).join('');
        e.innerHTML = companyPhoneNumbersHtml
    });
}

let parentCompanyName = async () =>{
    if(!companyDataForLogo)
        await fetchCompanyInformation();
    
    document.querySelectorAll(".parent-company-name").forEach(e => {
        e.innerHTML = companyDataForLogo.parent_company_name;
    });
}