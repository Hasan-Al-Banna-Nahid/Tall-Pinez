// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/n8n-proxy",
        destination:
          "http://n8n-simplifai.saavatar.xyz/webhook/6cc2d09b-017e-401e-9f18-6373c7e043ae",
      },
    ]
  },
}
