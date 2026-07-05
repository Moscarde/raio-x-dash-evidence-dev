/** @type {import("tailwindcss").Config} */
// Tipografia da identidade visual Radar SUS Municipal (ver reference/Radar SUS.dc.html):
// IBM Plex Sans para corpo/UI, IBM Plex Mono para rótulos técnicos.
module.exports = {
	theme: {
		extend: {
			fontFamily: {
				sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
				mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
			}
		}
	}
};
