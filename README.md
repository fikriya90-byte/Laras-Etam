# Laras Etam

Laras Etam adalah studio notasi digital berbasis web untuk menyusun partitur gamelan Jawa dan musik Barat. Aplikasi menyediakan editor not angka, track instrumen, playback sintetis, serta ekspor proyek dan partitur.

## Fitur saat ini

- Mode gamelan Jawa dan musik Barat dengan pengaturan laras, gaya, bentuk gending, birama, dan tempo.
- Editor not angka dengan keypad, subdivisi, dua lapisan suara, lirik, artikulasi, dan navigasi kursor.
- Track instrumen dengan kontrol mixer dasar, tab part, serta Auto-Garap berbasis pola.
- Playback sintetis Web Audio, metronom, loop, dan wilah virtual.
- Ekspor/impor JSON, ekspor PNG, cetak/PDF, WAV sintetis, dan MIDI dasar.

## Jalankan aplikasi

Buka landing page `index.html`, lalu klik **Buka aplikasi**. Editor aktif masih berada di `index.hmtl`; `app/index.html` menampilkan shell branding dan memuat editor tersebut.

## Struktur repositori

- `index.html` — landing page
- `app/index.html` — shell aplikasi
- `app/app.css` — styling shell
- `index.hmtl` — editor legacy yang masih aktif
- `assets/` — aset landing page dan favicon
- `src/project-store.mjs` — fondasi baru untuk validasi dan penyimpanan proyek; belum terhubung ke editor
- `tests/` — unit test untuk modul project store
- `docs/FEATURE_AUDIT.md` — audit fitur dan batasan
- `docs/ARCHITECTURE.md` — rencana modularisasi bertahap

## Batasan yang diketahui

Laras Etam belum setara fitur dengan Avid Sibelius. Pada audit statis terakhir, impor MIDI/MusicXML dan engraving profesional belum ditemukan. Ekspor MIDI masih dasar/lossy; playback dan WAV menggunakan sintesis browser. Audit statis bukan pengganti pengujian runtime; detailnya ada di [audit fitur](docs/FEATURE_AUDIT.md).

## Pengembangan lokal

- Untuk test modul: Node.js 20 atau lebih baru, jalankan `npm test`.
- Aplikasi adalah situs statis; beberapa dependensi UI dimuat melalui CDN dan memerlukan koneksi internet.
- GitHub Pages: pilih branch `main` dan folder root melalui **Settings → Pages**.

## Status refactor

Refactor dimulai dengan modul fondasi dan unit test, belum menggantikan fungsi inline aplikasi. Lihat [rencana arsitektur](docs/ARCHITECTURE.md).