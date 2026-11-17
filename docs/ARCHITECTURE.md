# Arsitektur aplikasi dan refactor bertahap

Editor berjalan dari `index.hmtl`, dengan UI, state, renderer, audio, dan ekspor masih berada dalam satu dokumen. Memindahkan semuanya sekaligus berisiko memutus fungsi inline dan alur editor. Karena itu refactor dilakukan bertahap dengan tes karakterisasi.

## Fondasi yang disiapkan

- `src/project-store.mjs`: format proyek JSON berversi, validasi bentuk data minimum, dukungan baca berkas JSON legacy, serta helper penyimpanan browser.
- `src/safe-text.mjs`: utilitas untuk normalisasi dan penyaringan teks sebelum rendering ke DOM agar aman dari injeksi markup.
- `tests/project-store.test.mjs`: unit test untuk serialisasi, parsing, validasi, dan storage.
- `tests/safe-text.test.mjs`: unit test untuk escape teks dan fallback aman.
- `package.json`: perintah `npm test` berbasis Node.js test runner.

Modul ini belum disambungkan ke fungsi simpan/impor inline pada editor. Integrasi harus dilakukan sesudah state legacy dipetakan dan skenario migrasi diuji.

## Urutan pemisahan modul

1. Petakan state/fungsi legacy dan tambah tes karakterisasi untuk perilaku saat ini.
2. Sambungkan model proyek dan penyimpanan dengan membaca format JSON lama.
3. Pasang utilitas aman untuk rendering teks sebelum data dinamis dimasukkan ke DOM.
4. Pisahkan model skor dan aksi edit: input nada, subdivisi, seleksi, undo/redo.
5. Pisahkan renderer DOM, playback/audio, dan adapter ekspor.
6. Pindahkan event handler inline ke modul UI dan hapus global hanya setelah semua pemanggil dialihkan.
7. Ubah halaman editor menjadi loader modul setelah pengujian regresi lulus.

Jangan menghapus atau mengganti nama `index.hmtl` sebelum semua rute dan tautan lama dialihkan dan divalidasi.
