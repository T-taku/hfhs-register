/** @type {import('next-pwa')} */
const withPWA = require('next-pwa')({
  dest: 'public'
})

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  reactStrictMode: true,
  register: true,
  skipWaiting: true,
});