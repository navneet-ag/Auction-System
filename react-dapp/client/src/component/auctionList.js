import React from 'react';
import { Table } from 'reactstrap'
import { columns } from '../App'
import AuctionContract from "../contracts/Auction.json";
import AuctionBoxContract from "../contracts/AuctionBox.json";
import getWeb3 from "../getWeb3";
async function temp(){
    console.log("woooohoooo");
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = AuctionBoxContract.networks[networkId];
    console.log("lets see if this works");
    const auctionInstance = new web3.eth.Contract(
      AuctionBoxContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    auctionInstance.options.address = "0x1e2FaD454989C18616E7De4ac43c68fdB77F9B35"
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
}
function AuctionList () {
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
    return <div>
        <h2>GeeksforGeeks is a computer science portal for geeks!</h2>
        
        Read more about us at :
        <a href="https://www.geeksforgeeks.org/about/">
            https://www.geeksforgeeks.org/about/
        </a>
        <Table striped hover responsive className="border">
            {/* <div>{this.temp.bind(this)}</div> */}
					<thead>
						<tr>{columns.map((name)=>(<td>{name.Header}</td>))}</tr>
					</thead>
          <tbody>
            {/* {this.state.auctionListJSON.map((o)=>(<tr><td>{o.title}</td><td>{o.price}</td><td>{o.starttime}</td><td>{o.endtime}</td><td>{o.description}</td><td><input type="button" value="Bid" 
            onClick={()=>this.handleBidAuction(o)}/></td></tr>))} */}
          </tbody>
		    </Table>
    </div>
}
export default AuctionList;