window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined' && web3.eth.coinbase !== null) {
    if (window.location.pathname == '/sign-in') {
      window.location = '/'
    }
    var provider = web3.currentProvider
    setInfo();
    $("#redeem-btn").click(handleRedeem)
    $("#send-btn").click(handleSend)
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    if (window.location.pathname !== '/sign-in') {
      window.location = '/sign-in'
    }
  }
})

var baseAddress;
var ppContractAddress = "0x6DfFFD80E77BCB5886D3A3E5E568D34883Fb700b"
var ppContractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"pointOf","outputs":[{"name":"point","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"redeem","outputs":[{"name":"point","type":"uint256"},{"name":"next_redeemable_time","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"resetTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}]
var ppContract;

function setInfo() {
  baseAddress = web3.eth.coinbase;
  ppContract = web3.eth.contract(ppContractABI).at(ppContractAddress);
  $("#address-label").text(baseAddress)
  web3.eth.getBalance(baseAddress, (err, res) => {
    if (!err) {
      $("#balance-label").text(web3.fromWei(res, "ether") + " ether")
    } else {
      console.log(err)
    }
  })
  ppContract.balanceOf(baseAddress, (err, res) => {
    if (!err) {
      $("#rec-point-label").text(res.toString())
    } else {
      console.log(err)
    }
  })
  ppContract.pointOf(baseAddress, (err, res) => {
    if (!err) {
      $("#send-point-label").text(res.toString())
    } else {
      console.log(err)
    }
  })
}

function handleRedeem() {
  $("#redeem-btn").prop("disabled", true)
  ppContract.redeem({value: 0, gas: 200000, gasPrice: web3.toWei(0.1, "Gwei")}, (err, res) => {
    if (!err) {
      console.log(res)
    } else {
      console.log(err)
    }
  })
  $("#redeem-btn").prop("disabled", false)
}

function handleSend() {
  $("#send-btn").prop("disabled", true)
  ppContract.transfer(
    $("#address-input").val(), $("#amount-input").val(),
    {value: 0, gas: 200000, gasPrice: web3.toWei(0.1, "Gwei")},
    (err, res) => {
      if (!err) {
        console.log(res)
      } else {
        console.log(err)
      }
  })
  $("#send-btn").prop("disabled", false)
}