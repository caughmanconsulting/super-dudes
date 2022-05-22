import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/actions/blockchainActions";
import { fetchData } from "../../redux/actions/dataActions";
import hero from "../../images/hero-1.gif";
import hero1bg from "../../images/hero-bg.png";
import roadmap from "../../images/roadmap.jpg";
import { FaTwitter, FaDiscord } from "react-icons/fa";
const hero1BG = {
  backgroundImage: `url(${hero1bg})`,
  marginTop: "-90px",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function HomePage() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account != "" && blockchain.smartContract != null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("../../config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  // useEffect(() => {
  //   getConfig();
  // }, []);

  return (
    <div
      data-bs-spy="scroll"
      data-bs-target="#navbar"
      data-bs-offset="0"
      className="scrollspy"
      tabIndex="0"
    >
      <div className="primary-hero" id="home" style={hero1BG}>
        <h1 className="primary-title">Super Dudes</h1>
        <img src={hero} className="img-fluid" alt="hero-1" />
        <br />
        <br />
        <button
          type="button"
          className="button disabled"
          disabled
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
          }}
        >
          Connect Wallet
        </button>
      </div>
      <div id="about">
        <div className="container">
          <h1 className="title">About Us</h1>
          <p className="text m-0">
            Super Dudes is a 12,888 piece generative NFT collection made up of
            super heroes. They are the 2nd generation of Super Ordinary Villains
            art collection and the next step in the story of the Super Ordinary
            World. The villains couldn`t stay untested for the long. The line
            isn`t clear between good or bad and the battle between villains and
            heroes is closer than we think. The heroes will unfold the rest of
            the story to come.
          </p>
        </div>
      </div>
      <div id="lore">
        <div className="container">
          <h1 className="title">Lore</h1>
          <p className="text m-0">
            Towards the end of World War 2, a group of 9 villains got together,
            in secret and developed what they called “The Graveyard Project”.
            The goal was simple, these 9 very powerful supers, wanted to ensure
            that should the war begin to turn for their allies, that they`d be
            prepared to fight back, without having to break the pact. The
            Graveyard Project was the brainchild of Lucas Fynn (Malice). Fynn
            believed that the best way to win a war wasn`t strategy, but in
            numbers.
          </p>
        </div>
      </div>
      <div id="roadmap">
        <h1 className="title">Anti-Roadmap</h1>
        <div className="container">
          <div className="row">
            <div className="col-10 offset-1">
              <img src={roadmap} className="img-fluid" alt="roadmap-img" />
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col">
              <ul className="list-unstyled d-flex justify-content-center footer-social">
                <li>
                  <a
                    className="footer-icon"
                    target="_blank"
                    rel="noreferrer"
                    href="https://twitter.com/graveyardfalls?s=21&t=U3HFGlh_aQ5iuPukG3Nbvg"
                  >
                    <FaTwitter />
                  </a>
                </li>
                <li>
                  <a
                    className="footer-icon"
                    target="_blank"
                    rel="noreferrer"
                    href="https://discord.gg/supers"
                  >
                    <FaDiscord />
                  </a>
                </li>
              </ul>
              <p className="text">© 2022 Super Dudes NFT</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
