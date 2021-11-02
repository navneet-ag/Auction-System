const auction_test = artifacts.require("Auction");

module.exports = function (deployer) {
  deployer.deploy(auction_test);
};
