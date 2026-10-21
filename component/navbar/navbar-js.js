// data link
const htmlCodeLink = "/component/navbar/navbar.html";
const menuDataLink = "/json/menu.json";
const companyInformationDataLink = "/json/company_information.json";

//country
let country = "ae";

//data store variable
let menuData = null;
let companyDataForLogo = null;

let fetchMenu = async () =>{
  try{
    let response = await fetch(menuDataLink);
    let data = await response.json();

    if(data)
      menuData = data;
  }
  catch(error){
    console.error("Error during loading the menu data", error);
  }
}

let fetchCompanyInformation = async () =>{
  try{
    let response = await fetch(companyInformationDataLink);
    let data = await response.json();

    if(data)
      companyDataForLogo = data;
  }
  catch(error){
    console.error("Error during loading the menu data", error);
  }
}

//logo
let companyLogoLoad = async () => {
  let navbarLogo = document.querySelector(".navbar-logo");
  
  if (!companyDataForLogo)
    await fetchCompanyInformation();

  navbarLogo.innerHTML = `<img src="${companyDataForLogo.logo}" alt="Company Logo" />`;
}

let menuPart = (data, menuKey, ulClassName) =>{
  let ul = document.createElement("ul");
  ul.className = ulClassName;

  data.forEach(m =>{
    let li = document.createElement("li");
    let a = document.createElement("a");

    if(ulClassName === "main-submenu"){
      li.classList.add("menu-item");
      a.className = "menu-item-link";
    }

    if(m.route)
      a.href = m.route;
    
    a.dataset.menu = menuKey;
    a.textContent = m.title;
    
    li.append(a);

    if(m.submenu){
      li.classList.add("has-children");
      a.innerHTML += '<span>+</span>';
      a.classList.add("nav-link");

      // empty the li tag
      li.innerHTML = "";
      li.append(a);

      let subSubmenu = menuPart(m.submenu, menuKey, "inner-submenu"); 

      li.append(subSubmenu);
    }
    ul.append(li);
  }); 
  return ul;
}

let loadMenuData = async () =>{
  let navMenu = document.getElementsByClassName("nav-menu")[0];
  
  if (!menuData)
    await fetchMenu();

  navMenu.innerHTML = "";

  menuData.forEach (e =>{
    let li = document.createElement("li");
    li.className = "nav-item";

    let parts = (e.route || "/")
      .replace(/^#?\/+/, "")
      .replace(/\/+$/, "")
      .split("/");

    if (!parts[0]) parts = ["home"];

    if(e.submenu){
      li.classList.add("dropdown");
      
      let subMenuData = e.submenu;
      
      // li.innerHTML = `<a href="${e.route ? e.route : ""}" class="nav-link" data-menu="${parts[0]}">${e.title}<span class="caret">▾</span></a>`;
      li.innerHTML = `<a href="${e.route ? e.route : ""}" class="nav-link main-nav caret" data-menu="${parts[0]}">${e.title} ▾</a>`;
      li.append(menuPart(subMenuData, parts[0], "main-submenu"));
    }
    else{
      li.innerHTML = `<a href="${e.route ? e.route : ""}" class="nav-link main-nav" data-menu="${parts[0]}" >${e.title}</a>`;
    }
    navMenu.append(li);
  });

  // setupNav();
  // setupSubmenuToggle();
  await handleRoute();
}

// function setupSubmenuToggle() {
//   document.querySelectorAll(".submenu-toggle").forEach(toggle => {
//     toggle.addEventListener("click", e => {
//       e.stopPropagation();
//       const dropdown = toggle.closest(".dropdown");
//       dropdown.classList.toggle("open");
//     });
//   });
// }

let navbarHtmlCodeLoad = async () => {
  try {
    
    const response = await fetch(htmlCodeLink, { cache: "no-store" });

    const html = await response.text();

    if (!response.ok) {
      throw new Error(`Navbar load failed: ${response.status}`);
    }

    const navbar = document.getElementById("navbar");
    if (!navbar) throw new Error('Element "#navbar" not found in index.html');

    navbar.innerHTML = html;
    await loadMenuData();
    await companyLogoLoad();
    setupHamburger();
  } catch (error) {
    console.error("Navbar initialization failed:", error);
  }
};


// let navbarHtmlCodeLoad = async () =>{
//   // Load navbar
//   fetch(htmlCodeLink)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("navbar").innerHTML = html;

//       loadMenuData();
//       companyLogoLoad();
//       setupHamburger();
//     });
// }


function navigateThePage(parts) {
  let route = parts || "home";
  console.log("line no 153 Current route:", route);

  //index.html change to home.html
  route = route.replace(".html", ""); // Remove .html if present
  if(route === "index") {
    route = "home";
  }

  // Detail pages ke liye bhi folder ka naam use hoga
  return `/pages/${route}/${route}.html`;
}



// Load page content
// function loadPage(page, menu) {
//   fetch(page)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("content").innerHTML = html;
//       setActive(menu);
      
//       // if (typeof initHeroSlider === "function") {
//       //   initHeroSlider();
//       // }
//       // if(typeof companyInformationForPrivacyPolicy === "function"){
//       //   companyInformationForPrivacyPolicy();
//       // }
//       // if(typeof companyInformationForContact == "function"){
//       //   companyInformationForContact();
//       // }
//       // if (typeof loadTheProductData == "function"){
//       //   loadTheProductData();
//       // }
//       // if(typeof loadTheMoreData == "function"){
//       //   loadTheMoreData();
//       // }
//       // if(typeof loadTheProductDetailData == "function"){
//       //   loadTheProductDetailData();
//       // }
//       // if(typeof distributorMethod == "function" && typeof indiaMap == "function"){
//       //   distributorMethod();
//       //   indiaMap();
//       // }
//       // if(typeof moreDetailInit == "function" ){
//       //   moreDetailInit();
//       // }

      // switch(menu) {
      //   case "home":
      //     initHeroSlider();
      //     break;
        
      //   case "policy":
      //     companyInformationForPrivacyPolicy();
      //     break;
        
      //   case "about" :
      //     companyInformationForAboutPage();
      //     break;

      //   case "contact" :
      //     companyInformationForContact();
      //     break;
        
      //   case "product" :
      //     loadTheProductData()
      //     break;
        
      //   case "more" :
      //     loadTheMoreData();
      //     break;
        
      //   case "productDetail":
      //     loadTheProductDetailData();
      //     break;

      //   case "distributor" : 
      //     distributorMethod();
      //     indiaMap();
      //     break;

      //   case "exportEnquiry" :
      //     exportEnquiryInit();
      //     break;

      //   case "moreDetail" : 
      //     moreDetailInit();
      //     break;
      // }
//     });
// }

async function loadPage(page, menu) {
  if(!menu)
    menu = "home";
  
  try {
    const res = await fetch(page, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Page load failed: ${page}`);
    }

    const html = await res.text();
    document.getElementById("content").innerHTML = html;

    setActive(menu);

    switch(menu) {
        case "home":
          initHeroSlider();
          break;
        
        case "policy":
          companyInformationForPrivacyPolicy();
          break;
        
        case "about" :
          companyInformationForAboutPage();
          break;

        case "contact" :
          companyInformationForContact();
          break;
        
        case "product" :
          loadTheProductData()
          break;
        
        case "more" :
          loadTheMoreData();
          break;
        
        case "productDetail":
          loadTheProductDetailData();
          break;

        case "distributor" : 
          distributorMethod();
          indiaMap();
          break;

        case "exportEnquiry" :
          exportEnquiryInit();
          break;

        case "moreDetail" : 
          moreDetailInit();
          break;
    }
  } catch (error) {
    console.error(error);
    document.getElementById("content").innerHTML =
      "<h2>Page can not be load. Please try again.</h2>";
  }
}




function getRouteParts() {
  let path = window.location.pathname;
  console.log("line no 306 Current path:", path);
  // Purane hash URLs ko clean URLs mein convert karein
  if (window.location.hash.startsWith("#/")) {
    path = window.location.hash.slice(1);

    window.history.replaceState(
      {},
      "",
      path
    );
  }

  return path
    .split("/")
    .filter(Boolean);
}



// Hash router
// async function handleRoute() {
  
//   const hash = location.hash || "#/home";

//   const parts = hash.replace("#/", "").split("/");
//   let page = navigateThePage(parts);
//   // const page = parts[0];        // buy / rent / home
//   // const subPage = parts[1];     // apartments / villas

//   loadPage(page, parts[0]);
//   window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "smooth"
//   });
// }

let getDirectoryFromPath = (path) => {
  let directory = path[0] || "home";
  directory = directory.replace(".html", ""); // Remove .html if present
  if(directory === "index") {
    directory = "home";
  }

  return directory;
}

async function handleRoute() {
  const parts = getRouteParts();
  const directory = getDirectoryFromPath(parts);

  const page = navigateThePage(directory);

  console.log("Loading page:", page, "with menu:", directory);
  await loadPage(page, directory);

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}

// Hamburger
function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  console.log("Hamburger setup complete: ", hamburger, " navMenu:", navMenu);

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("open");
  });

  navMenu.addEventListener("click", e => {
    // console.log(window.innerWidth);
    const navItem = e.target.closest(".nav-item");
    if (!navItem || window.innerWidth > 768) return;
// console.log("nva");
    const clickedLink = e.target.closest("a");
// console.log(clickedLink);
    // ✅ CLICK ON TEXT → NAVIGATE
    if (clickedLink) {
      closeMobileMenu();
      return;
    }

    // ✅ CLICK ON EMPTY SPACE → TOGGLE SUBMENU
    e.preventDefault();
    navItem.classList.toggle("open");
  });
}


function closeMobileMenu() {
  document.getElementById("hamburger")?.classList.remove("active");
  document.getElementById("navMenu")?.classList.remove("open");
}

// Highlight active menu
function setActive(menu) {
  document.querySelectorAll(".main-nav").forEach(link => {
    link.classList.toggle("active", link.dataset.menu === menu);
  });
  document.querySelector(".navbar-logo")?.classList.remove("active");
}

// document.addEventListener("click", e => {
//   if (
//     window.innerWidth <= 768 &&
//     e.target.matches(".submenu a")
//   ) {
//     console.log(e);
//     closeMobileMenu();
//   }
// });

// document.querySelectorAll(".nav-item.dropdown > .nav-link")
//   .forEach(link => {
//     link.addEventListener("click", e => {
//       if (window.innerWidth <= 768) {
//         e.preventDefault();
//         link.parentElement.classList.toggle("open");
//       }
//     });
//   });



// Handle refresh + back/forward
let routeUpdateFrame = null;
function handleHistoryNavigation() {
  if (routeUpdateFrame !== null) {
    cancelAnimationFrame(routeUpdateFrame);
  }

  // A history traversal can fire both events for a hash URL; handle it once.
  routeUpdateFrame = requestAnimationFrame(() => {
    routeUpdateFrame = null;
    handleRoute();
  });
}

window.addEventListener("popstate", handleHistoryNavigation);
window.addEventListener("hashchange", handleHistoryNavigation);


//navbar data
navbarHtmlCodeLoad();
