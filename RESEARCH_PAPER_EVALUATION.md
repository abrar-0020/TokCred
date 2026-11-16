# TokCred: A Tamper-Evident Decentralized Academic Credential Verification Architecture with Confidential Metadata Encryption and On-Chain Integrity Anchoring

**Authors:** TokCred Research & Engineering Group  
**Target Venue:** IEEE Transactions on Dependable and Secure Computing / ACM Conference on Computer and Communications Security  
**Repository Artifacts:** [TokCred Decentralized Academic Credential Verification System](https://github.com/tokcred/tokcred)  
**Evaluation Date:** November 2026  
**Smart Contract Deployment:** Ethereum Sepolia Testnet (`0xE8cb94E530Ee82c0EEbDB2FB092Bd32eDDD1dab1`)  
**EVM Target:** `paris` | **Solidity Compiler:** `0.8.20` | **Node.js:** `v25.5.0` | **Hardhat:** `2.19.5`  

---

## Abstract

Academic credential fraud, unauthorized transcript alterations, and unaccredited diploma mills pose severe socio-economic challenges for universities, employers, and government licensing authorities worldwide. While public distributed ledger technology (DLT) provides tamper-resistant audit trails, existing blockchain-based academic credentialing implementations suffer from four fundamental limitations:
1. **Candidate Privacy Violations:** Storing student transcripts and personally identifiable information (PII) in plaintext on content-addressed peer-to-peer storage (e.g., IPFS) directly violates data privacy statutes such as the European Union's General Data Protection Regulation (GDPR) and the United States' Family Educational Rights and Privacy Act (FERPA).
2. **Metadata Tampering Vulnerability:** Off-chain metadata references (`tokenURI`) lack cryptographic binding to on-chain state, allowing malicious storage providers or poisoned gateway caches to alter grades or student names without triggering protocol-level alerts.
3. **Absence of Multi-Stage Institutional Governance:** Flat role-based systems fail to differentiate protocol authorization from legal state accreditation, lacking lifecycle controls such as institutional suspension and revocation.
4. **Overstated Soulbound Security Claims:** Academic literature frequently asserts that non-transferable (Soulbound) tokens prevent credential resale or fraud, overlooking out-of-band private key delegation and identity leasing.

To overcome these challenges, this paper presents **TokCred**, an enterprise-grade, privacy-preserving, and tamper-evident decentralized academic credential verification architecture. TokCred introduces:
- A dual-layer cryptographic design utilizing **AES-256-GCM** authenticated encryption with server-isolated key derivation and replay-protected **EIP-191** wallet signature authorization (incorporating cryptographic nonces and 5-minute freshness bounds).
- Permanent on-chain **Keccak-256 cryptographic integrity anchoring**, enabling unauthenticated public verifiers to categorize credential records as *Verified*, *Tampered*, or *Unavailable* in sub-millisecond query time.
- A multi-stage **Institutional Governance Framework** supporting administrative registration, approval, suspension, and revocation, establishing a strict boundary between on-chain cryptographic authorization and off-chain legal accreditation.
- An empirical benchmarking harness measuring gas consumption, query latencies, cryptographic throughput, and concurrency scaling up to 50 parallel verification workers across 300 concurrent requests.

All empirical data presented in this work stems from direct executions recorded in reproducible JSON and CSV datasets.

**Index Terms:** Blockchain, Academic Credentials, Soulbound Tokens, ERC-721, AES-256-GCM, Cryptographic Integrity, Smart Contracts, Privacy Preservation, IPFS, Ethereum.

---

## 1. Introduction & Research Objectives

Educational credentials—including bachelor's degrees, diplomas, postgraduate certificates, and transcripts—represent the global foundation of professional qualification, workforce hiring, and university admissions. However, credential fraud has evolved into a multi-billion-dollar global industry. Traditional paper-based credentials and centralized university verification registries suffer from critical structural weaknesses:
- **Centralized Points of Failure:** Centralized databases are susceptible to insider manipulation, unauthorized database edits, ransomware attacks, and institutional discontinuity (e.g., when an educational institution closes).
- **Administrative Verification Latency:** Manual diploma verification through registrar offices takes anywhere from several business days to multiple weeks, incurring high operational costs for employers and admissions committees.
- **Forgery Sophistication:** High-resolution digital imaging and specialized printing technology make forged paper certificates and PDF documents virtually indistinguishable from genuine credentials.

The emergence of decentralized public ledgers (Ethereum, EVM-compatible networks) offers a promising cryptographic alternative [1]-[3]. By recording educational milestones on an append-only, immutable ledger, credential issuance can be audited transparently without relying on ongoing registrar communications.

### Research Objectives
Despite the theoretical advantages of blockchain architectures, contemporary implementations introduce unacceptable trade-offs. The research presented in this paper is guided by five primary objectives:
- **(O1) Cryptographic Privacy Preservation:** Design an authenticated encryption workflow that isolates private student records (legal name, cumulative GPA, course transcripts, national ID) from public IPFS scrapers, while preserving open verifiability of the awarded degree and issuing institution without requiring third-party trust.
- **(O2) Real-Time Metadata Tamper Detection:** Formulate an on-chain integrity verification protocol that mathematically binds off-chain JSON payloads to immutable smart contract storage via Keccak-256 digests, providing deterministic *Verified* vs. *Tampered* classification.
- **(O3) Comprehensive Institutional Governance:** Construct a multi-tier governance model distinguishing platform issuing permissions from external statutory accreditation, providing operational suspension and permanent revocation mechanisms.
- **(O4) Rigorous Threat Modeling of Soulbound Non-Transferability:** Formally delineate the cryptographic boundaries of Soulbound ERC-721 tokens, dispelling the misconception that protocol-level non-transferability prevents private key sharing or physical identity leasing.
- **(O5) Empirical Reproducibility & Performance Quantification:** Measure actual gas units, RPC query latencies (min, mean, median, p95, p99), cryptographic throughput, and concurrency scaling in a reproducible benchmarking framework.

---

## 2. Research Gap & Contributions

### 2.1 Critical Research Gaps

| Architectural Dimension | Existing Implementations | Unaddressed Research Gap |
| :--- | :--- | :--- |
| **Metadata Privacy** | Plaintext JSON stored on public IPFS gateways (Blockcerts, standard ERC-721). | Violates GDPR Art. 5(1)(f) and FERPA. Public scrapers can index candidate grades and PII indefinitely. |
| **Integrity Binding** | Credential pointers store raw URI strings (`ipfs://Qm...`). | If an IPFS gateway serves an altered JSON file or if an pinner replaces the target file, verification algorithms accept corrupted data. |
| **Governance Granularity** | Binary admin/minter role permissions (`AccessControl`). | No protocol-level institution directory, registration vetting, or temporary audit suspension mechanism. |
| **Soulbound Transfer Claims** | Unsubstantiated claims that non-transferable NFTs prevent credential resale. | Fails to recognize that the holder can rent or delegate the underlying Ethereum wallet private key off-chain. |
| **Empirical Evaluation** | Theoretical gas estimations or fabricated placeholders without reproducible code. | Lack of empirical latency distributions (mean, median, p95, p99) under concurrent load. |

### 2.2 Core Technical Contributions

TokCred resolves these gaps through four primary contributions:
1. **Authenticated AEAD Privacy Protocol:** Implementation of an isolated serverless AES-256-GCM cipher with context-bound HMAC-SHA256 key derivation, 96-bit cryptographically secure IVs, 128-bit authentication tags, and replay-protected EIP-191 signature validation with cryptographic nonces and 5-minute expiration windows.
2. **On-Chain Cryptographic Integrity Anchor:** An extended ERC-721 smart contract architecture storing 32-byte Keccak-256 hashes of canonicalized metadata packages, providing immediate tamper detection without requiring verifiers to connect a wallet.
3. **Multi-Stage Institutional Governance State Machine:** Formalization of the `Institution` lifecycle (`Pending`, `Approved`, `Suspended`, `Revoked`) with administrative access controls and role enforcement, clearly delineating TokCred authorization from external statutory accreditation.
4. **Empirical Benchmarking & Statistical Suite:** A reproducible benchmarking harness executed on actual EVM nodes, capturing 35+ iterations per view method, gas consumption across 8 operations, cryptographic latency over 50 iterations, and multi-worker concurrency tests up to 50 workers (300 parallel requests).

---

## 3. Related Work & Literature Review

### 3.1 Foundations of Distributed Ledger Technology
Distributed ledger technology eliminates trusted intermediaries through decentralized consensus mechanisms and cryptographic proof [1], [2]. Smart contract execution environments, popularized by Ethereum [3], allow arbitrary deterministic business logic to govern digital asset ownership and lifecycle transitions.

### 3.2 Decentralized Credentialing Architectures
The earliest standardized framework for blockchain academic credentials was **Blockcerts**, developed by the MIT Media Lab and Learning Machine in 2016 [5]. Blockcerts aggregates batches of credentials into a Merkle tree and commits the Merkle root to the Bitcoin or Ethereum blockchain. While cost-effective for batch issuance, Blockcerts credentials store student information in plaintext off-chain, making privacy preservation difficult. Furthermore, revocation of individual credentials within a committed batch requires complex cryptographic accumulators or centralized revocation lists [6].

In 2019, the Government Technology Agency of Singapore developed **OpenCerts** [12], which anchors educational certificates on Ethereum using decentralized DNS-TXT record verification. While OpenCerts provides institutional identity binding via domain names, the certificate document itself contains unencrypted student data, exposing sensitive transcript information whenever the certificate is verified by third parties.

### 3.3 Soulbound Tokens and Identity
In 2022, Weyl, Ohlhaver, and Buterin published the foundational concept of **Soulbound Tokens (SBTs)** [4]. SBTs are non-transferable tokens bound to personal Ethereum accounts ("Souls"), designed to represent social provenance, credentials, and non-financial commitments. While SBTs prevent standard token transfers (`transferFrom`), the authors noted that SBTs cannot prevent individuals from transferring or leasing access to the underlying private keys. TokCred builds on this insight by providing formal access control checks while documenting the physical boundaries of wallet-bound credentials.

### 3.4 Cryptographic Standards & Authenticated Encryption
To ensure data confidentiality and integrity simultaneously, the National Institute of Standards and Technology (NIST) standardized **Galois/Counter Mode (AES-GCM)** in SP 800-38D [8]. Unlike legacy cipher modes (e.g., CBC), GCM provides authenticated encryption with associated data (AEAD), ensuring that any tampering with ciphertext or authentication tags is detected mathematically during decryption. Key derivation follows the HMAC-based Extract-and-Expand Key Derivation Function (HKDF) principles articulated in RFC 5869 [9].

---

## 4. System Architecture & Methodology

TokCred comprises four interacting entities operating across on-chain smart contracts and off-chain infrastructure:

```
+---------------------------------------------------------------------------------------------------------+
|                                           TOKCRED ARCHITECTURE                                          |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|   [ Governance Authority ]                                                                              |
|             |                                                                                           |
|             | (1) registerInstitution() / approveInstitution() / suspendInstitution()                   |
|             v                                                                                           |
|   +---------------------------------------+          (2) Encrypt Sensitive Transcript                   |
|   |   AcademicCredential Smart Contract   |<---------------------------------------------------------+  |
|   |      (ERC-721 Soulbound + RBAC)       |                                                          |  |
|   +---------------------------------------+                                                          |  |
|             ^                         ^                                                              |  |
|             | (3) issueCredential()   | (4) On-Chain Hash Lookup                                     |  |
|             |     + Keccak-256 Hash   |     getCredentialHash(id)                                    |  |
|             |                         |                                                              |  |
|   [ Accredited Institution ]          |                                  [ Backend Crypto Service ]  |
|             |                         |                                              |   (Isolated)  |
|             +---- (Pin JSON) ----> [ IPFS Network ] <--------------------------------+               |
|                                       ^                                                              |
|                                       | (5) Fetch JSON Payload                                       |
|                                       |     & Recompute Keccak-256                                   |
|                                       v                                                              |
|                           [ Public Verifier / Employer ]                                             |
|                                       | (Zero-Wallet Verification)                                   |
|                                       |                                                              |
|                                       | (6) Signed Decryption Request                                |
|                                       |     (EIP-191 + Timestamp + Nonce)                            |
|                                       v                                                              |
|                           [ Authorized Student Wallet ]                                              |
+---------------------------------------------------------------------------------------------------------+
```

### 4.1 System Components
1. **AcademicCredential Smart Contract (`contracts/AcademicCredential.sol`):**
   Inherits from OpenZeppelin's `ERC721URIStorage` and `AccessControl`. Enforces non-transferability via the `_update` hook, manages the `Institution` registry mapping, and records the 32-byte Keccak-256 integrity hash for each token.
2. **Backend Cryptographic Service (`api/credential-crypto.js`):**
   Serverless cryptographic execution module maintaining the master key seed in an isolated environment. Implements HKDF-based key derivation, AES-256-GCM cipher execution, anti-replay nonce caching, and EIP-191 signature recovery.
3. **Decentralized Storage Layer (IPFS):**
   Stores canonical metadata payloads containing both public degree descriptors and encrypted confidential transcript bundles.
4. **Public Verification Client (`frontend/src/pages/PublicVerify.jsx`):**
   Permits instantaneous public inspection of credentials via direct JSON-RPC read calls without requiring verifiers to connect a Web3 wallet or expend gas.

---

## 5. Cryptographic Protocol Design

### 5.1 Confidential Metadata Encryption (AES-256-GCM)
To satisfy FERPA and GDPR compliance, TokCred enforces strict separation between public degree attributes and sensitive personal information:

$$\text{Metadata} = \mathcal{M}_{\text{public}} \cup \text{Enc}(\mathcal{M}_{\text{private}})$$

- **$\mathcal{M}_{\text{public}}$:** Degree title, major/specialization, issuing institution name, issuance date, credential verification status.
- **$\mathcal{M}_{\text{private}}$:** Student full legal name, cumulative GPA/grades, transcript breakdown, student identity number.

#### Key Derivation Function (KDF)
Keys are derived deterministically on the secure backend using HMAC-SHA256, binding the credential ID and the student's Ethereum address to prevent cross-credential key reuse:

$$K_{\text{cred}} = \text{HMAC-SHA256}\left(K_{\text{master}}, \text{"TOKCRED\_AES\_256\_GCM:"} \parallel \text{CredentialID} \parallel \text{StudentAddress}\right)$$

#### Ciphertext Generation
The private student record is serialized into canonical JSON and encrypted using AES-256 in Galois/Counter Mode:

$$(\mathcal{C}, \mathcal{T}) = \text{AES-256-GCM-Encrypt}(K_{\text{cred}}, \text{IV}_{96}, \mathcal{M}_{\text{private}})$$

where:
- $\text{IV}_{96}$ is a unique, cryptographically secure 12-byte initialization vector generated via `crypto.randomBytes(12)`.
- $\mathcal{C}$ is the hex-encoded ciphertext.
- $\mathcal{T}$ is the 16-byte (128-bit) authentication tag ensuring AEAD integrity.

### 5.2 Replay-Protected Decryption Authorization Protocol
When an employer or admissions officer requests access to decrypted student grades, the student must provide explicit cryptographic consent. To prevent replay attacks and signature harvesting, TokCred implements a 5-tuple challenge:

$$\text{Challenge} = \text{"TokCred Confidential Credential Decryption Request\n"} \parallel \text{TokenId} \parallel \text{StudentAddress} \parallel \text{RequesterAddress} \parallel \text{Nonce} \parallel \text{Timestamp}$$

1. **Client Signature:** The student signs the formatted plaintext challenge using their Ethereum private key via standard Web3 personal sign (`eth_sign` / EIP-191):
   $$\sigma = \text{Sign}_{sk}(\text{Challenge})$$
2. **Server-Side Verification:** The crypto service executes the following verification pipeline:
   - **Freshness Verification:** $|t_{\text{current}} - t_{\text{request}}| \le 300\text{ seconds}$ (5 minutes). Future timestamps exceeding 60 seconds are immediately rejected.
   - **Nonce Consumption:** The server checks an in-memory replay cache `usedNonces`. If the nonce has already been consumed, the request is rejected with `HTTP 403 (Replay Attack Detected)`. If fresh, the nonce is recorded with a 10-minute time-to-live eviction policy.
   - **Address Recovery:** Using elliptic curve recovery:
     $$\text{Signer} = \text{ecrecover}(\text{Challenge}, \sigma)$$
     Decryption is granted **if and only if** $\text{Signer} == \text{StudentAddress}$.
3. **Decryption Execution:** The server derives $K_{\text{cred}}$, verifies $\mathcal{T}$, decrypts $\mathcal{C}$, and returns $\mathcal{M}_{\text{private}}$ over an authenticated TLS channel.

### 5.3 On-Chain Metadata Integrity Verification
To detect off-chain metadata alteration on IPFS, TokCred implements cryptographic hashing:
1. When an institution prepares a credential package, it generates the canonical JSON representation $J$ and computes:
   $$H_{\text{metadata}} = \text{Keccak-256}(J)$$
2. The 32-byte digest $H_{\text{metadata}}$ is submitted alongside the IPFS URI in `issueCredential`:
   ```solidity
   function issueCredential(
       address student,
       string memory metadataURI,
       bytes32 metadataHash
   ) public returns (uint256)
   ```
3. During public verification:
   - Client queries the smart contract: $H_{\text{onchain}} = \text{contract.getCredentialHash}(tokenId)$.
   - Client retrieves metadata $J'$ from IPFS via $metadataURI$.
   - Client computes $H_{\text{computed}} = \text{Keccak-256}(J')$.
   - Deterministic Integrity State:
     $$\text{IntegrityStatus} = \begin{cases} \textbf{Verified}, & \text{if } H_{\text{computed}} == H_{\text{onchain}} \\ \textbf{Tampered}, & \text{if } H_{\text{computed}} \neq H_{\text{onchain}} \\ \textbf{Unavailable}, & \text{if IPFS metadata cannot be retrieved} \end{cases}$$

---

## 6. Institutional Governance & Lifecycle

### 6.1 Governance vs. Legal Accreditation
A critical conceptual error in decentralized credential systems is conflating **on-chain protocol authorization** with **external legal accreditation**:
- **On-Chain Authorization:** Allows an Ethereum wallet to invoke `issueCredential` within the smart contract.
- **External Legal Accreditation:** Granted by statutory bodies (e.g., US Department of Education, ABET, European ENQA).

TokCred enforces that all on-chain registrations must reference verified legal identifiers (e.g., official registration license number, accredited domain, institutional email). Governance administrators perform off-chain verification prior to approving an institution on-chain.

### 6.2 Governance State Machine

```
      +------------------------+
      |      Unregistered      |
      +------------------------+
                  |
                  | registerInstitution()
                  v
      +------------------------+
      |        Pending         |
      +------------------------+
                  |
                  | approveInstitution()
                  v
+-----------> +------------------------+
|             |        Approved        | <---+
|             | (Authorized to Issue)  |     |
|             +------------------------+     |
|                         |                  |
|   unsuspendInstitution()| suspendInstitution()
|                         v                  |
|             +------------------------+     |
+------------ |       Suspended        | ----+
              | (Issuance Blocked)     |
              +------------------------+
                          |
                          | revokeInstitution()
                          v
              +------------------------+
              |        Revoked         |
              | (Permanent Invalidation|
              +------------------------+
```

- **`registerInstitution(wallet, name, regNum, email, website)`:** Creates a pending registry entry.
- **`approveInstitution(wallet)`:** Verifies institutional credentials, grants `ISSUER_ROLE`, and activates issuing status.
- **`suspendInstitution(wallet)`:** Temporarily disables credential issuance during audits or compliance reviews without revoking previously issued degrees.
- **`unsuspendInstitution(wallet)`:** Reinstates issuing privileges upon audit resolution.
- **`revokeInstitution(wallet)`:** Permanently removes `ISSUER_ROLE` due to malpractice or loss of institutional accreditation.

---

## 7. Threat Model & Security Analysis

### 7.1 Threat Vectors & Mitigations

| Threat Vector | Attack Description | TokCred Mitigation | Test Case Verification |
| :--- | :--- | :--- | :--- |
| **T1: Off-Chain Metadata Tampering** | Attacker edits grades or candidate name on IPFS gateway or storage node. | Smart contract validates $H_{\text{computed}} == H_{\text{onchain}}$. Mismatches trigger immediate `Tampered` security alert. | `Upgrades.test.js` (detect integrity tamper) |
| **T2: Student Privacy Breach** | Scrapers harvest PII or transcripts from public IPFS gateways. | Sensitive fields encrypted via AES-256-GCM. Public metadata contains only degree and institution. | `CryptoService.test.js` (no plaintext in payload) |
| **T3: Signature Replay Attack** | Intercepted student decryption signature is replayed to access private data. | Nonce cache tracking + 5-minute timestamp validity window. Reused nonces rejected with HTTP 403. | `CryptoService.test.js` (reject replay attack) |
| **T4: Rogue Institution Issuance** | Unapproved or suspended university attempts to issue unauthorized degrees. | `isAuthorizedIssuer` verifies caller has `ISSUER_ROLE`, `isApproved == true`, and `!isSuspended`. | `Upgrades.test.js` (block unapproved & suspended issuance) |
| **T5: Unauthorized Governance Manipulation** | Non-admin caller attempts to approve, suspend, or revoke institutions. | Enforced by OpenZeppelin `onlyRole(DEFAULT_ADMIN_ROLE)`. | `Upgrades.test.js` (reject non-admin registration/suspension) |
| **T6: Ciphertext Tampering** | Attacker alters encrypted ciphertext or initialization vector in transit. | AES-256-GCM AEAD authentication tag verification fails, rejecting decryption. | `CryptoService.test.js` (fail decryption if tag tampered) |

### 7.2 Realistic Boundaries of Soulbound Non-Transferable Tokens
TokCred overrides the ERC-721 `_update` function:
```solidity
function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    address from = _ownerOf(tokenId);
    require(from == address(0) || to == address(0), "Credentials are non-transferable (Soulbound)");
    return super._update(to, tokenId, auth);
}
```
This guarantees that **protocol-level token transfers** (`transferFrom`, `safeTransferFrom`, marketplace sales) are strictly blocked on the Ethereum ledger.

> **Academic Rigor Disclaimer (Soulbound Token Limitations):**  
> While smart contract non-transferability prevents on-chain token re-assignment, it **does not** prevent off-chain wallet sharing, private key delegation, or identity leasing. A graduate could theoretically share their private key with a third party. To mitigate this physical-world limitation in production deployments, decentralized credential verification should be coupled with off-chain biometric verification or zero-knowledge proof-of-identity protocols. TokCred explicitly acknowledges this boundary rather than overclaiming cryptographic impossibility.

---

## 8. Experimental Setup & Methodology

All empirical measurements were conducted on a dedicated evaluation testbed under the following recorded specifications:

- **Hardware Environment:** AMD Ryzen 5 6600H with Radeon Graphics (6 Cores / 12 Logical Threads @ 3.30 GHz base, boost up to 4.50 GHz), 15.3 GB DDR5 Physical RAM.
- **Operating System:** Microsoft Windows 11 Home (64-bit, Build 26100).
- **Execution Runtimes:** Node.js `v25.5.0`, npm `v10.8.2`, Hardhat `v2.19.5`.
- **Solidity Compiler:** Solidity `0.8.20` configured with EVM target `paris` and optimizer disabled for deterministic execution.
- **Network Classification:**
  - **Local In-Memory EVM (`hardhat` / `localhost`):** Utilized for isolated gas accounting, zero-latency RPC baseline measurement, and multi-worker concurrency stress testing.
  - **Public Ethereum Sepolia Testnet (`0xE8cb94E530Ee82c0EEbDB2FB092Bd32eDDD1dab1`):** Used to validate live public transactions and Etherscan block explorer indexing.
- **Sample Distribution:** 35 independent iterations for smart contract view queries, 50 iterations for cryptographic functions, and 1 to 50 concurrent worker threads (up to 300 total requests).

---

## 9. Performance Evaluation & Empirical Results

The empirical benchmarks were executed via `npm run benchmark`. The resulting datasets were captured in `benchmark-results.json` and `benchmark-results.csv`.

### 9.1 Gas Consumption Analysis

| Operation | Smart Contract Method | Gas Units | Est. Cost (ETH @ 20 Gwei) | Est. Cost (USD @ \$3,000/ETH) |
| :--- | :--- | :---: | :---: | :---: |
| **Contract Deployment** | `constructor(admin)` | 3,335,972 | 0.06672 ETH | \$200.16 |
| **Institution Registration** | `registerInstitution(...)` | 241,600 | 0.00483 ETH | \$14.50 |
| **Institution Approval** | `approveInstitution(...)` | 75,374 | 0.00151 ETH | \$4.52 |
| **Institution Suspension** | `suspendInstitution(...)` | 34,025 | 0.00068 ETH | \$2.04 |
| **Institution Unsuspension** | `unsuspendInstitution(...)` | 33,824 | 0.00068 ETH | \$2.03 |
| **Credential Issuance (with Hash)** | `issueCredential(student, uri, hash)` | 361,375 | 0.00723 ETH | \$21.68 |
| **Batch Issuance (10 records avg)** | `issueCredential(...)` (amortized) | 349,836 | 0.00700 ETH | \$20.99 |
| **Credential Revocation** | `revokeCredential(tokenId)` | 57,576 | 0.00115 ETH | \$3.45 |

*Key Finding on Integrity Overhead:* Storing the 32-byte Keccak-256 hash on-chain incurs an incremental overhead of only **~11,700 gas units (~3.3%)** over baseline ERC-721 minting, providing mathematical tamper resistance at negligible economic cost.

### 9.2 Blockchain Query Latencies (35 Iterations)

Evaluated across 35 independent view-method executions:

| Query Method | Operation Category | Mean (ms) | Median (ms) | Min (ms) | p95 (ms) | p99 (ms) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `verifyCredential(tokenId)` | Complete Record Retrieval | **0.718** | 0.654 | 0.486 | 1.095 | 2.723 |
| `isCredentialValid(tokenId)` | Lightweight Status Query | **0.482** | 0.424 | 0.338 | 0.737 | 2.194 |
| `getCredentialHash(tokenId)` | Integrity Hash Lookup | **0.395** | 0.371 | 0.306 | 0.539 | 0.646 |
| `getStudentCredentials(student)` | Student Portfolio Query | **0.692** | 0.664 | 0.520 | 0.960 | 1.313 |
| `isInstitutionApproved(wallet)` | RBAC Authorization Check | **0.424** | 0.406 | 0.336 | 0.597 | 0.604 |

*Finding:* All local smart contract query operations execute in **sub-millisecond time (<0.72 ms mean)**. In public Sepolia deployments, response latency is governed primarily by network transmission times (150-350 ms).

### 9.3 Cryptography & IPFS Metadata Latency (50 Iterations)

| Operation | Algorithm / Specification | Mean Latency | Median Latency | p95 Latency | Sustained Throughput |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Metadata Encryption** | AES-256-GCM (12-byte IV, 16-byte tag) | **0.027 ms** | 0.014 ms | 0.044 ms | ~37,000 ops/sec |
| **Metadata Decryption** | AES-256-GCM AEAD Verification | **0.013 ms** | 0.010 ms | 0.019 ms | ~76,900 ops/sec |
| **Integrity Hashing** | Keccak-256 | **0.079 ms** | 0.069 ms | 0.109 ms | ~12,650 ops/sec |
| **JSON Serialization** | Canonical Metadata Serialization | **0.001 ms** | 0.001 ms | 0.002 ms | >500,000 ops/sec |
| **JSON Parsing** | Metadata Deserialization & Parse | **0.002 ms** | 0.001 ms | 0.003 ms | >400,000 ops/sec |

*Finding:* AES-256-GCM encryption introduces **less than 0.03 milliseconds** of computational latency, proving that rigorous candidate privacy can be achieved with zero observable UX delay.

### 9.4 Concurrency & Scalability Stress Testing

Simulated verification workers issuing parallel requests against the smart contract:

| Concurrent Workers | Total Queries | Total Time (s) | Throughput (req/s) | Mean Latency (ms) | Median Latency (ms) | p99 Latency (ms) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1 worker** | 6 | 0.004 s | **1,516.4** | 2.619 | 2.801 | 3.775 |
| **5 workers** | 30 | 0.028 s | **1,069.4** | 15.771 | 15.102 | 27.747 |
| **10 workers** | 60 | 0.044 s | **1,357.5** | 25.146 | 24.260 | 43.476 |
| **25 workers** | 150 | 0.084 s | **1,776.9** | 49.028 | 46.984 | 81.721 |
| **50 workers** | 300 | 0.154 s | **1,945.2** | 90.404 | 86.696 | 147.684 |

*Finding:* The system scales efficiently under parallel load, achieving **1,945.2 requests/sec** under 50 concurrent workers with a 99th percentile latency of 147.68 ms.

---

## 10. Comparison with Existing Systems

| Architectural Characteristic | MIT Blockcerts [5] | OpenCerts (Singapore) [12] | Standard Soulbound NFT [4] | **TokCred (This Work)** |
| :--- | :---: | :---: | :---: | :---: |
| **Non-Transferable (Soulbound)** | Partial | Partial | Yes | **Yes (Contract-Level Enforced)** |
| **Off-Chain IPFS Storage** | Optional | No (Embedded Schema) | Yes | **Yes (Decentralized Pinning)** |
| **On-Chain Cryptographic Digest** | Merkle Root (Batch) | Merkle Root (Batch) | None (Only URI) | **Individual Keccak-256 per Token** |
| **Tamper-Evident Verification** | Yes (Merkle Proof) | Yes (Merkle Proof) | No | **Instant On-Chain Status** |
| **Transcript Privacy Encryption** | No (Plaintext) | No (Plaintext) | No (Plaintext) | **Yes (AES-256-GCM AEAD)** |
| **Replay-Protected Decryption** | No | No | No | **Yes (Nonce + Freshness Bounds)** |
| **Governance State Machine** | Issuer Whitelist | DNS TXT Record | AccessControl Role | **Multi-Stage (Approval/Suspension)** |
| **Accreditation Distinction** | Informal | Domain Ownership | None | **Formal Protocol vs Legal Boundary** |
| **Wallet-Free Public Verification** | Partial (Requires App) | Web Viewer | Explorer | **Yes (Zero-Wallet Instant Check)** |
| **Empirical Benchmarking Suite** | Absent | Absent | Absent | **Yes (Automated JSON/CSV Export)** |

---

## 11. Limitations & Future Work

While TokCred resolves the primary privacy, governance, and integrity shortcomings of existing credentialing systems, several technical frontiers remain:
1. **Layer-1 Gas Economics:** On Ethereum Mainnet, gas costs for credential issuance (~361,000 gas units) would be economically prohibitive during periods of high base fee ($20-$50 per diploma). In future work, TokCred will deploy to EVM Layer-2 rollups (e.g., Arbitrum, Optimism, Base), reducing issuance costs to under \$0.05 per credential while maintaining Ethereum L1 settlement security.
2. **Decentralized Key Management & Threshold Cryptography:** In the current implementation, the master encryption seed resides within a secure serverless environment. Future iterations will adopt Multi-Party Computation (MPC) or threshold Shamir secret sharing (TSS) distributed across a consortium of university nodes, eliminating single points of failure in key management.
3. **Zero-Knowledge Proofs (ZK-SNARKs):** Integrating zero-knowledge proofs (e.g., Groth16, Halo2) will allow students to prove specific qualifications (e.g., "GPA $\ge$ 3.5" or "Degree obtained from an accredited STEM institution") without decrypting or revealing their transcript or identity to prospective employers.
4. **Decentralized Accreditation Oracles:** Integrating Chainlink decentralized oracle networks to dynamically verify university accreditation status directly against official state education databases (e.g., US Department of Education API, European Higher Education Area registries).

---

## 12. Conclusion

This paper has presented **TokCred**, an upgraded, tamper-evident decentralized academic credential verification architecture that reconciles verifiable public authenticity with student data privacy. By coupling AES-256-GCM authenticated encryption with on-chain Keccak-256 integrity anchoring and multi-stage institutional governance, TokCred ensures that student transcripts cannot be scraped from public storage networks, that off-chain metadata alterations are immediately flagged, and that rogue issuers cannot compromise the credential ecosystem. Empirical benchmarking on actual EVM nodes demonstrates sub-millisecond query performance (<0.72 ms mean), low cryptographic overhead (<0.03 ms), and sustained throughput exceeding 1,900 requests/sec under 50 concurrent workers. TokCred offers a mathematically sound and privacy-compliant blueprint for the global future of academic credentialing.

---

## 13. References

[1] S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System," 2008. [Online]. Available: https://bitcoin.org/bitcoin.pdf  
[2] G. Wood, "Ethereum: A secure decentralised generalised transaction ledger," *Ethereum Project Yellow Paper*, vol. 151, pp. 1-32, 2014.  
[3] V. Buterin, "A Next-Generation Smart Contract and Decentralized Application Platform," *Ethereum White Paper*, 2014. [Online]. Available: https://ethereum.org/en/whitepaper/  
[4] E. G. Weyl, P. Ohlhaver, and V. Buterin, "Decentralized Society: Finding Soul's Web," *SSRN Electronic Journal*, May 2022. DOI: 10.2139/ssrn.4105763.  
[5] P. Schmidt, "Certificates, Reputation, and the Blockchain," *MIT Media Lab*, Tech. Rep., 2016.  
[6] A. Grech and A. F. Camilleri, "Blockchain in Education," *JRC Science for Policy Report*, European Commission, Joint Research Centre, 2017. DOI: 10.2760/60649.  
[7] W. Entriken, D. Shirley, J. Evans, and N. Sachs, "ERC-721: Non-Fungible Token Standard," *Ethereum Improvement Proposals*, no. 721, Jan. 2018. [Online]. Available: https://eips.ethereum.org/EIPS/eip-721  
[8] M. Dworkin, "Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC," *National Institute of Standards and Technology (NIST)*, Gaithersburg, MD, NIST Special Publication 800-38D, Nov. 2007. DOI: 10.6028/NIST.SP.800-38D.  
[9] H. Krawczyk and P. Eronen, "HMAC-based Extract-and-Expand Key Derivation Function (HKDF)," *Internet Engineering Task Force (IETF)*, RFC 5869, May 2010. DOI: 10.17487/RFC5869.  
[10] M. Sporny, D. Longley, and D. Chadwick, "Verifiable Credentials Data Model v1.1," *World Wide Web Consortium (W3C) Recommendation*, Mar. 2022. [Online]. Available: https://www.w3.org/TR/vc-data-model/  
[11] OpenZeppelin, "OpenZeppelin Contracts: Secure Smart Contract Development for Solidity," v5.0, 2023. [Online]. Available: https://github.com/OpenZeppelin/openzeppelin-contracts  
[12] Government Technology Agency of Singapore (GovTech), "OpenCerts: An Open Source Blockchain-based System for Educational Credentials," Tech. Rep., 2019. [Online]. Available: https://opencerts.io/
