const ip = "http://localhost:5678/api"

const galery = document.getElementsByClassName("gallery");
const firstCategoryName = document.getElementById("category").firstChild.textContent;

var cacheWorks;
var categoryName;
var cacheCategoryElement;

function updateFilter() {
    if (cacheCategoryElement[0].textContent === firstCategoryName) {
        for (child of galery[0].children) {
            child.style.display = "";
        }
        return;
    }
    cacheWorks.forEach((() => {
        
    }));

}

function updateFilterList(works) {
    document.getElementById("category").children.length = 1;
    categoryName = new Set();
    works.forEach((work) => {
        categoryName.add(work.category.name);
    });
    console.log(categoryName);
    window.categoryName = categoryName;
    cacheCategoryElement = document.getElementsByClassName("category-active");
}

function updateWorks() {
    fetch(ip + "/works").then((resp) => {
        resp.json().then((works) => {
            window.cacheWorks = works;
            works.forEach(work => {
                ele = document.createElement("figure");
                ele.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
				<figcaption>${work.title}</figcaption>
            `;
                galery[0].appendChild(ele);
            });
            updateFilterList(works);
        });
    });
}

//init
updateWorks();