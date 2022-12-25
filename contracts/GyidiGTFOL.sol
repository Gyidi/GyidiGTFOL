//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract GyidiGTFOL {
    /** 
        @dev Modifier to check that the caller of the function is a project creator.
    */
    modifier onlyCreator() {
        require(
            msg.sender == creator,
            "Only the project creator can call this function"
        );
        _;
    }

    /**
     * @notice This event will emit when a Donation is made.
     * @param from The contributor of the project.
     * @param timestamp The time money was sent.
     * @param amount The quantity of money that was sent.
     * @param name The name of the donor/contributor.
     * @param message The message sent.
     */
    event NewDonation(
        address from,
        uint256 timestamp,
        uint256 amount,
        string name,
        string message
    );
    /**
     * @notice This event will emit when a Donation is made.
     * @param to The contributor of the project.
     * @param timestamp The time money was sent.
     * @param amount The quantity of money that was sent.
     */
    event FundsWithdrawn(address to, uint256 timestamp, uint256 amount);

    /**
     * @notice Donation struct.
     * @param from The contributor of the project.
     * @param timestamp The time money was sent.
     * @param amount The quantity of money that was sent.
     * @param name The name of the donor/contributor.
     * @param message The message sent.
     */
    struct Donation {
        address from;
        uint256 timestamp;
        uint256 amount;
        string name;
        string message;
    }

    /**
     * @notice List of all donations.
     */
    Donation[] donations;

    /**
     * @notice Address of Gyidi.
     */
    address payable creator;

    /**
     * @notice Address of Gyidi.
     */
    constructor() {
        creator = payable(msg.sender);
    }

    /**
     * @notice make a donation to contract owner.
     * @param _name name of donor
     * @param _message message from donor
     */
    function donate(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "can't donate with no eth");
        require(
            msg.sender != creator,
            "Creator of project cannot contribute to it"
        );

        // Add the donation to storage!
        donations.push(
            Donation(msg.sender, block.timestamp, msg.value, _name, _message)
        );

        emit NewDonation(
            msg.sender,
            block.timestamp,
            msg.value,
            _name,
            _message
        );
    }

    /**
     * @notice send funds stored in contract to contract owner.
     */
    function withdraw() public onlyCreator {
        require(address(this).balance > 0, "Balance must be greater than 0");
        creator.transfer(address(this).balance);
        emit FundsWithdrawn(creator, block.timestamp, address(this).balance);
    }

    /**
     * @dev fetches all stored donations
     */
    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }

    /**
     * @notice gets contract balance.
     */
    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
