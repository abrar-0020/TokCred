# TokCred Android Architecture & Smart Contract Specification
> **Instructions for Google AI Studio / Gemini Pro:**  
> Use this document as the single source of truth to build the native Android application (Kotlin + Jetpack Compose) for the **Decentralized Academic Credential Verification System (TokCred)**.

---

## 1. Project Overview & Objectives
TokCred is a decentralized platform where universities issue academic certificates as **Soulbound (non-transferable) ERC-721 NFTs** on the Ethereum blockchain (Sepolia Testnet), and employers/verifiers can instantly verify authenticity using cryptographic proofs and IPFS metadata.

The Android app serves two main user experiences:
1. **Verifiers & Employers (Primary):** Instant QR scanning or manual Token ID lookup to verify credentials on-chain, inspecting student records, issuing university details, and validity status.
2. **Students / Graduates:** Mobile credential wallet to view their issued academic certificates in a luxury physical-card style, with shareable verification QR codes.

---

## 2. Design System: "Light Premium" (Luxury Academic / Fintech)
Do **not** use a dark theme. The design must look like an elite university credential registry (Apple / Stripe / Luxury Fintech aesthetic):

- **Background:** Soft Off-White / Alabaster (`#F8FAFC` or `#F9FBFF`).
- **Cards & Surfaces:** Crisp Pure White (`#FFFFFF`) with ultra-fine borders (`#E2E8F0` at 1dp) and diffused soft elevation dropshadows.
- **Primary Brand / Action:** Deep Royal Navy / Oxford Blue (`#0F172A` / `#1E3A8A`) for buttons, headings, and high-priority controls.
- **Accent / Honors:** Champagne Gold (`#D4AF37` / `#C5A059`) for verified seals, distinction badges, and award highlights.
- **Status Colors:**
  - **Verified / Valid:** Rich Emerald Green (`#059669` / background `#ECFDF5`).
  - **Revoked:** Crimson Red (`#DC2626` / background `#FEF2F2`).
  - **Pending / Scanning:** Warm Amber (`#D97706`).
- **Typography:** Material 3 with clean geometric sans-serif (Inter / Outfit / Roboto).
- **Physical Certificate Card Aesthetic:** Rounded corners (16dp-20dp), subtle watermark seal, gold-foil badge styling, and crisp typography.

---

## 3. Blockchain & Smart Contract Details

### Network Information
- **Network Name:** Ethereum Sepolia Testnet
- **Chain ID:** `11155111`
- **RPC Endpoint:** `https://ethereum-sepolia-rpc.publicnode.com` (or Infura / Alchemy Sepolia RPC)
- **Explorer:** `https://sepolia.etherscan.io`
- **Deployed Contract Address:** `0x4b948b20C17E793021835a3423B42A2da71E96b3`
- **Contract Name:** `AcademicCredential` (Symbol: `ACADCRED`)

### Contract Solidity Architecture
The smart contract inherits OpenZeppelin's `ERC721`, `ERC721URIStorage`, and `AccessControl`. Tokens are **Soulbound** (all peer-to-peer transfers are blocked in `_update()`).

#### Solidity Struct
```solidity
struct Credential {
    uint256 tokenId;
    address student;
    string metadataURI;
    uint256 issueTimestamp;
    bool revoked;
}
```

#### Core Read Functions Required by the Mobile App
1. **`verifyCredential(uint256 tokenId)`**
   - Returns: `Credential` struct `(tokenId, student, metadataURI, issueTimestamp, revoked)`
2. **`isCredentialValid(uint256 tokenId)`**
   - Returns: `bool` (`true` if exists and `revoked == false`)
3. **`getStudentCredentials(address student)`**
   - Returns: `uint256[]` (array of all token IDs minted for this student address)
4. **`tokenURI(uint256 tokenId)`**
   - Returns: `string` (IPFS URI, e.g. `ipfs://Qm...` or `https://ipfs.io/ipfs/...`)
5. **`getTotalCredentials()`**
   - Returns: `uint256` (total issued counter)

### Minimal Smart Contract ABI (JSON for Web3j / Web3.kt)
```json
[
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "verifyCredential",
    "outputs": [
      {
        "components": [
          {"name": "tokenId", "type": "uint256"},
          {"name": "student", "type": "address"},
          {"name": "metadataURI", "type": "string"},
          {"name": "issueTimestamp", "type": "uint256"},
          {"name": "revoked", "type": "bool"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "isCredentialValid",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "student", "type": "address"}],
    "name": "getStudentCredentials",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCredentials",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]
```

---

## 4. Off-Chain IPFS Metadata Schema
When `tokenURI(tokenId)` is resolved, it points to a JSON file on IPFS (format: `ipfs://<CID>` or `https://gateway.pinata.cloud/ipfs/<CID>`).

### Metadata JSON Schema
```json
{
  "name": "Bachelor of Science in Computer Science - John Doe",
  "description": "Academic credential issued by Massachusetts Institute of Technology...",
  "institution": "Massachusetts Institute of Technology",
  "studentName": "John Doe",
  "degree": "Bachelor of Science in Computer Science",
  "grade": "A (3.9/4.0 GPA)",
  "issueDate": "2024-05-15",
  "image": "ipfs://QmExample123.../certificate-image.png",
  "attributes": [
    { "trait_type": "Institution", "value": "Massachusetts Institute of Technology" },
    { "trait_type": "Degree", "value": "Bachelor of Science in Computer Science" },
    { "trait_type": "Grade", "value": "A (3.9/4.0 GPA)" },
    { "trait_type": "Specialization", "value": "Artificial Intelligence" },
    { "trait_type": "Honors", "value": "Summa Cum Laude" }
  ],
  "external_url": "https://institution.edu"
}
```

*Note on IPFS resolution:* Convert `ipfs://<CID>` to `https://ipfs.io/ipfs/<CID>` or a custom gateway (Pinata / Cloudflare) to load the JSON metadata and images with Coil in Compose.

---

## 5. Mobile App Tech Stack & Architecture

### Recommended Stack
* **Language:** Kotlin
* **UI Toolkit:** Jetpack Compose with Material 3
* **Architecture:** MVVM + Clean Architecture with Repository pattern
* **Async Flow:** Kotlin Coroutines & `StateFlow`
* **Dependency Injection:** Hilt
* **Blockchain Client:** `org.web3j:core:4.9.8` (or Ktor + raw JSON-RPC `eth_call`)
* **Camera / QR Scanning:** CameraX (`androidx.camera`) + Google ML Kit Barcode Scanning (`com.google.mlkit:barcode-scanning`)
* **Image Loading:** Coil (`io.coil-kt:coil-compose`)
* **HTTP / JSON:** Retrofit 2 + Kotlinx Serialization / Gson

### App Package Structure
```text
com.tokcred.app/
├── data/
│   ├── model/
│   │   ├── CredentialOnChain.kt       // On-chain struct
│   │   ├── CredentialMetadata.kt      // IPFS JSON model
│   │   └── FullCredentialRecord.kt    // Combined UI model
│   ├── remote/
│   │   ├── Web3RpcService.kt          // Ethereum Sepolia calls
│   │   └── IpfsApiService.kt          // IPFS gateway fetcher
│   └── repository/
│       └── CredentialRepositoryImpl.kt
├── domain/
│   ├── repository/
│   │   └── CredentialRepository.kt
│   └── usecase/
│       ├── VerifyCredentialUseCase.kt
│       └── GetStudentPortfolioUseCase.kt
├── presentation/
│   ├── theme/
│   │   ├── Color.kt                  // Light Premium palette
│   │   ├── Type.kt
│   │   └── Theme.kt
│   ├── scanner/
│   │   ├── QrScannerScreen.kt         // CameraX + ML Kit overlay
│   │   └── QrScannerViewModel.kt
│   ├── verification/
│   │   ├── VerificationResultScreen.kt// Luxury Certificate View
│   │   └── VerificationViewModel.kt
│   ├── student/
│   │   ├── StudentPortfolioScreen.kt  // Digital Card Carousel
│   │   └── StudentViewModel.kt
│   └── components/
│       ├── CertificateCard.kt
│       ├── StatusBadge.kt
│       └── PremiumTopBar.kt
└── MainActivity.kt
```

---

## 6. Detailed Key Screen Specifications

### Screen 1: QR Scanner (Verifier Mode)
- **Camera Viewfinder:** Clean, minimal white rounded bounding box with gold corner accents.
- **Scanning Logic:**
  - Reads QR code string. QR codes encode either a raw `tokenId` (e.g. `"0"`, `"12"`), an in-app deep link (e.g., `tokcred://verify?tokenId=0`), or a web URL (e.g. `https://tokcred.com/verify/0`).
  - Regex or URI parser extracts the `tokenId`.
  - Triggers haptic feedback (`HapticFeedbackType.LongPress`) on valid scan and navigates to the result screen.
- **Manual Input Fallback:** A bottom sheet or button to manually type a numeric Token ID or paste a Student Address.

### Screen 2: Verification Result (The Crown Jewel Screen)
- **Certificate Header:** University Crest / Seal, Institution Name, and "Verified On-Chain" green badge with checkmark.
- **Recipient Section:** "Awarded to **[studentName]** for completing **[degree]** with Grade **[grade]**".
- **Security & Blockchain Accordion:**
  - Token ID: `#0`
  - Student Address: `0x71...8B20` (with copy button)
  - Contract Address: `0x4b94...96b3`
  - Issue Timestamp: Human-readable UTC date & time
  - Status: **VALID & ACTIVE** or **REVOKED**
  - "View on Etherscan" button opening `https://sepolia.etherscan.io/address/0x4b948b20C17E793021835a3423B42A2da71E96b3`.

### Screen 3: Student Portfolio (Student Mode)
- Input wallet address or connect wallet.
- Calls `getStudentCredentials(studentAddress)`.
- Loops through token IDs, fetching each credential + IPFS metadata.
- Shows horizontal snapping carousel of luxurious, embossed physical-style credential cards.
- Clicking "Share" on any card opens a high-contrast QR code for employers to scan.

---

## 7. How to Prompt Google AI Studio
When prompting Google AI Studio:
1. Upload or paste this entire `ANDROID_APP_ARCHITECTURE.md` file.
2. Ask for specific modules sequentially:
   - **Step 1:** "Based on the specification, generate the Gradle dependencies, Theme (Color.kt, Theme.kt for the Light Premium aesthetic), and data models."
   - **Step 2:** "Generate the `Web3RpcService` and `CredentialRepository` that calls the `verifyCredential` smart contract function on Sepolia testnet and fetches the IPFS metadata."
   - **Step 3:** "Generate the CameraX + ML Kit QR scanner Jetpack Compose screen."
   - **Step 4:** "Generate the Verification Result screen with the luxury physical certificate UI."
