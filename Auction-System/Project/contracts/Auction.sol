pragma solidity >=0.4.22 <0.9.0;
// pragma solidity ^0.4.8;
contract Auction {
    address public owner;
    
    uint public startBlock;
    uint public endBlock;
    
    string public ipfsHash;
    bool public canceled;
    
    address public highestBidder;
    mapping(address => uint256) public fundsByBidder;
    uint public highestBindingBid = 0;
    uint public startingPrice;   // Starting price of the auction
    bool ownerHasWithdrawn;
    
    string public title;
    
    constructor (address  _owner, uint _startBlock, uint _endBlock, string  memory _ipfsHash, string  memory _title, uint _startingPrice) public {
        if (_startBlock >= _endBlock) revert();
        if (_startBlock < block.number) revert();
        if (_owner == address(0)) revert();
        if (bytes(_ipfsHash).length == 0) revert();
        if (bytes(_title).length == 0) revert();
        if (_startingPrice<0) revert();
        
        title = _title;
        startingPrice = _startingPrice;
        owner = _owner;
        startBlock = _startBlock;
        endBlock = _endBlock;
        ipfsHash = _ipfsHash;
    }
    
    function getHighestBid()
        public view
        returns (uint)
    {
        return fundsByBidder[highestBidder];
    }
    
    event LogBid(address bidder, uint bid, address highestBidder, uint highestBindingBid);
    event LogWithdrawal(address withdrawer, address withdrawalAccount, uint amount);
    event LogCanceled();
    
    function placeBid ()
        payable
        // onlyAfterStart
        // onlyBeforeEnd
        onlyNotCanceled
        onlyNotOwner
        onlyHigherprice
        public returns (bool success) {
            if (msg.value == 0) revert();
            // uint highestBid = fundsByBidder[highestBidder];
            fundsByBidder[msg.sender] = msg.value;
            
            if (highestBindingBid<msg.value){
                highestBindingBid = msg.value;
                highestBidder = msg.sender;
            }
            emit LogBid(msg.sender, msg.value, highestBidder, highestBindingBid);
            return true;
        }
    
    function cancelAuction()
        public
        onlyOwner
        onlyBeforeEnd
        onlyNotCanceled
        returns (bool success)
    {
        canceled = true;
        emit LogCanceled();
        return true;
    }
    
    function withdraw()
        public
        onlyEndedOrCanceled
        returns (bool success)
    {
        address withdrawalAccount;
        uint withdrawalAmount;

        if (canceled) {
            // if the auction was canceled, everyone should simply be allowed to withdraw their funds
            withdrawalAccount = msg.sender;
            withdrawalAmount = fundsByBidder[withdrawalAccount];

        } else {
            // the auction finished without being canceled

            if (msg.sender == owner) {
                // the auction's owner should be allowed to withdraw the highestBindingBid
                withdrawalAccount = highestBidder;
                withdrawalAmount = highestBindingBid;
                ownerHasWithdrawn = true;

            } 
            else if (msg.sender == highestBidder) {
               revert();
            } 
            else {
                // anyone who participated but did not win the auction should be allowed to withdraw
                // the full amount of their funds
                withdrawalAccount = msg.sender;
                withdrawalAmount = fundsByBidder[withdrawalAccount];
            }
        }

        if (withdrawalAmount == 0) revert();

        fundsByBidder[withdrawalAccount] -= withdrawalAmount;

        // send the funds
        if (!msg.sender.send(withdrawalAmount)) revert();

        emit LogWithdrawal(msg.sender, withdrawalAccount, withdrawalAmount);

        return true;
    }

    
    modifier onlyOwner {
        if (msg.sender != owner) revert();
        _;
    }

    modifier onlyNotOwner {
        if (msg.sender == owner) revert();
        _;
    }

    // modifier onlyAfterStart {
    //     if (block.number < startBlock) revert();
    //     _;
    // }

    modifier onlyBeforeEnd {
        if (block.number > endBlock) revert();
        _;
    }

    modifier onlyNotCanceled {
        if (canceled) revert();
        _;
    }

    modifier onlyEndedOrCanceled {
        if (block.number < endBlock && !canceled) revert();
        _;
    }
    
    modifier onlyHigherprice {
        if (startingPrice > msg.value) revert();
        _;
    }
}