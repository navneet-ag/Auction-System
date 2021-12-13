pragma solidity >=0.4.22 <0.9.0;
// pragma solidity ^0.4.8;

contract Auction {
    address payable public owner;
    
    string public title;
    uint public startTime;
    uint public endTime;
    string public description;
    uint public startingPrice;
    
    address payable public highestBidder;
    mapping(address => uint256) public fundsByBidder;
    uint public highestBindingBid = 0;
          
    
    
    constructor (address payable  _owner, string  memory _title, uint _startingPrice, uint _startTime, uint _endTime, string memory _description) 
        onlyNotOwner 
        onlyHigherprice
        public {
        // if (_owner == address(0)) revert();
        if (bytes(_title).length == 0) revert();
        // if (_startingPrice<0) revert();
        
        title = _title;
        startingPrice = _startingPrice;
        owner = _owner;
        startTime = _startTime;
        endTime = _endTime;
        description = _description;
    }

    function getHighestBid()
        public view
        returns (uint)
    {
        return fundsByBidder[highestBidder];
    }
    
    event LogBid(address bidder, uint bid, address highestBidder, uint highestBindingBid);
    event LogWithdrawal(address withdrawer, address withdrawalAccount, uint amount);


    function getTitle()
        public
        returns (string memory )
    {

        return title;
    }

    function getStartTime()
        public 
        returns (uint)
    {
        return startTime;
    }

    function getEndTime()
        public 
        returns (uint)
    {
        return endTime;
    }

    function getPrice()
        public
        returns (uint)
    {   
        return startingPrice;
    }

    function getDescription()
        public
        returns (string memory)
    {
        return description;
    }

    function placeBid ()
        payable
        onlyAfterStart
        onlyBeforeEnd
        onlyNotOwner
        onlyHigherprice
        public returns (bool success) {
            fundsByBidder[msg.sender] += msg.value;
            
            if (highestBindingBid<msg.value){
                highestBindingBid = msg.value;
                highestBidder = msg.sender;
            }
            emit LogBid(msg.sender, msg.value, highestBidder, highestBindingBid);
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

    modifier onlyAfterStart {
        if (now < startTime) revert();
        _;
    }

    modifier onlyBeforeEnd {
        if (now > endTime) revert();
        _;
    }


    modifier onlyEndedOrCanceled {
        if (block.number < endTime) revert();
        _;
    }
    
    modifier onlyHigherprice {
        if (startingPrice > msg.value) revert();
        _;
    }

}