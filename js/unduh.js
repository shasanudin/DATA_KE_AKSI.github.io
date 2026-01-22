// 1. Render Tabel Agregat (Desil 6-10 Digabung)
function renderAgregat(data, container) {
    let sum = Array(10).fill(0);
    let total = 0;
    
    data.wilayah.forEach(w => {
        total += w.total_kk;
        w.desil.forEach((v, i) => sum[i] += v);
    });

    // Menghitung gabungan Desil 6 s/d 10
    const sumDesil6_10 = sum.slice(5).reduce((a, b) => a + b, 0);

    let html = `
        <table class="table table-bordered table-sm text-center">
            <thead class="bg-light">
                <tr>
                    <th>KATEGORI</th>
                    <th>DESIL</th>
                    <th>JUMLAH KK</th>
                    <th>PERSENTASE</th>
                </tr>
            </thead>
            <tbody>`;

    const labels = ["Sangat Miskin", "Miskin", "Hampir Miskin", "Rentan", "Menengah Bawah"];
    
    // Tampilkan Desil 1 sampai 5
    for (let i = 0; i < 5; i++) {
        html += `
            <tr>
                <td class="text-left">${labels[i]}</td>
                <td>Desil ${i + 1}</td>
                <td>${sum[i].toLocaleString()}</td>
                <td>${((sum[i] / total) * 100).toFixed(1)}%</td>
            </tr>`;
    }

    // Tampilkan Gabungan Desil 6-10
    html += `
            <tr class="bg-light">
                <td class="text-left font-italic">Lainnya (Mampu/Sejahtera)</td>
                <td>Desil 6 - 10</td>
                <td>${sumDesil6_10.toLocaleString()}</td>
                <td>${((sumDesil6_10 / total) * 100).toFixed(1)}%</td>
            </tr>
            <tr class="font-weight-bold" style="background: #eee;">
                <td colspan="2">TOTAL KECAMATAN SUMBER</td>
                <td>${total.toLocaleString()}</td>
                <td>100%</td>
            </tr>
        </tbody></table>`;
    
    container.innerHTML = html;
}

// 2. Render Tabel Prioritas (Ditambah Persentase Kerentanan)
function renderPrioritas(data, container) {
    // Urutkan berdasarkan beban kerentanan tertinggi
    const sorted = [...data.wilayah].sort((a, b) => {
        const bebanA = (a.desil[0] + a.desil[1]) / a.total_kk;
        const bebanB = (b.desil[0] + b.desil[1]) / b.total_kk;
        return bebanB - bebanA;
    });

    let html = `
        <table class="table table-bordered table-sm text-center">
            <thead class="bg-light">
                <tr>
                    <th rowspan="2" class="align-middle">RANK</th>
                    <th rowspan="2" class="align-middle">DESA / KELURAHAN</th>
                    <th colspan="2">PRIORITAS</th>
                    <th rowspan="2" class="align-middle">TOTAL (D1+D2)</th>
                    <th rowspan="2" class="align-middle bg-warning text-dark">% KERENTANAN</th>
                </tr>
                <tr>
                    <th>D1</th>
                    <th>D2</th>
                </tr>
            </thead>
            <tbody>`;

    sorted.forEach((w, i) => {
        const totalD12 = w.desil[0] + w.desil[1];
        const persenKerentanan = ((totalD12 / w.total_kk) * 100).toFixed(1);
        
        html += `
            <tr>
                <td>${i + 1}</td>
                <td class="text-left">${w.nama}</td>
                <td>${w.desil[0].toLocaleString()}</td>
                <td>${w.desil[1].toLocaleString()}</td>
                <td class="font-weight-bold">${totalD12.toLocaleString()}</td>
                <td class="font-weight-bold text-danger">${persenKerentanan}%</td>
            </tr>`;
    });

    html += `</tbody></table>
    <p class="small text-muted mt-2">* % Kerentanan dihitung dari perbandingan (Desil 1 + Desil 2) terhadap Total KK di wilayah tersebut.</p>`;
    
    container.innerHTML = html;
}
