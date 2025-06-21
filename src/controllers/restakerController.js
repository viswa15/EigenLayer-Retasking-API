const { getDelegationAmount } = require('../services/eigenLayerContractService'); // ADD THIS LINE

const getRestakers = async (req, res) => {
  try {
    const { stakerAddress, operatorAddress } = req.query;

    if (stakerAddress && operatorAddress) {
      const delegation = await getDelegationAmount(stakerAddress, operatorAddress);
      if (delegation) {
        return res.status(200).json([delegation]);
      } else {
        return res.status(404).json({ message: "Delegation not found for the given staker and operator." });
      }
    } else {
      return res.status(200).json({
        message: "To get restaker details, please provide 'stakerAddress' and 'operatorAddress' as query parameters (e.g., /api/restakers?stakerAddress=0x...&operatorAddress=0x...)."
      });
    }

  } catch (error) {
    console.error('Error fetching restakers from contract:', error);
    res.status(500).json({ message: 'Failed to fetch restakers', error: error.message });
  }
};

module.exports = {
  getRestakers,
};