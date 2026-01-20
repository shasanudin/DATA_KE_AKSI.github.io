fetch('data/dtsen.json')
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById('wilayahSelect');
        document.getElementById('updateData').innerText = data.updated;

        // A. Proses Tabel Agregasi Kecamatan
        const tabelKec = document.getElementById('tabelDesilKecamatan');
        let agregat = Array(10).fill(0);
        data.wilayah.forEach(w => {
            w.desil.forEach((val, i) => { agregat[i] += val; });
        });

        let rowHtml = "";
        for(let i=0; i<5; i++) {
            rowHtml += `<tr><td>Desil ${i+1}</td><td>${agregat[i].toLocaleString('id-ID')}</td></tr>`;
        }
        let gabungD610Kec = agregat.slice(5).reduce((a, b) => a + b, 0);
        rowHtml += `<tr class="table-success font-weight-bold"><td>Desil 6-10</td><td>${gabungD610Kec.toLocaleString('id-ID')}</td></tr>`;
        tabelKec.innerHTML = rowHtml;

        // B. Inisialisasi Dropdown
        data.wilayah.forEach((w, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = w.nama;
            select.appendChild(opt);
        });

        // C. Event Listener & Render Awal
        select.addEventListener('change', e => renderWilayah(e.target.value, data));
        renderWilayah(0, data);
    })
    .catch(err => console.error("Gagal memuat data:", err));

// 3. Fungsi Render Detail Wilayah
function renderWilayah(idx, data) {
    localStorage.setItem('lastSelectedWilayah', idx);
    const w = data.wilayah[idx];
    const d = w.desil;
    const totalKK = w.total_kk;

    // Fungsi pembantu untuk menghitung persentase secara otomatis
    // Rumus: (Nilai Desil / Total KK) * 100
    const hitungPersen = (nilai) => {
        return totalKK > 0 ? ((nilai / totalKK) * 100).toFixed(1) : 0;
    };

    // Update Label Card dengan angka yang sudah dihitung ke persen
    document.getElementById('totalKK').innerText = totalKK.toLocaleString('id-ID');
    document.getElementById('desil1').innerText = hitungPersen(d[0]) + '%';
    document.getElementById('desil2').innerText = hitungPersen(d[1]) + '%';
    document.getElementById('desil3').innerText = hitungPersen(d[2]) + '%';
    document.getElementById('desil4').innerText = hitungPersen(d[3]) + '%'; // Nama fungsi sudah diperbaiki di sini
    
    // Gabungkan D6 sampai D10 (hitung jumlah riilnya dulu)
    const jumlah610 = d.slice(5).reduce((a, b) => a + b, 0);
    document.getElementById('desil510').innerText = hitungPersen(jumlah610) + '%';

    // Update Grafik (Chart)
    const ctx = document.getElementById('desilChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6-10'],
            datasets: [{
                label: 'Proporsi (%)',
                // Data diubah menjadi persen sebelum dimasukkan ke chart
                data: [
                    hitungPersen(d[0]), 
                    hitungPersen(d[1]), 
                    hitungPersen(d[2]), 
                    hitungPersen(d[3]), 
                    hitungPersen(d[4]), 
                    hitungPersen(jumlah610)
                ],
                backgroundColor: ['#dc3545', '#ffc107', '#0d6efd', '#6610f2', '#fd7e14', '#28a745']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true, 
                    max: 100, // Mengunci agar maksimal grafik adalah 100%
                    ticks: { callback: v => v + '%' } 
                } 
            },
            plugins: { legend: { display: false } }
        }
    });
}
