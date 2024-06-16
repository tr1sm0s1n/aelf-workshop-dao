import { IPortkeyProvider, IChain } from "@portkey/provider-types";
import { useEffect, useState } from "react";

function useDAOSmartContract(provider: IPortkeyProvider | null) {
  const [smartContract, setSmartContract] =
    useState<ReturnType<IChain["getContract"]>>();

  //Step A - Setup Portkey Wallet Provider
useEffect(() => {
  (async () => {
    if (!provider) return null;

    try {
      // 1. get the sidechain tDVW using provider.getChain
      const chain = await provider?.getChain("tDVW");
      if (!chain) throw new Error("No chain");

      //Address of DAO Smart Contract
      //Replace with Address of Deployed Smart Contract
      const address = "2DcGHYWLv9JrDJWmKUrv4jgCTRSrSMWHABUxTNY3UEmsLu4XZF";

      // 2. get the DAO contract
      const daoContract = chain?.getContract(address);
      setSmartContract(daoContract);
    } catch (error) {
      console.log(error, "====error");
    }
  })();
}, [provider]);

  return smartContract;
}

export default useDAOSmartContract;
