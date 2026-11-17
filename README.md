# Laras Etam

Laras Etam adalah studio notasi digital berbasis web untuk menyusun partitur gamelan Jawa dan musik Barat. Aplikasi menyediakan editor not angka, track instrumen, playback sintetis, serta ekspor proyek dan partitur.

## Fitur

- Mode gamelan Jawa dan musik Barat dengan pengaturan laras, gaya, bentuk gending, birama, dan tempo.
- Editor not angka dengan keypad, subdivisi, dua lapisan suara, lirik, artikulasi, dan navigasi kursor.
- Track instrumen dengan kontrol mixer dasar, tab part, serta fitur Auto-Garap berbasis pola.
- Playback sintetis berbasis Web Audio, metronom, loop, dan wilah virtual.
- Ekspor/impor JSON, ekspor PNG, cetak/PDF, WAV sintetis, dan MIDI dasar.

## Buka aplikasi

Buka landing page `index.html`, lalu pilih **Buka aplikasi**. Editor utama saat ini masih berada di `index.hmtl`; `app/index.html` menyediakan shell aplikasi dan memuat editor tersebut.

## Struktur repositori

- `index.html` — landing page Laras Etam
- `app/index.html` — shell aplikasi dengan header branding
- `app/app.css` — styling shell aplikasi
- `index.hmtl` — editor utama legacy
- `assets/` — aset landing page dan favicon
- `docs/FEATURE_AUDIT.md` — audit implementasi dan batasan fitur

## Batasan yang diketahui

Laras Etam belum setara fitur dengan Avid Sibelius. Belum ada impor MIDI/MusicXML pada implementasi yang ditinjau, engraving notasi profesional, atau sound library realistis. Ekspor MIDI bersifat dasar/lossy; playback dan WAV menggunakan sintesis browser. Riwayat versi proyek berjalan di memori halaman. Detail dan prioritas perbaikan ada di [audit fitur](docs/FEATURE_AUDIT.md).

## Menjalankan / publikasi

Aplikasi dapat dibuka sebagai situs statis di browser modern. Beberapa dependensi UI dimuat melalui CDN sehingga memerlukan koneksi internet. Untuk GitHub Pages, pilih branch `main` dan folder root melalui **Settings → Pages**.

## Status audit

Dokumentasi fitur dibuat dari tinjauan statis kode, bukan hasil pengujian runtime. Validasi lintas-browser dan pengujian semua jalur ekspor masih perlu dilakukan.
