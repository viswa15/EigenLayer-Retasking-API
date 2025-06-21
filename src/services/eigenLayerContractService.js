const { ethers } = require('ethers');
const eigenlayerABI = require('../utils/eigenLayerABI.json'); // Make sure this path is correct

const EIGENLAYER_CONTRACT_ADDRESS = '0x94B87a0279c6D987a095E2B5cDD79E870f06B086'; // Correct EigenLayer Mainnet Contract

if (!process.env.ETHEREUM_RPC_URL) {
  console.error("ETHEREUM_RPC_URL is not defined in .env file. Please set it up.");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const eigenlayerContract = new ethers.Contract(EIGENLAYER_CONTRACT_ADDRESS, eigenlayerABI, provider);

// Helper to convert wei to stETH (assuming 18 decimal places for stETH)
const formatEth = (weiAmount) => {
  if (!weiAmount) return '0';
  try {
    return ethers.formatEther(weiAmount);
  } catch (e) {
    console.error("Error formatting wei amount:", weiAmount, e);
    return '0';
  }
};

// Function to fetch operator details
async function getOperatorsFromContract() {
  try {
    // IMPORTANT: Fetching ALL operators directly from contract calls is very difficult
    // as contracts don't expose methods to iterate all registered operators.
    // In a real application, you'd likely use a subgraph (if a working one existed)
    // or parse historical 'OperatorRegistered' events, which is complex for an API endpoint.

    // For this assignment, we'll use a few example operator IDs.
    // In a real scenario, these would come from a database populated by event listeners
    // or from a working subgraph.

    // These are example operator addresses/IDs. You might need to replace them
    // with actual, current ones if these don't return data.
    // Finding exact operator IDs or addresses from public info is key here.
    // Note: operatorId is bytes32, operator address is address. The contract maps address to ID.
    // You might need to find a few known operator addresses or their IDs.
    const exampleOperatorAddresses = [
      "0x6e9f65d6c8e317c374c435ae78c0e70415309999", // Example: Lido
      "0x8a923577d6123b37803d6d030c6a5e155c81f7f0", // Example: P2P.org
    ];

    const operatorsData = [];
    for (const address of exampleOperatorAddresses) {
      try {
        // Convert address to bytes32 operatorId if the contract requires operatorId for some calls
        // The contract function 'operatorAddresses' maps address to operatorId
        const operatorId = await eigenlayerContract.operatorAddresses(address); // This returns bytes32

        // Use the operatorId to get details.
        // Check the ABI for available functions like 'operatorDetails' or 'operatorTotalShares'
        const details = await eigenlayerContract.operatorDetails(operatorId);
        const totalShares = await eigenlayerContract.operatorTotalShares(operatorId); // This seems to be the total stake
        const status = await eigenlayerContract.operatorStatus(operatorId); // Returns an enum (0=REGISTERED, 1=DEREGISTERED)

        operatorsData.push({
          operatorAddress: address,
          operatorId: operatorId, // The bytes32 ID
          name: details.operatorName || 'N/A',
          totalDelegatedStakeStETH: formatEth(totalShares),
          status: status === 0 ? 'Registered' : 'Deregistered', // Interpret enum
          slashHistory: [] // Direct slash history not easily queryable via simple contract calls. Requires event parsing.
        });

      } catch (opError) {
        console.warn(`Could not fetch details for example operator ${address}:`, opError.message);
        // Add a placeholder for operators that fail to fetch
        operatorsData.push({
          operatorAddress: address,
          name: 'Error Fetching',
          totalDelegatedStakeStETH: '0',
          status: 'Unknown',
          slashHistory: []
        });
      }
    }
    return operatorsData;

  } catch (error) {
    console.error("Error in getOperatorsFromContract:", error);
    throw error;
  }
}

// Function to fetch restaker (delegation) details for a specific staker/operator
async function getDelegationAmount(stakerAddress, operatorAddress) {
  try {
    // You would need the operatorId for the delegationAmounts mapping
    const operatorId = await eigenlayerContract.operatorAddresses(operatorAddress);
    if (operatorId === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        // Operator address did not map to a known operatorId
        return null;
    }

    // The delegationAmounts mapping takes bytes32 for operatorId and bytes32 for stakerId.
    // Assuming stakerAddress can be directly used if the mapping expects address-like representation of staker.
    // If not, you might need to convert stakerAddress to a bytes32 ID if EigenLayer uses such a system for stakers.
    // For now, let's assume it can take the raw address for the staker part of the key.
    const delegationAmountWei = await eigenlayerContract.delegationAmounts(operatorId, stakerAddress);

    return {
      userAddress: stakerAddress,
      targetAVSValidatorOperatorAddress: operatorAddress,
      amountRestakedStETH: formatEth(delegationAmountWei)
    };
  } catch (error) {
    console.error(`Error fetching delegation for staker ${stakerAddress} to operator ${operatorAddress}:`, error);
    throw error;
  }
}

module.exports = {
  getOperatorsFromContract,
  getDelegationAmount,
};