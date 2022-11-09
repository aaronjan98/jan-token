import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import config from '../config.json'
import {
    loadProvider,
    loadNetwork,
    loadAccount,
    loadTokens,
    loadExchange,
} from '../store/interactions.js'

import Navbar from './Navbar'
import Markets from './Markets'
import Balance from './Balance'

const { ethereum } = window

const connectWallet = async dispatch => {
    try {
        if (!ethereum) return console.log('Please install metamask')

        // Connect Ethers to blockchain
        const provider = loadProvider(dispatch)

        // Fetch current network's chainId e.g. hardhat: 31337, goerli: 5
        const chainId = await loadNetwork(provider, dispatch)

        // Reload page when network changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload()
        })

        // Fetch current account & balance from Metamask when changed
        window.ethereum.on('accountsChanged', () => {
            loadAccount(provider, dispatch)
        })

        // if (config[chainId] === '31337') {
        // Load token smart contracts
        const Jan = config[chainId].Jan
        const mETH = config[chainId].mETH
        await loadTokens(provider, [Jan.address, mETH.address], dispatch)

        // Load exchange smart contract
        const exchangeConfig = config[chainId].exchange
        await loadExchange(provider, exchangeConfig.address, dispatch)
        // }
    } catch (error) {
        console.log(error)

        throw new Error('No ethereum object')
    }
}

function App() {
    const dispatch = useDispatch()

    const loadBlockchainData = async () => {
        connectWallet(dispatch)
    }

    useEffect(() => {
        loadBlockchainData()
    })

    return (
        <div>
            <Navbar />

            <main className="exchange grid">
                <section className="exchange__section--left grid">
                    <Markets />

                    <Balance />

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
    )
}

export default App
