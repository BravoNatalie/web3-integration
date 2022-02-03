import { useState } from "react";
import { Button } from "@mui/material";
import { w3 } from "../../services/w3";
import { mobileAndTabletCheck } from "../../services/utils";

export const ConnectWallet = () => {
  function onClick() {
    if (!window.ethereum && mobileAndTabletCheck()) {
      window.open("https://metamask.app.link/dapp/localhost:3000");
    } else if (window.ethereum) {
      w3.connectWallet();
    }
  }

  return (
    <div>
      {!window.ethereum && !mobileAndTabletCheck() && (
        <div
          style={{ fontSize: 18, fontFamily: "asapRegular", paddingBottom: 20 }}
        >
          You need a MetaMask wallet to be able to min, please click
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          to install MetaMask.
        </div>
      )}
      <Button variant="contained" color="warning" onClick={onClick}>
        CONNECT WALLET
      </Button>
    </div>
  );
};
