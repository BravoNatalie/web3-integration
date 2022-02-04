import { ethers } from "ethers";

export const w3 = {
  ethereum: null,
  provider: null,
  connectWallet: null,
  disconnectWallet: null,
  onAccountChanged: function (account) {},
  onChainChanged: function (chainId) {},
  onDisconnect: function () {},
  isConnected: null,
  accounts: [],
  chainId: null,
  useEthMainnet: false,
};

const { ethereum } = window;

if (ethereum) {
  w3.ethereum = ethereum;

  ethereum.on("accountsChanged", (accounts) => {
    // Handle the new accounts, or lack thereof.
    // "accounts" will always be an array, but it can be empty.
    accountsChanged(accounts);
  });

  ethereum.on("chainChanged", (chainId) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    window.location.reload();
  });

  ethereum.on("disconnect", () => {
    w3.provider = null;
    w3.connectWallet = null;
    w3.isConnected = false;
    w3.accounts = [];
    w3.chainId = null;

    w3.onDisconnect();
    window.location.reload();
  });

  function accountsChanged(accounts) {
    w3.accounts = accounts;
    if (accounts.length > 0) {
      w3.onAccountChanged(accounts[0]);
    } else {
      w3.onAccountChanged(null);
    }
  }

  w3.connectWallet = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    accountsChanged(accounts);
  };

  w3.isConnected = () => {
    return ethereum.selectedAddress != null || w3.accounts.length > 0;
  };

  w3.getProvider = async function () {
    if (w3.provider) {
      return w3.provider;
    }
    if (ethereum) {
      if (w3.accounts.length === 0) {
        w3.connectWallet();
      }
      w3.chainId = ethereum.chainId;
      w3.provider = new ethers.providers.Web3Provider(ethereum);
      return w3.provider;
    }
    return null;
  };

  // networks
  w3.ethereumMainnet = {
    chainId: "0x1",
    rpc: "https://main-light.eth.linkpool.io/",
  };
  w3.ethereumRinkeby = {
    chainId: "0x4",
    rpc: "https://rinkeby-light.eth.linkpool.io/",
  };

  w3.isEthereumMainnet = () => {
    console.log(w3.chainId);
    return w3.chainId === w3.ethereumMainnet.chainId;
  };
  w3.isEthereumRinkeby = () => {
    return w3.chainId === w3.ethereumRinkeby.chainId;
  };
  w3.isEthereum = () => {
    return w3.isEthereumMainnet() || w3.isEthereumRinkeby();
  };
  w3.isCorrectEthereumNetwork = () => {
    return (
      (w3.useEthMainnet && w3.isEthereumMainnet()) ||
      (!w3.useEthMainnet && w3.isEthereumRinkeby())
    );
  };
  w3.getEthereumRPC = () => {
    return w3.useEthMainnet ? w3.ethereumMainnet.rpc : w3.ethereumRinkeby.rpc;
  };

  w3.connectTo = async (network) => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{ chainId: network.chainId, rpcUrl: network.rpc }],
          });
        } catch (addError) {
          // handle "add" error
          alert("Error adding network");
        }
      }
      // handle other "switch" errors
      alert("Error switching network");
    }
  };

  w3.connectToEthereum = async () => {
    if (w3.useEthMainnet) {
      await w3.connectTo(w3.ethereumMainnet);
    } else {
      await w3.connectTo(w3.ethereumRinkeby);
    }
  };
}
