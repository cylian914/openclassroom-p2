const ip = "http://localhost:5678/api";

const galery = document.getElementsByClassName("gallery")[0];
const category = document.getElementById("category");
const firstCategoryName = category.children[0].textContent;


var cacheWorks;
var categoryNames;

function updateFilter() {

    filters = document.getElementsByClassName("category-active");
    if (filters[0].textContent === firstCategoryName) {
        for (child of galery.children) {
            child.style.display = "";
        }
        return;
    }
    for (i = 0; i < cacheWorks.length; i++) {
        (async () => {
            for (ele of filters) {
                if (ele.textContent === cacheWorks[i].category.name) {
                    galery.children[i].style.display = "";
                    return;
                };
            }
            galery.children[i].style.display = "none";
        })();
    }
}

function initFilterList(works) {
    window.category.children[0].addEventListener("click", (e) => {
        filters = document.getElementsByClassName("category-active");
        while (filters.length > 0) {
            filters[0].classList.remove("category-active")
        }
        e.target.classList.add("category-active");
        updateFilter();
    });
    categoryNames = new Set();
    works.forEach((work) => {
        categoryNames.add(work.category.name);
    });
    window.categoryNames = categoryNames;
    categoryNames.forEach((category) => {
        ele = document.createElement("li");
        ele.textContent = category;
        ele.addEventListener("click", (e) => {
            window.category.children[0].classList.remove("category-active");
            e.target.classList.toggle("category-active");
            if (document.getElementsByClassName("category-active").length === 0) {
                window.category.children[0].classList.add("category-active")
            }
            updateFilter();
        });
        window.category.appendChild(ele);
    });
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
                galery.appendChild(ele);
            });
            initFilterList(works);
        });
    });
}

updateWorks();