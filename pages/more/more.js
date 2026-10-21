// first - folder same for html file, second-file (json), ...filter with filter key

let loadSubmenuForMore = (list) => {
    let pageTitle = document.querySelector(".page-title");
    pageTitle.innerHTML = "";

    let subTree = document.createElement("div");
    subTree.className = "tree-sub";

    list.forEach (e => {
        let a = `<a href="${e.route}">${e.title}</a>`;
        subTree.innerHTML += a;
    });
    pageTitle.append(subTree);
}

let pageTitleArrange = (title) => {
    document.querySelector(".page-title").innerHTML = `<h1>${title}</h1>`;
}

let moreDataArrange = (data) =>{
    let awardContainer = document.querySelector(".award-container");
    awardContainer.innerHTML = "";

    const parts = getCurrentRouteParts();

    data.forEach( e => {
        let pageLink = e.pageLink;

      if(pageLink){
        pageLink = pageLink.replace(/^.*\/json\/|\.json$/g, "");
      }
      
        let card = `<div class="award-card" onclick="location.href='#/moreDetail/${pageLink ? pageLink :parts[1]}/id-${e.id}'">
            <div class="award-image">
                <img src="${e.thumb_img}" alt="${e.title}">
            </div>

            <h3 class="more-title">${e.title}</h3>
            <p class="more-description">
                ${e.description}
            </p>
        </div>`;
        awardContainer.innerHTML += card;
    });
}

let loadTheMoreData = async () => {
    let dataPageLink = fetchJsonDataLink();
    let bannerImage = null;
    let list = null;
    let title = null;
    let flag = true;

    if(dataPageLink){
        if (!pageObj[dataPageLink])
        await fetchProductData(dataPageLink);
        
        let data = pageObj[dataPageLink];
        
        bannerImage = data.bannerImage;
        list = data.list;
        title = data.page_title;
    }
    else{
        if(!menuData)
            await fetchMenu();

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
        pageTitleArrange(title);
        moreDataArrange(list);
    }
    else{
        loadSubmenuForMore(list);

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
      
      moreDataArrange(productDataList);
    }
}

// loadTheProductData();