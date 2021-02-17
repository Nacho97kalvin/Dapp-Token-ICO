import Web3 from "web3";
import SuperToken from "./artifacts/SuperToken.json";
import TokenSale from "./artifacts/TokenSale.json";

const options = {
    web3: {
        block: false,
        customProvider: new Web3("ws://localhost:7545"),    // ganache enviroment
    },
    contracts: [SuperToken, TokenSale],
    events: {
        QuinoToken: ["Transfer", "Approval"],
        TokenSale: ["Sell"]
    },
};

export default options;