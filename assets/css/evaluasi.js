// Load Navbar
fetch('navbar.html')
.then(r => r.text())
.then(html => document.getElementById('navbar').innerHTML = html);

// Load Data
Promise.all([
    fetch('data/dtsen.json').then(r => r.json()),
    fetch('data/bansos.json').then(r => r.json())
])
.then(([dtsen, bansos]) => initDashboard(dtsen, bansos));

function initDashboard(dtsen, bansos) {

    let totalTarget = 0;
    let totalCovered = 0;
    let totalGap = 0;
    let totalLeakage = 0;

    let rows = [];
    let labels = [];
    let gapData = [];
    let coverData = [];

    // Table Header
    document.getElementById('evalHead').innerHTML = `
    <tr>
        <th>Wilayah</th>
        <th>D1</th><th>D2</th><th>D3</th><th>D4</th><th>D5</th>
        <th>Total Target</th>
        <th>Total Bansos</th>
        <th>Covered</th>
        <th>GAP</th>
        <th>Leakage</th>
        <th>Status</th>
    </tr>`;

    dtsen.wilayah.forEach(w => {

        let d1 = w.desil[0];
        let d2 = w.desil[1];
        let d3 = w.desil[2];
        let d4 = w.desil[3];
        let d5 = w.desil[4];

        let target = d1 + d2 + d3 + d4 + d5;

        let match = bansos.wilayah.find(b => b.nama === w.nama);
        let bansosTotal = match ? 
            (match.bansos.PKH + match.bansos.BPNT + match.bansos.PBI) : 0;

        let covered = Math.min(target, bansosTotal);
        let gap = Math.max(0, target - bansosTotal);
        let leakage = Math.max(0, bansosTotal - target);

        totalTarget += target;
        totalCovered += covered;
        totalGap += gap;
        totalLeakage += leakage;

        let status = "SEIMBANG";
        if (gap > target * 0.2) status = "KRITIS (KURANG)";
        if (leakage > target * 0.2) status = "ANOMALI (SALAH SASARAN)";

        rows.push(`
        <tr>
            <td>${w.nama}</td>
            <td>${d1}</td><td>${d2}</td><td>${d3}</td><td>${d4}</td><td>${d5}</td>
            <td class="font-weight-bold">${target}</td>
            <td>${bansosTotal}</td>
            <td class="text-success">${covered}</td>
            <td class="text-warning">${gap}</td>
            <td class="text-primary">${leakage}</td>
            <td class="font-weight-bold">${status}</td>
        </tr>`);

        labels.push(w.nama);
        gapData.push(gap);
        coverData.push(covered);
    });

    document.getElementById('evalTable').innerHTML = rows.join('');

    // KPI
    document.getElementById('kpiCards').innerHTML = `
    ${kpiCard("Total Target (D1–D5)", totalTarget, "danger")}
    ${kpiCard("Sudah Tercover", totalCovered, "success")}
    ${kpiCard("Belum Tercover (GAP)", totalGap, "warning")}
    ${kpiCard("Potensi Salah Sasaran", totalLeakage, "primary")}
    `;

    // Chart
    new Chart(document.getElementById('evalChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'GAP', data: gapData },
                { label: 'Covered', data: coverData }
            ]
        },
        options: { responsive: true }
    });

    generateRecommendations(totalGap, totalLeakage, totalTarget, labels);
}

// KPI Card Template
function kpiCard(label, value, color) {
    return `
    <div class="col-md-3 mb-3">
        <div class="card card-custom p-3">
            <p class="small text-muted mb-1">${label}</p>
            <div class="stat text-${color}">${value.toLocaleString('id-ID')}</div>
        </div>
    </div>`;
}

// Recommendations Engine
function generateRecommendations(gap, leak, target, labels) {
    let rec = document.getElementById('recommendations');
    rec.innerHTML = "";

    if (gap > target * 0.25) {
        rec.innerHTML += `<li><b>DARURAT:</b> Banyak keluarga target belum menerima bansos.</li>`;
    }

    if (leak > target * 0.15) {
        rec.innerHTML += `<li><b>AUDIT WAJIB:</b> Indikasi salah sasaran tinggi.</li>`;
    }

    rec.innerHTML += `<li><b>PRIORITAS INTERVENSI:</b> ${labels.slice(0,3).join(', ')}</li>`;
}
