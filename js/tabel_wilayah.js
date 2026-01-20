fetch('data/dtsen.json')
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById('wilayahSelect');
        
        // Perbaikan 1: Cek apakah elemen 'updateData' ada sebelum diisi
        const updateEl = document.getElementById('updateData');
        if (updateEl) updateEl.innerText = data.updated;

        // A. Proses Tabel Agregasi Kecamatan
        const tabelKec = document.getElementById('tabelDesilKecamatan');
        if (tabelKec) { // Perbaikan 2: Cek apakah tabel ada
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
        }

        // B. Inisialisasi Dropdown
        if (select) {
            data.wilayah.forEach((w, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = w.nama;
                select.appendChild(opt);
            });

            // C. Event Listener & Render Awal
            select.addEventListener('change', e => renderWilayah(e.target.value, data));
            
            // Ambil pilihan terakhir atau default ke 0
            const lastIdx = localStorage.getItem('lastSelectedWilayah') || 0;
            select.value = lastIdx;
            renderWilayah(lastIdx, data);
        }
    })
    .catch(err => console.error("Gagal memuat data:", err));

// 3. Fungsi Render Detail Wilayah
function renderWilayah(idx, data) {
    localStorage.setItem('lastSelectedWilayah', idx);
    const w = data.wilayah[idx];
    if (!w) return; // Safety check jika data wilayah tidak ketemu

    const d = w.desil;
    const totalKK = w.total_kk;

    const hitungPersen = (nilai) => {
        return totalKK > 0 ? ((nilai / totalKK) * 100).toFixed(1) : 0;
    };

    // Gunakan fungsi helper untuk update elemen secara aman
    const safeSetText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    safeSetText('totalKK', totalKK.toLocaleString('id-ID'));
    safeSetText('desil1', hitungPersen(d[0]) + '%');
    safeSetText('desil2', hitungPersen(d[1]) + '%');
    safeSetText('desil3', hitungPersen(d[2]) + '%');
    safeSetText('desil4', hitungPersen(d[3]) + '%');

    const jumlah610 = d.slice(5).reduce((a, b) => a + b, 0);
    safeSetText('desil510', hitungPersen(jumlah610) + '%');

    // Update Grafik hanya jika canvas-nya ada
    const chartEl = document.getElementById('desilChart');
    if (chartEl) {
        const ctx = chartEl.getContext('2d');
        if (window.chart && typeof window.chart.destroy === 'function') window.chart.destroy();

        window.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6-10'],
                datasets: [{
                    label: 'Proporsi (%)',
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
                    y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } 
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}
