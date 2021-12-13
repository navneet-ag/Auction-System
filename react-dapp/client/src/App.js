import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import AuctionContract from "./contracts/Auction.json";
import AuctionBoxContract from "./contracts/AuctionBox.json";
import { Row, Card, CardBody, CardTitle, CardSubtitle, CardText, Button, Col, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment'
import getWeb3 from "./getWeb3";


import "./App.css";

class App extends Component {
  state = { storageValue: "",
            web3: null, 
            accounts: null, 
            contract: null, 
            newValue: "",
            title:"",
            price:"0",
            description:"",
            startdate:"",
            starttime:"",
            enddate:"",
            endtime:"",
            auctionList:[],
            auctionListJSON:[],
            auctionObject: [],
            auctionBidPrice:0,
            isBid:""
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
    auctionInstance.options.address = "0x73607ab44eE6De9a800bD528A587c6640a540d9C"
    const response = await auctionInstance.methods.returnAllAuctions().call();
    this.setState({auctionList: response});
    const index = response.length-1;
    const individualAuction = await Promise.all(response.map(async(item)=>{
      const auction_1 = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      auction_1.options.address = item;
      return {title: await auction_1.methods.getTitle().call(),
              address: auction_1.options.address, 
              price: web3.utils.fromWei(await auction_1.methods.getPrice().call() ,'ether'),
              starttime: new Intl.DateTimeFormat('en-US', 
                                                { year: 'numeric',
                                                  month: '2-digit',
                                                  day: '2-digit', 
                                                  hour: '2-digit', 
                                                  minute: '2-digit', 
                                                  second: '2-digit' 
                                                }
                                                ).format(
                                                        await auction_1.methods.getStartTime().call()*1000
                                                        ),
              endtime:new Intl.DateTimeFormat('en-US', 
                                              { year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit', 
                                                hour: '2-digit', 
                                                minute: '2-digit', 
                                                second: '2-digit' 
                                              }
                                              ).format(
                                                      await auction_1.methods.getEndTime().call()*1000
                                                      ),
              description: await auction_1.methods.getDescription().call()
            }
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
    auctionInstance.options.address = "0x73607ab44eE6De9a800bD528A587c6640a540d9C"
    this.setState({auctionContract: auctionInstance})
    const {accounts, contract} = this.state;
    const BidPrice = web3.utils.toWei(this.state.price, 'ether'); 
    var ContractStartDate = moment(this.state.startdate + ' ' + this.state.starttime).toDate();    
    var ContractStartUnixTime = Date.parse(ContractStartDate)/1000;

    var ContractEndDate = moment(this.state.enddate + ' ' + this.state.endtime).toDate();    
    var ContractEndUnixTime = Date.parse(ContractEndDate)/1000;
    console.log(this.state.title);
    console.log(BidPrice);
    console.log(ContractStartUnixTime);
    console.log(ContractEndUnixTime);
    console.log(this.state.description);
    try{
      await auctionInstance.methods.createAuction(this.state.title,BidPrice,ContractStartUnixTime,ContractEndUnixTime,this.state.description).send({from:accounts[0]});

    }catch(error)
    {
      await alert(" Error in creating auction \n Please make sure you that : \n 1) You have enough funds to deploy the contract \n 2) Title and description are not empty \n 3) Starting price is not zero \n 4) Current time should be less than end time");
    }
    
    // console.log( auctionInstance.methods.returnAllAuctions().call());
    
  }
  async handleBidSubmit(){
    const web3 = this.state.web3;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = AuctionBoxContract.networks[networkId];
    console.log("yayyayayay");
    console.log(this.state.auctionBidPrice);
    const bidPriceWei = web3.utils.toWei(this.state.auctionBidPrice, 'ether');
    const fromAddress = web3.eth.accounts.givenProvider.selectedAddress;
    console.log("ahhahahahahahha");
    console.log(this.state.auctionList);
    // console.log(this.state.auctionObject.price);
    const selectedAuction = new web3.eth.Contract(
      AuctionContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    selectedAuction.options.address = this.state.auctionObject.address;
    // const selectedAuction = AuctionContract(this.state.auctionObject.address);
    // this.state.isBid = true;
    
    try {
      const ans = await selectedAuction.methods
        .placeBid()
        .send({
          from: fromAddress,
          value: bidPriceWei,
        });
      }catch(error)
      {
        console.log("Error in bidding");
        await alert(" Error in bidding \n Please make sure you that : \n 1) You are not the owner of this contract \n 2) Current Time is beyond start time and before end time \n 3) Your bid is not below the starting Price");
      }
    // console.log("yahan kya hua hai");
    // console.log(ans);
    // console.log("maja hi aa gaya");
  }
  async handleWithdraw(){
    const web3 = this.state.web3;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = AuctionBoxContract.networks[networkId];
    // console.log("yayyayayay");
    // console.log(this.state.auctionBidPrice);
    // const bidPriceWei = web3.utils.toWei(this.state.auctionBidPrice, 'ether');
    // const fromAddress = web3.eth.accounts.givenProvider.selectedAddress;
    // console.log("ahhahahahahahha");
    // console.log(this.state.auctionList);
    // console.log(this.state.auctionObject.price);
    const selectedAuction = new web3.eth.Contract(
      AuctionContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    selectedAuction.options.address = this.state.auctionObject.address;
    // const selectedAuction = AuctionContract(this.state.auctionObject.address);
    // this.state.isBid = true;
    const { accounts } = this.state;
    try {
      const ans = await selectedAuction.methods
        .withdraw()
        .send({
          from: accounts[0]
        });
    }catch(error)
    {
      await alert("Error in withdrawing funds \n 1) Auction has not ended yet \n 2) You might have not bid for this auction ");
    }

    console.log("ab batao yahan kya hua hai");
    // console.log(ans);
    console.log("firse maja hi aa gaya");
  }
  
  handleBidAuction(o){
    console.log("ooo yeah baby");
    console.log(o.price);
    console.log(o.title);
    this.setState({auctionObject: o})
    // console.log(this.state.auctionObject.price)
    console.log("main mar jawa");
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const columns = [{  
      Header: 'Title',  
      accessor: 'title'  
      },{  
      Header: 'Starting Price(ether)',  
      accessor: 'price'  
      },{
      Header: 'Start time',
      accessor: 'start time'
      },{
        Header: 'End time',
        accessor: 'end time'
      },{
        Header: 'Description',
        accessor: 'description'
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
        <label>Description:
          <input 
            type="text" 
            name="description" 
            value={this.state.description || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Starting Date:
          <input 
            type="date" 
            name="startdate" 
            value={this.state.startdate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Starting Time:
          <input 
            type="time" 
            name="starttime" 
            value={this.state.starttime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Ending Date:
          <input 
            type="date" 
            name="enddate" 
            value={this.state.enddate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div class="form-group">
        <label>Ending Time:
          <input 
            type="time" 
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
            {this.state.auctionListJSON.map((o)=>(<tr><td>{o.title}</td><td>{o.price}</td><td>{o.starttime}</td><td>{o.endtime}</td><td>{o.description}</td><td><input type="button" value="Bid" 
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
              <Row>
                <Button onClick={this.handleBidSubmit.bind(this)}>
                  BID
                </Button>
                
                <Button style = {{color:'blue'}} onClick={this.handleWithdraw.bind(this)} >
                  WITHDRAW
                </Button>
              </Row>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default App;  