/**
 * ==================== INDEX.JS - Halaman Beranda ====================
 * File ini berisi fungsi untuk SLIDER / CAROUSEL di halaman beranda.
 * 
 * Penulis: KlinikSehat Team
 * ================================================================
 */

// ============================================================
// FUNGSI CEK HALAMAN BERANDA
// ============================================================
function isBerandaPage() {
    return document.querySelector('.hero-slider') !== null;
}

// ============================================================
// FUNGSI SLIDER / CAROUSEL
// ============================================================
let slideIndex = 0;
let slides = [];
let dots = [];
let slideInterval = null;

// Inisialisasi slider
function initSlider() {
    if (!isBerandaPage()) return;
    
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
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
    
    slides.forEach(function(slide) {
        slide.classList.remove('active');
    });
    dots.forEach(function(dot) {
        dot.classList.remove('active');
    });
    
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

// Pindah slide
function changeSlide(n) {
    showSlide(slideIndex += n);
    resetAutoSlide();
}

// Langsung menuju slide tertentu
function currentSlide(n) {
    showSlide(slideIndex = n);
    resetAutoSlide();
}

// Auto slide setiap 4 detik
function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 4000);
}

// Reset auto slide
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
 * ==================== LAYANAN.JS - Halaman Layanan ====================
 * File ini berisi fungsi untuk halaman layanan.
 * Saat ini hanya placeholder untuk pengembangan selanjutnya.
 * 
 * Penulis: KlinikSehat Team
 * Tanggal: 2026
 * ================================================================
 */

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