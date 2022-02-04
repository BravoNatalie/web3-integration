import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { w3 } from "./services/w3";
import {
  Button,
  Tooltip,
  Typography,
  Fade,
  Radio,
  TextField,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";
import { ethers } from "ethers";
import { ConnectWallet } from "./components/ConnectWallet";
import { contractAddress } from "./config";
const contractJson = require("./contract/NFT.json");

const connectWalletStyle = window.connectWalletStyle;
const mintButtonStyle = window.mintButtonStyle;
const snackStyle = window.snackStyle
  ? window.snackStyle
  : { backgroundColor: "#9E9E9E" };
const inputStyle = window.inputStyle;
const inputColor = window.inputColor ? window.inputColor : "#9E9E9E";
const walletBackground = window.walletBackground
  ? window.walletBackground
  : "#f6f6f6";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RadioItem = styled(Radio)`
  &:hover {
    background: none;
  }
`;

const WalletButton = styled(Button)`
  height: 1.5rem;
  border-radius: 0.8rem;

  &:hover {
    background-color: ${walletBackground};
  }
`;

const MintingArea = styled.div`
  display: flex;
  padding: 1rem;

  .MuiTextField-root {
    margin-right: 1rem;

    .MuiInputBase-root {
      input {
        height: 0.4375rem;
        width: 4rem;
      }
    }
  }

  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: ${inputColor};
    }
  }
`;

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState(1);
  const [inputError, setInputError] = useState(false);
  const [snackContent, setSnackContent] = useState("");
  const [mintMore, setMintMore] = useState(false);
  const tokenPrice = ethers.utils.parseEther("0.0001");

  useEffect(() => {
    if (window.ethereum) {
      setTimeout(() => {
        setIsConnected(w3.isConnected()); // wait a little bit to check if metamask is connected because it takes a bit to load
      }, 300);
    }
  }, []);

  w3.onAccountChanged = (account) => {
    setIsConnected(account !== null);
    if (account) setAccount(account);
  };

  w3.onDisconnect = () => {
    setAccount("");
    setConnected(false);
    setContract(null);
  };

  function setIsConnected(isConnected) {
    setConnected(isConnected);
    if (isConnected) {
      (async () => {
        const provider = await w3.getProvider();
        const signer = await provider.getSigner();
        const _contract = new ethers.Contract(
          contractAddress,
          contractJson.abi,
          signer
        );
        setContract(_contract);
      })();
    } else {
      setContract(null);
    }
  }

  async function onMint(amount) {
    if (amount <= 0 || amount > 3500) {
      setInputError(true);
      setSnackContent("Not valid Amount");
      return;
    }
    if (!w3.isCorrectEthereumNetwork()) {
      await w3.connectToEthereum();
      return;
    }
    try {
      const tx = await contract.mintPublicSale(amount, {
        value: tokenPrice.mul(amount),
      });
      setAmount(1);
      setMintMore(true);
      await tx.wait();
    } catch (error) {
      setSnackContent("Error - " + error.error.message);
    }
  }

  async function disconnect() {
    setConnected(false);
  }

  function handleInput(event) {
    const value = event.target.value;
    setAmount(value);
  }

  const handleClose = () => {
    setSnackContent("");
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Main className="App">
      {connected ? (
        <>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={snackContent !== ""}
            onClose={handleClose}
            message={snackContent}
            action={action}
            ContentProps={{
              sx: snackStyle,
            }}
          />
          <MintingArea>
            <TextField
              onChange={(e) => handleInput(e)}
              value={amount}
              error={inputError}
              type="number"
              placeholder="1"
              inputProps={{ style: { textAlign: "center" } }}
              style={inputStyle}
            />
            <Button
              variant="contained"
              style={mintButtonStyle}
              onClick={() => onMint(amount)}
              sx={{ padding: "0 1.8rem" }}
            >
              {mintMore ? "MINT MORE" : "MINT"}
            </Button>
          </MintingArea>
          <Tooltip
            title="Disconnect"
            placement="bottom"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <WalletButton
              sx={{
                color: "text.secondary",
              }}
              onClick={() => disconnect()}
            >
              <RadioItem
                size="small"
                color="success"
                checked={connected}
                value={connected}
                name="account"
              />
              <Typography variant="subtitle2" sx={{ paddingRight: "0.5rem" }}>
                {account.slice(0, 5)}...{account.slice(-4)}
              </Typography>
            </WalletButton>
          </Tooltip>
        </>
      ) : (
        <ConnectWallet style={connectWalletStyle} />
      )}
    </Main>
  );
}

export default App;
