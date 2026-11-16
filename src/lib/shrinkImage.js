// A photo the visitor attaches to the quote form, made smaller in the
// browser before it's sent: no longer than `max` px on its long side, as a
// JPEG. A phone photo of 3-5 MB comes down to a few hundred KB, which keeps
// each upload under the host's 4.5 MB limit a request and quick on a phone's
// connection. PDFs (and anything else) aren't touched. Null when the browser
// can't open the image (a HEIC photo in a browser other than Safari): the
// form then sends it as it is if it's a JPEG or PNG small enough, or says it
// can't.
export async function shrinkImage(file, max = 2000, quality = 0.82) {
  if (!file.type.startsWith("image/")) return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) return null;
  const name = `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`;
  return new File([blob], name, { type: "image/jpeg" });
}
