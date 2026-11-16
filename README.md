# Laras Etam

Studio notasi angka berbasis web untuk menyusun, mendengarkan, dan membagikan partitur gamelan Jawa maupun musik Barat. Antarmuka dan panduan aplikasi menggunakan Bahasa Indonesia.

## Mulai menggunakan

Buka [Laras Etam](https://fikriya90-byte.github.io/Laras-Etam/) setelah GitHub Pages diaktifkan. Untuk menjalankan secara lokal, unduh atau kloning repositori, lalu buka `index.html` di browser modern. Koneksi internet diperlukan agar Tailwind CSS, Google Fonts, dan Font Awesome yang dimuat dari CDN dapat digunakan.

## Fitur

- Templat partitur gamelan dan musik Barat serta pembuatan lembar kosong.
- Pengaturan laras, gaya tradisi, bentuk gending, birama, dan tempo.
- Penyuntingan notasi angka, lirik, beberapa suara, dan bagian instrumen.
- Playback, kontrol tempo, loop, serta audisi nada melalui wilah virtual.
- Impor/ekspor proyek JSON dan ekspor partitur ke PDF, PNG, WAV, serta MIDI.
- Tampilan responsif dan pilihan tema.

## Pintasan keyboard

| Pintasan | Aksi |
| --- | --- |
| `1`–`7` | Masukkan nada |
| `.` atau `0` | Perpanjang nada atau masukkan diam |
| Tombol panah | Navigasi kursor |
| `Spasi` | Putar atau jeda |
| `V` | Beralih antara Suara 1 dan Suara 2 |
| `Ctrl+Z` | Urungkan tindakan terakhir |
| `Ctrl+S` | Simpan proyek |
| `Ctrl+K` | Buka pencarian perintah |
| `Ctrl+Alt+K` | Buka wilah virtual |

## Publikasikan dengan GitHub Pages

1. Buka **Settings → Pages** pada repositori.
2. Pada **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/ (root)`, lalu simpan.
4. Tunggu proses deployment selesai, lalu buka URL Pages yang ditampilkan GitHub.

`index.html` adalah pintu masuk standar GitHub Pages dan meneruskan ke berkas aplikasi lama `index.hmtl`. Gunakan alamat root situs agar pengalihan berlangsung otomatis.

## Catatan

- Aplikasi ini berjalan di sisi klien; tidak diperlukan server aplikasi atau proses build.
- Data proyek dapat disimpan atau diekspor sebagai JSON. Simpan salinan ekspor secara berkala.
- Berkas audio sampel khusus dan proyek yang diimpor sebaiknya hanya berasal dari sumber tepercaya.
- Pustaka pihak ketiga dimuat dari CDN, sehingga ketersediaan dan versinya mengikuti penyedia masing-masing.

## Berkontribusi

Perubahan, laporan masalah, dan usulan fitur sangat dipersilakan melalui GitHub Issues atau Pull Requests. Sertakan langkah reproduksi dan browser/perangkat yang digunakan untuk laporan bug.
