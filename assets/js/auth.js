document.getElementById('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();

    const users = await fetch('../data/users.json').then(r => r.json());
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.users.find(u => 
        u.username === username && u.password === password
    );

    if (!user) {
        document.getElementById('error').innerText = "Login gagal";
        return;
    }

    sessionStorage.setItem("user", JSON.stringify(user));
    window.location = "dashboard.html";
});

function getUser() {
    return JSON.parse(sessionStorage.getItem("user"));
}

function logout() {
    sessionStorage.clear();
    window.location = "login.html";
}
