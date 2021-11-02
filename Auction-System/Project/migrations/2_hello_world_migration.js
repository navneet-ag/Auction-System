const Hello_world = artifacts.require("hello_world");

module.exports = function (deployer) {
  deployer.deploy(Hello_world);
};
