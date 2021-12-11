pragma solidity >=0.4.22 <0.9.0;
import "./Auction.sol";

contract AuctionBox{
    Auction[] public auctions; 
   
    function createAuction (
        string memory _title,
        uint _startPrice
        ) public{
        require(_startPrice > 0);
        // set the new instanc
        Auction newAuction = new Auction(msg.sender, _title, _startPrice);
        // push the auction address to auctions array
        auctions.push(newAuction);
    }
    
    function returnAllAuctions() public view returns(Auction[] memory){
    // function returnAllAuctions() public view returns(string memory){
        // return "working 123 123";
        return auctions;
    }
}
