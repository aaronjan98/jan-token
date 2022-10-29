import { useEffect } from 'react';
import { ethers } from 'ethers';

import TOKEN_ABI from '../abis/Token.json';
import '../App.css';
import config from '../config.json';

const { ethereum } = window;

const connectWallet = async () => {
  try {
    if (!ethereum) return console.log('Please install metamask');

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    console.log(account);

    // Connect Ethers to blockchain
    const provider = new ethers.providers.Web3Provider(ethereum);
    const { chainId } = await provider.getNetwork();
    console.log({ chainId });

    // Talk to Token Smart Contract
    const token = new ethers.Contract(
      config[chainId].Jan.address,
      TOKEN_ABI,
      provider
    );
    console.log(token.address);
    const symbol = await token.symbol();
    console.log(symbol);
  } catch (error) {
    console.log(error);

    throw new Error('No ethereum object');
  }
};

function App() {
  const loadBlockchainData = async () => {
    connectWallet();
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
