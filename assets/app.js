document.addEventListener('DOMContentLoaded', () => {
  // Determine language of the current page
  const pageLang = document.documentElement.lang || 'en';

  // 1. Header scroll effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Interactive Diagram Details Data
  const nodeDetails = {
    en: {
      browser: {
        title: "Transparent Browser Hook",
        desc: "A lightweight proxy injected into the DOM that overrides window.fetch and XMLHttpRequest. It autonomously intercepts REST calls, checks for 'x-gpg-support' headers, and tunnels payloads without modifying frontend logic."
      },
      extension: {
        title: "Web Extension Coordinator",
        desc: "The Chrome/Firefox browser extension that manages public-key lookups (WKD/Ubuntu keyserver) and communicates with the Native Messaging Host over a persistent OS port to coordinate payload encryption."
      },
      native: {
        title: "Secure Native Daemon (Rust)",
        desc: "An isolated background service built in Rust. It interacts directly with the local GPG binary on the OS. Because it is completely outside the browser environment, raw private keys never enter browser memory."
      },
      keyring: {
        title: "OS GPG Keyring (Hardware Guard)",
        desc: "The OS-level keyring stores your private key and uses pinentry screens for passphrase prompts. It stands completely isolated from XSS, malicious browser plugins, and DOM scraping scripts."
      },
      middleware: {
        title: "Zero-Trust Backend Middleware",
        desc: "A backend plugin (Laravel, GoFiber, Caddy, Axum) that intercepts incoming streams, decrypts them using the server's GPG key, and forwards standard JSON to controllers. Outgoing responses are encrypted back to the client."
      }
    },
    tr: {
      browser: {
        title: "Şeffaf Tarayıcı Yakalayıcısı",
        desc: "DOM ortamına enjekte edilen hafif bir vekil (proxy) kütüphane. window.fetch ve XMLHttpRequest metodlarını gözetleyerek, sunucudan 'x-gpg-support' başlığı geldiği anda istekleri otonom olarak yakalar ve şifreleme tüneline sokar."
      },
      extension: {
        title: "Tarayıcı Eklenti Koordinatörü",
        desc: "Chrome veya Firefox üzerinde çalışan, WKD (Web Key Directory) ya da Ubuntu anahtar sunucuları üzerinden genel anahtar sorguları gerçekleştiren ve Native Messaging üzerinden işletim sistemine şifreleme emirleri gönderen eklenti katmanı."
      },
      native: {
        title: "Güvenli Yerel Servis (Rust)",
        desc: "İşletim sisteminde izole çalışan Rust Daemon'ı. Tarayıcı eklentisinden gelen verileri doğrudan sistemin 'gpg' binary dosyasına besler. Tarayıcı dışında çalıştığından, gizli anahtarlar tarayıcı belleklerine asla uğramaz."
      },
      keyring: {
        title: "GPG Anahtarlığı (OS/Donanım Koruması)",
        desc: "Gizli anahtarlarınızı barındıran yerel anahtarlık. Şifre sorma işlemlerini OS seviyesindeki 'pinentry' arayüzleriyle yapar. DOM sızıntılarından, zararlı yan eklentilerden ve XSS saldırılarından fiziksel olarak izoledir."
      },
      middleware: {
        title: "Sıfır-Güven Backend Middleware",
        desc: "Caddy, Laravel, GoFiber ya da Axum gibi arka uç katmanlarında çalışan ağ geçidi. Gelen şifreli GPG paketlerini çözer ve API kontrolcülerine standart JSON besler. Sunucu yanıtlarını da istemcinin GPG anahtarıyla tekrar şifreler."
      }
    }
  };

  const diagramNodes = document.querySelectorAll('.diagram-node');
  const detailsTitle = document.getElementById('details-title');
  const detailsText = document.getElementById('details-text');

  if (diagramNodes.length > 0 && detailsTitle && detailsText) {
    diagramNodes.forEach(node => {
      node.addEventListener('click', () => {
        // Toggle active class on nodes
        diagramNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        // Update details box content
        const nodeId = node.dataset.node;
        const details = nodeDetails[pageLang][nodeId];
        
        if (details) {
          detailsTitle.innerHTML = `🛡️ ${details.title}`;
          detailsText.textContent = details.desc;
        }
      });
    });
  }

  // 3. Playbook Tab Switcher
  const playbookTabs = document.querySelectorAll('.playbook-tab');
  const playbookPanels = document.querySelectorAll('.playbook-panel');

  if (playbookTabs.length > 0) {
    playbookTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.dataset.tab;

        // Toggle tabs
        playbookTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Toggle panels
        playbookPanels.forEach(p => {
          if (p.id === targetPanel) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
      });
    });
  }

  // 4. Copy to Clipboard Helper
  const copyButtons = document.querySelectorAll('.btn-copy');
  
  if (copyButtons.length > 0) {
    copyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const preBlock = btn.closest('.code-window').querySelector('pre');
        const codeText = preBlock.textContent;

        navigator.clipboard.writeText(codeText).then(() => {
          const originalText = btn.textContent;
          btn.textContent = pageLang === 'tr' ? 'Kopyalandı!' : 'Copied!';
          btn.style.backgroundColor = 'var(--color-success)';
          btn.style.color = 'var(--bg-primary)';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  }

  // 5. Request & Login Flow Animations
  const animPacket = document.getElementById('anim-packet');
  const animPacketBody = document.getElementById('anim-packet-body');
  const animPacketHeader = document.getElementById('anim-packet-header');
  const animStatusText = document.getElementById('anim-status-text');
  const animNodeClient = document.getElementById('anim-node-client');
  const animNodeServer = document.getElementById('anim-node-server');
  const animWireLine = document.getElementById('anim-wire-line');
  const animWkdNode = document.getElementById('anim-wkd-node');
  const animPinentry = document.getElementById('anim-pinentry');
  const animPinentryInput = document.getElementById('anim-pinentry-input');

  const btnAnimE2e = document.getElementById('btn-anim-e2e');
  const btnAnimLogin = document.getElementById('btn-anim-login');

  if (animPacket && animPacketBody && animPacketHeader && animStatusText) {
    const texts = {
      en: {
        plaintextRequest: "METHOD: POST /api/user\nAuthorization: Bearer eyJhbGciOi...\nContent-Type: application/json\n\n{\n  \"ssn\": \"000-12-3456\",\n  \"balance\": 92834.12\n}",
        plaintextResponse: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"status\": \"success\",\n  \"data\": {\n    \"secureToken\": \"session_ok_983\",\n    \"updatedBalance\": 92834.12\n  }\n}",
        wkdLookup: "🔑 Web Key Directory (WKD) Discovery\n\nGET https://mail.tdl/.well-known/openpgpkey/hu/s8dfj3b...\n\nResolving User's GPG Public Key from domain to encrypt responses later...",
        keyringBridge: "🔑 GPG Keyring Communication\n\nConnecting to GPG local keychain...\nSpawning OS Pinentry prompt to unlock User's GPG Private Key...",
        keyringCacheHit: "🔑 GPG Keyring (Cache Hit)\n\nKey is already unlocked in gpg-agent memory.\nSkipping Pinentry passphrase prompt, encrypting request envelope instantly...",
        encryptedRequest: "-----BEGIN PGP MESSAGE-----\nVersion: GnuPG v2\nComment: Encrypted with SERVER'S Public Key\n\nhQIMA87Xp2Pt05QxAQ//RFwWz97hD\n8V+mZc8d4n4gJ9d9Z2h8p9mP9t2m\nQ9v2mQ9v2mQ9v2mQ9v2mQ9v2mQ9v\n-----END PGP MESSAGE-----",
        encryptedResponse: "-----BEGIN PGP MESSAGE-----\nVersion: GnuPG v2\nComment: Encrypted with USER'S Public Key\n\naB38xK29fD9d2mQ//S928dfk239fs\nkfL239dfjSDFK23sfj239sfj29s\ns9dfj23sf923fjs923fjs923fjs9\n-----END PGP MESSAGE-----",
        statusFormulating: "<span>Client (1/8):</span> Formulating REST API request in DOM. Session JWT header and body are in plaintext.",
        statusWkd: "<span>Key Discovery (2/8):</span> Server queries WKD (.well-known/openpgpkey) to fetch the <b>User's GPG Public Key</b> for encrypting the response.",
        statusPinentry: "<span>Native Host & GPG (3/8):</span> Rust Daemon prompts OS Pinentry dialog. Encrypts request envelope using the <b>Server's GPG Public Key</b>.",
        statusCacheHit: "<span>Native Host & GPG (3/8):</span> Rust Daemon checks keyring. Key is cached in <b>gpg-agent</b>. Skips Pinentry and encrypts request instantly.",
        statusRequestTransit: "<span>Request Transit (4/8):</span> Request (encrypted with <b>Server's Public Key</b>) flows over network. Session JWT is completely shielded.",
        statusServerDecrypting: "<span>Backend Gateway (5/8):</span> Server middleware decrypts request using the <b>Server's GPG Private Key</b> and forwards plain data to backend controllers.",
        statusServerEncrypting: "<span>Server Encrypt (6/8):</span> Backend encrypts the response envelope using the <b>User's GPG Public Key</b> fetched during Step 2.",
        statusResponseTransit: "<span>Response Transit (7/8):</span> Response (encrypted with <b>User's Public Key</b>) travels back. Entire return path is secure.",
        statusClientDecrypting: "<span>Client Decrypt (8/8):</span> Browser extension intercepts and decrypts response using the <b>User's GPG Private Key</b> to yield plaintext.",
        plaintextChallengeReq: "METHOD: GET /api/challenge\nAccept: application/json\n\n(Client requests cryptographic challenge to verify identity...)",
        challengeResp: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"challenge\": \"9f83a8b2c4...\",\n  \"expires\": \"2026-07-07T17:59:12Z\"\n}",
        loginSign: "🔑 Native Messaging Bridge\n\nExtension requests GPG Native Host...\nSigning challenge \"9f83a8b2c4...\" using User's GPG Private Key...",
        loginPost: "METHOD: POST /api/login\nContent-Type: application/json\n\n{\n  \"email\": \"user@mail.tdl\",\n  \"keyId\": \"0xUserKeyID\",\n  \"signature\": \"-----BEGIN PGP SIGNATURE-----\\n...\\n-----END PGP SIGNATURE-----\"\n}",
        loginVerify: "🔒 Gateway Signature Verification\n\nVerifying challenge signature against User's GPG Public Key...\nRetrieving key from local cache or WKD...",
        loginSuccess: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"status\": \"success\",\n  \"sessionToken\": \"gpg_session_92834b...\",\n  \"user\": \"user@mail.tdl\"\n}",
        statusChallengeReq: "<span>Challenge Request (1/6):</span> Client requests a cryptographic challenge from `/api/challenge` to start GPG-based authentication.",
        statusChallengeResp: "<span>Challenge Response (2/6):</span> Server generates a unique challenge token and sends it back to the browser.",
        statusLoginSign: "<span>Native GPG Signing (3/6):</span> Extension opens OS Pinentry prompt. User types passphrase to sign the challenge with their local GPG Private Key.",
        statusLoginPost: "<span>Submit Signature (4/6):</span> Client posts the signed challenge and key identifiers back to `/api/login`.",
        statusLoginVerify: "<span>Verify Signature (5/6):</span> Gateway (Caddy) verifies the signature against the User's Public Key. Verifies that user controls the private key.",
        statusLoginSuccess: "<span>Auth Successful (6/6):</span> Gateway issues a secure encrypted session token. User is logged in as <b>user@mail.tdl</b>."
      },
      tr: {
        plaintextRequest: "METOT: POST /api/user\nAuthorization: Bearer eyJhbGciOi...\nContent-Type: application/json\n\n{\n  \"ssn\": \"000-12-3456\",\n  \"bakiye\": 92834.12\n}",
        plaintextResponse: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"durum\": \"basarili\",\n  \"veri\": {\n    \"guvenliJeton\": \"session_ok_983\",\n    \"yeniBakiye\": 92834.12\n  }\n}",
        wkdLookup: "🔑 Web Key Directory (WKD) Keşfi\n\nGET https://mail.tdl/.well-known/openpgpkey/hu/s8dfj3b...\n\nSunucu, ileride yanıtı şifrelemek için Kullanıcının GPG Genel Anahtarını çekiyor...",
        keyringBridge: "🔑 GPG Anahtarlık İletişimi\n\nOS GPG anahtarlığına bağlanılıyor...\nKullanıcının GPG Gizli Anahtarını açmak için Pinentry ekranı tetikleniyor...",
        keyringCacheHit: "🔑 GPG Anahtarlık (Önbellek İsabeti)\n\nAnahtar gpg-agent belleğinde zaten açık.\nPinentry parola ekranı atlanıyor, istek zarfı anında şifreleniyor...",
        encryptedRequest: "-----BEGIN PGP MESSAGE-----\nVersion: GnuPG v2\nComment: SUNUCUNUN Genel Anahtarı ile şifrelendi\n\nhQIMA87Xp2Pt05QxAQ//RFwWz97hD\n8V+mZc8d4n4gJ9d9Z2h8p9mP9t2m\nQ9v2mQ9v2mQ9v2mQ9v2mQ9v2mQ9v\n-----END PGP MESSAGE-----",
        encryptedResponse: "-----BEGIN PGP MESSAGE-----\nVersion: GnuPG v2\nComment: KULLANICININ Genel Anahtarı ile şifrelendi\n\naB38xK29fD9d2mQ//S928dfk239fs\nkfL239dfjSDFK23sfj239sfj29s\ns9dfj23sf923fjs923fjs923fjs9\n-----END PGP MESSAGE-----",
        statusFormulating: "<span>İstemci (1/8):</span> REST API isteği DOM'da hazırlanıyor. JWT ve veri gövdesi henüz şeffaf (plaintext).",
        statusWkd: "<span>Anahtar Keşfi (2/8):</span> Sunucu, dönüş paketini şifrelemek amacıyla WKD ile <b>Kullanıcının GPG Genel Anahtarını</b> doğrulayıp çekiyor.",
        statusPinentry: "<span>Native Host & GPG (3/8):</span> Rust Daemon, OS Pinentry ekranını açar. İsteği <b>Sunucunun GPG Genel Anahtarı</b> ile şifreler.",
        statusCacheHit: "<span>Native Host & GPG (3/8):</span> Rust Daemon anahtarlığı kontrol eder. Anahtar <b>gpg-agent</b> önbelleğinde aktiftir. Pinentry atlanır.",
        statusRequestTransit: "<span>İstek Hattı (4/8):</span> İstek (<b>Sunucunun Genel Anahtarı</b> ile şifreli) ağda taşınıyor. JWT ve veriler tamamen gizlidir.",
        statusServerDecrypting: "<span>Arka Uç Geçidi (5/8):</span> Sunucu middleware, isteği <b>Sunucunun GPG Gizli Anahtarı</b> ile çözerek düz metin olarak kontrolcülere iletir.",
        statusServerEncrypting: "<span>Sunucu Şifreleme (6/8):</span> Arka uç, ürettiği yanıtı <b>Kullanıcının GPG Genel Anahtarı</b> (Adım 2'de alınan) ile şifreliyor.",
        statusResponseTransit: "<span>Yanıt Hattı (7/8):</span> Yanıt (<b>Kullanıcının Genel Anahtarı</b> ile şifreli) tarayıcıya geri taşınır. Dönüş yolu da tamamen güvenlidir.",
        statusClientDecrypting: "<span>İstemci Deşifre (8/8):</span> Eklenti gelen şifreli yanıtı yakalar ve <b>Kullanıcının GPG Gizli Anahtarı</b> ile çözüp uygulamaya aktarır.",
        plaintextChallengeReq: "METOT: GET /api/challenge\nAccept: application/json\n\n(İstemci, kimliğini doğrulamak için kriptografik challenge talep eder...)",
        challengeResp: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"challenge\": \"9f83a8b2c4...\",\n  \"expires\": \"2026-07-07T17:59:12Z\"\n}",
        loginSign: "🔑 Native Messaging Köprüsü\n\nEklenti GPG Daemon'ını çağırıyor...\n\"9f83a8b2c4...\" challenge verisi Kullanıcının GPG Gizli Anahtarı ile imzalanıyor...",
        loginPost: "METOT: POST /api/login\nContent-Type: application/json\n\n{\n  \"email\": \"user@mail.tdl\",\n  \"keyId\": \"0xUserKeyID\",\n  \"signature\": \"-----BEGIN PGP SIGNATURE-----\\n...\\n-----END PGP SIGNATURE-----\"\n}",
        loginVerify: "🔒 İmza Doğrulama (Geçit)\n\nChallenge imzası Kullanıcının GPG Açık Anahtarı ile doğrulanıyor...\nAnahtar yerel bellekten veya WKD'den alınıyor...",
        loginSuccess: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"durum\": \"basarili\",\n  \"oturumJetonu\": \"gpg_session_92834b...\",\n  \"kullanici\": \"user@mail.tdl\"\n}",
        statusChallengeReq: "<span>Challenge Talebi (1/6):</span> İstemci, GPG kimlik doğrulamasını başlatmak için `/api/challenge` adresinden bir challenge talep eder.",
        statusChallengeResp: "<span>Challenge Yanıtı (2/6):</span> Sunucu, benzersiz bir challenge belirteci oluşturur ve tarayıcıya geri gönderir.",
        statusLoginSign: "<span>Yerel GPG İmzalama (3/6):</span> Eklenti OS Pinentry ekranını açar. Kullanıcı, challenge verisini GPG Gizli Anahtarı ile imzalamak için parolasını girer.",
        statusLoginPost: "<span>İmzayı Gönder (4/6):</span> İstemci, imzalanmış challenge verisini ve anahtar kimlik bilgilerini `/api/login` adresine gönderir.",
        statusLoginVerify: "<span>İmza Kontrolü (5/6):</span> Geçit (Caddy) imzayı Kullanıcının Açık Anahtarı ile doğrular. Kullanıcının gizli anahtara sahip olduğunu onaylar.",
        statusLoginSuccess: "<span>Giriş Başarılı (6/6):</span> Geçit, şifreli bir oturum jetonu düzenler. Giriş başarılı: <b>user@mail.tdl</b>."
      }
    };

    const langText = texts[pageLang];
    let time = 0;
    let animationMode = 'e2e'; 

    if (btnAnimE2e && btnAnimLogin) {
      btnAnimE2e.addEventListener('click', () => {
        animationMode = 'e2e';
        btnAnimE2e.classList.add('active');
        btnAnimLogin.classList.remove('active');
        time = 0;
        resetNodeStates();
      });

      btnAnimLogin.addEventListener('click', () => {
        animationMode = 'login';
        btnAnimLogin.classList.add('active');
        btnAnimE2e.classList.remove('active');
        time = 0;
        resetNodeStates();
      });
    }

    function resetNodeStates() {
      animNodeClient.classList.remove('active', 'authenticated');
      animNodeServer.classList.remove('active');
      animWireLine.classList.remove('active');
      if (animWkdNode) animWkdNode.classList.remove('active');
      if (animPinentry) animPinentry.classList.remove('show');
    }

    function updateAnimStatus(htmlString) {
      if (animStatusText) animStatusText.innerHTML = htmlString;

      // Parse for structured status card
      const spanMatch = htmlString.match(/<span>(.*?)<\/span>/);
      if (!spanMatch) return;

      const headerHtml = spanMatch[1];
      const descHtml = htmlString.replace(/<span>.*?<\/span>\s*/, "");

      const stepMatch = headerHtml.match(/(\d+)\/(\d+)/);
      if (stepMatch) {
        const step = parseInt(stepMatch[1]);
        const total = parseInt(stepMatch[2]);
        const percent = (step / total) * 100;
        const cleanTitle = headerHtml.replace(/\s*\(\d+\/\d+\):?/, "");

        const animStatusTitle = document.getElementById('anim-status-title');
        const animStatusDesc = document.getElementById('anim-status-desc');
        const animStatusProgress = document.getElementById('anim-status-progress');
        const animStatusProgressText = document.getElementById('anim-status-progress-text');

        if (animStatusTitle) animStatusTitle.innerHTML = cleanTitle;
        if (animStatusDesc) animStatusDesc.innerHTML = descHtml;
        if (animStatusProgress) animStatusProgress.style.width = `${percent}%`;
        if (animStatusProgressText) animStatusProgressText.textContent = `${step}/${total}`;
      }
    }

    let liveFlowInterval = null;
    function startLiveFlow() {
      if (liveFlowInterval) return;
      liveFlowInterval = setInterval(() => {
        let leftPercent = 0;

        if (animationMode === 'e2e') {
          time = (time + 50) % 40000; 

          const cycle = Math.floor(time / 20000); 
          const cycleTime = time % 20000; 

          if (cycleTime < 3000) {
            leftPercent = 0;
            animPacket.classList.remove('encrypted');
            animPacketBody.classList.remove('encrypted-text');
            animPacketHeader.classList.remove('encrypted-title');
            animPacketHeader.textContent = pageLang === 'tr' 
              ? `📄 HTTP İsteği ${cycle + 1} (Plain)` 
              : `📄 HTTP Request ${cycle + 1} (Plain)`;
            animPacketBody.textContent = langText.plaintextRequest;
            
            animNodeClient.classList.add('active');
            animNodeServer.classList.remove('active');
            animWireLine.classList.remove('active');
            if (animWkdNode) animWkdNode.classList.remove('active');
            if (animPinentry) animPinentry.classList.remove('show');
            
            updateAnimStatus(langText.statusFormulating);
          } else if (cycleTime >= 3000 && cycleTime < 5500) {
            leftPercent = 0;
            if (animWkdNode) animWkdNode.classList.add('active');
            
            animPacketHeader.textContent = pageLang === 'tr' ? "🔑 Kullanıcı Anahtarı Çözümleniyor" : "🔑 Resolving User Public Key";
            animPacketBody.textContent = langText.wkdLookup;
            
            updateAnimStatus(langText.statusWkd);
          } else if (cycleTime >= 5500 && cycleTime < 8500) {
            leftPercent = 0;
            if (animWkdNode) animWkdNode.classList.remove('active');

            if (cycle === 0) {
              if (animPinentry) animPinentry.classList.add('show');
              animPacketHeader.textContent = pageLang === 'tr' ? "🔒 GPG Şifreleme Köprüsü" : "🔒 GPG Encryption Bridge";
              animPacketBody.textContent = langText.keyringBridge;

              const elapsed = cycleTime - 5500;
              if (animPinentryInput) {
                if (elapsed < 800) {
                  animPinentryInput.value = "";
                } else if (elapsed < 1400) {
                  animPinentryInput.value = "••••";
                } else if (elapsed < 2200) {
                  animPinentryInput.value = "••••••••";
                } else {
                  animPinentryInput.value = "••••••••••";
                }
              }
              updateAnimStatus(langText.statusPinentry);
            } else {
              if (animPinentry) animPinentry.classList.remove('show');
              animPacketHeader.textContent = pageLang === 'tr' ? "🔑 GPG Önbellek Köprüsü" : "🔑 GPG Agent Cache hit";
              animPacketBody.textContent = langText.keyringCacheHit;
              updateAnimStatus(langText.statusCacheHit);
            }
          } else if (cycleTime >= 8500 && cycleTime < 11500) {
            if (animPinentry) animPinentry.classList.remove('show');
            
            animPacket.classList.add('encrypted');
            animPacketHeader.classList.add('encrypted-title');
            animPacketHeader.textContent = pageLang === 'tr' ? "🔒 Şifreli İstek (GPG)" : "🔒 Encrypted Request (GPG)";
            animPacketBody.classList.add('encrypted-text');
            animPacketBody.textContent = langText.encryptedRequest;
            
            const progress = (cycleTime - 8500) / 3000;
            leftPercent = progress * 73;
            
            animNodeClient.classList.remove('active');
            animWireLine.classList.add('active');
            updateAnimStatus(langText.statusRequestTransit);
          } else if (cycleTime >= 11500 && cycleTime < 13500) {
            leftPercent = 73;
            animWireLine.classList.remove('active');
            animNodeServer.classList.add('active');
            updateAnimStatus(langText.statusServerDecrypting);
            
            if (cycleTime < 12500) {
              animPacketBody.textContent = "...";
            } else {
              animPacket.classList.remove('encrypted');
              animPacketHeader.classList.remove('encrypted-title');
              animPacketHeader.textContent = pageLang === 'tr' ? "📄 İstek Alındı (Düz Metin)" : "📄 Request Decrypted (Plain)";
              animPacketBody.classList.remove('encrypted-text');
              animPacketBody.textContent = langText.plaintextRequest;
            }
          } else if (cycleTime >= 13500 && cycleTime < 16000) {
            leftPercent = 73;
            animPacket.classList.add('encrypted');
            animPacketHeader.classList.add('encrypted-title');
            animPacketHeader.textContent = pageLang === 'tr' ? "🔒 Yanıt Şifreleniyor" : "🔒 Encrypting Response";
            animPacketBody.classList.add('encrypted-text');
            
            if (cycleTime < 14800) {
              animPacketBody.textContent = "...";
            } else {
              animPacketBody.textContent = langText.encryptedResponse;
            }
            updateAnimStatus(langText.statusServerEncrypting);
          } else if (cycleTime >= 16000 && cycleTime < 18500) {
            animNodeServer.classList.remove('active');
            animWireLine.classList.add('active');
            
            animPacketHeader.textContent = pageLang === 'tr' ? "🔒 Şifreli Yanıt (GPG)" : "🔒 Encrypted Response (GPG)";
            animPacketBody.textContent = langText.encryptedResponse;
            
            const progress = (cycleTime - 16000) / 2500;
            leftPercent = 73 - (progress * 73);
            
            updateAnimStatus(langText.statusResponseTransit);
          } else if (cycleTime >= 18500) {
            leftPercent = 0;
            animWireLine.classList.remove('active');
            animNodeClient.classList.add('active');
            updateAnimStatus(langText.statusClientDecrypting);
            
            if (cycleTime < 19500) {
              animPacketBody.textContent = "...";
            } else {
              animPacket.classList.remove('encrypted');
              animPacketHeader.classList.remove('encrypted-title');
              animPacketHeader.textContent = pageLang === 'tr' ? "📄 Yanıt Çözüldü (Düz Metin)" : "📄 Response Decrypted (Plain)";
              animPacketBody.classList.remove('encrypted-text');
              animPacketBody.textContent = langText.plaintextResponse;
            }
          }
        } else {
          time = (time + 50) % 18000;

          if (time < 3000) {
            animPacket.classList.remove('encrypted');
            animPacketHeader.classList.remove('encrypted-title');
            animPacketHeader.textContent = pageLang === 'tr' ? "📄 Challenge İsteği" : "📄 Challenge Request";
            animPacketBody.classList.remove('encrypted-text');
            animPacketBody.textContent = langText.plaintextChallengeReq;

            const progress = time / 3000;
            leftPercent = progress * 73;

            animNodeClient.classList.add('active');
            animNodeClient.classList.remove('authenticated');
            animNodeServer.classList.remove('active');
            animWireLine.classList.add('active');
            if (animWkdNode) animWkdNode.classList.remove('active');
            if (animPinentry) animPinentry.classList.remove('show');
            
            updateAnimStatus(langText.statusChallengeReq);
          } else if (time >= 3000 && time < 5500) {
            animPacket.classList.remove('encrypted');
            animPacketHeader.classList.remove('encrypted-title');
            animPacketHeader.textContent = "📄 Challenge Token";
            animPacketBody.classList.remove('encrypted-text');
            animPacketBody.textContent = langText.challengeResp;

            const progress = (time - 3000) / 2500;
            leftPercent = 73 - (progress * 73);

            animNodeClient.classList.remove('active');
            animNodeServer.classList.add('active');
            animWireLine.classList.add('active');
            
            updateAnimStatus(langText.statusChallengeResp);
          } else if (time >= 5500 && time < 9000) {
            leftPercent = 0;
            animNodeServer.classList.remove('active');
            animNodeClient.classList.add('active');
            animWireLine.classList.remove('active');
            if (animPinentry) animPinentry.classList.add('show');

            animPacketHeader.textContent = pageLang === 'tr' ? "✍️ Yerel GPG İmzalama" : "✍️ Local GPG Signing";
            animPacketBody.textContent = langText.loginSign;

            const elapsed = time - 5500;
            if (animPinentryInput) {
              if (elapsed < 800) {
                animPinentryInput.value = "";
              } else if (elapsed < 1600) {
                animPinentryInput.value = "••••";
              } else if (elapsed < 2400) {
                animPinentryInput.value = "••••••••";
              } else {
                animPinentryInput.value = "••••••••••";
              }
            }

            updateAnimStatus(langText.statusLoginSign);
          } else if (time >= 9000 && time < 12000) {
            if (animPinentry) animPinentry.classList.remove('show');

            animPacket.classList.remove('encrypted');
            animPacketHeader.classList.remove('encrypted-title');
            animPacketHeader.textContent = pageLang === 'tr' ? "📄 Giriş İsteği (İmzalı)" : "📄 Login Request (Signed)";
            animPacketBody.textContent = langText.loginPost;

            const progress = (time - 9000) / 3000;
            leftPercent = progress * 73;

            animNodeClient.classList.remove('active');
            animWireLine.classList.add('active');

            updateAnimStatus(langText.statusLoginPost);
          } else if (time >= 12000 && time < 15000) {
            leftPercent = 73;
            animWireLine.classList.remove('active');
            animNodeServer.classList.add('active');

            animPacketHeader.textContent = pageLang === 'tr' ? "🔑 İmza Doğrulama" : "🔑 Verifying Signature";
            animPacketBody.textContent = langText.loginVerify;

            if (animWkdNode) {
              animWkdNode.classList.add('active');
            }

            updateAnimStatus(langText.statusLoginVerify);
          } else if (time >= 15000) {
            if (animWkdNode) animWkdNode.classList.remove('active');

            animPacketHeader.textContent = pageLang === 'tr' ? "📄 Oturum Jetonu" : "📄 Session Token";
            animPacketBody.textContent = langText.loginSuccess;

            const progress = (time - 15000) / 3000;
            leftPercent = 73 - (progress * 73);

            animNodeServer.classList.remove('active');
            animWireLine.classList.add('active');

            if (time > 16500) {
              animNodeClient.classList.add('authenticated');
            } else {
              animNodeClient.classList.add('active');
            }

            updateAnimStatus(langText.statusLoginSuccess);
          }
        }

        animPacket.style.left = `${leftPercent}%`;
      }, 50);
    }

    function stopLiveFlow() {
      if (liveFlowInterval) {
        clearInterval(liveFlowInterval);
        liveFlowInterval = null;
      }
    }
  }

  // 6. Interactive GPG Authentication Simulator
  let hasExtension = false;
  let hasNative = false;
  let pinentryInterval = null;

  const btnSimAction = document.getElementById('btn-sim-action');
  const btnInstallExt = document.getElementById('btn-install-ext');
  const btnInstallNative = document.getElementById('btn-install-native');
  const simAlertExtension = document.getElementById('sim-alert-extension');
  const simAlertNative = document.getElementById('sim-alert-native');
  const simPinentryBox = document.getElementById('sim-pinentry-box');
  const simPinentryInputField = document.getElementById('sim-pinentry-input-field');
  const btnSimPinCancel = document.getElementById('btn-sim-pin-cancel');
  const btnSimPinOk = document.getElementById('btn-sim-pin-ok');
  const simSuccessBox = document.getElementById('sim-success-box');
  const btnSimReset = document.getElementById('btn-sim-reset');
  const simToolbarExt = document.getElementById('sim-toolbar-ext');
  const simCardTitle = document.getElementById('sim-card-title');
  const simCardDescription = document.getElementById('sim-card-description');

  const mockCursor = document.getElementById('mock-cursor');
  const btnStoreAddSim = document.getElementById('btn-store-add-sim');
  const simTerminalText = document.getElementById('sim-terminal-text');

  function clickCursor() {
    if (mockCursor) {
      mockCursor.classList.add('click');
      setTimeout(() => mockCursor.classList.remove('click'), 200);
    }
  }

  function setCursor(left, top) {
    if (mockCursor) {
      mockCursor.style.left = left;
      mockCursor.style.top = top;
    }
  }

  function resetSimState() {
    if (pinentryInterval) clearInterval(pinentryInterval);
    hasExtension = false;
    hasNative = false;
    if (simTerminalText) simTerminalText.innerHTML = "";
    if (btnStoreAddSim) {
      btnStoreAddSim.textContent = pageLang === 'tr' ? "Chrome'a Ekle" : "Add to Chrome";
      btnStoreAddSim.classList.remove('added');
      btnStoreAddSim.style.background = "#1a73e8";
    }
    const btnUbuntuInstall = document.getElementById('btn-ubuntu-install-sim');
    const ubuntuProgressTrack = document.getElementById('ubuntu-progress-track');
    const ubuntuProgressBar = document.getElementById('ubuntu-progress-bar');
    if (btnUbuntuInstall) {
      btnUbuntuInstall.textContent = pageLang === 'tr' ? "Yükle" : "Install";
      btnUbuntuInstall.classList.remove('installing');
      btnUbuntuInstall.style.background = "#e95420";
    }
    if (ubuntuProgressTrack) ubuntuProgressTrack.style.display = "none";
    if (ubuntuProgressBar) ubuntuProgressBar.style.width = "0%";

    if (simAlertExtension) simAlertExtension.classList.remove('show');
    if (simAlertNative) simAlertNative.classList.remove('show');
    if (simPinentryBox) simPinentryBox.classList.remove('show');
    if (simSuccessBox) simSuccessBox.classList.remove('show');
    if (simPinentryInputField) simPinentryInputField.value = "";
    
    const mockDesktop = document.getElementById('mock-desktop');
    if (mockDesktop) {
      mockDesktop.classList.remove('has-store');
      mockDesktop.classList.remove('has-native');
    }
    if (simCardTitle) {
      simCardTitle.textContent = pageLang === 'tr' ? "Oturum Aç" : "Sign In";
    }
    if (simCardDescription) {
      simCardDescription.textContent = pageLang === 'tr'
        ? "Sıfır-Güven geliştirici erişim geçidi."
        : "Zero-Trust developer access gateway.";
    }
    if (simToolbarExt) {
      simToolbarExt.classList.remove('active', 'installed', 'highlight-zoom');
      const indicator = simToolbarExt.querySelector('.status-indicator');
      if (indicator) indicator.className = 'status-indicator red';
    }
    setCursor('20%', '20%');
  }

  function writeTerminalLineImmediate(text) {
    if (simTerminalText) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.textContent = text;
      simTerminalText.appendChild(line);
      simTerminalText.scrollTop = simTerminalText.scrollHeight;
    }
  }

  const simSteps = [
    { time: 0, action: () => resetSimState() },
    // 1. Move cursor to GPG login button
    { time: 1000, action: () => setCursor('50.0%', '82.4%') },
    // 2. Click GPG Login -> Warning overlay (Missing Extension)
    { time: 2000, action: () => { clickCursor(); if (simAlertExtension) simAlertExtension.classList.add('show'); } },
    // 3. Move cursor to Install Extension button
    { time: 3500, action: () => setCursor('50.0%', '78.8%') },
    // 4. Click Install Extension -> Show Web Store Window
    { time: 4500, action: () => { clickCursor(); if (simAlertExtension) simAlertExtension.classList.remove('show'); const md = document.getElementById('mock-desktop'); if (md) md.classList.add('has-store'); } },
    // 5. Move to Add to Chrome inside Web Store
    { time: 5500, action: () => setCursor('89.1%', '21.1%') },
    // 6. Click Add to Chrome -> Installing state
    { time: 6500, action: () => { clickCursor(); if (btnStoreAddSim) { btnStoreAddSim.textContent = pageLang === 'tr' ? "Ekleniyor..." : "Adding to Chrome..."; btnStoreAddSim.style.background = "#5f6368"; } } },
    // 7. Added to Chrome success state
    { time: 8000, action: () => { if (btnStoreAddSim) { btnStoreAddSim.textContent = pageLang === 'tr' ? "Chrome'a Eklendi" : "Added to Chrome"; btnStoreAddSim.classList.add('added'); } hasExtension = true; if (simToolbarExt) { simToolbarExt.classList.add('active', 'installed', 'highlight-zoom'); const ind = simToolbarExt.querySelector('.status-indicator'); if (ind) ind.className = 'status-indicator red'; } } },
    // 8. Close Web Store -> Show Native Host warning popup, remove zoom highlight on extension icon
    { time: 9500, action: () => { const md = document.getElementById('mock-desktop'); if (md) md.classList.remove('has-store'); if (simAlertNative) simAlertNative.classList.add('show'); if (simToolbarExt) { simToolbarExt.classList.remove('highlight-zoom'); } } },
    // 9. Move cursor to Install Native Host button
    { time: 10500, action: () => setCursor('50.0%', '78.8%') },
    // 10. Click Install Native Host -> Open Terminal & Software Center
    { time: 11500, action: () => { clickCursor(); if (simAlertNative) simAlertNative.classList.remove('show'); const md = document.getElementById('mock-desktop'); if (md) md.classList.add('has-native'); } },
    // 11. Move cursor to Software Center Install button
    { time: 12500, action: () => setCursor('70.3%', '34.8%') },
    // 12. Click Install -> Installing state in store
    { time: 13500, action: () => { clickCursor(); const btnUbuntu = document.getElementById('btn-ubuntu-install-sim'); const track = document.getElementById('ubuntu-progress-track'); if (btnUbuntu) { btnUbuntu.textContent = pageLang === 'tr' ? "Yükleniyor..." : "Installing..."; btnUbuntu.classList.add('installing'); btnUbuntu.style.background = "#5e2750"; } if (track) track.style.display = "block"; } },
    // APT commands and Software Center progress updates in parallel
    { time: 12000, action: () => writeTerminalLineImmediate("user@aegis:~$ sudo add-apt-repository ppa:aegis-http/ppa") },
    { time: 12800, action: () => writeTerminalLineImmediate("[sudo] password for user: ••••") },
    { time: 13500, action: () => { writeTerminalLineImmediate("Repository added successfully."); const bar = document.getElementById('ubuntu-progress-bar'); if (bar) bar.style.width = "20%"; } },
    { time: 14200, action: () => writeTerminalLineImmediate("user@aegis:~$ sudo apt update") },
    { time: 15200, action: () => { writeTerminalLineImmediate("Reading package lists... Done"); const bar = document.getElementById('ubuntu-progress-bar'); if (bar) bar.style.width = "40%"; } },
    { time: 16000, action: () => writeTerminalLineImmediate("user@aegis:~$ sudo apt install aegis-host") },
    { time: 16800, action: () => { writeTerminalLineImmediate("Reading package lists... Done"); const bar = document.getElementById('ubuntu-progress-bar'); if (bar) bar.style.width = "60%"; } },
    { time: 17500, action: () => { writeTerminalLineImmediate("Building dependency tree... Done"); const bar = document.getElementById('ubuntu-progress-bar'); if (bar) bar.style.width = "80%"; } },
    { time: 18500, action: () => writeTerminalLineImmediate("Installing aegis-host (1.0.4)... Done.") },
    { time: 19500, action: () => { writeTerminalLineImmediate("user@aegis:~$ "); const bar = document.getElementById('ubuntu-progress-bar'); const btnUbuntu = document.getElementById('btn-ubuntu-install-sim'); if (bar) bar.style.width = "100%"; if (btnUbuntu) { btnUbuntu.textContent = pageLang === 'tr' ? "Kaldır" : "Remove"; btnUbuntu.style.background = "#333"; } } },
    // 13. Close native windows -> Toolbar green, login card ready
    { time: 21500, action: () => { const md = document.getElementById('mock-desktop'); if (md) md.classList.remove('has-native'); hasNative = true; if (simToolbarExt) { const ind = simToolbarExt.querySelector('.status-indicator'); if (ind) ind.className = 'status-indicator green'; } if (simCardTitle) simCardTitle.textContent = pageLang === 'tr' ? "Oturum Aç" : "Sign In"; } },
    // 14. Move cursor to GPG Sign In button
    { time: 22500, action: () => setCursor('50.0%', '82.4%') },
    // 15. Click Sign In -> Spawns Pinentry box
    { time: 23500, action: () => { clickCursor(); if (simPinentryBox) simPinentryBox.classList.add('show'); if (simPinentryInputField) simPinentryInputField.value = ""; } },
    // Pinentry typing simulator
    { time: 24000, action: () => { if (simPinentryInputField) simPinentryInputField.value = "••"; } },
    { time: 24300, action: () => { if (simPinentryInputField) simPinentryInputField.value = "••••"; } },
    { time: 24600, action: () => { if (simPinentryInputField) simPinentryInputField.value = "••••••"; } },
    { time: 24900, action: () => { if (simPinentryInputField) simPinentryInputField.value = "••••••••"; } },
    { time: 25200, action: () => { if (simPinentryInputField) simPinentryInputField.value = "••••••••••"; } },
    // 16. Move to OK button
    { time: 26000, action: () => setCursor('62.4%', '67.0%') },
    // 17. Click OK -> Success Screen
    { time: 27000, action: () => { clickCursor(); if (simPinentryBox) simPinentryBox.classList.remove('show'); if (simSuccessBox) simSuccessBox.classList.add('show'); } },
    // 18. Loop end
    { time: 33000, action: () => {} }
  ];

  let simTime = 0;
  const totalDuration = 33000;
  let isPlaying = true;
  let tickerInterval = null;
  let lastExecutedStep = -1;

  function runTimelineTo(targetTime) {
    resetSimState();
    simSteps.forEach((step) => {
      if (step.time <= targetTime) {
        step.action();
      }
    });
  }

  function updateVideoControls() {
    const progressBar = document.getElementById('ctrl-progress-bar');
    const timerText = document.getElementById('ctrl-timer');
    if (progressBar) {
      const pct = (simTime / totalDuration) * 100;
      progressBar.style.width = `${pct}%`;
    }
    if (timerText) {
      const currentSec = Math.floor(simTime / 1000);
      const totalSec = Math.floor(totalDuration / 1000);
      const formatTime = (s) => `00:${s.toString().padStart(2, '0')}`;
      timerText.textContent = `${formatTime(currentSec)} / ${formatTime(totalSec)}`;
    }
  }

  function tick() {
    if (!isPlaying) return;

    simSteps.forEach((step) => {
      if (step.time > lastExecutedStep && step.time <= simTime) {
        step.action();
        lastExecutedStep = step.time;
      }
    });

    updateVideoControls();

    simTime += 100;
    if (simTime > totalDuration) {
      simTime = 0;
      lastExecutedStep = -1;
      resetSimState();
    }
  }

  const progressContainer = document.getElementById('ctrl-progress-container');
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const pct = Math.max(0, Math.min(1, clickX / width));
      
      simTime = Math.floor(pct * totalDuration);
      lastExecutedStep = -1;
      
      runTimelineTo(simTime);
      updateVideoControls();
    });
  }

  const btnPlayPause = document.getElementById('ctrl-play-pause');
  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      isPlaying = !isPlaying;
      btnPlayPause.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    });
  }

  const btnRestart = document.getElementById('ctrl-restart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      simTime = 0;
      lastExecutedStep = -1;
      resetSimState();
      updateVideoControls();
      isPlaying = true;
      if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
    });
  }

  if (btnSimReset) {
    btnSimReset.addEventListener('click', () => {
      simTime = 0;
      lastExecutedStep = -1;
      resetSimState();
      updateVideoControls();
      isPlaying = true;
      if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
    });
  }

  function startSimLoop() {
    resetSimState();
    simTime = 0;
    lastExecutedStep = -1;
    isPlaying = true;
    if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
    
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(tick, 100);
  }

  // Intersection Observer to run animations only when in viewport (or hash targeted)
  let simObserved = false;
  let flowObserved = false;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'live-flow') {
        if (entry.isIntersecting) {
          startLiveFlow();
          flowObserved = true;
        } else {
          stopLiveFlow();
        }
      } else if (entry.target.id === 'gpg-simulator') {
        if (entry.isIntersecting) {
          if (!simObserved) {
            startSimLoop();
            simObserved = true;
          } else {
            // Resume timeline ticker interval if visible
            if (tickerInterval) clearInterval(tickerInterval);
            tickerInterval = setInterval(tick, 100);
          }
        } else {
          // Pause timeline ticker interval to save CPU when out of viewport
          if (tickerInterval) {
            clearInterval(tickerInterval);
            tickerInterval = null;
          }
        }
      }
    });
  }, observerOptions);

  const flowSection = document.getElementById('live-flow');
  if (flowSection) observer.observe(flowSection);

  const simSection = document.getElementById('gpg-simulator');
  if (simSection) observer.observe(simSection);

  // Check URL hashes for direct deep linking
  function checkHashTarget() {
    const hash = window.location.hash;
    if (hash === '#live-flow') {
      startLiveFlow();
      flowObserved = true;
    } else if (hash === '#gpg-simulator') {
      startSimLoop();
      simObserved = true;
    }
  }

  window.addEventListener('hashchange', checkHashTarget);
  checkHashTarget();
});
