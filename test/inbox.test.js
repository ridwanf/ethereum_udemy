const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");
let accounts;
let inbox;
const INITIAL_STRING = "Hi There";
beforeEach(async () => {
  //  Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // use one of those accounts to deploy
  // the contract
  inbox = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });
  it("Can change the message", async () => {
    await inbox.methods
      .setMessage("oh Hallo")
      .send({ from: accounts[0], gas: "1000000" });
    const message = await inbox.methods.message().call();
    assert.equal(message, "oh Hallo");
  });
});
