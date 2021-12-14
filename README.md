# Auction-System using Solidity

We have created a sealed-bid auction system using Solidity, Truffle and React. You can create a new auction by providing a title, starting price, start time and date, end time and date and the description of the product to be auctioned using ETH. 

Anyone with a valid cryptocurrency wallet can create and bid on the auction. Only the owner cannot bid on his own auction.

After the auction has ended, the owner can withdraw highest bid and all other bidders can withdraw their bids.

## Prerequisites

* **Node** - v14.x.x (preferrably v14.17.0 for long term support)
* **npm** - v7.x.x (preferrably 7.6.0)
* **Web3.js** - v1.5.x (preferrably 1.5.3)
* **Solidity** - v0.5.x (preferrably 0.5.16)
* **Truffle** - v5.4.x (preferrably v.5.4.17)

## Running it Locally

1. Clone this repo

```bash
git clone https://github.dev/navneet-ag/Auction-System
cd Auction-System/react-dapp
```

2. Start truffle 
```bash
truffle develop
compile
migrate --reset
```
3. Copy the contract address from the truffle console and initalize the auctionInstance.options.address variable in the App.js file.

4. Open a different terminal and run the following commands
```bash
cd client
npm install
npm run start
```

If you `npm run start`, the app will be available at <http://localhost:3000>.
