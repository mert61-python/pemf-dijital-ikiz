# PEMF dijital ikiz — gömme ve canlı veri sözleşmesi, sürüm 1

Bu belge, ana uygulamanın **Simülasyon** sekmesine gömülen dijital ikizin (Three.js / WebGL) uyması gereken kuralları tanımlar.
Uygulamadaki karşılığı `apps/ui/src/services/ikizKoprusu.ts`, `apps/ui/src/hooks/useIkizKoprusu.ts` ve `apps/ui/src/screens/DemaSimulatorScreen.tsx`
dosyalarındadır (GA, istem 53). Değişiklikler yalnızca yeni bir sürüm numarasıyla yapılır.

## 1. Gömme

- Derleme çıktısı **tek klasördür** ve sunucunun `/simulator/` adresinden **göreli yollarla** çalışır. Giriş sayfası `index.html`'dir.
- Dil URL'den gelir: `/simulator/index.html?dil=tr` ya da `?dil=en`. Sayfadaki her metnin iki dilde karşılığı olmalıdır.
- **İnternet bağlantısı gerektirmez:** three.js, modeller, dokular ve yazı tipleri pakete dahil edilir. CDN ya da dış yazı tipi kullanılmaz (sahada internet yok).
- Boyut bütçesi: önerilen üst sınır 20 MB.
- Başarım: saha bilgisayarı LattePanda 3 Delta (Intel Celeron N5105, 8 GB) üzerinde akıcı çalışmalıdır. Önerilen hedef saniyede en az 30 kare,
  ayrıca bir düşük kalite seçeneği bulunmalıdır.
- Web'de sayfa bir `iframe` içinde, mobilde `react-native-webview` içinde açılır. Sayfa her iki ortamda da aynı kodla çalışmalıdır.

## 2. İletişim kuralları (güvenlik)

- **Yalnızca okuma:** uygulama ikize veri gönderir. İkizin gönderebileceği tek ileti `pemf.ikiz.hazir`'dır.
  Bunun dışındaki her ileti uygulama tarafından yok sayılır. **İkiz cihaza komut gönderemez** (köprüde komut yolu yoktur).
- İletiler her zaman **JSON metni** olarak gönderilir; alan adları Türkçedir.
- Web'de uygulama iletiyi ikiz sayfasının **kendi kökenine** gönderir (joker `*` kullanmaz). Ayrıca yalnızca kendi açtığı çerçeveden
  **ve** o çerçevenin kökeninden gelen iletileri kabul eder.
- İkiz sayfası, iletinin bu sözleşmedeki `tur` değerlerinden biri olup olmadığını denetlemeli ve tanımadığı alanları yok saymalıdır.

## 3. İkiz → uygulama: `pemf.ikiz.hazir`

İkiz, dinlemeye hazır olduğunda (sayfa her yüklendiğinde) **bir kez** bu iletiyi gönderir:

```js
const hazir = JSON.stringify({ tur: "pemf.ikiz.hazir", surum: 1 });
if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(hazir); // mobil
else window.parent.postMessage(hazir, "*");                                   // web (iframe)
```

Uygulama bu iletiyi alana kadar canlı alan haritasını **göndermez** ve sunucu hesabı hiç başlamaz. `pemf.ikiz.durum` ise sayfa yüklendiği
andan itibaren gönderilir. Sayfa yenilendiğinde ya da dil değiştiğinde çerçeve yeniden yüklenir; ikiz `hazir` iletisini yeniden göndermelidir.

> Not: Mobilde mevcut DEMA sayfası, sayfa yüksekliğini sayı metni olarak (`"1840"`) gönderir. Bu ileti olduğu gibi kabul edilmeye devam eder.

## 4. Uygulama → ikiz iletilerinin alınması

```js
function dinle(olay) {
  let ileti;
  try { ileti = JSON.parse(olay.data); } catch { return; }
  if (!ileti || ileti.surum !== 1) return;
  if (ileti.tur === "pemf.ikiz.durum") durumuIsle(ileti);
  else if (ileti.tur === "pemf.ikiz.alan") alaniIsle(ileti);
}
window.addEventListener("message", dinle);    // web + iOS WebView
document.addEventListener("message", dinle);  // Android WebView
```

**Çevrimdışı çalışma:** 3 saniye boyunca `pemf.ikiz.durum` gelmezse (cihaz bağlı değilse ya da sayfa uygulama dışında açıldıysa) ikiz kendi
**çevrimdışı simülasyonuna** geçer.

## 5. `pemf.ikiz.durum` — saniyede 2 kez (500 ms)

| alan | tür | anlam |
|---|---|---|
| `tur` | `"pemf.ikiz.durum"` | |
| `surum` | `1` | |
| `zaman` | sayı | epoch saniye (istemci saati) |
| `cihazBagli` | boolean | kart (STM) bağlı mı |
| `acilDurdur` | boolean | ACİL DURDUR mandalı kurulu mu — kuruluysa ikiz bunu **açıkça göstermelidir** |
| `bobinler` | dizi (7) | bobin 1–7, sıralı |
| `bobinler[].bobin` | 1–7 | |
| `bobinler[].aktif` | boolean | bobin sürülüyor mu |
| `bobinler[].frekansHz` | sayı \| null | |
| `bobinler[].dutyYuzde` | sayı \| null | görev oranı, % |
| `bobinler[].fazDerece` | sayı \| null | faz (gecikme), derece |
| `bobinler[].surusKipi` | `"cift"` \| `"tek"` \| null | kartın etkin kipi (çift yönlü / tek yönlü); null = bilinmiyor |
| `bobinler[].olculenMt` | sayı \| null | sensörün (MLX) o bobinde gerçekten ölçtüğü alan; **ölçüm yoksa null (0 değil)** |
| `olculenAlan` | `{mT, bobin}` \| null | ölçülen en büyük alan; sensörün kabindeki yeri bilinmediği için haritaya yerleştirilmez |
| `seans` | `{tur, sureSn, gecenSn}` \| null | etkin seans; yoksa null |

**Hasta bilgisi gönderilmez** (ikizin buna ihtiyacı yoktur).

## 6. `pemf.ikiz.alan` — kalibre manyetik alan haritası (yaklaşık saniyede 1)

Sunucu, çalışan bobinlerin duty / faz / frekans değerlerinden kabindeki **tepe |B|** dağılımını ürünün kalibre alan modeliyle hesaplar
(fizik tek kaynaktır; ikizin kendi Excel tabanlı modeli bunun yerine geçmez). Bobin ayarı değişmediği sürece aynı harita yeniden gönderilir.

| alan | tür | anlam |
|---|---|---|
| `tur` / `surum` | `"pemf.ikiz.alan"` / `1` | köprü iletisinin sürümü |
| `haritaSurumu` | `1` | sunucu haritasının sürümü |
| `durum` | metin | `tamam` · `sifir` (çalışan bobin yok) · `kalibrasyonYok` · `kalibrasyonBozuk` · `kalibrasyonEski` · `eslemeDogrulanmadi` · `modelYok` · `modelBozuk` · `hata` |
| `modelTahmini` | `true` | ekranda **"Model tahmini, ölçüm değil" / "Model estimate, not a measurement"** etiketi gösterilmelidir |
| `kalibrasyon` | metin | kalibrasyon kimliği (değişirse harita yeni kalibrasyondandır) |
| `izgara.kok` | [x, y, z] mm | ilk noktanın konumu |
| `izgara.adim` | mm | 20 |
| `izgara.boyut` | [nx, ny, nz] | örnek: [28, 18, 21] (10 584 nokta) |
| `izgara.cerceve` | `"kabin"` | eksenler aşağıda |
| `izgara.camIc` | [genişlik, yükseklik, derinlik] mm | cam iç ölçüleri (örnek: 555 × 350 × 405) |
| `deger` | base64 | 8 bitlik değerler; `0..254` = değer × `olcek` (mT), `255` = **alan tablosunun dışında** (çizilmez) |
| `olcek` | sayı | mT / kademe |
| `yok` | `255` | |
| `enYuksek` | `{mT, konum: [x, y, z]}` \| null | en yüksek değer ve konumu |
| `bobinler` | dizi | haritanın hesaplandığı bobinler (`bobin`, `frekans`, `duty` oranı, `faz`) |
| `uyarilar` | dizi | `dutyKirpildi` (duty %50'nin üstündeki bobinler modelde %50 sayıldı) · `frekansKalibrasyonDisi` (76–147 Hz dışı) |

**Kabin çerçevesi:** başlangıç noktası cam içinin merkezidir; **+X önden bakan kişinin SOLU**, **+Y yukarı**, **+Z ARKAYA** doğrudur (mm).
Taban camı `y = −camIc[1] / 2` düzlemindedir; en alt katman taban camının 5 mm üstündedir (plaka sıvısının ortası).

**Değerlerin çözülmesi** (C sırası: önce x, sonra y, sonra z):

```js
const b = Uint8Array.from(atob(ileti.deger), (c) => c.charCodeAt(0));
const [nx, ny, nz] = ileti.izgara.boyut;
const i = (ix * ny + iy) * nz + iz;
const mT = b[i] === ileti.yok ? null : b[i] * ileti.olcek;
const konum = [0, 1, 2].map((k) => ileti.izgara.kok[k] + [ix, iy, iz][k] * ileti.izgara.adim);
```

`durum` `tamam` değilse ızgara alanları bulunmaz; ikiz bu durumda durum kodunun anlamını (iki dilde) göstermeli ya da kendi çevrimdışı
görünümünü kullanmalıdır.

## 7. Kabul listesi (teslimde ölçülür)

1. İki dil desteği (`?dil=tr|en`); her metin iki dilde.
2. İnternetsiz çalışır (ağ kapalıyken konsolda dış istek yok).
3. LattePanda üzerinde akıcı; düşük kalite seçeneği var.
4. Canlı durum 1 saniye içinde yansır (`pemf.ikiz.durum` 2 Hz).
5. Cihaz yokken (3 saniye ileti gelmezse) çevrimdışı simülasyona geçer.
6. ACİL DURDUR mandalı (`acilDurdur: true`) açıkça görünür.
7. Alan haritası gösteriliyorsa "Model tahmini, ölçüm değil" etiketi görünür; `255` değerleri çizilmez.
8. Yalnızca `pemf.ikiz.hazir` gönderir (başka ileti, komut ya da ağ isteği yok).
9. Konsol hatası yok.
10. Kendi deposunda derleme ve test CI'ı var.
11. 3B model ve doku lisansları ticari kullanıma izin verir (lisans listesi teslimde).

Kartsız geliştirme için ev sayfası ve kayıtlı örnek ileti oynatıcısı `kitler\pemf-dijital-ikiz\` klasöründedir.
