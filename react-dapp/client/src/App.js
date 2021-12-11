import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import AuctionContract from "./contracts/Auction.json";
import AuctionBoxContract from "./contracts/AuctionBox.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: "",
            web3: null, 
            accounts: null, 
            contract: null, 
            newValue: "",
            title:"",
            price:"",
            ipfshash:"",
            startdate:"",
            starttime:"",
            enddate:"",
            endtime:"",
            auctionList:[]
          };

  componentDidMount = async () => {
    try {

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  handleChange(event){
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
    // this.setState({newValue: event.target.value});
  }
  async allAuctions(event){
    event.preventDefault();
    const web3 = this.state.web3;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = AuctionBoxContract.networks[networkId];
    console.log("lets see if this works");
    const auctionInstance = new web3.eth.Contract(
      AuctionBoxContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    auctionInstance.options.address = "0x9Fdd503139338201F642Ec33ECE90b95DD0C436B"
    const response = await auctionInstance.methods.returnAllAuctions().call();
    
    this.setState({auctionList: response});
    // console.log(this.state.auctionList);
    
    // const data = await response.json();
    // const index = this.state.auctionList.length-1;
    // console.log(this.state.auctionList[index]);
    // console.log(this.state.auctionList[index-1]);

    const index = response.length-1;
    // console.log(response[index]);
    // console.log(response[index-1]);
    
    const auction_1 = new web3.eth.Contract(
      AuctionContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    auction_1.options.address = response[index];
    console.log(await auction_1.methods.getTitle().call());
    console.log(await auction_1.methods.getPrice().call());


    const quotes = [
      {text: 'Whatever the mind of man can conceive and believe, it can achieve.',
      author: 'Napoleon Hill'},
      {text: 'Strive not to be a success, but rather to be of value.',
      author: 'Albert Einstein'},
      {text: 'I attribute my success to this: I never gave or took any excuse.',
      author: 'Florence Nightingale'},
      {text: 'You miss 100% of the shots you don’t take.',
      author: 'Wayne Gretzky'}
    ];
    for(var i=0; i<=index;i++){

    }


  }
  async handleSubmit(event){
    event.preventDefault();
    const web3 = this.state.web3;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = AuctionBoxContract.networks[networkId];
    const auctionInstance = new web3.eth.Contract(
      AuctionBoxContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    auctionInstance.options.address = "0x9Fdd503139338201F642Ec33ECE90b95DD0C436B"
    this.setState({auctionContract: auctionInstance})
    const {accounts, contract} = this.state;
    const BidPrice = web3.utils.toWei(this.state.price, 'ether'); 
    await auctionInstance.methods.createAuction(this.state.title,BidPrice).send({from:accounts[0]});
    
    console.log( auctionInstance.methods.returnAllAuctions().call());
    
  }
  runExample = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  // async handleAuctionAdded(i, event) {
  //   var auctionList = this.state.auctionList;
  //   auctionList[i] = event.target.value;
  //   this.setState({
  //     auctionList: auctionList
  //   });
  // }
  // renderRows() {
  //   var context = this;
  //   const index = this.state.auctionList.length-1;
  //   console.log("main idhar hun");
  //   console.log(this.state.auctionList);
  //   console.log("main idhar nhi hun");
    
  //   return this.state.auctionList.map(function(o, i){
  //     return (
  //       <tr key={"item-"+i}>
  //         <td>
  //           <input type="text" value={o} onChange={this.handleAuctionAdded.bind(this, i)}/>
  //         </td>
  //       </tr>

  //     );
  //   });
  // }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    // console.log(this.state.storageValue);
    return (
      <div className="App">
        <h1>Welcome to this dapp!</h1>
        {/* <div>Swastik likes : {this.state.storageValue}</div> */}
        <form onSubmit={this.handleSubmit.bind(this)}>
        {/* <input type="text" name="newValue" value={this.state.newValue} onChange={this.handleChange.bind(this)}/><br/> */}
        <label>Title:
          <input 
            type="text" 
            name="title" 
            value={this.state.title || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
        <label>Starting Price:
          <input 
            type="text" 
            name="price" 
            value={this.state.price || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
        <label>IPFS Hash:
          <input 
            type="text" 
            name="ipfshash" 
            value={this.state.ipfshash || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
        <label>Starting Date:
          <input 
            type="text" 
            name="startdate" 
            value={this.state.startdate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
        <label>Starting Time:
          <input 
            type="text" 
            name="starttime" 
            value={this.state.starttime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
        <label>Ending Date:
          <input 
            type="text" 
            name="enddate" 
            value={this.state.enddate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
        <label>Ending Time:
          <input 
            type="text" 
            name="endtime" 
            value={this.state.endtime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        <br/>
        </label>
          <input type="submit" value="Create Auction"/>
        </form>
        <form onSubmit={this.allAuctions.bind(this)}>
          <input type="submit" value="View All Auction"/>
        </form>
        <div>
        <table className="">
          <thead>
            <tr>
              <th>
                Item
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {this.renderRows()} */}
          </tbody>
        </table>
        </div>




      </div>

    );
  }
}

export default App;  