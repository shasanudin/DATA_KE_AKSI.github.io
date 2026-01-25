fetch('navbar.html')
.then(r => r.text())
.then(html => document.getElementById('navbar').innerHTML = html);

fetch('data/alur.json')
.then(r => r.json())
.then(data => renderArticle(data.articles[0]));

function renderArticle(article) {

    let stepsHTML = article.steps.map(step => `
        <div class="alur-step">
            <div class="alur-title">${step.title}</div>
            <div class="alur-body">${step.content}</div>
        </div>
    `).join('');

    let reqHTML = article.requirements.map(item => `
        <li class="mb-2">✅ ${item}</li>
    `).join('');

    document.getElementById('newsContainer').innerHTML = `
    <div class="news-container">

        <h1 class="headline">${article.title}</h1>

        <div class="byline">
            Oleh: ${article.author} | ${article.date}
        </div>

        <p class="lead-text">${article.lead}</p>

        <hr>

        <h4 class="mb-4 font-weight-bold">Tahapan Mekanisme Pemutakhiran Data</h4>

        ${stepsHTML}

        <div class="mt-5 p-4 border rounded bg-white shadow-sm">
            <h5 class="font-weight-bold mb-3">Dokumen Persyaratan Usulan Mandiri</h5>
            <ul class="list-unstyled">${reqHTML}</ul>
        </div>

        <div class="mt-5 p-4 bg-light border-left border-primary">
            <em>"${article.quote}"</em>
        </div>

        <div class="text-center mt-5">
            <a href="index.html" class="btn btn-primary px-5">Kembali ke Dashboard</a>
        </div>

    </div>
    `;
}
