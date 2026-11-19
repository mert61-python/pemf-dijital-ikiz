# PEMF dijital ikiz kiti

> **Bu depo dijital ikiz geliştiricisi içindir.** Bağlantıyla paylaşıldı; herkes okuyabilir. Doğrudan kod göndermek için GitHub
> kullanıcı adınızı koordinatöre iletin, depoya **bakım (maintain)** yetkisiyle eklenirsiniz. O zamana kadar depoyu *fork* edip
> çekme isteği (PR) açabilirsiniz. İlk iş: aşağıdaki **Hızlı başlangıç** ile ev sayfasını açıp örnek ikizi deneyin.

Bu kit, PEMF uygulamasının **Simülasyon** sekmesine gömülecek dijital ikiz (Three.js / WebGL) için hazırlandı. İkiz, uygulamanın içinde
web'de bir `iframe`, mobilde bir `WebView` içinde açılır. Uygulamadan canlı veriyi **yalnızca okur**; cihaza komut gönderemez.

## İçerik

| dosya | içerik |
|---|---|
| `ikiz-sozlesmesi-v1.md` | gömme ve canlı veri sözleşmesi (iletiler, alanlar, alan haritasının çözülmesi, kabin eksenleri, kurallar) |
| `KABUL.md` | teslimde ölçülecek maddeler |
| `ev/index.html` + `ev/oynatici.js` | **kartsız geliştirme için ev sayfası**: ikizinizi `iframe` içinde açar, kayıtlı iletileri sözleşmedeki sırayla yeniden oynatır, sizden gelen iletileri denetler |
| `ev/kayitlar/ornek_seans.js` | kayıtlı örnek iletiler (yaklaşık 40 sn: boşta → 7 bobin 100 Hz → faz değişimi → iki frekans → ACİL DURDUR → sıfırlama) |
| `ornek-ikiz/index.html` | sözleşmeyi uygulayan **en küçük örnek ikiz** (Three.js yok; kesit haritası, bobin tablosu, ACİL DURDUR bandı, çevrimdışı geçiş) |

> Örnek iletilerdeki alan haritaları **sentetik bir tablodan** üretilmiştir (değerler gerçek kabini temsil etmez). Gerçek değerler,
> uygulamaya bağlandığınızda ürünün kalibre alan modelinden gelir.

## Hızlı başlangıç

1. `ev/index.html` dosyasını tarayıcıda açın. Varsayılan olarak `ornek-ikiz` açılır. Kendi ikizinizi denemek için adresine şunu ekleyin:
   `?ikiz=<ikizinizin index.html yolu>`.
2. **Oynat** düğmesine basın. İkiziniz önce `pemf.ikiz.hazir` iletisini göndermelidir; ev sayfası bunu yeşil satırla gösterir ve
   ardından alan haritası iletilerini göndermeye başlar.
3. **Cihaz yok** düğmesiyle ileti akışını kesin. İkiziniz 3 saniye içinde çevrimdışı simülasyona geçmelidir.
4. **ACİL DURDUR mandalı** düğmesine basın. İkiziniz durumu açıkça göstermelidir.
5. **Dil** seçimini değiştirin. Çerçeve `?dil=en` ile yeniden yüklenir; her metin İngilizce görünmelidir.
6. Günlükte kırmızı "SÖZLEŞME DIŞI" satırı görmemelisiniz. İkiz yalnızca `pemf.ikiz.hazir` gönderebilir.

## Teslim

- Derleme çıktısı tek klasördür ve `/simulator/` altında göreli yollarla çalışır. İnternet gerektirmez: three.js, modeller ve dokular
  pakete dahildir; CDN kullanılmaz. Boyut bütçesi 20 MB'dir.
- Saha bilgisayarı LattePanda 3 Delta'dır (Celeron N5105). İkiz bu bilgisayarda akıcı çalışmalı, düşük kalite seçeneği de bulunmalıdır.
- Alan haritası gösterildiğinde "Model tahmini, ölçüm değil" etiketi görünür olmalıdır.
- Kendi deponuzda derleme ve test CI'ı bulunmalıdır. 3B model ve doku lisansları ticari kullanıma izin vermelidir.

İkiziniz kabul edildiğinde uygulamadaki eski simülatörün (DEMA) yerini alır ve sekmenin adı "Dijital ikiz" olur. Bu değişikliği ana
uygulama ekibi yapar. Depo açma ve davet işlemleri koordinatör üzerinden yürür.
