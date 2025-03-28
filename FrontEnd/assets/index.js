const ip = "http://localhost:5678/api";

const gallery = document.getElementsByClassName("gallery")[0];
const modalGalery = document.getElementById("modal-content-gallery");
const category = document.getElementById("category");
const firstCategoryName = category.children[0].textContent;
const photohbtn = document.getElementById("modal-addphoto-fp-hbtn");
const modalCategoryList = document.getElementById("modal-addphoto-select");

var workList = [];
var categoryNames;
var apiCategory;
var loginUserId;
var loginToken;

function updateFilter() {
    filters = document.getElementsByClassName("category-active");
    if (filters[0].textContent === firstCategoryName) {
        for (child of gallery.children) {
            child.style.display = "";
        }
        return;
    }
    workList.forEach(async (work) => {
        for (ele of filters) {
            if (ele.textContent === work.category.name) {
                work.galleryEle.style.display = "";
                return;
            };
        }
        work.galleryEle.style.display = "none";
    });
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

async function addWork(work) {
    galleryEle = document.createElement("figure");
    galleryEle.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
				<figcaption>${work.title}</figcaption>
                `;
    gallery.appendChild(galleryEle);
    work.galleryEle = galleryEle;
    modalGaleryEle = document.createElement("div");
    modalGaleryEle.innerHTML = `
					<img src="${work.imageUrl}" alt="${work.title}">
					<i class="fa-solid fa-trash-can"></i>
                `;
    modalGaleryEle.children[1].addEventListener("click", (e) => {
        removeWork(work);
        removeFromServerWork(work);
    })
    modalGalery.appendChild(modalGaleryEle);
    work.modalGaleryEle = modalGaleryEle;
    workList.push(work);
}

function removeWork(work) {
    workList.splice(workList.indexOf(work), 1);
    work.galleryEle.remove();
    work.modalGaleryEle.remove();
}

async function removeFromServerWork(work) {
    fetch(ip + `/works/${work.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${loginToken}`
        }
    });
}

function addCategory(cat) {
    ele = document.createElement("option");
    ele.value = cat.id;
    ele.textContent = cat.name;
    modalCategoryList.appendChild(ele);
}

function initApi() {
    fetch(ip + "/works").then((resp) => {
        resp.json().then((works) => {
            works.forEach(addWork);
            initFilterList(works);
        });
    });
    fetch(ip + "/categories").then((rep) => {
        rep.json().then((j) => {
            apiCategory = j;
            j.forEach(addCategory)
        });
    });
}

function loadLogin() {
    loginToken = sessionStorage.getItem("token");
    loginUserId = sessionStorage.getItem("userId");
}

function loginHandler() {
    if (loginToken === null | loginUserId == null)
        return;
    for (ele of document.getElementsByClassName("login-show")) {
        ele.style.display = "flex";
    }
    nav = document.querySelector("header");
    nav.style.marginTop = "88px";
    logout = document.getElementById("loginout");
    logout.textContent = "logout";
    logout.addEventListener("click", (e) => {
        loadLogin();
        if (loginToken === null | loginUserId == null)
            return;
        e.preventDefault();
        sessionStorage.clear();
        for (ele of document.getElementsByClassName("login-show")) {
            ele.style.display = "none";
        }
        nav.style.marginTop = "0px";
        e.target.textContent = "login";
    });
}

function handleFiles(e) {
    console.log(photohbtn.value);
}

function initModal() {
    document.querySelector("#login-edition-project > a").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("modal").style.display = "flex";
    });
    document.getElementById("modal").addEventListener("click", (e) => {
        if (e.target.id != "modal") {
            return;
        }
        document.getElementById("modal").style.display = "none";
    });
    document.getElementById("modal-close").addEventListener("click", (e) => {
        document.getElementById("modal-content-goback").click()
        document.getElementById("modal").style.display = "none";
    });
    document.getElementById("modal-content-addphoto").addEventListener("click", (e) => {
        e.preventDefault();
        for (cl of document.getElementsByClassName("addphoto-hide")) {
            cl.style.display="none";
        }
        for (cl of document.getElementsByClassName("addphoto-show")) {
            if (cl.id === "modal-content-goback")
                cl.style.visibility = "visible"
            else
                cl.style.display = "flex";
        }
    });
    document.getElementById("modal-content-goback").addEventListener("click", (e) => {
        e.preventDefault();
        for (cl of document.getElementsByClassName("addphoto-hide")) {
            cl.style.display = "flex";
        }
        for (cl of document.getElementsByClassName("addphoto-show")) {
             if (cl.id === "modal-content-goback")
                cl.style.visibility = "hidden"
            else
                cl.style.display = "none";
        }
    })
    document.getElementById("modal-addphoto-fp-btn").addEventListener("click", (e) => {
        e.preventDefault();
        photohbtn.click()
    });
    photohbtn.addEventListener("change", handleFiles);
}

initModal();
initApi();
loadLogin();
loginHandler();