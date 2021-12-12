import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import AuctionContract from "./contracts/Auction.json";
import AuctionBoxContract from "./contracts/AuctionBox.json";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button, Col, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTable from "react-table";  
// import "react-table/react-table.css"; 


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
            auctionList:[],
            auctionListJSON:[],
            auctionObject: [],
            auctionBidPrice:0
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
  handleBidChange(event){
    const name = event.target.name;
    const value = event.target.value || 0;
    console.log(value);
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
    auctionInstance.options.address = "0x54a2fA6C13a01EDeb9Ca2B7092A2Bf222078fa0f"
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
    const individualAuction = await Promise.all(response.map(async(item)=>{
      const auction_1 = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      auction_1.options.address = item;
      // console.log(await auction_1.methods.getTitle().call());
      // console.log(await auction_1.methods.getPrice().call());
      return {title: await auction_1.methods.getTitle().call(), price: await auction_1.methods.getPrice().call()}
  }))
    console.log(individualAuction);
    this.setState({auctionListJSON: individualAuction})


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
    auctionInstance.options.address = "0x54a2fA6C13a01EDeb9Ca2B7092A2Bf222078fa0f"
    this.setState({auctionContract: auctionInstance})
    const {accounts, contract} = this.state;
    const BidPrice = web3.utils.toWei(this.state.price, 'ether'); 
    await auctionInstance.methods.createAuction(this.state.title,BidPrice).send({from:accounts[0]});
    
    console.log( auctionInstance.methods.returnAllAuctions().call());
    
  }
  handleBidAuction(o){
    console.log("ooo yeah baby");
    console.log(o.price);
    console.log(o.title);
    this.setState({auctionObject: o})
  }
  handleBidSubmit(){
    console.log("yayyayayay");
    console.log(this.state.auctionBidPrice);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const columns = [{  
      Header: 'Title',  
      accessor: 'title'  
      },{  
      Header: 'Price',  
      accessor: 'price'  
      },{
      Header: 'Bid Here',
      accessor: 'bid'
      }]
    return (
      <div className="App">
        <h1>Welcome to this dapp!</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
        <div class="form-group">
        <label>Title:
          <input 
            type="text" 
            name="title" 
            value={this.state.title || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Starting Price:
          <input 
            type="text" 
            name="price" 
            value={this.state.price || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>IPFS Hash:
          <input 
            type="text" 
            name="ipfshash" 
            value={this.state.ipfshash || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Starting Date:
          <input 
            type="text" 
            name="startdate" 
            value={this.state.startdate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Starting Time:
          <input 
            type="text" 
            name="starttime" 
            value={this.state.starttime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Ending Date:
          <input 
            type="text" 
            name="enddate" 
            value={this.state.enddate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Ending Time:
          <input 
            type="text" 
            name="endtime" 
            value={this.state.endtime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
          <input type="submit" value="Create Auction"/>
        </form>
        <form onSubmit={this.allAuctions.bind(this)}>
          <input type="submit" value="View All Auction"/>
        </form>
        <div>
        <Table striped hover responsive className="border">
					<thead>
						<tr>{columns.map((name)=>(<td>{name.Header}</td>))}</tr>
					</thead>
          <tbody>
            {this.state.auctionListJSON.map((o)=>(<tr><td>{o.title}</td><td>{o.price}</td><td><input type="button" value="Bid" 
            onClick={()=>this.handleBidAuction(o)}/></td></tr>))}
          </tbody>
				</Table>
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                {this.state.auctionObject.title}
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                {this.state.auctionObject.price}
              </CardSubtitle>
              <CardText>
                Please enter the amount you want to bid here:
                <input 
                  type="number" 
                  name="auctionBidPrice" 
                  // value={this.state.auctionBidPrice} 
                  onChange={this.handleBidChange.bind(this)}
                /> 
              </CardText>
              <Button onClick={this.handleBidSubmit.bind(this)}>
                BID
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

    );
  }
}

export default App;  