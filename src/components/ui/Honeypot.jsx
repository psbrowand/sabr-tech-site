// Hidden field that people never see or fill but form-filling bots do. The
// API (api/_lib/abuse.mjs) silently drops submissions that include it.
export const HONEYPOT_FIELD = 'company';

export function honeypotValue(form) {
  return form?.elements?.namedItem(HONEYPOT_FIELD)?.value || '';
}

export default function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Company
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
