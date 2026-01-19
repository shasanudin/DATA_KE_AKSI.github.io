fetch("data/dtsen.json")
  .then(res => res.json())
  .then(data => {

    const tbody = document.getElementById("tabelPrioritas");

    // hitung total desil 1–2 per wilayah
    const hasil = data.wilayah.map(w => {
      const d1 = w.desil[0];
      const d2 = w.desil[1];
      return {
        nama: w.nama,
        jenis: w.jenis,
        d1,
        d2,
        total: d1 + d2
      };
    });

    // urutkan dari tertinggi
    hasil.sort((a, b) => b.total - a.total);

    // render tabel
    tbody.innerHTML = "";
    hasil.forEach((w, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${w.nama}</td>
          <td>${w.jenis}</td>
          <td>${w.d1}</td>
          <td>${w.d2}</td>
          <td><strong>${w.total}</strong></td>
        </tr>
      `;
    });

  })
  .catch(err => {
    console.error("Gagal load DTSEN:", err);
  });
