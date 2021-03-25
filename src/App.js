import { useEffect, useRef, useState } from "react";
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

  const amount = useRef(null)

  const PreLoad =async()=>{
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()

      if (typeof accounts[0] !== 'undefined') { // verifico que haya un usuario
        const balance = await web3.eth.getBalance(accounts[0])
        setAccountData({ account: accounts[0], balance: web3.utils.fromWei(balance) })
      } else {
        window.alert('Please Login with MetaMask')
      }

      try{
        const Token = new web3.eth.Contract(SuperToken.abi, SuperToken.networks[netId].address)
        const Sale = new web3.eth.Contract(TokenSale.abi, TokenSale.networks[netId].address)
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
  
  const CheckingTokens = async ()=>{
    const supply = await Contracts.Token.methods.totalSupply().call()
    console.log(supply)
    const solded = await Contracts.Sale.methods.tokensSold().call()
    console.log(solded, ' tokens vendidos')
  }

  useEffect( () => {
    PreLoad()
    CheckingTokens()
    // console.log(SuperToken.networks[5777].address)
  }, [])


  const BuyToken = async(e)=>{
    e.preventDefault()
    let price = await Contracts.Sale.methods.tokenPrice().call()
    let Buy = await Contracts.Sale.methods.buyTokens(amount.current.value).send({ from: AccountData.account, value: amount.current.value*price})
    CheckingTokens()
    // console.log(price)
  }

  return (
    <div>
      <h1>ICO for SuperToken</h1>
      <h2>El usuario actual es: {AccountData.account}</h2>
      <h3>Con un balance de <strong>{AccountData.balance}</strong> ether</h3>
      
        <form>
          <label>Amount to buy: <input type="text" ref={amount}/></label>
          <button onClick={BuyToken}>Buy</button>
        </form>
      
    </div>
  );
}

// Falta enviarle la cantidad de tokens al contrato TokenSale que va a vender
// tmbn hacer la funcion endSale() 
export default App;
