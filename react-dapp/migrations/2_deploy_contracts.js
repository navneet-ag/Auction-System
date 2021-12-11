var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var AuctionBox = artifacts.require("./AuctionBox.sol");


module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage, "cookies");
  deployer.deploy(AuctionBox);

};
