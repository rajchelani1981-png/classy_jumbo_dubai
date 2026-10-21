  // first - folder same for html file, second-file (json), ...filter with filter key
  let pageObj = {};
  let filterSequenceWithKey = ["category", "flavour"];

  // let fetchJsonDataLink = () => {
  //   const hash = location.hash;
  //   let jsonDataPageLink = "/json";
  //   const parts = hash.replace("#/", "").split("/");

  //   //if json file name not found then
  //   if(!parts[1])
  //     return null;

  //   jsonDataPageLink += `/${parts[1]}.json`;
  //   return jsonDataPageLink;
  // }

  
function getCurrentRouteParts() {
  let path = window.location.pathname || "/";

  // Support legacy URLs like /#/product/biscuits
  if (window.location.hash.startsWith("#/")) {
    path = window.location.hash.slice(1);
  }

  path = path.replace(/^\/+|\/+$/g, "");

  if (!path || path === "index.html") {
    return ["home"];
  }

  return path.split("/");
}

// let fetchJsonDataLink = () => {
//   const parts = getCurrentRouteParts();

//   // /product/ => no detail JSON
//   if (!parts[1]) {
//     return null;
//   }

//   // /product/biscuits/ => /json/biscuits.json
//   return `/json/${parts[1]}.json`;
// };

  function fetchJsonDataLink() {
    const parts = getRouteParts();
    console.log("line no 50 parts", parts);
    // /product/ has no product JSON slug
    if (!parts[1]) return null;

    // /product/biscuits/ -> /json/biscuits.json
    // /productDetail/biscuits/id-123/ -> /json/biscuits.json
    return `/json/${parts[1]}.json`;
  }

// let fetchJsonDataLinkByLink = (link) => {
//   // Handles either #/product/biscuits or /product/biscuits/
//   let path = link || "";

//   if (path.startsWith("#/")) {
//     path = path.slice(1);
//   }

//   path = path.replace(/^\/+|\/+$/g, "");
//   const parts = path.split("/");

//   if (!parts[1]) {
//     return null;
//   }

//   return `/json/${parts[1]}.json`;
// };

function fetchJsonDataLinkByLink(link) {
  let path = link || "";

  // Accept old hash-style menu links too
  if (path.startsWith("#/")) {
    path = path.slice(1);
  }

  const parts = path.replace(/^\/+|\/+$/g, "").split("/");

  if (!parts[1]) return null;

  return `/json/${parts[1]}.json`;
}
  

  let fetchProductData = async (dataPageLink) =>{
    try{
      let response = await fetch(dataPageLink);
      let data = await response.json();

      if(data)
        pageObj[dataPageLink] = data;
    }
    catch (error){
      console.log("error", error);
    }
  }

  let filteredData = (key, value, data) => {
    return data.filter( e => e[key].toUpperCase() == value.toUpperCase());
  }

  let filteredRelatedData = (key, value, data) => {
    return data.filter( e => e[key].toUpperCase() != value.toUpperCase());
  }

  let filtersTheData = (data) => {
    const parts = getCurrentRouteParts();
    
    for(let i = 2; i < parts.length; i++){
      let filter = parts[i].split("-");

      let key = decodeURIComponent(filter[0]);
      let value = decodeURIComponent(filter[1]);

      if(key && value && data)
        data = filteredData(key, value, data);
    }
    return data;
  }

  let filtersOtherRelatedData = (data) => {
    const hash = location.hash;
    const parts = hash.replace("#/", "").split("/");
    
    for(let i = 2; i < parts.length; i++){
      let filter = parts[i].split("-");

      let key = filter[0];
      let value = filter[1];

      if(key && value && data)
        data = filteredRelatedData(key, value, data);
    }
    return data;
  }

  let loadBannerImage = (imageLink) => {
    document.querySelector(".page-banner").innerHTML = `
    <picture>
      ${imageLink.mobile_webp ? `<source media="(max-width: 768px)" type="image/webp" srcset="${imageLink.mobile_webp}">` : ""}
      ${imageLink.mobile_img ? `<source media="(max-width: 768px)" srcset="${imageLink.mobile_img}">` : ""}
      ${imageLink.tablet_webp ? `<source media="(max-width: 1024px)" type="image/webp" srcset="${imageLink.tablet_webp}">` : ""}
      ${imageLink.tablet_img ? `<source media="(max-width: 1024px)" srcset="${imageLink.tablet_img}">` : ""}
      <source type="image/webp" srcset="${imageLink.img_webp}">
      <img src="${imageLink.img}" loading="lazy">
    </picture>`;
  }

  let appendProducts = (data, grid) => {
    const parts = getCurrentRouteParts();

    const fragment = document.createDocumentFragment();

    data.forEach(p => {
      let pageLink = p.pageLink
        ? p.pageLink.replace(/^.*\/json\/|\.json$/g, "")
        : parts[1];

      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.link = `#/productDetail/${pageLink}/id-${p.id}`;

      card.innerHTML = `
        <img
          data-src="${p.thumbnail}"
          class="lazy-img"
          alt="${p.sub_flavour}" >
        <h3>${p.flavour}</h3>
        <span>${p.brand}</span>
      `;

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);

    // Observe newly added images
    grid.querySelectorAll(".lazy-img").forEach(img => imgObserver.observe(img));
  };

  const idle = window.requestIdleCallback || function (cb) {
    return setTimeout(cb, 1);
  };

  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });


  let productDataArrange = (data) => {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    if (data.length > 12) {
      appendProducts(data.slice(0, 12), grid);

      idle(() => {
        appendProducts(data.slice(12), grid);
      });
    } else {
      appendProducts(data, grid);
    }
  };



  //fetch category list
  let fetchCategory = (data, filterKey) =>{
    let list = new Set();

    for(let i=0; i < data.length; i++){
      list.add(data[i][filterKey]);
    }
    return list;
  }

  function syncTabs(currentCategory) {
    let tabs = document.querySelectorAll(".category-tabs button");
    tabs.forEach(b => {
      b.classList.toggle("active", b.dataset.category === currentCategory);
    });
  }

  let filterOptionLoad = (data, filterKey) => {
    let categoryTabs = document.querySelector(".category-tabs");
    categoryTabs.innerHTML = "";

    data.forEach(e => {
      let button = document.createElement("button");

      button.dataset.category = `${filterKey}-${e}`;
      button.textContent = e.toUpperCase();
      button.addEventListener("click", () => {
        updateTheHashWithPreviousData(`${filterKey}-${e}`);
        loadTheProductData();
        syncTabs(`${filterKey}-${e}`);
      });

      categoryTabs.append(button);
    });
  }

  let loadSubmenu = (list) =>{
    let categoryTabs = document.querySelector(".category-tabs");
    categoryTabs.innerHTML = "";

    list.forEach(e => {
      let button = document.createElement("button");

      button.dataset.category = `${e.route}`;
      button.textContent = e.title;
      button.addEventListener("click", () => {
        location.hash = e.route;
        loadTheProductData();
        syncTabs(e.route);
      });

      categoryTabs.append(button);
    });
  }

  // let fetchJsonDataLinkByLink = (link) => {
  //   const parts = link.replace("#/", "").split("/");

  //   return `/json/${parts[1]}.json`;
  // }

  let loadTheProductData = async () => {
    let dataPageLink = fetchJsonDataLink();

    console.log("dataPageLink", dataPageLink);
    let bannerImage = null;
    let list = null;
    let flag = true;
    
    if(dataPageLink){
      if (!pageObj[dataPageLink]){
        await fetchProductData(dataPageLink);
      }
      let data = pageObj[dataPageLink];
      console.log("line no 297", data);
      bannerImage = data.bannerImage;
      list = data.list;
    }
    else{
      if(!menuData)
        await fetchMenu();

      // let productHash = location.hash;
      // let productMenu = menuData.find( e => e.route == productHash);

      const parts = getCurrentRouteParts();
      const currentRoute = "/" + parts.join("/") + "/";

      const productMenu = menuData.find(e => {
        if (!e.route) return false;

        const menuRoute = e.route.startsWith("#/")
          ? "/" + e.route.slice(2)
          : e.route;

        return menuRoute.replace(/\/+$/, "") ===
              currentRoute.replace(/\/+$/, "");
      });

      bannerImage = productMenu.bannerImage;
      list = productMenu.submenu;
      flag = false;
    }

    loadBannerImage(bannerImage)

    if(flag){
      let filteredData = filtersTheData(list);
      console.log("filteredData", filteredData);
      productDataArrange(filteredData);

      // arrange for filter
      let categories = new Set();
      let keyIndex = 0;
      
      for(let i=0; i < filterSequenceWithKey.length; i++){
        categories = fetchCategory(filteredData, filterSequenceWithKey[i]);
        keyIndex = i;

        if(categories.size > 1){
          break;
        }
      }

      filterOptionLoad(categories, filterSequenceWithKey[keyIndex]);
    }
    else{
      loadSubmenu(list);
      //data stroage
      let productDataList = [];

      //data collect
      for(let i=0; i<list.length; i++){
        let pageLink = fetchJsonDataLinkByLink(list[i].route);

        if (!pageObj[pageLink]){
          await fetchProductData(pageLink);
        }
        let allProductListWithPageLink = pageObj[pageLink].list.map(item => ({
          ...item,
          "pageLink" : pageLink
        }));
        productDataList.push(...allProductListWithPageLink);
      }
      
      productDataArrange(productDataList);
    }

    document.getElementById("productGrid").addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;

      // location.hash = card.dataset.link;
      const target = card.dataset.link || "";

      const cleanPath = target.startsWith("#/")
        ? target.slice(1)
        : target.startsWith("/")
          ? target
          : `/${target}`;

      window.location.href = cleanPath.endsWith("/")
        ? cleanPath
        : `${cleanPath}/`;
    });

  }

  //expected changeFilter = "/key-value/key-value"
  //for isolate filter
  function updateTheHashWithIsolateData(changeFilter) {
    let hash = location.hash;
    let parts = hash.replace("#/", "").split("/");
    location.hash = `#/${parts[0]}/${parts[1]}${changeFilter}`;
  }

  //with previous filter
  function updateTheHashWithPreviousData(changeFilter) {
    const hash = location.hash.replace(/^#\/?/, ""); // remove # or #/
    const beforeFilterUrlSplit = getCurrentRouteParts();
    const beforeFilterUrl = beforeFilterUrlSplit.join("/");

    const parts = beforeFilterUrl.split("/").filter(Boolean);
    const changeParts = changeFilter.replace("/", "")

    const segmentSet = new Set(parts);
    segmentSet.add(changeFilter);

    location.hash = "#/" + [...segmentSet].join("/");
  }

// loadTheProductData();