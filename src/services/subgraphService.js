const axios = require('axios');
require("dotenv").config();

const SUBGRAPH_URL = process.env.SUBGRAPH_URL;

console.log(SUBGRAPH_URL);

if (!SUBGRAPH_URL) {
  console.error("SUBGRAPH_URL is not defined in .env file.");
  process.exit(1);
}

const querySubgraph = async (query) => {
  try {
    const response = await axios.post(SUBGRAPH_URL, { query });
    if (response.data.errors) {
      console.error('Subgraph Errors:', response.data.errors);
      throw new Error('Error querying subgraph');
    }
    return response.data.data;
  } catch (error) {
    console.error('Error querying subgraph:', error.message);
    throw error;
  }
};

// --- Queries for Restakers ---
const getDelegations = async (first = 1000, skip = 0) => {
  const query = `
    query GetDelegations($first: Int, $skip: Int) {
      delegations(first: $first, skip: $skip) {
        id # Unique ID for the delegation
        staker {
          id # Staker address
        }
        operator {
          id # Operator address
        }
        stake {
          id # Stake ID
          stakedAmount # Amount restaked (in wei)
          strategy {
            id # Strategy ID
            # Check strategy ID for stETH, e.g., if it's the Lido strategy
          }
        }
      }
    }
  `;
  const data = await querySubgraph(query, { first, skip });
  return data.delegations;
};


// --- Queries for Validators/Operators ---
const getOperators = async (first = 1000, skip = 0) => {
  const query = `
    query GetOperators($first: Int, $skip: Int) {
      operators(first: $first, skip: $skip) {
        id # Operator address
        totalStake # Total stake delegated to this operator (in wei)
        status # Active, DeRegistered, etc. (need to check subgraph enum)
        slashings { # Check if this exists for slash history
          id
          timestamp
          amount # Amount slashed
          # reason (might not be directly available, might need to infer)
        }
      }
    }
  `;
  const data = await querySubgraph(query, { first, skip });
  return data.operators;
};

// --- Queries for Rewards (Challenging - need to find relevant events) ---
// The subgraph structure for rewards is not immediately clear from the Notion doc.
// We might need to look for events like 'WithdrawalCompleted' or 'RewardsClaimed'
// from the EigenLayer contracts. For this initial phase, we will assume rewards are not
// directly indexed as a simple `Reward` entity.
// We'll leave this function for now, and come back to it if a clear path emerges.
// For now, reward info will be aggregated from other sources or might require
// more advanced subgraph queries on specific events, or even direct RPC calls.
const getRewardEventsForAddress = async (address, first = 100, skip = 0) => {
    // This is a placeholder. You'll need to inspect the subgraph's event structures.
    // For example, if there's a 'WithdrawalCompleted' event with a reward amount.
    const query = `
        query GetRewards($address: String!, $first: Int, $skip: Int) {
            # Placeholder: Replace with actual event or entity related to rewards
            # e.g., userWithdrawals(where: { recipient: $address }, first: $first, skip: $skip) {
            #     amount
            #     timestamp
            #     # ... other reward-related fields
            # }
            # Or perhaps 'stakerWithdrawns' if that's available
            # This part requires a deeper dive into the EigenLayer subgraph's event indexing.
            # For now, this will return empty or throw an error if the entity doesn't exist.
            _meta {
                block {
                    number
                }
            }
        }
    `;
    const data = await querySubgraph(query, { address, first, skip });
    return data; // Needs to be processed based on actual subgraph schema
};


module.exports = {
  getDelegations,
  getOperators,
  getRewardEventsForAddress, // Will require refinement
};