module.exports = {
  apps: [
    {
      name: 'microsite-backend',
      script: './server.js',
      watch: true,
      env_dev: {
        NODE_ENV: 'dev',
      },
      env_prod: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
