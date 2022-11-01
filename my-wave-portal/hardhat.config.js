require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: "0.8.17",
    networks: {
        goerli: {
            url: process.env.STAGING_QUICKNODE_KEY, // quick node goerli key
            accounts: [process.env.PRIVATE_KEY], // metamask account private key
        },
    },
};
