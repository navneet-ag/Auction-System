pragma solidity >=0.4.22 <0.9.0;
// pragma solidity ^0.4.8;
contract Auction {
    address payable public owner;
    
    uint public startBlock;
    uint public endBlock;
    
    string public ipfsHash;
    bool public canceled;
    
    address payable public highestBidder;
    mapping(address => uint256) public fundsByBidder;
    uint public highestBindingBid = 0;
    uint public startingPrice;   // Starting price of the auction
    bool ownerHasWithdrawn;
    
    string public title;
    
    // constructor (address  _owner, uint _startBlock, uint _endBlock, string  memory _ipfsHash, string  memory _title, uint _startingPrice) public {
    //     if (_startBlock >= _endBlock) revert();
    //     if (_startBlock < block.number) revert();
    //     if (_owner == address(0)) revert();
    //     if (bytes(_ipfsHash).length == 0) revert();
    //     if (bytes(_title).length == 0) revert();
    //     if (_startingPrice<0) revert();
        
    //     title = _title;
    //     startingPrice = _startingPrice;
    //     owner = _owner;
    //     startBlock = _startBlock;
    //     endBlock = _endBlock;
    //     ipfsHash = _ipfsHash;
    // }

    constructor (address payable _owner, string  memory _title, uint _startingPrice) public {
        if (_owner == address(0)) revert();
        if (bytes(_title).length == 0) revert();
        if (_startingPrice<0) revert();
        
        title = _title;
        startingPrice = _startingPrice;
        owner = _owner;
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
    
    function getTitle()
        public
        returns (string memory )
    {
        return title;
    }

    function getPrice()
        public
        returns (uint)
    {
        return startingPrice;
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
    

    function withdraw() public{
        //the owner and bidders can finalize the auction.
        // require(msg.sender == owner || bids[msg.sender] > 0);

        address payable recipiant;
        uint value;

        // owner can get highestPrice
        if(msg.sender == owner){
            recipiant = owner;
            value = highestBindingBid;
        }
        // highestBidder can get no money
        else if (msg.sender == highestBidder){
            recipiant = highestBidder;
            value = 0;
        }
        // Other bidders can get back the money 
        else {
            recipiant = msg.sender;
            value = fundsByBidder[msg.sender];
        }
        // initialize the value
        fundsByBidder[msg.sender] = 0;
        recipiant.transfer(value);
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