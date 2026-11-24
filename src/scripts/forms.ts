// One behaviour for every `form[data-reception]` (quote and careers), so both forms feel like one system.
// While data-reception="off" nothing leaves the browser: no request, no upload. The person gets an
// honest "complete, not sent" panel. Never a simulated success (D-031, D-045).
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const mb = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });

function errorFor(el: Control) {
  const ids = (el.getAttribute('aria-describedby') ?? '').split(/\s+/);
  return ids.map((id) => document.getElementById(id)).find((n) => n?.classList.contains('error')) ?? null;
}

/** '' when valid; otherwise the reason, whose message lives on the field's .error element. */
function validate(el: Control): '' | 'msg' | 'msgType' | 'msgSize' {
  if (el instanceof HTMLInputElement && el.type === 'file') {
    const f = el.files?.[0];
    if (!f) return el.required ? 'msg' : '';
    if (!(f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) return 'msgType';
    return f.size > Number(el.dataset.maxBytes ?? Infinity) ? 'msgSize' : '';
  }
  if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.checked ? '' : 'msg';
  return el.checkValidity() && el.value.trim() !== '' ? '' : 'msg';
}

function check(el: Control) {
  const reason = validate(el), err = errorFor(el);
  el.toggleAttribute('aria-invalid', !!reason);
  if (err) err.textContent = reason ? err.dataset[reason] ?? '' : '';
  return !reason;
}

function setup(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('.status')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const label = submit.textContent ?? '';
  const controls = [...form.querySelectorAll<Control>('[required], input[type="file"]')];

  // the file zone names the chosen file
  form.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((input) => {
    const name = input.closest('.file')?.querySelector('.file-name');
    const empty = name?.textContent ?? '';
    input.addEventListener('change', () => {
      const f = input.files?.[0];
      if (name) name.textContent = f ? `${f.name} · ${f.size < 1048576 ? `${Math.max(1, Math.round(f.size / 1024))} KB` : `${mb.format(f.size / 1048576)} MB`}` : empty;
      check(input);
    });
  });

  // once flagged, a field clears its error as soon as it becomes valid (input, not blur: no layout
  // shift between mousedown and mouseup on the next control)
  controls.forEach((el) => {
    const ev = el instanceof HTMLSelectElement || (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'file')) ? 'change' : 'input';
    el.addEventListener(ev, () => el.hasAttribute('aria-invalid') && check(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.replaceChildren(); status.dataset.state = '';
    const invalid = controls.filter((el) => !check(el));
    if (invalid.length) { invalid[0].focus(); return; }

    if (form.dataset.reception !== 'on') {
      status.dataset.state = 'pending';
      status.append(
        Object.assign(document.createElement('p'), { className: 'status-title', textContent: form.dataset.pendingTitle ?? '' }),
        Object.assign(document.createElement('p'), { textContent: form.dataset.pendingBody ?? '' }),
      );
      status.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Enviando…';
    try {
      const data = new FormData(form);
      const hasFile = [...data.values()].some((v) => v instanceof File && v.size);
      const res = await fetch('/', hasFile
        ? { method: 'POST', body: data } // multipart: the browser sets the boundary
        : { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data as unknown as Record<string, string>).toString() });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.dataset.state = 'ok';
      status.textContent = form.dataset.okText ?? '';
    } catch (err) {
      status.dataset.state = 'error';
      status.textContent = `No se pudo enviar: ${/^\d+$/.test((err as Error).message) ? `el servidor respondió con el error ${(err as Error).message}` : 'no hay conexión con el servidor'}. Sus datos siguen en el formulario.`;
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-reception]').forEach(setup);
}
