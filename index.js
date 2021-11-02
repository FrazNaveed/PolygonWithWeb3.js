const Tx =  require('ethereumjs-tx').Transaction;
const  Common = require ('ethereumjs-common');
const Web3 = require('web3');
var addresses = require("./addresses.json");

const customChainParams = { name: 'matic-mumbai', chainId: 80001, networkId: 80001 }
const common = Common.default.forCustomChain('goerli', customChainParams, 'petersburg');



const web3 = new Web3("https://speedy-nodes-nyc.moralis.io/df800cc67c2b4ffd5f3e4005/polygon/mumbai");
const USER_ADDR = "0xbD9D4a71B76C494958d9D258A1e3d4c0801495e0";
const privateKey = Buffer.from("58c5d200fa11320f548a3530519330c8b7d30bf03d592128cda734578c0bec8c", 'hex');
const POLY_ABI = require("./eth_PolyABI.json");
const POLY_ADDRESS = addresses["polygon"];
const POLY_CONTRACT = new web3.eth.Contract(POLY_ABI, POLY_ADDRESS);


// create transaction object

web3.eth.getTransactionCount(USER_ADDR, (err, txCount)=>{

    const txObject = {
    from: USER_ADDR,
    to: POLY_ADDRESS,
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(10000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    data: POLY_CONTRACT.methods
    .mint(
        100
    )
    .encodeABI(),
    }    

    const tx = new Tx(txObject, {common});
    tx.sign(privateKey);
    
    const serealizeTransaction = tx.serialize();
    const raw = '0x'+ serealizeTransaction.toString('hex');
    
    web3.eth.sendSignedTransaction(raw, (err, txHash)=>{
       if(err){
           console.log(err)
       }
       else{
        console.log("txHash:", txHash);
       }
    });
});

