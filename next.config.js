module.exports = {
  env: {
    BASE_URL: !!process.env.VERCEL_URL ? `${process.env.VERCE_URL}/api` : 'http://localhost:3000/api',
  },
  
}