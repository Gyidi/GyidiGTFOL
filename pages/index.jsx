import abi from "../utils/GyidiGTFOL.json";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x985fA79F394d53491f9B9d6c5b8A49c096Ca883c";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onValueChange = (event) => {
    setValue(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const donate = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const gyidi = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("sending donation..");
        const donationTxn = await gyidi.donate(
          name ? name : "anon",
          message ? message : "Just donated!",
          {
            value: value
              ? ethers.utils.parseEther(value)
              : ethers.utils.parseEther("0.001"),
          }
        );

        await donationTxn.wait();

        console.log("mined ", donationTxn.hash);

        console.log("donated!");

        // Clear the form fields.
        setName("");
        setMessage("");
        setValue("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all donations stored on-chain.
  const getDonations = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gyidi = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("fetching donations from the blockchain..");
        const donations = await gyidi.getDonations();
        console.log("fetched!");
        setDonations(donations);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let gyidi;
    isWalletConnected();
    getDonations();

    // Create an event handler function for when someone sends
    // us a new donation.
    const onNewDonation = (from, timestamp, amount, name, message) => {
      console.log(
        "Donation received: ",
        from,
        timestamp,
        amount,
        name,
        message
      );
      setDonations((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          amount,
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new donation events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      gyidi = new ethers.Contract(contractAddress, contractABI, signer);

      gyidi.on("NewDonation", onNewDonation);
    }

    return () => {
      if (gyidi) {
        gyidi.off("NewDonation", onNewDonation);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>GyidiGTFOL</title>
        <meta name="description" content="Decentralized Crowdfunding site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav id="navbar">
        <h1>Gyidi</h1>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>Donate to Gyidi!</h1>

        {currentAccount ? (
          <div>
            <form>
              <div>
                <label>Amount</label>
                <br />

                <input
                  id="value"
                  type="text"
                  placeholder="Enter amount in ETH"
                  onChange={onValueChange}
                />
              </div>
              <br />
              <div>
                <label>Name</label>
                <br />

                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                />
              </div>
              <br />
              <div>
                <label>Send Gyidi a message</label>
                <br />

                <textarea
                  rows={3}
                  placeholder="Message to donor!"
                  id="message"
                  onChange={onMessageChange}
                  required
                ></textarea>
              </div>
              <div>
                <button id="button" type="button" onClick={donate}>
                  Donate
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button id="button" onClick={connectWallet}>
            {" "}
            Connect your wallet{" "}
          </button>
        )}
      </main>

      {!currentAccount && (
        <div>
          <h2>About Gyidi</h2>
          <div id="about">
            <p>
              Gyidi is a decentralised crowdfunding platform built entirely on the
              blockchain with the aim of removing bureaucracy and middlemen
              plaguing the both for profit to non-profit business. <br /> <br/> The goal is
              to provide every individual the tools to fund and execute social
              projects and for donors an uncensored, transparent medium where
              capital is entrusted under the rigorous enforcement of smart
              contracts and DAOs. <br />
              <br /> We are still in early stage development and we need all the help
              we can get.
              <br /> <br />
              Feel free to donate to Gyidi following the steps below.
              <br />
            </p>
          </div>

          <br />
          <h2>Steps on how to donate</h2>
          <ol>
            <li>
              Get metamask from <a href="https://metamask.io">Metamask</a>{" "}
            </li>
            <li>
              Get GoerliETH from <a href="https://goerlifaucet.com">Faucet</a>{" "}
            </li>
            <li>Connect wallet </li>
            <li>Type in amount in eth, any name and a message</li>
            <li>Click donate</li>
            <li>Confirm transaction</li>
            <li>Wait for the magic to happen :)</li>
          </ol>
        </div>
      )}

      {currentAccount && <h1>donations received</h1>}

      {currentAccount &&
        donations.map((donation, idx) => {
          return (
            <div
              key={idx}
              style={{
                border: "2px solid",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>"{donation.message}"</p>
              <p>
                From: {donation.name} at {donation.timestamp.toString()}
              </p>
            </div>
          );
        })}

      <footer className={styles.footer}>
        <div>
          <p>Created by Gyidi!</p>
          <a
            href="mailto: hello@gyidi.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email: hello@gyidi.org
          </a>
        </div>
      </footer>
    </div>
  );
}
