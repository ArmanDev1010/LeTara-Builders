// US phone numbers in the forms, shown the American way as they're typed:
// 7477777777 becomes (747) 777-7777. Pasted or autofilled numbers with a +1
// or 1 country code lose it (no US area code starts with 1), and anything
// past ten digits is dropped.
export function formatPhone(value) {
  const digits = String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^1+/, "")
    .slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// A complete number as formatPhone shows it, with a real area code.
export const PHONE_PATTERN = /^\([2-9]\d{2}\) \d{3}-\d{4}$/;

// Reformats a phone <input> in place as it's typed, keeping the cursor after
// the same digit it was after, so editing the middle of the number works.
export function formatPhoneInput(input) {
  const { value, selectionStart } = input;
  const formatted = formatPhone(value);
  if (formatted === value) return;
  // digits before the cursor, less a country code that's being dropped
  const before = value.slice(0, selectionStart ?? value.length).replace(/\D/g, "");
  const dropped = value.replace(/\D/g, "").match(/^1*/)[0].length;
  let digitsBefore = Math.max(0, before.length - dropped);
  input.value = formatted;
  if (document.activeElement !== input) return;
  let cursor = 0;
  while (cursor < formatted.length && digitsBefore > 0) {
    if (/\d/.test(formatted[cursor])) digitsBefore--;
    cursor++;
  }
  input.setSelectionRange(cursor, cursor);
}
