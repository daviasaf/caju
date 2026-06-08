import sharp from 'sharp'

let cachedLogo: Buffer | null = null

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffc928"/>
  <rect x="42" y="42" width="1116" height="546" rx="34" fill="#fffaf3"/>
  <rect x="92" y="112" width="390" height="390" rx="54" fill="#ffc928"/>
  <path d="M 348 228 C 324 202 292 189 255 189 C 183 189 138 238 138 307 C 138 376 183 425 255 425 C 292 425 324 412 348 386" fill="none" stroke="#172026" stroke-width="58" stroke-linecap="round"/>
  <text x="560" y="290" fill="#172026" font-family="Arial, Helvetica, sans-serif" font-size="118" font-weight="900">CAJU</text>
  <text x="564" y="356" fill="#172026" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800">Vista Quissama</text>
  <text x="566" y="422" fill="#5d666e" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600">Produtos autorais inspirados em Quissama</text>
</svg>
`

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  cachedLogo ||= await sharp(Buffer.from(logoSvg)).png().toBuffer()

  return cachedLogo
})
