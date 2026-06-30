/**
 * ==================== INDEX.JS - Halaman Beranda ====================
 * File ini berisi fungsi untuk SLIDER / CAROUSEL di halaman beranda.
 * 
 * Penulis: KlinikSehat Team
 * ================================================================
 */

// ============================================================
// FUNGSI CEK HALAMAN
// ============================================================
function isBerandaPage() {
    return document.querySelector('.hero-slider') !== null;
}

function isPesananPage() {
    return document.getElementById('formPesanan') !== null;
}

function isRiwayatPage() {
    return document.getElementById('kontenRiwayat') !== null;
}

// ============================================================
// FUNGSI SLIDER / CAROUSEL
// ============================================================
let slideIndex = 0;        // Index slide aktif
let slides = [];           // Array elemen slide
let dots = [];             // Array elemen dot indicator
let slideInterval = null;  // Interval untuk auto slide

// Inisialisasi slider
function initSlider() {
    if (!isBerandaPage()) return;
    
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Event listener untuk tombol prev dan next
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            changeSlide(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            changeSlide(1);
        });
    }
    
    // Event listener untuk dot indicator
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            currentSlide(index);
        });
    });
    
    startAutoSlide();
    console.log('🔄 Slider initialized with ' + slides.length + ' slides');
}

// Menampilkan slide berdasarkan index
function showSlide(n) {
    if (!slides.length) return;
    
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    
    // Sembunyikan semua slide
    slides.forEach(function(slide) {
        slide.classList.remove('active');
    });
    dots.forEach(function(dot) {
        dot.classList.remove('active');
    });
    
    // Tampilkan slide aktif
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

// Pindah slide (n = 1 untuk next, -1 untuk prev)
function changeSlide(n) {
    showSlide(slideIndex += n);
    resetAutoSlide();
}

// Langsung menuju slide tertentu
function currentSlide(n) {
    showSlide(slideIndex = n);
    resetAutoSlide();
}

// Memulai auto slide (berganti setiap 4 detik)
function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 4000);
}

// Mereset timer auto slide (dipanggil saat user interaksi)
function resetAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = setInterval(function() {
            changeSlide(1);
        }, 4000);
    }
}

// ============================================================
// EVENT LISTENER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 KlinikSehat - Beranda siap');
    initSlider();
    console.log('✅ index.js berhasil dijalankan!');
});

/**
 * ==================== PESANAN.JS - Halaman Pesan Janji ====================
 * File ini berisi fungsi untuk:
 * 1. Pemesanan janji (form handling)
 * 2. Data dokter berdasarkan layanan
 * 3. Data harga berdasarkan layanan
 * 4. Mode edit (dari riwayat)
 * 
 * Penulis: KlinikSehat Team
 * Tanggal: 2026
 * ================================================================
 */

// ============================================================
// DATA DOKTER BERDASARKAN LAYANAN
// ============================================================
const dataDokter = {
    'Konsultasi Umum': [
        'dr. Ahmad Fauzi, Sp.PD',
        'dr. Siti Rahmawati, Sp.PD',
        'dr. Budi Santoso, Sp.PD'
    ],
    'Konsultasi Jantung': [
        'dr. Hendra Wijaya, Sp.JP',
        'dr. Rina Marlina, Sp.JP'
    ],
    'Perawatan Gigi': [
        'drg. Putri Maharani, Sp.KG',
        'drg. Andi Wijaya, Sp.KG'
    ],
    'Konsultasi Anak': [
        'dr. Maya Sari, Sp.A',
        'dr. Agus Salim, Sp.A'
    ],
    'Konsultasi Psikologi': [
        'dr. Dian Puspita, Sp.KJ',
        'dr. Rizki Ramadhan, Sp.KJ'
    ],
    'Vaksinasi': [
        'dr. Yulia Sari',
        'dr. Eka Putra'
    ],
    'Laboratorium': [
        'dr. Novi Andriani, Sp.PK',
        'dr. Irfan Hakim, Sp.PK'
    ],
    'Rontgen / USG': [
        'dr. Raditya Pratama, Sp.Rad',
        'dr. Lisa Anggraini, Sp.Rad'
    ]
};

// ============================================================
// DATA HARGA BERDASARKAN LAYANAN
// ============================================================
const hargaList = {
    'Konsultasi Umum': 150000,
    'Konsultasi Jantung': 350000,
    'Perawatan Gigi': 200000,
    'Konsultasi Anak': 200000,
    'Konsultasi Psikologi': 250000,
    'Vaksinasi': 100000,
    'Laboratorium': 180000,
    'Rontgen / USG': 300000
};


// ============================================================
// FUNGSI UNTUK HALAMAN PESANAN
// ============================================================
// Set tanggal minimal = hari ini
function setTanggalMinimal() {
    if (!isPesananPage()) return;
    
    const inputTanggal = document.getElementById('tanggalJanji');
    if (inputTanggal) {
        const today = new Date().toISOString().split('T')[0];
        inputTanggal.min = today;
        inputTanggal.value = today;
    }
}

// Event: layanan berubah → dokter otomatis berubah
function setupLayananDokter() {
    if (!isPesananPage()) return;
    
    const pilihLayanan = document.getElementById('pilihLayanan');
    const pilihDokter = document.getElementById('pilihDokter');
    
    if (!pilihLayanan || !pilihDokter) return;
    
    pilihLayanan.addEventListener('change', function() {
        const layanan = this.value;
        pilihDokter.innerHTML = '';
        
        if (layanan === '') {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '-- Pilih Layanan Terlebih Dahulu --';
            pilihDokter.appendChild(option);
            return;
        }
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Pilih Dokter --';
        pilihDokter.appendChild(defaultOption);
        
        const daftarDokter = dataDokter[layanan] || [];
        for (let i = 0; i < daftarDokter.length; i++) {
            const option = document.createElement('option');
            option.value = daftarDokter[i];
            option.textContent = daftarDokter[i];
            pilihDokter.appendChild(option);
        }
    });
}

// Cek mode edit
function cekModeEdit() {
    if (!isPesananPage()) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        let riwayat = localStorage.getItem('kliniksehat_riwayat');
        riwayat = riwayat ? JSON.parse(riwayat) : [];
        
        let dataEdit = null;
        for (let i = 0; i < riwayat.length; i++) {
            if (riwayat[i].id === editId) {
                dataEdit = riwayat[i];
                break;
            }
        }
        
        if (dataEdit) {
            document.getElementById('namaPasien').value = dataEdit.nama;
            document.getElementById('nomorPonsel').value = dataEdit.telepon;
            document.getElementById('pilihLayanan').value = dataEdit.layanan;
            document.getElementById('tanggalJanji').value = dataEdit.tanggal;
            document.getElementById('waktuJanji').value = dataEdit.waktu;
            document.getElementById('catatanTambahan').value = dataEdit.catatan || '';
            
            const event = new Event('change');
            document.getElementById('pilihLayanan').dispatchEvent(event);
            
            setTimeout(function() {
                document.getElementById('pilihDokter').value = dataEdit.dokter;
            }, 100);
            
            const btnSubmit = document.getElementById('btnSubmit');
            if (btnSubmit) {
                btnSubmit.textContent = '✏️ Update Janji';
            }
            
            document.getElementById('formPesanan').dataset.editId = editId;
            console.log('✏️ Mode Edit: ' + editId);
        }
    }
}

// Submit form
function setupFormPesanan() {
    if (!isPesananPage()) return;
    
    const formPesanan = document.getElementById('formPesanan');
    if (!formPesanan) return;
    
    formPesanan.addEventListener('submit', function(e) {
        e.preventDefault();

        const nama = document.getElementById('namaPasien').value.trim();
        const telepon = document.getElementById('nomorPonsel').value.trim();
        const layanan = document.getElementById('pilihLayanan').value;
        const dokter = document.getElementById('pilihDokter').value;
        const tanggal = document.getElementById('tanggalJanji').value;
        const waktu = document.getElementById('waktuJanji').value;
        const catatan = document.getElementById('catatanTambahan').value.trim();

        if (!nama || !telepon || !layanan || !dokter || !tanggal || !waktu) {
            alert('⚠️ Semua data wajib harus diisi!');
            return;
        }

        if (telepon.length < 10) {
            alert('⚠️ Nomor telepon minimal 10 digit!');
            return;
        }

        const editId = this.dataset.editId;
        const harga = hargaList[layanan] || 0;

        let riwayat = localStorage.getItem('kliniksehat_riwayat');
        riwayat = riwayat ? JSON.parse(riwayat) : [];

        if (editId) {
            for (let i = 0; i < riwayat.length; i++) {
                if (riwayat[i].id === editId) {
                    riwayat[i].nama = nama;
                    riwayat[i].telepon = telepon;
                    riwayat[i].layanan = layanan;
                    riwayat[i].dokter = dokter;
                    riwayat[i].tanggal = tanggal;
                    riwayat[i].waktu = waktu;
                    riwayat[i].catatan = catatan;
                    riwayat[i].harga = harga;
                    break;
                }
            }
            localStorage.setItem('kliniksehat_riwayat', JSON.stringify(riwayat));
            alert('✅ Data janji berhasil diupdate!');
            window.location.href = 'riwayat.html';
            
        } else {
            const idBaru = 'KLS' + Date.now().toString().slice(-6);

            const dataBaru = {
                id: idBaru,
                layanan: layanan,
                dokter: dokter,
                nama: nama,
                telepon: telepon,
                tanggal: tanggal,
                waktu: waktu,
                catatan: catatan,
                harga: harga,
                status: 'Dikonfirmasi',
                tanggalDaftar: new Date().toISOString()
            };

            riwayat.unshift(dataBaru);
            localStorage.setItem('kliniksehat_riwayat', JSON.stringify(riwayat));

            document.getElementById('formPesanan').style.display = 'none';
            document.getElementById('pesanSukses').style.display = 'block';
        }
    });
}

// ============================================================
// EVENT LISTENER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 KlinikSehat - Pesanan siap');
    
    if (isPesananPage()) {
        setTanggalMinimal();
        setupLayananDokter();
        setupFormPesanan();
        cekModeEdit();
    }
    
    console.log('✅ pesanan.js berhasil dijalankan!');
});

/**
 * ==================== LAYANAN.JS - Halaman Layanan ====================
 * File ini berisi fungsi untuk halaman layanan.
 * Saat ini hanya placeholder untuk pengembangan selanjutnya.
 * ================================================================
 */

// ============================================================
// DATA HARGA BERDASARKAN LAYANAN
// ============================================================
// Objek yang berisi harga setiap layanan.
// Key = nama layanan, Value = harga dalam Rupiah.
// Digunakan saat menyimpan data janji.
const hargaList = {
    'Konsultasi Umum': 150000,
    'Konsultasi Jantung': 350000,
    'Perawatan Gigi': 200000,
    'Konsultasi Anak': 200000,
    'Konsultasi Psikologi': 250000,
    'Vaksinasi': 100000,
    'Laboratorium': 180000,
    'Rontgen / USG': 300000
};

// ============================================================
// FUNGSI FORMAT TANGGAL
// ============================================================
// Mengubah format tanggal dari YYYY-MM-DD ke format Indonesia
// Contoh: "2026-06-24" -> "24 Juni 2026"
function formatTanggal(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 KlinikSehat - Layanan siap');
    console.log('✅ layanan.js berhasil dijalankan!');
});

/**
 * ==================== RIWAYAT.JS - Halaman Riwayat ====================
 * File ini berisi fungsi untuk:
 * 1. Menampilkan data riwayat
 * 2. Hapus per data
 * 3. Hapus semua data
 * 4. Edit data (redirect ke pesanan.html)
 * 
 * Penulis: KlinikSehat Team
 * Tanggal: 2026
 * ================================================================
 */

// ============================================================
// FUNGSI FORMAT TANGGAL
// ============================================================
function formatTanggal(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
}

// ============================================================
// FUNGSI CEK HALAMAN RIWAYAT
// ============================================================
function isRiwayatPage() {
    return document.getElementById('kontenRiwayat') !== null;
}

// ============================================================
// FUNGSI UNTUK HALAMAN RIWAYAT
// ============================================================

// Menampilkan data riwayat
function tampilkanRiwayat() {
    if (!isRiwayatPage()) return;
    
    let riwayat = localStorage.getItem('kliniksehat_riwayat');
    riwayat = riwayat ? JSON.parse(riwayat) : [];

    const kontainer = document.getElementById('kontenRiwayat');
    if (!kontainer) return;

    if (riwayat.length === 0) {
        kontainer.innerHTML = `
            <div class="riwayat-kosong">
                <div class="icon-kosong">📋</div>
                <p>Belum ada janji temu. Yuk, buat janji di KlinikSehat!</p>
                <a href="pesanan.html" class="btn-ke-layanan">Buat Janji Sekarang</a>
            </div>
        `;
        const btnHapusSemua = document.getElementById('btnHapusSemua');
        if (btnHapusSemua) btnHapusSemua.style.display = 'none';
        return;
    }

    const btnHapusSemua = document.getElementById('btnHapusSemua');
    if (btnHapusSemua) btnHapusSemua.style.display = 'inline-block';

    let html = `<p style="color:#64748b;margin-bottom:0.8rem;">Menampilkan ${riwayat.length} data janji temu</p>`;
    html += `<div class="tabel-wrapper">`;
    html += `<table class="tabel-riwayat">`;
    html += `<thead>`;
    html += `<tr>`;
    html += `<th>No</th>`;
    html += `<th>Nama Pasien</th>`;
    html += `<th>Layanan</th>`;
    html += `<th>Dokter</th>`;
    html += `<th>Tanggal</th>`;
    html += `<th>Waktu</th>`;
    html += `<th>Harga</th>`;
    html += `<th>Status</th>`;
    html += `<th>Aksi</th>`;
    html += `</tr>`;
    html += `</thead>`;
    html += `<tbody>`;

    for (let i = 0; i < riwayat.length; i++) {
        const item = riwayat[i];
        const hargaStr = item.harga ? 'Rp ' + item.harga.toLocaleString('id-ID') : '-';

        html += `<tr>`;
        html += `<td><span class="no-urut">${i + 1}</span></td>`;
        html += `<td class="nama-pasien">${item.nama}</td>`;
        html += `<td>${item.layanan}</td>`;
        html += `<td>${item.dokter || '-'}</td>`;
        html += `<td>${formatTanggal(item.tanggal)}</td>`;
        html += `<td>${item.waktu}</td>`;
        html += `<td class="harga-text">${hargaStr}</td>`;
        html += `<td><span class="badge-status">✅ ${item.status}</span></td>`;
        html += `<td>`;
        html += `<div class="aksi-button">`;
        html += `<button class="btn-edit" data-id="${item.id}">✏️ Edit</button>`;
        html += `<button class="btn-hapus" data-id="${item.id}">🗑️ Hapus</button>`;
        html += `</div>`;
        html += `</td>`;
        html += `</tr>`;
    }

    html += `</tbody>`;
    html += `</table>`;
    html += `</div>`;
    kontainer.innerHTML = html;
}

// Hapus satu data
function hapusPesanan(id) {
    if (!confirm('Yakin ingin menghapus janji ini?')) return;

    let riwayat = localStorage.getItem('kliniksehat_riwayat');
    riwayat = riwayat ? JSON.parse(riwayat) : [];

    let indexHapus = -1;
    for (let i = 0; i < riwayat.length; i++) {
        if (riwayat[i].id === id) {
            indexHapus = i;
            break;
        }
    }

    if (indexHapus !== -1) {
        riwayat.splice(indexHapus, 1);
        localStorage.setItem('kliniksehat_riwayat', JSON.stringify(riwayat));
        tampilkanRiwayat();
        alert('✅ Janji berhasil dihapus!');
    }
}

// Hapus semua data
function hapusSemua() {
    if (confirm('⚠️ Yakin ingin menghapus SEMUA riwayat?')) {
        localStorage.removeItem('kliniksehat_riwayat');
        tampilkanRiwayat();
        alert('✅ Semua riwayat berhasil dihapus!');
    }
}

// Edit data - redirect ke pesanan.html
function editPesanan(id) {
    let riwayat = localStorage.getItem('kliniksehat_riwayat');
    riwayat = riwayat ? JSON.parse(riwayat) : [];

    let data = null;
    for (let i = 0; i < riwayat.length; i++) {
        if (riwayat[i].id === id) {
            data = riwayat[i];
            break;
        }
    }

    if (data) {
        window.location.href = 'pesanan.html?edit=' + id;
    } else {
        alert('Data tidak ditemukan!');
    }
}

// ============================================================
// EVENT LISTENER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 KlinikSehat - Riwayat siap');
    
    if (isRiwayatPage()) {
        tampilkanRiwayat();

        const btnHapusSemua = document.getElementById('btnHapusSemua');
        if (btnHapusSemua) {
            btnHapusSemua.onclick = function() {
                hapusSemua();
            };
        }

        document.body.addEventListener('click', function(e) {
            const target = e.target;

            if (target.classList && target.classList.contains('btn-edit')) {
                const id = target.getAttribute('data-id');
                if (id) {
                    console.log('✏️ Klik Edit untuk ID:', id);
                    editPesanan(id);
                }
            }

            if (target.classList && target.classList.contains('btn-hapus')) {
                const id = target.getAttribute('data-id');
                if (id) {
                    console.log('🗑️ Klik Hapus untuk ID:', id);
                    hapusPesanan(id);
                }
            }
        });
    }
    
    console.log('✅ riwayat.js berhasil dijalankan!');
});