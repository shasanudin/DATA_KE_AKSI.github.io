document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Menghentikan reload halaman

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const message = document.getElementById('message');
    const submitBtn = this.querySelector('button');

    // Efek Loading: Ubah teks tombol saat diproses
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "MEMPROSES...";
    submitBtn.disabled = true;

    // Simulasi jeda waktu server (1 detik)
    setTimeout(() => {
        // Logika login sederhana (Silakan ganti sesuai kebutuhan)
        if (user === "admin" && pass === "aksi2024") {
            // Simpan status login di browser agar user tidak perlu login ulang saat refresh
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", user);

            message.style.color = "#28a745"; // Warna hijau sukses
            message.innerText = "Login Berhasil! Mengalihkan...";

            // Redirect ke halaman dashboard setelah sukses
            setTimeout(() => {
                window.location.href = "dashboard.html"; 
            }, 1000);
        } else {
            // Jika login gagal
            message.style.color = "#dc3545"; // Warna merah error
            message.innerText = "Username atau password salah!";
            
            // Kembalikan tombol ke kondisi awal
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    }, 1200);
});
