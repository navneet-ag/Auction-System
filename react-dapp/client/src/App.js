import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import AuctionContract from "./contracts/Auction.json";
import AuctionBoxContract from "./contracts/AuctionBox.json";
import { Container, Row, Card, CardBody, CardTitle, CardSubtitle, CardText, Button, Col, Table, CardHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment'
import getWeb3 from "./getWeb3";
import Header from "./header";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

import "./App.css";
const Styles = styled.div`
  background: lavender;
  padding: 20px`;
//to prevent the table from displaying without clicking the button "show all auctions"
// let check = false;
// let check2 = false;
// let check_withdraw = false;
//to prevent the Bid Card from displaying without clicking the button "Bid"
// let check_bid = false;
// let check_form = false;
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
            isBid:"",
            check_bid:false,
            check: false,
            check2: false,
            check_withdraw: false,
            check_form: false,
            check_profile: true
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
    this.setState({check:true, check_form:false,check_profile:false})
    // check = true;
    // check2 = false;
    this.setState({check2:false})
    this.setState({check_bid: false});
    // check_withdraw = false;
    this.setState({check_withdraw:false})
    console.log(this.state);
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
  async withdrawAuctions(event){
    event.preventDefault();
    this.setState({check2:true, check_form:false,check_profile:false});
    this.setState({check:false});
    // check2 = true;
    // check = false;
    this.setState({check_bid:false});
    // check_withdraw = false;
    this.setState({check_withdraw:false});
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
    auctionInstance.options.address = "0x54a2fA6C13a01EDeb9Ca2B7092A2Bf222078fa0f"
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
  handleCancel(){
    console.log("haan hua main");
    this.setState({check_bid:false});
    this.setState({check_withdraw:false});
    this.setState({check:false});
    this.setState({check2:false, check_profile:true,check_form:false});
  }
  handleCancel2(){
    console.log("haan hua main");
    this.setState({check_bid:false});
    this.setState({check_withdraw:false});
  }
  handleAuctionCreation(){
    console.log("ooo yeah");
    this.setState({check_form:true, check:false, check_bid:false, check_withdraw:false, check_profile:false})
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
    this.setState({check_bid:true});
    this.setState({check_withdraw:false});
    // check_withdraw = false;
    console.log("ooo yeah baby");
    console.log(o.price);
    console.log(o.title);
    this.setState({auctionObject: o})
    // console.log(this.state.auctionObject.price)
    console.log("main mar jawa");
  }
  handleWithdrawAuction(o){
    // check_withdraw = true;
    this.setState({check_withdraw:true})
    this.setState({check_bid:false});
    this.setState({auctionObject: o})
  }
  
  async profile(){
    console.log("yes i am being called");
    const web3 = this.state.web3;

    const currentAddress = web3.eth.accounts.givenProvider.selectedAddress;
    console.log("gasolinaaaaaa");
    var currentBalance = await Promise.all(web3.eth.getBalance(currentAddress));
    // currentBalance = web3.toDecimal(currentBalance);
    console.log("yahoooooooo");
    console.log(currentBalance);
  }
  async profile(){
    const web3 = this.state.web3;
    const currentAddress = web3.eth.accounts.givenProvider.selectedAddress;
    console.log("ye kya ho rha hai");
    var currentBalance = 0;
    await web3.eth.getBalance(currentAddress, function(err, result){
      if(err){
        console.log(err);
      }
      else{
        currentBalance = web3.utils.fromWei(result, 'ether');
        console.log(currentBalance);
        console.log(web3.utils.fromWei(result, 'ether')+"ETH")
      }
    })
    console.log("yahaha");
    return currentBalance;
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
      },this.state.check && {
        Header: 'Bid Here',
        accessor: 'bid'
      },this.state.check2 && {
        Header: 'Withdraw',
        accessor: 'withdraw'
      }].filter(item=>item)

  // TO BE LOOKED INTO>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const web3 = this.state.web3;
    const currentAddress = web3.eth.accounts.givenProvider.selectedAddress;
    console.log("ye kya ho rha hai");
    // var currentBalance;
    web3.eth.getBalance(currentAddress, function(err, result){
      if(err){
        console.log(err);
      }
      else{
        const currentBalance = web3.utils.fromWei(result, 'ether');
        console.log(currentBalance);
        console.log(web3.utils.fromWei(result, 'ether')+"ETH")
      }
    })
    console.log("yahaha");
    // console.log(currentBalance);
    // currentBalance = web3.toDecimal(currentBalance);
    // console.log(currentBalance);
    // console.log("bwahahahhaha");
    // console.log(currentAddress);
    // this.setState({currentAccount: currentAddress})
  // END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    return (
      <div className="App">
        <Header/>
        <div className="navbar-dark  d-print-none">
			</div>
      <Styles>
        {/* add check condition for rendering etc. */}
        {this.state.check_profile && <div style={{
            display: 'block', padding: 30
        }}>
          <Card className="form">
            <CardBody>
              <CardTitle tag="h5">
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
              </CardSubtitle>
              <Card>
                <CardHeader style={{backgroundColor: "black", color: "white"}}>YOUR PROFILE</CardHeader>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item" style={{textAlign: "left"}}>
                    Public Address : {currentAddress}</li>
                  {/* <li className="list-group-item" style={{textAlign: "left"} } >
                    Account Balance : idk why this is not working</li> */}
                </ul>
              </Card>
              <Row>
                <Col>
                <Button className="submitButton profileButton" onClick={this.handleAuctionCreation.bind(this)}>
                  CREATE AUCTION
                </Button>
                </Col>
                <Col>
                <Button className="submitButton profileButton" onClick={this.allAuctions.bind(this)}>
                  SHOW ALL AUCTIONS
                </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                <Button className="submitButton profileButton" onClick={this.allAuctions.bind(this)}>
                  PLACE A BID
                </Button>
                </Col>
                <Col>
                <Button className="submitButton profileButton" onClick={this.withdrawAuctions.bind(this)}>
                  WITHDRAW BID
                </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
          </div>}
          </Styles>
      <Styles>
      {this.state.check_form && <div style={{
            display: 'block', padding: 30
        }}>
        
        <form onSubmit={this.handleSubmit.bind(this)}>
        <div style={{textAlign: "right"}}><Button onClick={this.handleCancel.bind(this)} close/></div>
        <div className="form-group">
          <h1>Auction Form</h1>
        <label>Title:
          <input 
            type="text" 
            name="title" 
            value={this.state.title || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div className="form-group">
        <label>Starting Price:
          <input 
            type="text" 
            name="price" 
            value={this.state.price || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div className="form-group">
        <label>Description:
          <input 
            type="text" 
            name="description" 
            value={this.state.description || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div className="form-group">
        <label>Starting Date:
          <input 
            type="date" 
            name="startdate" 
            value={this.state.startdate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div className="form-group">
        <label>Starting Time:
          <input 
            type="time" 
            name="starttime" 
            value={this.state.starttime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div className="form-group">
        <label>Ending Date:
          <input 
            type="date" 
            name="enddate" 
            value={this.state.enddate || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
        <div className="form-group">
        <label>Ending Time:
          <input 
            type="time" 
            name="endtime" 
            value={this.state.endtime || ""} 
            onChange={this.handleChange.bind(this)}
          />
        </label>
        </div>
          <input type="submit" className="submitButton" value="Create Auction"/>
          {/* <input type="button" className="submitButton" value="View All Auctions" onClick={this.allAuctions.bind(this)}/> */}
          {/* <input type="button" className="submitButton" value="Withdraw Your Bid" onClick={this.withdrawAuctions.bind(this)}/> */}
        </form>

        {/* <form onSubmit={this.allAuctions.bind(this)}>
          <input type="submit" className="submitButton" value="View All Auctions"/>
        </form> */}
        </div>}
        </Styles>        
        <div>
        
        {(this.state.check || this.state.check2) && <div style={{
            display: 'block', padding: 30
        }}><div><h1>ONGOING AUCTIONS</h1></div>
        <div style={{textAlign: "right"}}><Button onClick={this.handleCancel.bind(this)} close/></div>
        
        <Table striped hover responsive className="border" bordered={true}>
					{this.state.check && <caption>Please click on the Bid Button if you want to bid on an item.</caption>}
          {this.state.check2 && <caption>Please click on the Withdraw Button if you want to withdraw your bid.</caption>}
          {/* <caption>
                <Button className="cancelButton" onClick={this.handleCancel.bind(this)}>
                  Close
                </Button>
          </caption> */}
          <thead className="table-dark">
						<tr>{columns.map((name)=>(<td>{name.Header}</td>))}</tr>
					</thead>
          <tbody>
            {this.state.auctionListJSON.map((o)=>(<tr><td>{o.title}</td>
            <td>{o.price}</td>
            <td>{o.starttime}</td>
            <td>{o.endtime}</td>
            <td>{o.description}</td>
            {this.state.check && <td><input type="button" 
            className="submitButton" value="Bid" onClick={()=>this.handleBidAuction(o)}/></td>}
            {this.state.check2 && <td><input type="button" className="submitButton" value="Withdraw" 
            onClick={()=>this.handleWithdrawAuction(o)}/></td>}
            </tr>))}
          </tbody>
          
				</Table></div>}
        
        <Styles>
        {this.state.check_bid && <div style={{
            display: 'block', padding: 30
        }}>
          <Card className="form">
            <CardBody>
              <CardTitle tag="h5">
                {/* Place a Bid */}
                {/* {this.state.auctionObject.title} */}
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                {/* {this.state.auctionObject.price} */}
              </CardSubtitle>
              <Card>
                <CardHeader style={{backgroundColor: "black", color: "white"}}>PLACE A BID</CardHeader>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item" style={{textAlign: "left"}}>TITLE : {this.state.auctionObject.title}</li>
                  <li className="list-group-item" style={{textAlign: "left"}}>Starting Price : {this.state.auctionObject.price}</li>
                  <li className="list-group-item" style={{textAlign: "left"}}>Address : {this.state.auctionObject.address}</li>
                  <li className="list-group-item" style={{textAlign: "left"}}>Description : {this.state.auctionObject.description}</li>
                </ul>
              </Card>
              <CardText>
                <p style={{margin: "10px"}}>Please enter the amount you want to bid here:
                </p>
                <input 
                  type="number" 
                  name="auctionBidPrice" 
                  // value={this.state.auctionBidPrice} 
                  onChange={this.handleBidChange.bind(this)}
                /> 
              </CardText>
              <Row>
                <Button className="submitButton" onClick={this.handleBidSubmit.bind(this)}>
                  BID
                </Button>
                <Button className="cancelButton" onClick={this.handleCancel2.bind(this)}>
                  Cancel
                </Button>
              </Row>
            </CardBody>
          </Card>
          </div>}
          </Styles>
          <Styles>
        {this.state.check_withdraw && <div style={{
            display: 'block', padding: 30
        }}>
          <Card className="form">
            <CardBody>
              <CardTitle tag="h5">
                {/* Place a Bid */}
                {/* {this.state.auctionObject.title} */}
              </CardTitle>
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                {/* {this.state.auctionObject.price} */}
              </CardSubtitle>
              <Card>
                <CardHeader style={{backgroundColor: "black", color: "white"}}>Withdraw Details</CardHeader>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item" style={{textAlign: "left"}}>TITLE : {this.state.auctionObject.title}</li>
                  <li className="list-group-item" style={{textAlign: "left"}}>Starting Price : {this.state.auctionObject.price}</li>
                  <li className="list-group-item" style={{textAlign: "left"}}>Address : {this.state.auctionObject.address}</li>
                  <li className="list-group-item" style={{textAlign: "left"}}>Description : {this.state.auctionObject.description}</li>
                </ul>
              </Card>
              <Row>
                <Button className="submitButton" onClick={this.handleWithdraw.bind(this)} >
                  WITHDRAW
                </Button>
                <Button className="cancelButton" onClick={this.handleCancel2.bind(this)}>
                  Cancel
                </Button>
              </Row>
            </CardBody>
          </Card>
          </div>}
          </Styles>  
        </div>
      </div>
    );
  }
}

export default App;  