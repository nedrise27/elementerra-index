module.exports = {
  apps: [{
    name: "elementerra-index",
    script: "./dist/main.js",
    instances: 2,
    wait_ready: true
  }]
}
