using AElf.Cryptography.ECDSA;
using AElf.Testing.TestBase;

namespace AElf.Contracts.BuildersDAO
{
    // The Module class load the context required for unit testing
    public class Module : ContractTestModule<BuildersDAO>
    {
        
    }
    
    // The TestBase class inherit ContractTestBase class, it defines Stub classes and gets instances required for unit testing
    public class TestBase : ContractTestBase<Module>
    {
        // The Stub class for unit testing
        internal readonly BuildersDAOContainer.BuildersDAOStub BuildersDAOStub;
        // A key pair that can be used to interact with the contract instance
        private ECKeyPair DefaultKeyPair => Accounts[0].KeyPair;

        public TestBase()
        {
            BuildersDAOStub = GetBuildersDAOContractStub(DefaultKeyPair);
        }

        private BuildersDAOContainer.BuildersDAOStub GetBuildersDAOContractStub(ECKeyPair senderKeyPair)
        {
            return GetTester<BuildersDAOContainer.BuildersDAOStub>(ContractAddress, senderKeyPair);
        }
    }
    
}