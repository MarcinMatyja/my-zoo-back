module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '83c4fd6c18d212e1adcab009c63548ac'),
  },
});
