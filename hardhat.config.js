require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


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
};
