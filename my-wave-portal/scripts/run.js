// Build a script ro run our contract

const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory(
        "WavePortal"
    );
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001"),
    });
    await waveContract.deployed();
    console.log("Contract Deployed to:", waveContract.address);
    console.log("Contract Deployed by:", owner.address);

    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract Balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let waveTnx = await waveContract.wave("Good Morning!"); // call wave function which is in contract
    await waveTnx.wait(); //wait for the transaction to be mined

    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract Balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

    // await waveContract.getTotalWaves(); // call getTotalWave function which is in contract
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
