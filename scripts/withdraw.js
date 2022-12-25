// scripts/withdraw.js

const hre = require("hardhat")
const abi = require("../artifacts/contracts/GyidiGTFOL.sol/GyidiGTFOL.json")

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address)
  return hre.ethers.utils.formatEther(balanceBigInt)
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress = "0x985fA79F394d53491f9B9d6c5b8A49c096Ca883c"
  const contractABI = abi.abi

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API_KEY
  )

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)
  // Instantiate connected contract.
  const gyidi = new hre.ethers.Contract(contractAddress, contractABI, signer)

  // Check starting balances.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  )
  let contractBalance = await getBalance(provider, gyidi.address)
  console.log("current balance of contract: ", contractBalance, "ETH")



  // Withdraw funds if there are funds to withdraw.
  if (contractBalance > 0) {
    console.log("withdrawing funds..")
    const withdrawTxn = await gyidi.withdraw()
    await withdrawTxn.wait()
  } else {
    console.log("no funds to withdraw!")
  }

  // Check ending balance.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  )
  contractBalance = await getBalance(provider, gyidi.address)
  console.log("current balance of contract: ", contractBalance, "ETH")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
