import { useEffect, useState } from "react";
import Web3 from 'web3'
import SuperToken from './artifacts/SuperToken.json'
import TokenSale from './artifacts/TokenSale.json'

function App() {

  const [AccountData, setAccountData] = useState({
    web3: 'undefined',
    account: '',
    balance: 0
  })

  const [Contracts, SetContracts] = useState({
    Token: '',
    Sale: ''
  })

  const PreLoad =async()=>{
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()

      if (typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])
        setAccountData({ account: accounts[0], balance: web3.utils.fromWei(balance) })
      } else {
        window.alert('Please Login with MetaMask')
      }

      try{
        const Token = new web3.eth.Contract(SuperToken.abi, SuperToken.networks[netId.address])
        const Sale = new web3.eth.Contract(TokenSale.abi, TokenSale.networks[netId.address])
        SetContracts({Token, Sale})
      }
      catch(err){
        console.log(err)
        alert('Error, see the console')
      }

    }
    else{
      alert('please install MetaMask or any provider!!')
    }
  }
  
  useEffect( () => {
    PreLoad()
  }, [])


  const BuyToken = async(e)=>{
    e.preventDefault()
    console.log('Buying')
    let price = await Contracts.Sale.methods.tokenPrice().call()
    console.log(price)
  }


  // console.log(window.ethereum)
  return (
    <div>
      <h1>ICO for SuperToken</h1>
      <h2>El usuario actual es: {AccountData.account}</h2>
      <h3>Con un balance de <strong>{AccountData.balance}</strong> ether</h3>
      
        <form>
          <label>Amount to buy: <input type="text"/></label>
          <button onClick={BuyToken}>Buy</button>
        </form>
      
    </div>
  );
}

// Falta enviarle la cantidad de tokens al contrato TokenSale que va a vender
// Y en la funcion buyTokens agregar el msg.value donde este tiene q ser igual al numero de tokens a comprar en wei
export default App;
