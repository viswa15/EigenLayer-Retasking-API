const Validator = require('../models/Validator');

const { getOperatorsFromContract } = require('../services/eigenLayerContractService'); // ADD THIS LINE

const getValidators = async (req, res) => {
  try {
    const validators = await getOperatorsFromContract();
    res.status(200).json(validators);
  } catch (error) {
    console.error('Error fetching validators from contract:', error);
    res.status(500).json({ message: 'Failed to fetch validators', error: error.message });
  }
};

module.exports = {
  getValidators,
};