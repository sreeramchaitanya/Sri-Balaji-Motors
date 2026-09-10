/* Owner configuration: replace empty strings ONLY with confirmed business details.
 * Phone/WhatsApp: international format, e.g. +91 followed by the actual 10-digit number.
 * mapsUrl: copy the workshop's verified Google Maps place URL.
 * mapEmbedUrl: Google Maps > Share > Embed a map > copy the iframe's src value.
 * No credentials or API key is required. Never add secrets to this public repository.
 * All contact controls and displayed details update from this single object.
 */
window.GARAGE_CONFIG = Object.freeze({
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  hours: '',
  mapsUrl: '',
  mapEmbedUrl: ''
});
