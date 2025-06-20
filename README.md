<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h1>🔗 EigenLayer Data API</h1>
  <p>This project is a backend API built with <strong>Node.js</strong> and <strong>Express.js</strong>. It allows you to retrieve real-time data related to EigenLayer restaking, including information about validators (operators) and restakers (delegators), by interacting directly with the Ethereum blockchain.</p>

  <h2>📦 Features</h2>
  <ul>
    <li>Fetch example EigenLayer validator (operator) details including delegated stake</li>
    <li>Query specific restaker (delegator) delegation amounts to a chosen operator</li>
    <li>Direct interaction with Ethereum smart contracts using Ethers.js</li>
    <li>Uses Infura as an RPC provider for blockchain connectivity</li>
    <li>Configurable via environment variables (.env)</li>
  </ul>

  <h2>🗂️ Project Structure</h2>
  <pre><code>your-project/
├── .env                          
├── package.json
├── package-lock.json
├── server.js                     
├── src/
│   ├── config/
│   │   └── db.js                 
│   ├── controllers/
│   │   ├── restakerController.js 
│   │   └── validatorController.js
│   ├── models/
│   │   ├── Restaker.js           
│   │   └── Validator.js          
│   ├── routes/
│   │   ├── index.js              
│   │   ├── restakerRoutes.js     
│   │   └── validatorRoutes.js    
│   ├── services/
│   │   ├── eigenlayerContractService.js 
│   │   └── (subgraphService.js - NO LONGER USED)
│   └── utils/                     
│       └── eigenlayerABI.json     
└── .gitignore                    </code></pre>

  <h2>🚀 Getting Started</h2>

  <h3>1. Clone the repository (if applicable)</h3>

  <h3>2. Install dependencies</h3>

  <h3>3. Configure Environment Variables</h3>

  <h3>4. Set up EigenLayer Contract ABI</h3>
  
  

  <h2>📡 API Endpoints</h2>

  <h3>Get Validators/Operators</h3>
  <p>Retrieves a list of example EigenLayer operators and their delegated stake.</p>
  <p><strong>GET</strong> <code>/api/validators</code></p>

    <p>*(Note: This endpoint uses a limited set of hardcoded example operator addresses in `eigenlayerContractService.js` for demonstration purposes, as fetching all operators directly from the contract is computationally intensive and typically requires event parsing or a dedicated subgraph.)*</p>

  <h3>Get Restaker Delegation Amount</h3>
  <p>Retrieves the restaked amount for a specific staker delegating to a specific operator.</p>
  <p><strong>GET</strong> <code>/api/restakers</code></p>
  <h4>Query Parameters:</h4>
  <ul>
    <li><code>stakerAddress</code>: The Ethereum address of the restaker (e.g., <code>0xAbc123...</code>).</li>
    <li><code>operatorAddress</code>: The Ethereum address of the operator (e.g., <code>0xDef456...</code>).</li>
  </ul>
  <h4>Example:</h4>
  <pre><code>GET http://localhost:3000/api/restakers?stakerAddress=0x...&operatorAddress=0x...</code></pre>
  <h4>Response Example:</h4>
  
    <p>*(Note: Fetching all restakers directly from contract is not feasible for a single API call and would require extensive event parsing or a dedicated subgraph.)*</p>

  <h2>🛠️ Technologies Used</h2>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>Ethers.js</li>
    <li>MongoDB</li>
    <li>Mongoose</li>
    <li>Dotenv</li>
  </ul>

  <h2>📌 Notes</h2>
  <ul>
    <li>**Subgraph Transition:** The project initially aimed to use The Graph subgraphs but pivoted to direct smart contract interaction due to data availability and schema issues.</li>
    <li>**Data Aggregation:** Directly querying all operators or all restaker delegations from smart contracts is not efficient. A more robust solution for comprehensive data would involve listening to blockchain events and storing them in a database.</li>
    <li>The API currently provides limited example data for operators as a full scan is out of scope for a simple API.</li>
  </ul>

  <h2>🧑‍💻 Author</h2>
  <p><strong>Viswa Tummala</strong></p>

  <h2>📃 License</h2>
  <p>This project is licensed under the MIT License.</p>
</body>
</html>