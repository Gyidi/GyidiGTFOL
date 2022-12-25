const hre = require("hardhat")

async function main() {
  // We get the contract to deploy.
  const Gyidi = await hre.ethers.getContractFactory("GyidiGTFOL")
  const gyidi = await Gyidi.deploy()

  await gyidi.deployed()

  console.log("GyidiGTFOL deployed to:", gyidi.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
