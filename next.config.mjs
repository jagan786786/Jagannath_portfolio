/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pure static site: Netlify serves the `out/` folder, no server needed.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
}

export default nextConfig
