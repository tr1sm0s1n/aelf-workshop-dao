import { useEffect, useState } from "react";
import { IPortkeyProvider, MethodsBase } from "@portkey/provider-types";
import "./HomeDAO.css";
import detectProvider from "@portkey/detect-provider";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import useDAOSmartContract from "./useDAOSmartContract";

interface IVotes {
  address: string;
}

interface IProposal {
  id: string;
  title: string;
  description: string;
  status: string;
  yesVotes: IVotes[];
  noVotes: IVotes[];
  voteThreshold: number;
}

interface IProposals {
  proposals: IProposal[];
}

interface IVoteInput {
  voter: string;
  proposalId: number;
  vote: boolean;
}

function HomeDAO() {
  const [initialized, setInitialized] = useState(false);
  const [joinedDAO, setJoinedDAO] = useState(false);
  const [provider, setProvider] = useState<IPortkeyProvider | null>(null);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>();
  const [proposals, setProposals] = useState<IProposals>();
  const [isConnected, setIsConnected] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const DAOContract = useDAOSmartContract(provider);

  const navigate = useNavigate();

  const handleCreateProposalClick = () => {
    navigate("/create-proposal", { state: { currentWalletAddress } });
  };

  const init = async () => {
    try {
      setProvider(await detectProvider({ providerName: "Portkey" }));
      try {
        //Fetch Accounts
        const accounts = await provider?.request({
          method: MethodsBase.ACCOUNTS,
        });
        if (!accounts) throw new Error("No accounts");

        const account = accounts?.tDVW?.[0];

        if (!account) throw new Error("No account");

        const proposalResponse = await DAOContract?.callViewMethod<IProposals>(
          "GetAllProposals",
          ""
        );
        setProposals(proposalResponse?.data);
        alert("Fetched proposals");
      } catch (error) {
        console.error(error, "===error");
      }
    } catch (error) {
      console.log(error, "=====error");
    }
  };

  const connect = async () => {
    //Step B - Connect Portkey Wallet
    const accounts = await provider?.request({
      method: MethodsBase.REQUEST_ACCOUNTS,
    });
    const account = accounts?.tDVW?.[0];
    setCurrentWalletAddress(account);
    setIsConnected(true);
    alert("Successfully connected");
  };

  const initializeAndJoinDAO = async () => {
    //Step C - Write Initialize Smart Contract and Join DAO Logic
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });
      if (!accounts) throw new Error("No accounts");

      const account = accounts?.tDVW?.[0];
      if (!account) throw new Error("No account");

      if (!initialized) {
        await DAOContract?.callSendMethod("Initialize", account, {});
        setInitialized(true);
        alert("DAO Contract Successfully Initialized");
      }

      await DAOContract?.callSendMethod("JoinDAO", account, account);
      setJoinedDAO(true);
      alert("Successfully Joined DAO");
    } catch (error) {
      console.error(error, "====error");
    }
  };

  const voteYes = async (index: number) => {
    //Step F - Write Vote Yes Logic
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });

      if (!accounts) throw new Error("No accounts");

      const account = accounts?.tDVW?.[0];

      if (!account) throw new Error("No account");

      const createVoteInput: IVoteInput = {
        voter: account,
        proposalId: index,
        vote: true,
      };

      await DAOContract?.callSendMethod(
        "VoteOnProposal",
        account,
        createVoteInput
      );
      alert("Voted on Proposal");
      setHasVoted(true);
    } catch (error) {
      console.error(error, "=====error");
    }
  };

  const voteNo = async (index: number) => {
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });

      if (!accounts) throw new Error("No accounts");

      const account = accounts?.tDVW?.[0];

      if (!account) throw new Error("No account");

      const createVoteInput: IVoteInput = {
        voter: account,
        proposalId: index,
        vote: false,
      };

      await DAOContract?.callSendMethod(
        "VoteOnProposal",
        account,
        createVoteInput
      );
      alert("Voted on Proposal");
      setHasVoted(true);
    } catch (error) {
      console.error(error, "=====error");
    }
  };

  useEffect(() => {
    //Step G - Use Effect to Fetch Proposals
    const fetchProposals = async () => {
      try {
        const accounts = await provider?.request({
          method: MethodsBase.ACCOUNTS,
        });

        if (!accounts) throw new Error("No accounts");

        const account = accounts?.tDVW?.[0];

        if (!account) throw new Error("No account");

        const proposalResponse = await DAOContract?.callViewMethod<IProposals>(
          "GetAllProposals",
          ""
        );

        setProposals(proposalResponse?.data);
        alert("Fetched Proposals");
      } catch (error) {
        console.error(error, "===error");
      }
    };

    fetchProposals();
  }, [DAOContract, hasVoted, isConnected, joinedDAO]);

  useEffect(() => {
    if (!provider) init();
  }, [provider]);

  if (!provider) return <>Provider not found.</>;

  return (
    <>
      <>
        <div className="App">
          <div className="container header">
            <div className="logo">
              <img src="/src/assets/aelf_logo.png" alt="Aelf Logo" />
            </div>
            <div className="search-bar"></div>
            <Button onClick={connect} className="header-button">
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>
          </div>
          <div className="DAO-info">
            <div className="left-aligned">
              <header className="app-header">
                <div className="title-container">
                  <h1>Welcome to Developer DAO</h1>

                  <p className="subtitle">
                    Developer DAO aims to empower developers with the foundation
                    of how DAOs work
                  </p>

                  <p className="collaboration-message">
                    🚀 Brought to you by Aelf Developer Community
                  </p>
                </div>
                <div className="container"></div>
                <div className="header"></div>

                <Button
                  className="header-button"
                  onClick={initializeAndJoinDAO}
                >
                  Join DAO
                </Button>
                <Button
                  className="header-button"
                  onClick={handleCreateProposalClick}
                >
                  Create Proposal
                </Button>
              </header>
            </div>
          </div>
          <div className="proposal-list">
            <h2>Proposals of Developer DAO</h2>
            <div className="proposals">
              {proposals?.proposals.map((proposal, index) => (
                <div key={index} className="proposal-card">
                  <h2>{proposal.title}</h2>
                  <p>{proposal.description}</p>
                  <p>Status: {proposal.status}</p>
                  <p>Vote Threshold: {proposal.voteThreshold}</p>
                  <p>Yes Votes: {proposal.yesVotes.length}</p>
                  <p>No Votes: {proposal.noVotes.length}</p>
                  <div className="button-group">
                    <Button onClick={() => voteNo(index)}>Vote No</Button>
                    <Button onClick={() => voteYes(index)}>Vote Yes</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default HomeDAO;
