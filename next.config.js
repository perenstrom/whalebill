module.exports = {
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/create',
        permanent: true
      }
    ];
  }
};
