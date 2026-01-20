function prepareQR(id, msg) {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = ""; 

    // Tampilkan pesan yang harus ditanda tangani di console (F12) untuk memudahkan
    console.log("ID Laporan:", id);
    console.log("Pesan (MSG):", msg);

    // Munculkan kotak input untuk Signature
    const userSignature = prompt("MASUKKAN SIGNATURE HEX DARI SIGNER TOOL:", "");

    if (userSignature) {
        const finalPayload = { id: id, msg: msg, sig: userSignature.trim() };
        new QRCode(qrDiv, {
            text: JSON.stringify(finalPayload),
            width: 100, height: 100,
            correctLevel: QRCode.CorrectLevel.H
        });
        alert("QR Code Sah Terbentuk!");
    } else {
        alert("QR Tanpa Tanda Tangan (Status: DRAFT)");
        new QRCode(qrDiv, {
            text: JSON.stringify({id: id, msg: msg, sig: "UNSIGNED"}),
            width: 100, height: 100
        });
    }
}
