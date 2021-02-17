const ST = artifacts.require("./SuperToken.sol")

contract('ST', (accounts) => {
    var TokenInstance
    it('inizializa el contrato con los valores correctos', () => {
        return ST.deployed().then((i) => {
            TokenInstance = i
            return TokenInstance.Name()
        }).then((name) => {
            assert.equal(name, 'SuperToken', 'Tiene el nombre correcto')
            return TokenInstance.Symbol()
        }).then((s) => {
            assert.equal(s, 'ST', 'tiene el simbolo correcto')
        })
    })

    it('setea el suministro total', async () => {
        // esto lo q hace es inicializar el contrato donde se le llama 'qt' y se le puede llamar diferentes metodos q este tiene mediante una async/await y la notacion punto usando el nombre del metodo.
        let st = await ST.deployed()
        let ts = await st.totalSupply()
        //  assert.equal lo q hace es verificar q se cumpla la igualdad
        assert.equal(ts.toNumber(), 10000, 'setea el total del suministro a 10000')
        let balance = await st.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 10000, 'asigna el suministro inicial al admin')
    })

    //     it('trasnfiere el token al duenio', async () => {
    //         try {
    //             let st = await ST.deployed()
    //             let transfer = await st.transfer.call(accounts[1], 99999999999999999999999)
    //             assert.fail(transfer)
    //         } catch (err) {
    //             assert(err.message.indexOf('revert') >= 0, 'error message must content revert')
    //             // tira el tipo de error revert porq es un error de solidity que quiere decir que se reviertio la llamada a una funcion por x razon
    //         }

    //     })
    // })

    it('trasnfiere el token al duenio', () => {
        return ST.deployed().then((i) => {
            TokenInstance = i
            return TokenInstance.transfer.call(accounts[1], 9999999)
        })
            .then(assert.fail).catch((error) => {
                assert(error.message.indexOf('revert') >= 0, 'error message must content revert')
                return TokenInstance.transfer.call(accounts[1], 2500, { from: accounts[0] })
            })
            .then((success) => {
                assert.equal(success, true, 'returna el valor de true');
                return TokenInstance.transfer(accounts[1], 2500, { from: accounts[0] });
            })
            .then((receipt) => {
                assert.equal(receipt.logs.length, 1, 'tira un solo evento');
                assert.equal(receipt.logs[0].event, 'Transfer', 'Tendria q ser el evento llamado Transfer');
                assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
                assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
                assert.equal(receipt.logs[0].args._value, 2500, 'logs the transfer amount');
                return TokenInstance.balanceOf(accounts[1])
            })
            .then((balance) => {
                assert.equal(balance.toNumber(), 2500, 'agrego la cantidad al usuario receptor')
                return TokenInstance.balanceOf(accounts[0])
            })
            .then((balance) => {
                assert.equal(balance.toNumber(), 7500, 'reduce la cantidad del usuario emisor a 7500')
            })
    })



    it('aprueba los tokens para delegar la transferencia delegada', () => {
        return ST.deployed().then((i) => {
            TokenInstance = i
            return TokenInstance.approve.call(accounts[1], 100)
        })
            .then((success) => {
                assert.equal(success, true, 'returna el valor de true');
                return TokenInstance.approve(accounts[1], 100, { from: accounts[0] })
            })
            .then((receipt) => {
                assert.equal(receipt.logs.length, 1, 'tira un solo evento');
                assert.equal(receipt.logs[0].event, 'Approval', 'Tendria q ser el evento llamado Approval');
                assert.equal(receipt.logs[0].args._owner, accounts[0], 'logea la cuenta son autorizadas por...');
                assert.equal(receipt.logs[0].args._spender, accounts[1], 'logea la cuenta a ser autorizada a...');
                assert.equal(receipt.logs[0].args._value, 100, 'logea la cantidad transferida');
                return TokenInstance.allowance(accounts[0], accounts[1])
            }).then((allowance) => {
                assert.equal(allowance, 100, 'guarda la cantidad a transferir permitida')
            })
    })

    // 
    // FromAccount = accounts[2]    FA
    // ToAccount = accounts[3]  TA
    // SpendingAccount = accounts[4]    // intermediario   SA
    // 

    it('maneja la transferencia delegada', () => {
        return ST.deployed().then((i) => {
            TokenInstance = i
            return TokenInstance.transfer(accounts[2], 100, { from: accounts[0] })
        })
            .then((receipt) => {
                return TokenInstance.approve(accounts[4], 10, { from: accounts[2] })    // permite que SA gaste 10 tokens de FA
            })
            .then((receipt) => {
                return TokenInstance.transferFrom(accounts[2], accounts[3], 9999, { from: accounts[4] })
                //intenta transferir mas tokens de los que tiene de antes (100 maximo)
            })
            .then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'no se puede transferir mas que el balance');
                return TokenInstance.transferFrom(accounts[2], accounts[3], 20, { from: accounts[4] });
                // intenta enviar mas tokens de los permitidos (10), pero menos de lo q tiene (100)
            }).then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'no se puede transferir mas que la cantidad permitida por allow');
                return TokenInstance.transferFrom.call(accounts[2], accounts[3], 10, { from: accounts[4] });
                // envia la cantdad correcta, pero no la realiza todavia (solo hace una call de la funcion)
            })
            .then((success) => {
                assert.equal(success, true)
                return TokenInstance.transferFrom(accounts[2], accounts[3], 10, { from: accounts[4] })
                // ahora si transfiere la cantidad dicha antes (ahora si hace la transaccion)
            })
            .then((receipt) => {
                assert.equal(receipt.logs.length, 1, 'tira un solo evento');
                assert.equal(receipt.logs[0].event, 'Transfer', 'Tendria q ser el evento llamado Approval');
                assert.equal(receipt.logs[0].args._from, accounts[2], 'logs the account the tokens are transferred from');
                assert.equal(receipt.logs[0].args._to, accounts[3], 'logs the account the tokens are transferred to');
                assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
                // a partir de aca se verifica los balances finales de las cuentas
                return TokenInstance.balanceOf(accounts[2]);
            }).then((balance) => {
                assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account')
                return TokenInstance.balanceOf(accounts[3])
            })
            .then((balance) => {
                assert.equal(balance.toNumber(), 10, 'deducts the amount from the receiving account')
                return TokenInstance.allowance(accounts[2], accounts[4])
            })
            .then((allowance) => {
                assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance')
            })
    })
})