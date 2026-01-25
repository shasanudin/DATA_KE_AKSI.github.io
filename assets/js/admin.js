const user = getUser();
if (!user) location = "login.html";

document.getElementById('welcome').innerHTML =
`👤 ${user.role} — ${user.username}`;

const menu = document.getElementById('menu');

const roleMenus = {
    Operator: ["Input Artikel"],
    TKSK: ["Verifikasi Artikel"],
    Camat: ["Review & Rekomendasi"],
    Dinsos: ["Final Approval"]
};

menu.innerHTML = roleMenus[user.role].map(item => `
<div class="col-md-3 mb-3">
<div class="card p-3 font-weight-bold">${item}</div>
</div>
`).join('');

let articles = [];

fetch('../data/alur.json')
.then(r => r.json())
.then(data => {
    articles = data.articles || [];
    render();
});

function render() {
    const list = document.getElementById('articleList');
    list.innerHTML = '';

    articles.forEach((a, i) => {
        list.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
            <div>
                <strong>${a.title}</strong><br>
                <small>Status: ${a.status || "Draft"}</small>
            </div>

            <div>
                ${getActionButtons(i)}
            </div>
        </li>
        `;
    });
}

function getActionButtons(i) {
    if (user.role === "Operator")
        return `<button class="btn btn-sm btn-primary" onclick="updateStatus(${i}, 'Menunggu Verifikasi')">Submit</button>`;

    if (user.role === "TKSK")
        return `<button class="btn btn-sm btn-warning" onclick="updateStatus(${i}, 'Diverifikasi TKSK')">Verifikasi</button>`;

    if (user.role === "Camat")
        return `<button class="btn btn-sm btn-info" onclick="updateStatus(${i}, 'Direkomendasikan Camat')">Rekomendasi</button>`;

    if (user.role === "Dinsos")
        return `<button class="btn btn-sm btn-success" onclick="updateStatus(${i}, 'Disetujui Final')">Approve</button>`;
}

function updateStatus(index, status) {
    articles[index].status = status;
    logAudit(status, articles[index].title);
    render();
    saveFile();
}

function logAudit(action, title) {
    console.log(`[AUDIT] ${user.username} → ${action} → ${title}`);
}

function saveFile() {
    const blob = new Blob([JSON.stringify({ articles }, null, 2)], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "alur.json";
    a.click();
}
