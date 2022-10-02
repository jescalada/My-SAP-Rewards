function getUserId() {
    console.log("User id being loaded: " + sessionStorage.getItem("userId"))
    return sessionStorage.getItem("userId")
}

function isAdmin() {
    return sessionStorage.getItem("isAdmin") === "true"
}

function getPoints() {
    return sessionStorage.getItem("points")
}

function getFullName() {
    return sessionStorage.getItem("full_name")
}

function loadAdminLink() {
    if (isAdmin()) {
        let element = `
        <a href="/admin">
            Admin
        </a>`
        document.getElementsByTagName("nav")[0].insertAdjacentHTML("beforeend", element)
    }
}

loadAdminLink();