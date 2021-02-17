// SPDX-License-Identifier: MIT

pragma solidity ^0.5.1;


contract SuperToken {
    uint256 public totalSupply;
    string public Name = "SuperToken";
    string public Symbol = "ST";

    mapping(address => uint256) public balanceOf; // guarda la cantidad de mis tokens q tiene el usuario
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner, // _owner seria el q llama al contrato en este caso
        address indexed _spender, // _spender seria el que va a enviar el amount
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply; // guarda el address q llamo a el contrato y le guarda como valor el initial supply
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // verifica q el que llama al contrato tenga como minimo la cantidad de ether que quiere enviar y hace el balance luego
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // TransferFrom actuaria como un intermediario entre el emisor (_from) y el receptor (_to)
    // ejecuta la transferencia delegada, previamente habiendo aprobado la cantidad de ether a enviar

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // verifica el balance de la cuenta que va a enviar los ether sea mayor al valor enviado
        require(balanceOf[_from] >= _value);
        //  verifica que se permita enviar, como minimo, la cantidad aprobada previamente
        require(allowance[_from][msg.sender] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // basicamente resetea la cantidad que se habia aprobado como que estaba perimitido enviar
        allowance[_from][msg.sender] -= _value;

        // emite el evento de q se completo bien la transaccion
        emit Transfer(_from, _to, _value);

        return true;
    }

    // spender es el que quiere enviar lo tokens, y limita la cantidad a enviar con el _value
    // aprueba la cantidad a enviar y la guarda en el mapping allowance

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}

/*  
    Funcionamiento del TransferFrom y Aprove:

   Basicamente primero se llama el aprove para permitir que una cuenta B pueda enviar tokens de una cuenta A en su nombre a otra llamada C
   Luego con la funcion TransferFrom se encarga de hacer la transferencia verificando por el mapping que esta aprobada 
   A --> B --> C
   accountB actuaria como intermediario entre ambas cuentas, el Approve sirve para permitir que B mande los token de A en su nombre

*/
