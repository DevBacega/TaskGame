module.exports = {
  env: {
    BASE_URL: !!process.env.VERCEL_URL ? '/api' : 'http://localhost:3000/api',
  },
  
}