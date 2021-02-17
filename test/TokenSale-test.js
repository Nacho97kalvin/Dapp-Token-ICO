const TS = artifacts.require("./TokenSale.sol")
const ST = artifacts.require("./SuperToken.sol")


contract('TS', (accounts) => {
    var tokenInstance
    var tokenSaleInstance
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000; // in wei
    var tokensAvailable = 7500; // 75% de la cantidad enviada como supply (10000)
    var numberOfTokens;

    it('inizializa el contrato con el valor correcto', function () {
        return TS.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.address
        }).then(function (address) {
            assert.notEqual(address, 0x0, 'has contract address');
            return tokenInstance.tokenContract();
        }).then(function (address) {
            assert.notEqual(address, 0x0, 'has token contract address');
            return tokenInstance.tokenPrice();
        }).then(function (price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

    it('facilitates token buying', function () {
        return ST.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                return TS.deployed();
            })
            .then(function (instance) {
                tokenSaleInstance = instance;
                // da el 75% del totalsupply, llamando la funcion desde QuinoToken, y enviandoselo al contrato de TokenSale  
                return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
            })
            .then(function (receipt) {
                // compra 10 tokens
                numberOfTokens = 10;
                return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
            })
            .then(function (receipt) {
                // verifica el evento 'sell'
                assert.equal(receipt.logs.length, 1, 'triggers one event');
                assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
                assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
                assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
                return tokenSaleInstance.tokensSold();
            })
            .then(function (amount) {
                assert.equal(amount.toNumber(), numberOfTokens, 'incrementa el numero de tokens vendidos');
                return tokenInstance.balanceOf(buyer);
            })
            .then(function (balance) {
                // verifica el balance del comprador
                assert.equal(balance.toNumber(), numberOfTokens);
                return tokenInstance.balanceOf(tokenSaleInstance.address);
            })
            .then(function (balance) {
                // verifica el balance del contrato q vendio los tokens
                assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
                // Try to buy tokens different from the ether value

                return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
            })
            .then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
                return tokenSaleInstance.buyTokens(10000, { from: buyer, value: numberOfTokens * tokenPrice })
            })
            .then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'no puede comprar mas tokens de los que hay habilitados');
            });
    });

    it('ends token sale', () => {
        return ST.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                return TS.deployed();
            })
            .then(function (instance) {
                tokenSaleInstance = instance;
                // intenta terminar la venta sin ser el admin
                return tokenSaleInstance.endSale({ from: buyer })
            }).then(assert.fail).catch((err) => {
                assert(err.message.indexOf('revert' >= 0, 'debe ser el admin'))
                return tokenSaleInstance.endSale({ from: admin })
            }).then((receipt) => {
                return tokenInstance.balanceOf(admin)
            }).then((balance) => {
                assert.equal(balance.toNumber(), 9990, 'retorna lo tokens no vendidos')
                return tokenSaleInstance.tokenPrice()
            }).then((price) => {
                assert.equal(price.toNumber(), 0, 'token price is empty')
            })
    })
})