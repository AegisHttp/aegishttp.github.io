# Aegis Organization Documentation Profile & Pages

This repository serves as the central documentation landing page for the **Aegis** Zero-Trust E2E HTTP encryption gateway.

👉 **View the live interactive website here:** [Aegis HTTP Gateway Documentation](https://aegishttp.github.io/)

[![Available in the Chrome Web Store](https://developer.chrome.com/docs/webstore/images/ChromeWebStore_Badge_v2_206x58.png)](https://chromewebstore.google.com/detail/lappbcambkogfmigiphapgjcglafcfnd)

---

## 🚀 Website Structure

The website is designed for GitHub Pages and is fully static, featuring modern styling and interactive guides:
* **[index.html](index.html):** Full documentation and interactive playground guide in English.
* **[tr.html](tr.html):** Full documentation and interactive playground guide in Turkish.
* **[assets/style.css](assets/style.css):** Design system ( obsidian dark mode, glassmorphism, responsive grids, custom tabs, scrollbars ).
* **[assets/app.js](assets/app.js):** Interactive components ( architecture diagram info switcher, playbook code tabs, clipboard copier ).

---

## 🛠️ Local Development & Preview

You can preview the website locally using any simple HTTP server.

**Option 1: Using Python**
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000`.

**Option 2: Using Node (http-server)**
```bash
npx http-server -p 8000
```
Then navigate to `http://localhost:8000`.

---

## 🇹🇷 Türkçe Açıklama

Bu depo, **Aegis** Sıfır-Güven E2E HTTP şifreleme ağ geçidinin merkezi dokümantasyon sayfasıdır.

👉 **Canlı etkileşimli web sitesini buradan görüntüleyebilirsiniz:** [Aegis HTTP Ağ Geçidi Dokümantasyonu](https://aegishttp.github.io/tr.html)

### Web Sitesi Yapısı:
* **[index.html](index.html):** İngilizce teknik dokümantasyon ve rehber.
* **[tr.html](tr.html):** Türkçe teknik dokümantasyon ve rehber.
* **[assets/style.css](assets/style.css):** Tasarım sistemi (koyu tema, glassmorphism, esnek ızgaralar, kod sekmeleri).
* **[assets/app.js](assets/app.js):** Etkileşimli şemalar, sekmeler ve kopyalama işlevleri.
