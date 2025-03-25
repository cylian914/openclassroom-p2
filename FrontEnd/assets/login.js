const ip = "http://localhost:5678/api";

const form = document.getElementById("formRoot");



form.addEventListener("submit", (e) => {
    e.preventDefault();
    const loginData = {
        email: document.getElementById("formEmail").value,
        password: document.getElementById("formPassword").value
    }
    const loginDataJson = JSON.stringify(loginData);
    console.log(loginDataJson);
    fetch(ip + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: loginDataJson
    }).then((resp) => {
        switch (resp.status) {
            case 200:
                resp.json().then((login) => {
                    window.sessionStorage.setItem("userId",login["userId"]);
                    window.sessionStorage.setItem("token",login["token"]);
                    window.location.href="index.html"
                });
                break;
            case 401:
                alert("Password incorrect");
                break;
            case 404:
                alert("user not found");
                break;
            }
    })
});