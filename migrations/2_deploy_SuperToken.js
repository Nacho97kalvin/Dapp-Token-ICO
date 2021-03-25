const ST = artifacts.require("./SuperToken.sol")
const TS = artifacts.require("./TokenSale.sol")

module.exports = function (deployer) {
    deployer.deploy(ST, 10000)                                          // passing the initial supply
        .then(() => {
            return deployer.deploy(TS, ST.address, 1000000000000000)   // 0,001 ether, price of each token
        })
}
