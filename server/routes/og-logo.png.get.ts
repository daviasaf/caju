import sharp from 'sharp'

let cachedLogo: Buffer | null = null

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fffaf3"/>
  <rect x="0" y="0" width="1200" height="630" fill="#fffaf3"/>
  <g transform="translate(0 4)">
    <rect x="500" y="128" width="200" height="200" rx="42" fill="#ffc928"/>
    <text x="600" y="258" fill="#172026" font-family="Arial, Helvetica, sans-serif" font-size="112" font-weight="900" text-anchor="middle">C</text>
  </g>
  <text x="600" y="425" fill="#172026" font-family="Arial, Helvetica, sans-serif" font-size="86" font-weight="900" text-anchor="middle">CAJU</text>
  <text x="600" y="482" fill="#5d666e" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" text-anchor="middle">Vista Quissama</text>
  <rect x="40" y="40" width="1120" height="550" rx="34" fill="none" stroke="#e2d9c9" stroke-width="2"/>
</svg>
`

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  cachedLogo ||= await sharp(Buffer.from(logoSvg)).png().toBuffer()

  return cachedLogo
})
