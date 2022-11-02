import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import config from '../config.json';
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken,
} from '../store/interactions.js';

const { ethereum } = window;

const connectWallet = async dispatch => {
  try {
    if (!ethereum) return console.log('Please install metamask');

    await loadAccount(dispatch);

    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);

    // Talk to Token Smart Contract
    await loadToken(provider, config[chainId].Jan.address, dispatch);
  } catch (error) {
    console.log(error);

    throw new Error('No ethereum object');
  }
};

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    connectWallet(dispatch);
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
