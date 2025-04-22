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

function disableFilter() {
    filters = document.getElementsByClassName("category-active");
    while (filters.length > 0) {
        filters[0].classList.remove("category-active")
    }
}

function initFilterList(works) {
    window.category.children[0].addEventListener("click", (e) => {
        disableFilter();
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
            disableFilter();
            e.target.classList.add("category-active");
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

function removeFromServerWork(work) {
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
    file = e.target.files[0];
    if (file.size > 32000000) {
        alert("Fichier trop gros");
        return;
    }
    for (ele of document.getElementById("modal-addphoto-fp").children) {
        if (ele.id !== "modal-addphoto-img") {
            ele.style.display = "none";
        }
        else {
            ele.file = file;
            ele.style.display = "";
        }
    }
    document.getElementById("modal-addphoto-img").src = URL.createObjectURL(file);
    checkForm();
}


function checkForm() {
    ele = document.getElementById("modal-content-addphoto");
    if (document.getElementById("modal-addphoto-img").file === undefined ||
        document.getElementById("modal-addphoto-titre").value === undefined ||
        document.getElementById("modal-addphoto-select").value === undefined) {
        ele.style.backgroundColor = "#A7A7A7";
        return false;
    }
    ele.style.backgroundColor = "#1D6154";
    return true;
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
        document.getElementById("modal-close").click();
    });
    document.getElementById("modal-close").addEventListener("click", (e) => {
        document.getElementById("modal-content-goback").click();
        document.getElementById("modal").style.display = "none";
        for (ele of document.getElementById("modal-addphoto-fp").children) {
            ele.style.display="";
            if (ele.id === "modal-addphoto-img") {
                ele.style.display = "none";
                if (ele.src !== undefined) {
                    URL.revokeObjectURL(ele.src);
                    ele.src = "";
                }
            }
        }
    });

    document.getElementById("modal-content-addphoto").addEventListener("click", (e) => {
        if (checkForm() && document.getElementById("modal-addphoto-form").parentElement.style.display !== "none") {
            form = new FormData();
            form.set("image", document.getElementById("modal-addphoto-img").file);
            form.set("title", document.getElementById("modal-addphoto-titre").value);
            form.set("category", document.getElementById("modal-addphoto-select").value); 
            fetch(ip + "/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${loginToken}`,
                },
                body: form
            }).then((e) => {
                e.json().then((ev) => {
                    i = parseInt(ev.categoryId);
                    ev.category = {
                        id: i,
                        name: categoryNames[i]
                    }
                    addWork(ev);
                })
            });
            document.getElementById("modal-close").click();
        }
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
    document.getElementById("modal-addphoto-titre").addEventListener("change", (e) => {
        checkForm();
    });
    document.getElementById("modal-addphoto-select").addEventListener("change", (e) => {
        checkForm();
    });    
    document.getElementById("modal-content-goback").addEventListener("click", (e) => {
        e.preventDefault();
        console.log(e.target);
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
