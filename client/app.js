/* global window, document, fetch */
const out = document.querySelector('[data-testid="output"]');
const statusEl = document.querySelector('[data-testid="status"]');

const API_BASE = 'http://localhost:3000';

// Single source of truth for calling the API on :3000
async function call(endpoint, params) {
  const url = new URL(endpoint, API_BASE);

  // Build querystring for GET endpoints your API expects
  if (params && typeof params === 'object') {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.href, { method: 'GET' });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    out.textContent = JSON.stringify(json, null, 2);
  } catch {
    out.textContent = text;
  }
  statusEl.textContent = res.status + ' ' + res.statusText;
  statusEl.className = res.ok ? 'ok' : 'err';
}

function hook(id, handler) {
  document.querySelector(`[data-testid="${id}"]`).addEventListener('click', handler);
}

// Quick endpoints
hook('btn-hello', () => call('/hello'));
hook('btn-cpr', () => call('/cpr'));
hook('btn-name-gender', () => call('/name-gender'));
hook('btn-name-gender-dob', () => call('/name-gender-dob'));
hook('btn-cpr-name-gender', () => call('/cpr-name-gender'));
hook('btn-cpr-name-gender-dob', () => call('/cpr-name-gender-dob'));
hook('btn-address', () => call('/address'));
hook('btn-phone', () => call('/phone'));

// /person bulk
hook('btn-person-bulk', () => {
  const n = document.querySelector('[data-testid="input-n"]').value;
  call('/person', n ? { n } : undefined); // -> GET /person?n=#
});

// validate CPR (API expects GET with query params)
hook('btn-validate-cpr', () => {
  const cpr = document.querySelector('[data-testid="input-cpr"]').value.trim();
  const gender = document.querySelector('[data-testid="select-gender"]').value;
  call('/validate-cpr', { cpr, gender });  // -> GET /validate-cpr?cpr=...&gender=...
});

// validate phone (GET with ?phone=)
hook('btn-validate-phone', () => {
  const phone = document.querySelector('[data-testid="input-phone"]').value.trim();
  call('/validate-phone', { phone });      // -> GET /validate-phone?phone=...
});
