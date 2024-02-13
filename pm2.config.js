module.exports = {
  apps: [{
    name: "elementerra-index",
    script: "./dist/src/main.js",
    instances: 4,
    wait_ready: true
  }]
}
