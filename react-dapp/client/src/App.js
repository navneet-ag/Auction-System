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
            endtime:""
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
    // const name = event.target.name;
    // const value = event.target.value;
    // this.setState({[name]: value});
    // this.setState({newValue: event.target.value});
  }

  async handleSubmit(event){
    event.preventDefault();
    console.log("ye chal rha hai");
    const web3 = this.state.web3;
    console.log("ye bhi chal rha hai");
    const networkId = await web3.eth.net.getId();
    console.log("working 3");
    const deployedNetwork = AuctionBoxContract.networks[networkId];
    const auctionInstance = new web3.eth.Contract(
      AuctionBoxContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    auctionInstance.options.address = "0xE3E8281FAfd1E21e29D217361A08Eb54099Cd85B"
    // const name = this.state.title;
    console.log(this.state);
    this.setState({auctionContract: auctionInstance})
    // const { auctionContract } = this.state;
    const {accounts, contract} = this.state;
    const BidPrice = web3.utils.toWei(this.state.price, 'ether'); 
    await auctionInstance.methods.createAuction(this.state.title,BidPrice).send({from:accounts[0]});
    console.log(auctionInstance.methods.returnAllAuctions());
    // await auctionContract.methods.
    
  }
  runExample = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    console.log(this.state.storageValue);
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
      </div>
    );
  }
}

export default App;
