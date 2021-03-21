/*
Se encarga de vender los tokens
Seteamos el precio de los tokens
Solo el admin de los tokens puede cerar la venta
Wei es como se pasan las transacciones en solidity
*/

// SPDX-License-Identifier: MIT

import "./SuperToken.sol";

pragma solidity ^0.5.1;

contract TokenSale {
    address payable admin;
    SuperToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(SuperToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function Multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == Multiply(_numberOfTokens, tokenPrice));
        // verifica que este contrato tenga la cantidad suficiente de tokens para vender obtenidos del balance del QuinoToken
        require(_numberOfTokens <= tokenContract.balanceOf(address(this)));
        // funcion del contrato QuinoToken 'transfer', envia el comprador y la cantidad de tokens
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);

        // envias los tokens sobrantes al admin
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            )
        );

        // autodestruye el contrato actual y envia el ether de la venta al admin
        selfdestruct(admin);
    }
}
