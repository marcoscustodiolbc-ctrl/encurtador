// ============================================================
//  app.js — Lógica principal do encurtador
// ============================================================

// Mensagem padrão do WhatsApp
const WA_MESSAGE = "Olá! Segue o link para acessar sua assinatura digital:\n\n";

function generateSlug(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
  for (let i = 0; i < len; i++) slug += chars[Math.floor(Math.random() * chars.length)];
  return slug;
}

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch { return false; }
}

async function slugExists(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/links?slug=eq.${slug}&select=slug`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const data = await res.json();
  return data && data.length > 0;
}

async function uniqueSlug() {
  for (let i = 0; i < 5; i++) {
    const slug = generateSlug(6);
    if (!(await slugExists(slug))) return slug;
  }
  return generateSlug(8);
}

async function insertLink(slug, originalUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/links`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({ slug, original_url: originalUrl, clicks: 0 })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Erro ao salvar no banco');
  }
  return await res.json();
}

// Monta URL de redirecionamento
function buildShortUrl(slug) {
  return `${BASE_URL}/r.html?s=${slug}`;
}

// Monta link do WhatsApp
function buildWhatsAppUrl(shortUrl) {
  const text = encodeURIComponent(`${WA_MESSAGE}${shortUrl}`);
  return `https://wa.me/?text=${text}`;
}

// === QR CODE ===
function generateQR(url) {
  const canvas = document.getElementById('qrCanvas');
  QRCode.toCanvas(canvas, url, {
    width: 200,
    margin: 1,
    color: { dark: '#0d7c66', light: '#f0faf7' }
  }, function(err) {
    if (err) {
      // fallback: preto e branco
      QRCode.toCanvas(canvas, url, { width: 200, margin: 1 });
    }
  });
}

function downloadQR() {
  const canvas = document.getElementById('qrCanvas');
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qrcode-assinatura.png';
  a.click();
}

// === ENCURTAR ===
async function shortenUrl() {
  const input   = document.getElementById('longUrl');
  const btn     = document.getElementById('shortenBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');
  const errorBox= document.getElementById('errorBox');

  const url = input.value.trim();

  errorBox.classList.add('hidden');

  if (!url) { showError('Cole uma URL antes de gerar o link.'); return; }
  if (!isValidUrl(url)) { showError('URL inválida. Inclua https:// no início.'); return; }

  btn.disabled = true;
  btnText.textContent = 'Gerando...';
  spinner.classList.remove('hidden');

  try {
    const slug     = await uniqueSlug();
    await insertLink(slug, url);

    const shortUrl = buildShortUrl(slug);

    // Preenche card de resultado
    document.getElementById('shortLinkText').textContent = shortUrl;
    document.getElementById('whatsappBtn').href = buildWhatsAppUrl(shortUrl);

    // Esconde form, mostra resultado
    document.getElementById('mainCard').classList.add('hidden');
    document.getElementById('resultCard').classList.remove('hidden');

    // Salva para uso na cópia
    document.getElementById('shortLinkText').dataset.url = shortUrl;

    // Gera QR Code
    generateQR(shortUrl);

    input.value = '';
    setTimeout(loadLinks, 800);

  } catch (err) {
    showError(`Erro: ${err.message}. Verifique o arquivo config.js e as permissões do Supabase.`);
  } finally {
    btn.disabled = false;
    btnText.textContent = 'GERAR LINK';
    spinner.classList.add('hidden');
  }
}

// === COPIAR ===
async function copyLink() {
  const url = document.getElementById('shortLinkText').dataset.url
           || document.getElementById('shortLinkText').textContent;
  const btn = document.getElementById('copyBtn');
  try {
    await navigator.clipboard.writeText(url);
    btn.classList.add('copied');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    }, 2500);
  } catch { alert('Não foi possível copiar. Selecione o link manualmente.'); }
}

// === VOLTAR ===
function resetForm() {
  document.getElementById('resultCard').classList.add('hidden');
  document.getElementById('mainCard').classList.remove('hidden');
  document.getElementById('errorBox').classList.add('hidden');
  document.getElementById('longUrl').focus();
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.textContent = msg;
  box.classList.remove('hidden');
}

// === DASHBOARD ===
async function loadLinks() {
  const container = document.getElementById('linksTable');
  container.innerHTML = `<div class="table-placeholder">Carregando...</div>`;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/links?select=*&order=created_at.desc&limit=30`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const links = await res.json();

    if (!links || links.length === 0) {
      container.innerHTML = `<div class="table-placeholder">Nenhum link criado ainda.</div>`;
      return;
    }

    container.innerHTML = links.map(link => {
      const shortUrl = buildShortUrl(link.slug);
      const waUrl    = buildWhatsAppUrl(shortUrl);
      const date     = new Date(link.created_at).toLocaleDateString('pt-BR');
      const display  = shortUrl.replace('https://', '');
      return `
        <div class="link-row">
          <div class="link-row-info">
            <div class="link-row-short">${display}</div>
            <div class="link-row-original">${link.original_url}</div>
          </div>
          <div class="link-row-meta">
            <span class="clicks-badge">${link.clicks || 0} cliques</span>
            <span class="row-date">${date}</span>
          </div>
          <div class="row-actions">
            <a href="${waUrl}" target="_blank" class="row-wa-btn" title="Compartilhar no WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
            </a>
            <button class="row-del-btn" onclick="deleteLink('${link.id}', this)" title="Remover">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14H6L5 6"></path>
              </svg>
            </button>
          </div>
        </div>`;
    }).join('');

  } catch (err) {
    container.innerHTML = `<div class="table-placeholder" style="color:#c0392b">Erro ao carregar. Verifique o config.js.</div>`;
  }
}

async function deleteLink(id, btn) {
  if (!confirm('Remover este link?')) return;
  btn.disabled = true;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/links?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    loadLinks();
  } catch (err) {
    alert('Erro ao deletar: ' + err.message);
    btn.disabled = false;
  }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('longUrl').addEventListener('keypress', e => {
    if (e.key === 'Enter') shortenUrl();
  });
  loadLinks();
});
