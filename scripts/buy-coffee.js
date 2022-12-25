const hre = require("hardhat")

// Returns the Ether balance of a given address.
async function getBalance(address) {  
  const balanceBigInt = await hre.ethers.provider.getBalance(address)
  return hre.ethers.utils.formatEther(balanceBigInt)
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0
    for (const address of addresses) {
      console.log(`Address ${addresses[idx]} balance: `, await getBalance(address))
      idx ++
    }
}

// Logs the donation stored on-chain from donations.
async function printDonation(_donation) {
  const timestamp = _donation._timestamp
  const tipper = _donation._name
  const amount = _donation._amount
  const tipperAddress = _donation._from
  const message = _donation._message
  console.log(
    `At ${timestamp}, name: ${tipper} (${tipperAddress}) said: "${message}" and sent: "${amount}"`
  )
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners()

  // We get the contract to deploy.
  const Gyidi = await hre.ethers.getContractFactory("GyidiGTFOL")
  const gyidi = await Gyidi.deploy()

  // Deploy the contract.
  await gyidi.deployed()
  console.log("Gyidi deployed to:", gyidi.address)


  // Check balances before the domatiom.
  const donations = [owner.address, tipper.address, gyidi.address]
  console.log("== start ==")
  await printBalances(donations)

  // Donate to Gyidi.
  const tip = { value: hre.ethers.utils.parseEther("1") }
  await gyidi.connect(tipper).donate("Carolina", "You're the best!", {
    value: tip.value,
  })
  await gyidi.connect(tipper2).donate("Vitto", "Amazing teacher", {
    value: tip.value,
  })
  await gyidi.connect(tipper3).donate("Kay", "I love my Proof of Knowledge", {
    value: tip.value,
  })

  // Check balances after the donation.
  console.log("== donated ==")
  await printBalances(donations)

  // Withdraw.
  await gyidi.connect(owner).withdraw()

  // Check balances after withdrawal.
  console.log("== withdraw ==")
  await printBalances(donations)

  // Check out the donation.
  console.log("== donation ==")
  const newDonation = await gyidi.connect(tipper3).viewDonation()
  printDonation(newDonation)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
