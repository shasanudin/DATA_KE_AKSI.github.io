async function prepareQR(id, msg) {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "Menandatangani...";

    try {
        // Panggil API Server untuk minta Signature
        const response = await fetch('http://localhost:3000/api/sign-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, msg: msg })
        });

        const signedData = await response.json();

        // Buat QR Code dari hasil respons Server
        qrDiv.innerHTML = "";
        new QRCode(qrDiv, {
            text: JSON.stringify(signedData),
            width: 110,
            height: 110,
            correctLevel: QRCode.CorrectLevel.H
        });

        console.log("Otentikasi Berhasil: Dokumen Terkunci.");
    } catch (err) {
        qrDiv.innerHTML = "Gagal koneksi ke Security Server";
        console.error(err);
    }
}
