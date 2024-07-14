const axios = require("axios");

class CircuitBreaker {
  constructor() {
    this.states = {};
    this.failureThreshold = 5;
    this.coolDownPeriod = 10;
    this.requestTimeout = 1;
  }

  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = "OPEN";
      state.nextTry = new Date() / 1000 + this.coolDownPeriod;
      console.log(`Alert Circuit for ${endpoint} is in state 'OPEN'`);
    }
  }

  initState(endpoint) {
    this.states[endpoint] = {
      failures: 0,
      coolDownPeriod: this.coolDownPeriod,
      circuit: "CLOSED",
      nextTry: 0,
    };
  }
}

module.exports = CircuitBreaker;
