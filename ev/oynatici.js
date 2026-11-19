// PEMF dijital ikiz ev sayfası — kayıtlı iletileri sözleşme v1'e göre yeniden oynatır.
// Ürün (Simülasyon sekmesi) ile AYNI kurallar: `pemf.ikiz.durum` 2 Hz (cihaz bağlıyken), `pemf.ikiz.alan` YALNIZ ikiz
// `pemf.ikiz.hazir` dedikten sonra; çerçeve yeniden yüklenince `hazir` sıfırlanır. İkizden `hazir` dışındaki her ileti İHLAL'dir.
// Not: ürün iletiyi ikiz sayfasının KÖKENİNE gönderir; dosyadan açılan ev sayfasında köken "null" olduğu için burada "*" kullanılır.
(function () {
  "use strict";
  var p = new URLSearchParams(location.search);
  var ikizAdres = p.get("ikiz") || "../ornek-ikiz/index.html";
  var kayit = window.PEMF_KAYIT || [];
  var cerceve = document.getElementById("ikiz");
  var gunluk = document.getElementById("gunluk");
  var t = 0, i = 0, oynuyor = false, hazir = false, kes = false, acil = false, son = performance.now();

  function yaz(sinif, metin) {
    var d = document.createElement("div");
    d.className = sinif;
    d.textContent = new Date().toLocaleTimeString() + "  " + metin;
    gunluk.prepend(d);
  }
  function yukle() {
    hazir = false;
    var dil = document.getElementById("dil").value;
    cerceve.src = ikizAdres + (ikizAdres.indexOf("?") < 0 ? "?" : "&") + "dil=" + dil;
    document.getElementById("ikizAdres").textContent = cerceve.src;
    yaz("bilgi", "çerçeve yüklendi (dil=" + dil + ") — hazir bekleniyor");
  }
  function gonder(ileti) {
    if (!cerceve.contentWindow) return;
    if (ileti.tur === "pemf.ikiz.durum" && acil) ileti = Object.assign({}, ileti, { acilDurdur: true });
    cerceve.contentWindow.postMessage(JSON.stringify(ileti), "*");
  }
  function tik() {
    var simdi = performance.now();
    if (oynuyor) t += (simdi - son) / 1000;
    son = simdi;
    while (oynuyor && i < kayit.length && kayit[i].t <= t) {
      var k = kayit[i++].ileti;
      if (kes) continue; // cihaz yok: hiçbir ileti gitmez → ikiz 3 sn sonra çevrimdışı simülasyona geçmeli
      if (k.tur === "pemf.ikiz.alan" && !hazir) continue; // sözleşme: alan yalnız hazir'dan sonra
      gonder(k);
    }
    if (i >= kayit.length) { i = 0; t = 0; } // döngü
    document.getElementById("zaman").textContent = t.toFixed(1).replace(".", ",");
    document.getElementById("ilerleme").textContent = i + " / " + kayit.length;
    requestAnimationFrame(tik);
  }
  window.addEventListener("message", function (e) {
    if (e.source !== cerceve.contentWindow) return;
    var o = null;
    try { o = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (x) { o = null; }
    if (o && o.tur === "pemf.ikiz.hazir") {
      hazir = true;
      yaz("tamam", "TAMAM: pemf.ikiz.hazir (surum " + o.surum + ") — alan iletileri başlıyor");
    } else {
      yaz("ihlal", "SÖZLEŞME DIŞI ileti (komut yolu YOK): " + String(typeof e.data === "string" ? e.data : JSON.stringify(e.data)).slice(0, 160));
    }
  });
  function anahtar(id, fn) {
    var b = document.getElementById(id);
    b.onclick = function () { var v = fn(); b.classList.toggle("aktif", v); };
  }
  document.getElementById("oynat").onclick = function () { oynuyor = true; };
  document.getElementById("duraklat").onclick = function () { oynuyor = false; };
  document.getElementById("basa").onclick = function () { t = 0; i = 0; };
  anahtar("kes", function () { kes = !kes; yaz("bilgi", kes ? "cihaz YOK — ileti kesildi" : "cihaz geri geldi"); return kes; });
  anahtar("acil", function () { acil = !acil; yaz("bilgi", "ACİL DURDUR mandalı " + (acil ? "KURULU" : "sıfırlandı")); return acil; });
  document.getElementById("dil").onchange = yukle;
  yukle();
  requestAnimationFrame(tik);
})();
