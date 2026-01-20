fetch("data/dtsen.json")
  .then(res => {
    if (!res.ok) throw new Error("File dtsen.json tidak ditemukan");
    return res.json();
  })
  .then(data => {

    /* ===============================
       1. RINGKASAN DATA
    =============================== */

    const updateDataEl = document.getElementById("updateData");
    if (updateDataEl) updateDataEl.innerText = data.updated || "-";

    let totalKK = 0;
    let totalD12 = 0;
    let totalD34 = 0;
    let totalD510 = 0;
    let totalDesil = Array(10).fill(0);

    data.wilayah.forEach(w => {
      const kk = Number(w.total_kk) || 0;
      const d = w.desil || [];

      totalKK += kk;
      totalD12 += (d[0] || 0) + (d[1] || 0);
      totalD34 += (d[2] || 0) + (d[3] || 0);
      totalD510 += d.slice(4).reduce((a, b) => a + (Number(b) || 0), 0);

      d.forEach((v, i) => totalDesil[i] += Number(v) || 0);
    });

    const persen = v => totalKK ? ((v / totalKK) * 100).toFixed(1) + "%" : "0%";

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setText("totalKK", totalKK.toLocaleString("id-ID"));
    setText("desil12", persen(totalD12));
    setText("desil34", persen(totalD34));
    setText("desil510", persen(totalD510));

    /* ===============================
       2. CHART DESIL
    =============================== */

    const chartEl = document.getElementById("desilChart");
    if (chartEl && window.Chart) {
      new Chart(chartEl, {
        type: "bar",
        data: {
          labels: ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10"],
          datasets: [{
            label: "Jumlah KK",
            data: totalDesil
          }]
        },
        options: {
          responsive: true,
          legend: { display: false },
          scales: {
            yAxes: [{
              ticks: { beginAtZero: true }
            }]
          }
        }
      });
    }

    /* ===============================
       3. TABEL PRIORITAS (DESIL 1–2)
    =============================== */

    const tbody = document.getElementById("tabelPrioritas");
    if (!tbody) return;

    const hasil = data.wilayah.map(w => {
      const d1 = Number(w.desil?.[0] || 0);
      const d2 = Number(w.desil?.[1] || 0);
      return {
        nama: w.nama,
        jenis: w.jenis,
        d1,
        d2,
        total: d1 + d2
      };
    }).sort((a, b) => b.total - a.total);

    tbody.innerHTML = hasil.map((w, i) => {
      let status = "Prioritas Rendah";
      let kelas = "prioritas-rendah";

      if (w.total >= 400) {
        status = "Prioritas Tinggi";
        kelas = "prioritas-tinggi";
      } else if (w.total >= 200) {
        status = "Prioritas Sedang";
        kelas = "prioritas-sedang";
      }

      return `
        <tr>
          <td>${i + 1}</td>
          <td>${w.nama}</td>
          <td>${w.jenis}</td>
          <td>${w.d1.toLocaleString("id-ID")}</td>
          <td>${w.d2.toLocaleString("id-ID")}</td>
          <td><strong>${w.total.toLocaleString("id-ID")}</strong></td>
          <td><span class="badge-risiko ${kelas}">${status}</span></td>
        </tr>
      `;
    }).join("");

  })
  .catch(err => console.error(err));
