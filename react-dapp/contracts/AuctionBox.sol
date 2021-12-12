pragma solidity >=0.4.22 <0.9.0;
import "./Auction.sol";

contract AuctionBox{
    
    Auction[] public auctions; 
   
    function createAuction (
        string memory _title,
        uint _startTime,
        uint _endTime,
        uint _startingPrice,
        string memory _description
        ) public{
        // set the new instance
        Auction newAuction = new Auction(msg.sender, _title, _startingPrice, _startTime,_endTime,_description);
        // push the auction address to auctions array
        auctions.push(newAuction);
    }
    
    function returnAllAuctions() public view returns(Auction[] memory){
        return auctions;
    }
}
