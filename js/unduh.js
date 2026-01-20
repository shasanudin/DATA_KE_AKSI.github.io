let globalData;

// 1. Inisialisasi Data (Auto-run)
async function initApp() {
    try {
        const res = await fetch('data/dtsen.json');
        globalData = await res.json();
        console.log("Data Berhasil Dimuat");
    } catch (err) {
        console.error("Gagal memuat JSON:", err);
    }
}
initApp();

// 2. Fungsi Utama (Harus di Luar agar bisa dipanggil onclick)
async function generateReport() {
    if (!globalData) {
        alert("Data belum siap, silakan tunggu sebentar...");
        return;
    }

    const tipe = document.getElementById('tipeLaporan').value;
    const id = "DTSEN-" + Date.now();
    const msg = `Kec-Sumber-${tipe}-${globalData.updated}`;

    // TAMPILKAN HASIL TABEL (Logika render Anda...)
    document.getElementById('kontenData').innerHTML = "Memproses Laporan...";

    // JALANKAN PROSES QR OTOMATIS
    await prepareQR(id, msg);
}

// 3. Fungsi Sinkronisasi ke Server Otomatis
async function prepareQR(id, msg) {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "Menandatangani...";

    try {
        // Ganti URL ini dengan URL Server Backend Anda nanti
        const response = await fetch('http://localhost:3000/api/sign-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, msg: msg })
        });

        const signedData = await response.json();

        qrDiv.innerHTML = "";
        new QRCode(qrDiv, {
            text: JSON.stringify(signedData),
            width: 110,
            height: 110,
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (err) {
        qrDiv.innerHTML = "<small class='text-danger'>Server Signer Offline</small>";
        console.error("Gagal Sign:", err);
    }
}
