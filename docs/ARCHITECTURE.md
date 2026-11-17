# Arsitektur aplikasi dan refactor bertahap

Editor berjalan dari `index.hmtl`, dengan UI, state, renderer, audio, dan ekspor masih berada dalam satu dokumen. Memindahkan semuanya sekaligus berisiko memutus fungsi inline dan alur editor. Karena itu refactor dilakukan bertahap dengan tes karakterisasi.

## Fondasi yang disiapkan

- `src/project-store.mjs`: format proyek JSON berversi, validasi bentuk data minimum, dukungan baca berkas JSON legacy, serta helper penyimpanan browser.
- `src/project-state.js`: state container framework-independent dengan update tervalidasi, defensive copy, subscribe, undo/redo, dan batas riwayat.
- `src/project-persistence.js`: helper untuk save/load/clear proyek ke storage browser.
- `src/safe-text.mjs`: normalisasi teks, HTML escaping khusus konteks text-node, dan `setTextContent()` untuk penulisan DOM tanpa parsing markup.
- `tests/`: unit test untuk project store, state, persistence, dan safe text.
- `package.json`: perintah `npm test` berbasis Node.js test runner.

## Batas integrasi saat ini

Modul state, persistence, dan store adalah fondasi teruji secara terpisah, tetapi belum disambungkan ke fungsi inline editor. `safe-text` juga belum dipasang di seluruh renderer legacy. Jangan menganggap autosave atau perlindungan seluruh DOM sudah aktif sampai integrasi dan tes browser selesai.

## Urutan pemisahan modul

1. Petakan state/fungsi legacy dan tambah tes karakterisasi untuk perilaku saat ini.
2. Sambungkan model proyek dan penyimpanan dengan membaca format JSON lama.
3. Migrasikan renderer dinamis secara bertahap ke API DOM aman.
4. Ganti perubahan state inline dengan `project-state` dan integrasikan undo/redo.
5. Sambungkan persistence browser untuk autosave dan restore proyek terakhir.
6. Pisahkan renderer DOM, playback/audio, dan adapter ekspor.
7. Pindahkan event handler inline ke modul UI dan hapus global hanya setelah semua pemanggil dialihkan.
8. Ubah halaman editor menjadi loader modul setelah pengujian regresi lulus.

Jangan menghapus atau mengganti nama `index.hmtl` sebelum semua rute dan tautan lama dialihkan dan divalidasi.
