function login() {
    let data = {
        username: $("#username").val(),
        password: $("#password").val()
    }

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then((data) => {
        // If authentication was successful, redirect to user profile, else display an error message
        if (data.success) {
            sessionStorage.setItem("userId", data.user.user_id);
            sessionStorage.setItem("isAdmin", data.user.isAdmin);
            sessionStorage.setItem("authenticated", data.success);
            sessionStorage.setItem("full_name", data.user.full_name);
            sessionStorage.setItem("points", data.user.points);
            window.location.href = '/profile'
        } else {
            $("#error-text").text("Invalid credentials. Please try again.")
        }
    })
}

function register() {
    let data = {
        username: $("#username").val(),
        password: $("#password").val(),
        isAdmin: document.getElementById("isAdmin").checked
    }

    fetch('/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then((data) => {
        // On success, redirect (refresh) to login
        if (data.success) {
            $("#success-text").text("Account created. You can log in now.")
        } else {
            $("#error-text").text("Account creation failed.")
        }
    })
}