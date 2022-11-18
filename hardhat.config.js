require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || ''


// This is a sample Hardhat task.
// https://hardhat.org/hardhat-runner/docs/advanced/create-task
task("accounts", "Prints  the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
    networks: {
        localhost: {},
        goerli: {
          url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
          accounts: privateKeys.split(','),
        },
    },
    etherscan: {
      apiKey: `${process.env.ETHERSCAN_API_KEY}`
    }
};
