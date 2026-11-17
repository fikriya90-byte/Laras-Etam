# Audit fitur Laras Etam

**Tanggal audit:** 2026-11-17  
**Metode:** tinjauan statis terhadap implementasi pada `index.hmtl`. Aplikasi tidak dijalankan dalam audit ini; karena itu status di bawah berarti fitur memiliki jalur implementasi di kode, bukan jaminan bebas bug atau tervalidasi di semua browser.

## Ringkasan

Laras Etam adalah editor notasi angka gamelan Jawa dan musik Barat berbasis browser dengan playback sintetis dan ekspor. Kode sudah mengimplementasikan alur kerja editor yang berguna, tetapi belum setara dengan Avid Sibelius sebagai aplikasi engraving/notasi profesional. Implementasi menggunakan satu dokumen HTML besar dengan CSS dan JavaScript inline, dan belum disertai test suite otomatis.

## Status fitur berdasarkan kode

| Area | Status audit | Temuan dan batasan |
| --- | --- | --- |
| Mode gamelan dan musik Barat | Ada implementasi | UI menyediakan konfigurasi gaya/laras/bentuk gending serta sistem musik Barat, key Do dan birama. Semantik key, teori musik, dan konversi nada belum setara engine notasi profesional. |
| Input dan pengeditan not angka | Ada implementasi | Keypad, navigasi kursor, subdivisi 1–4, dua lapisan suara, oktaf, tanda kromatik Barat, artikulasi, lirik, serta undo berbasis snapshot tersedia di kode. Tidak ada model notasi standar yang menyeluruh atau validasi musikal formal. |
| Skor, track, dan mixer | Ada implementasi | Kode membuat track, tab bagian, mute/solo, volume, pan, dan pemilihan bagian skor. Tidak ada kolaborasi real-time, instrumen berbasis sound library profesional, atau pemetaan otomatis yang terbukti lengkap. |
| Templat dan Auto-Garap | Ada implementasi, bersifat heuristik | Templat disusun dari pola yang ditanam di kode. Auto-Garap menghasilkan pola kolotomik, Peking, Slenthem, dan Bonang dengan aturan sederhana; hasilnya perlu diperiksa dan disunting oleh pengrawit. Saran cengkok juga pola statis/heuristik, bukan layanan AI. |
| Playback dan wilah virtual | Ada implementasi | Playback Web Audio, tempo, half-speed, loop gatra, metronom, audisi keypad/wilah, serta sintesis sederhana ada di kode. Suara sintetis bukan sampel instrumen akustik yang realistis; kualitas dan latensi bergantung pada browser/perangkat. |
| Proyek dan versi | Parsial | Ekspor/impor JSON dan riwayat versi di state aplikasi tersedia. Riwayat versi disimpan dalam memori halaman; tidak ada penyimpanan server atau persistensi versi yang terjamin setelah reload. Berkas JSON harus diperlakukan sebagai data lokal tepercaya. |
| Ekspor PNG | Ada implementasi khusus | Gambar dibuat dengan Canvas dan layout sederhana. Jangan anggap setara hasil engraving; kompleksitas tata letak, lirik, tanda, dan halaman panjang dapat berbeda dari tampilan editor. |
| Ekspor PDF | Ada implementasi dasar | Mengandalkan dialog print browser dan CSS `@media print`; hasil akhir bergantung pada pengaturan printer/browser. Belum ada kontrol tata letak halaman PDF khusus. |
| Ekspor WAV | Ada implementasi sintetis | Dirender offline 16-bit menggunakan Web Audio. Ini bukan renderer sound library profesional; dukungan sampel kustom dan hasil akhir perlu diuji terpisah. |
| Ekspor MIDI | Ada implementasi dasar dan lossy | Kode membangun berkas SMF Type 0. Pemetaan nada Barat menggunakan tabel sederhana; ekspor bukan round-trip notasi lengkap. Metadata/ekspresi, artikulasi, lirik, teknik permainan gamelan, dan pemetaan instrumen dapat hilang atau tidak mewakili praktik musik secara akurat. |
| Impor MIDI / MusicXML | Belum ditemukan di implementasi yang ditinjau | Tidak ada alur impor MIDI atau MusicXML pada editor utama. MIDI export tidak sama dengan pertukaran proyek dua arah. |
| Fitur engraving Sibelius | Belum setara | Belum terlihat engine engraving profesional untuk notasi balok, spacing otomatis, sistem/halaman kompleks, part extraction/pengelolaan part setara Sibelius, magnetic layout, proofreading, atau pustaka instrumen/SoundWorld. |
| Keamanan dan ketahanan | Perlu diperkuat | Aplikasi bergantung pada CDN eksternal untuk Tailwind, font, dan ikon. Belum ada test otomatis, pemeriksaan aksesibilitas menyeluruh, atau validasi komprehensif terhadap berkas impor. |

## Prioritas tindak lanjut

1. Tambahkan test fungsional untuk pembuatan skor, input nada, undo, penyimpanan/impor JSON, playback, dan semua ekspor.
2. Jadikan penyimpanan proyek tahan reload (misalnya IndexedDB), dengan validasi skema dan penanganan berkas rusak.
3. Tambahkan impor MIDI/MusicXML dengan dokumentasi jelas mengenai batas konversi.
4. Perbaiki ekspor MIDI agar tempo, track/channel, nada, lirik, dan ekspresi yang didukung diekspor konsisten; verifikasi hasil di MuseScore dan DAW.
5. Pisahkan CSS, state/model, renderer, audio, ekspor, dan UI dari `index.hmtl` secara bertahap dengan tes regresi.
6. Untuk klaim kesetaraan Sibelius, perlu scope terpisah: notasi balok penuh, engraving/layout profesional, part workflow, playback library, serta kompatibilitas pertukaran berkas.

## Kesimpulan

Fitur inti yang tampak di UI sebagian besar memiliki implementasi pada kode, namun tingkatnya adalah editor web eksperimental/khusus, bukan pengganti Avid Sibelius. Audit ini berbasis kode; verifikasi runtime lintas-browser dan uji hasil ekspor masih diperlukan sebelum menyatakan fitur stabil.
