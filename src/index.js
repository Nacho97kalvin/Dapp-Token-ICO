import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { Web3ReactProvider } from '@web3-react/core'
// import { InjectedConnector } from '@web3-react/injected-connector'
// import { NetworkConnector } from '@web3-react/network-connector'


// const injected = new InjectedConnector({ supportedChainIds: [5777] })  // conecta al id de la cadena de la wallet
// const network = new NetworkConnector({ urls: { 5777: 'HTTP://127.0.0.1:7545' } })  // conector al nodo


// function getLibrary(Provider, connector) {
//   return new Web3Provider(Provider)
// }



ReactDOM.render(
  <React.StrictMode>
    {/* <Web3ReactProvider getLibrary={getLibrary}> */}
    <App/>
    {/* </Web3ReactProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
