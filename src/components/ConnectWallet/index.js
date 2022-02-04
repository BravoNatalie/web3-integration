import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { w3 } from "../../services/w3";
import { mobileAndTabletCheck } from "../../services/utils";

const ConnectWalletBtn = styled(Button)`
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.2);
  }
`;

export const ConnectWallet = ({ style }) => {
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
      <ConnectWalletBtn variant="contained" onClick={onClick} style={style}>
        CONNECT WALLET
      </ConnectWalletBtn>
    </div>
  );
};
