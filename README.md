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
| `uygulama/` | ana uygulamanın **gerçek Simülasyon (ve Kontrol) sekmesi** — ikizinizi uygulamanın içinde, canlı veriyle görmek için |
| `sunucu/sahte_sunucu.py` | ana PEMF sunucusunun yerine geçen sahte sunucu: 7 bobini canlandırır, canlı durumu ve alan haritasını gönderir, ikizinizi `/simulator/` altında sunar |

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

## Uygulamanın gerçek Simülasyon sekmesinde deneme

Ev sayfası kayıtlı iletileri oynatır. İkizinizi uygulamanın **kendi** Simülasyon sekmesinde, canlı veriyle görmek için (Python 3.10 ve
Node.js 22 gerekir):

```bat
python -m pip install fastapi==0.136.3 uvicorn==0.48.0
cd uygulama
npm ci --legacy-peer-deps
npm run export:web
cd ..
python sunucu/sahte_sunucu.py --ikiz ornek-ikiz
```

Tarayıcıda `http://127.0.0.1:8765/?sekme=simulasyon` adresini açın. `--ikiz` yerine kendi derleme klasörünüzü verin (içinde
`index.html` olmalı). Kontrol sekmesinden bobin başlatıp durdurun; ikiziniz canlı durumu 1 saniye içinde göstermeli, `pemf.ikiz.hazir`
gönderdikten sonra alan haritalarını da almalıdır (harita sentetiktir, kalibrasyon kimliği "sentetik-kit"). ACİL DURDUR düğmesine
basınca ikiziniz mandalı açıkça göstermelidir. Sahte sunucuyu kapatınca (Ctrl+C) 3 saniye içinde çevrimdışı simülasyona geçmelidir.

> Uygulama, `pemf.ikiz.hazir` iletisini çerçeve yüklenmeden önce gönderseniz de kabul eder (betiğiniz yüklenir yüklenmez göndermeniz
> doğrudur).

## Teslim

- Derleme çıktısı tek klasördür ve `/simulator/` altında göreli yollarla çalışır. İnternet gerektirmez: three.js, modeller ve dokular
  pakete dahildir; CDN kullanılmaz. Boyut bütçesi 20 MB'dir.
- Saha bilgisayarı LattePanda 3 Delta'dır (Celeron N5105). İkiz bu bilgisayarda akıcı çalışmalı, düşük kalite seçeneği de bulunmalıdır.
- Alan haritası gösterildiğinde "Model tahmini, ölçüm değil" etiketi görünür olmalıdır.
- Kendi deponuzda derleme ve test CI'ı bulunmalıdır. 3B model ve doku lisansları ticari kullanıma izin vermelidir.

İkiziniz kabul edildiğinde uygulamadaki eski simülatörün (DEMA) yerini alır ve sekmenin adı "Dijital ikiz" olur. Bu değişikliği ana
uygulama ekibi yapar. Depo açma ve davet işlemleri koordinatör üzerinden yürür.
