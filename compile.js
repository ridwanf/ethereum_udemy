const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // remove build folder

// Read 'inbox.sol' file from the 'contracts' folder
const inboxPath = path.resolve(__dirname, "contracts", "inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");
let interface;
let bytecode;
var input = {
  language: "Solidity",
  sources: {
    "inbox.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)), 1);
fs.ensureDirSync(buildPath); // ensure build folder exists

for (let contract in output.contracts["inbox.sol"]) {
  fs.outputJSONSync(
    path.resolve(buildPath, "Inbox.json"),
    (interface = output.contracts["inbox.sol"][contract].abi)
  );

  fs.outputJSONSync(
    path.resolve(buildPath, "inboxBytecode.json"),
    (bytecode = output.contracts["inbox.sol"][contract].evm.bytecode.object)
  );
}

module.exports = {
  interface,
  bytecode,
};
