# Kabul listesi — dijital ikiz

Aşağıdaki maddelerin tamamı ölçülüp geçtiğinde ikiz birleştirilir (PLAN §1.6 + sözleşme v1). Ev sayfası (`ev/index.html`) ve ana
uygulamanın Simülasyon sekmesi aynı ölçümleri yapar.

| # | madde | nasıl ölçülür |
|---|---|---|
| 1 | İki dil: `?dil=tr` ve `?dil=en`, her metin iki dilde | ev sayfasında dil değiştir; ekranda çevrilmemiş metin yok |
| 2 | İnternetsiz çalışır | ağ kapalıyken aç; tarayıcı konsolunda dış istek yok |
| 3 | LattePanda (N5105) üzerinde akıcı çalışır (öneri: saniyede en az 30 kare) ve düşük kalite seçeneği vardır | sahada ölçüm (koordinatör) |
| 4 | Canlı durum 1 saniye içinde yansır | bobin aç / kapat → ekranda ≤ 1 sn |
| 5 | Cihaz yokken (3 sn ileti gelmezse) çevrimdışı simülasyona geçer | ev sayfası "Cihaz yok" |
| 6 | ACİL DURDUR mandalı (`acilDurdur: true`) açıkça görünür | ev sayfası "ACİL DURDUR mandalı" |
| 7 | Alan haritası "Model tahmini, ölçüm değil" etiketiyle gösterilir; `255` (tablo dışı) değerleri çizilmez; kabin eksenleri sözleşmedeki gibidir (+X önden bakanın solu, +Y yukarı, +Z arkaya) | ev sayfası kaydı |
| 8 | Yalnızca `pemf.ikiz.hazir` gönderilir; başka ileti, komut ya da ağ isteği yoktur | ev sayfası günlüğü (kırmızı satır yok) |
| 9 | Konsol hatası yoktur | tarayıcı geliştirici araçları |
| 10 | Derleme çıktısı tek klasördür, `/simulator/` altında göreli yollarla çalışır, boyutu 20 MB'yi geçmez | çıktı klasörü |
| 11 | Kendi deposunda derleme + test CI'ı vardır | depo |
| 12 | 3B model ve doku lisansları ticari kullanıma izin verir (lisans listesi teslimde) | lisans listesi |
