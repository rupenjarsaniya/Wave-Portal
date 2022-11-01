import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
    try {
        const ethereum = getEthereumObject();
        if (!ethereum) {
            console.error("Make sure you have MetaMask!");
            return null;
        }

        console.log("We have the Ethereum object", ethereum);
        const accounts = await ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Foud an authorized account", account);
            return account;
        } else {
            console.error("No authorized account found");
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default function App() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [allWaves, setAllWaves] = useState([]);
    const [message, setMessage] = useState("");

    const contractAddress = "0x837580Ba21aa32Ce2644260A997bF3a5701FA3FD";
    const contractABI = abi.abi;

    const getAllWaves = async () => {
        try {
            const ethereum = getEthereumObject();

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const waveProtalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                const waves = await waveProtalContract.getAllWaves();

                const waveCleaned = waves.map((wave) => {
                    return {
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    };
                });

                setAllWaves(waveCleaned);
            } else {
                console.log("Ethereum object does not exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const ethereum = getEthereumObject();

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connectd", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchSome = async () => {
            const account = await findMetaMaskAccount();
            if (account !== null) setCurrentAccount(account);
            await getAllWaves();
        };
        fetchSome();
    }, []);

    // useEffect(() => {
    //     let wavePortalContract;

    //     const onNewWave = (from, timestamp, message) => {
    //         console.log("NewWave", from, timestamp, message);
    //         setAllWaves((prevState) => [
    //             ...prevState,
    //             {
    //                 address: from,
    //                 timestamp: new Date(timestamp * 1000),
    //                 message: message,
    //             },
    //         ]);
    //     };

    //     if (window.ethereum) {
    //         const provider = new ethers.providers.Web3Provider(window.ethereum);
    //         const signer = provider.getSigner();

    //         wavePortalContract = new ethers.Contract(
    //             contractAddress,
    //             contractABI,
    //             signer
    //         );
    //         wavePortalContract.on("NewWave", onNewWave);
    //     }

    //     return () => {
    //         if (wavePortalContract) {
    //             wavePortalContract.off("NewWave", onNewWave);
    //         }
    //     };
    // }, []);

    const wave = async (e) => {
        e.preventDefault();
        try {
            const ethereum = getEthereumObject();

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());

                const waveTxn = await wavePortalContract.wave(message, {
                    gasLimit: 300000,
                });
                console.log("Mining...", waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined --", waveTxn.hash);

                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
            } else {
                console.log("Ethereum object does not exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">👋 Hey there!</div>

                <div className="bio">
                    I am Rupen and I worked on self-driving cars so that's
                    pretty cool right? Connect your Ethereum wallet and wave at
                    me!
                </div>

                <form onSubmit={wave} className="waveForm">
                    <textarea
                        className="waveTextArea"
                        placeholder="Enter Something..."
                        rows={3}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        required={true}
                        value={message}
                    >
                        {message}
                    </textarea>
                    <button type="submit" className="waveButton">
                        Wave at Me
                    </button>
                </form>

                {!currentAccount ? (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                ) : (
                    <button className="waveButton" disabled={true}>
                        {currentAccount}
                    </button>
                )}

                {allWaves &&
                    allWaves.map((wave, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "OldLace",
                                marginTop: "16px",
                                padding: "8px",
                            }}
                        >
                            <div>Address: {wave.address}</div>
                            <div>Time: {wave.timestamp.toString()}</div>
                            <div>Message: {wave.message}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
