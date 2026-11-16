import React, { useState, useEffect } from 'react';
import SharedPillNav from '../components/SharedPillNav';
import { Copy, Check, ExternalLink, AlertTriangle, Terminal, Code2, ArrowRight, Play, BookOpen } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   TOKCRED DEVELOPER DOCS — Production EVM Smart Contract Portal
   Theme: Vetra-Inspired Cinematic Horizon (#0C0C0C & Burnt Orange #FF6F32)
   Smart Contract Addresses:
     • Sepolia Testnet:  0xE8cb94E530Ee82c0EEbDB2FB092Bd32eDDD1dab1 (Chain 11155111)
     • Localhost Dev:    0x5FbDB2315678afecb367f032d93F642f64180aa3 (Chain 31337)
───────────────────────────────────────────────────────────────────────────── */

const CONTRACT_ADDRESS_SEPOLIA = '0xE8cb94E530Ee82c0EEbDB2FB092Bd32eDDD1dab1';
const CONTRACT_ADDRESS_LOCAL = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'prerequisites', label: 'Prerequisites', icon: 'setup' },
  { id: 'verify-credential', label: 'Verify a credential', icon: 'read' },
  { id: 'issue-credential', label: 'Issue a credential', icon: 'write' },
  { id: 'revoke-credential', label: 'Revoke a credential', icon: 'revoke' },
  { id: 'abi-reference', label: 'Contract ABI reference', icon: 'abi' },
  { id: 'networks', label: 'Networks & addresses', icon: 'network' },
];

const CODE_VERIFY = `import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '${CONTRACT_ADDRESS_SEPOLIA}';
const ABI = [
  "function verifyCredential(uint256 tokenId) public view returns (tuple(uint256 tokenId, address student, string metadataURI, uint256 issuedAt, bool revoked))",
  "function isCredentialValid(uint256 tokenId) public view returns (bool)",
];

async function verifyCredential(tokenId) {
  // Read-only provider: no private keys or browser extension needed
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const [isValid, credential] = await Promise.all([
    contract.isCredentialValid(tokenId),
    contract.verifyCredential(tokenId),
  ]);

  return {
    isValid,
    tokenId: credential.tokenId.toString(),
    student: credential.student,
    metadataURI: credential.metadataURI,
    issuedAt: new Date(Number(credential.issuedAt) * 1000),
    revoked: credential.revoked,
  };
}`;

const CODE_ISSUE = `import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '${CONTRACT_ADDRESS_SEPOLIA}';
const ISSUE_ABI = [
  "function issueCredential(address student, string memory metadataURI) public returns (uint256)",
  "event CredentialIssued(uint256 indexed tokenId, address indexed student, address indexed issuer, string metadataURI)"
];

async function issueCredential(studentAddress, ipfsUri) {
  // Connect MetaMask signer (write access)
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ISSUE_ABI, signer);

  // Submit issue transaction
  const tx = await contract.issueCredential(studentAddress, ipfsUri);
  const receipt = await tx.wait();

  // Parse CredentialIssued event from receipt
  const event = receipt.logs
    .map((log) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((e) => e && e.name === 'CredentialIssued');

  return {
    txHash: receipt.hash,
    tokenId: event.args.tokenId.toString(),
    student: event.args.student,
  };
}`;

const CODE_REVOKE = `import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '${CONTRACT_ADDRESS_SEPOLIA}';
const REVOKE_ABI = [
  "function revokeCredential(uint256 tokenId) public",
  "event CredentialRevoked(uint256 indexed tokenId, address indexed issuer)"
];

async function revokeCredential(tokenId) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, REVOKE_ABI, signer);

  const tx = await contract.revokeCredential(tokenId);
  const receipt = await tx.wait();

  return {
    success: receipt.status === 1,
    txHash: receipt.hash,
  };
}`;

const RETURN_SHAPES = [
  { name: 'isValid', type: 'boolean', desc: 'false if revoked or not found' },
  { name: 'tokenId', type: 'string', desc: 'The credential unique token ID' },
  { name: 'student', type: 'string (address)', desc: 'Owner student recipient address' },
  { name: 'metadataURI', type: 'string', desc: 'IPFS URI for metadata JSON descriptor' },
  { name: 'issuedAt', type: 'Date', desc: 'Standard JS Date timestamp object' },
  { name: 'revoked', type: 'boolean', desc: 'true if issuing institution revoked it' },
];

const ABI_METHODS = [
  {
    sig: 'verifyCredential(uint256)',
    returns: 'CredentialData tuple',
    access: 'Public read — no wallet',
    isPrimary: false,
  },
  {
    sig: 'isCredentialValid(uint256)',
    returns: 'bool',
    access: 'Public read — no wallet',
    isPrimary: false,
  },
  {
    sig: 'getStudentCredentials(address)',
    returns: 'uint256[]',
    access: 'Public read — no wallet',
    isPrimary: false,
  },
  {
    sig: 'issueCredential(address, string)',
    returns: 'uint256 tokenId',
    access: 'Requires ISSUER_ROLE',
    isPrimary: true,
  },
  {
    sig: 'revokeCredential(uint256)',
    returns: 'void',
    access: 'Requires ISSUER_ROLE',
    isPrimary: true,
  },
  {
    sig: 'grantRole(bytes32, address)',
    returns: 'void',
    access: 'Requires DEFAULT_ADMIN_ROLE',
    isAdmin: true,
  },
  {
    sig: 'getTotalCredentials()',
    returns: 'uint256',
    access: 'Public read — no wallet',
    isPrimary: false,
  },
];

const Developers = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedKey, setCopiedKey] = useState(null);

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white selection:bg-[#FF6F32] selection:text-white font-['Inter',sans-serif] relative overflow-x-hidden">
      {/* ── Atmospheric Planetary Glow CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dev-planet-glow {
          position: absolute;
          top: 300px;
          left: 50%;
          transform: translateX(-50%);
          width: 1300px;
          height: 600px;
          border-radius: 100%;
          background: radial-gradient(ellipse 60% 45% at 50% 40%, rgba(255, 111, 50, 0.38) 0%, rgba(255, 111, 50, 0.12) 45%, rgba(12, 12, 12, 0) 75%);
          filter: blur(55px);
          pointer-events: none;
          z-index: 1;
        }
        .dev-planet-horizon-crest {
          position: relative;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          height: 280px;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
        }
        .dev-planet-arc-body {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 1400px;
          height: 700px;
          border-radius: 50% / 100% 100% 0 0;
          background: radial-gradient(ellipse 70% 35% at 50% 0%, #150b06 0%, #0c0c0c 80%);
          border-top: 2px solid #FF6F32;
          box-shadow: 
            0 -8px 30px rgba(255, 111, 50, 0.85),
            0 -25px 80px rgba(255, 111, 50, 0.45),
            inset 0 4px 28px rgba(255, 111, 50, 0.4);
        }
      `}} />

      {/* ── 1. Current App Dark Pill Navbar ── */}
      <SharedPillNav variant="dark" />

      {/* ── 2. Cinematic Hero Section with Planetary Arc ── */}
      <section className="relative z-10 pt-36 pb-10 sm:pt-44 sm:pb-16 overflow-hidden text-center">
        {/* Atmospheric Ambient Glow behind Hero */}
        <div aria-hidden="true" className="dev-planet-glow" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Pill Announcement Badge */}
          <div className="inline-flex items-center p-1 pr-4 rounded-full bg-[#171717]/90 border border-white/10 hover:border-[#FF6F32]/50 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300 group cursor-pointer mb-8">
            <span className="bg-[#FF6F32] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full mr-2.5 shadow-sm shadow-[#FF6F32]/50">
              v1.2.0 is live!
            </span>
            <span className="text-xs text-white/80 font-medium group-hover:text-white flex items-center transition-colors">
              Read release notes
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-white/50 group-hover:text-[#FF6F32] group-hover:translate-x-0.5 transition-all" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl mx-auto">
            Integrate Verifiable Credentials with Web3
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 font-normal leading-relaxed mb-10">
            TokCred is a decentralized credential smart contract deployed on Ethereum. Interact directly using standard ethers.js v6 libraries with zero proprietary lock-in.
          </p>

          {/* CTA Pill Buttons Side-by-Side */}
          <div className="flex flex-col sm:row items-center justify-center gap-4 mb-8">
            <a 
              href="#overview"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-semibold bg-[#FF6F32] text-white shadow-[0_0_24px_rgba(255,111,50,0.5)] hover:bg-[#FF824C] hover:shadow-[0_0_32px_rgba(255,111,50,0.7)] active:scale-95 transition-all duration-200"
            >
              <span>Read Quickstart</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>

            <a 
              href="#verify-credential"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#141414]/90 text-white/90 border border-white/20 hover:border-white/40 hover:bg-[#1a1a1a] hover:text-white backdrop-blur-md transition-all duration-200 group"
            >
              <Play className="w-3.5 h-3.5 mr-2 text-[#FF6F32] group-hover:scale-110 transition-transform fill-[#FF6F32]" />
              <span>View Sample DApp</span>
            </a>
          </div>

          {/* Prominent Warning Notice Callout */}
          <div className="max-w-2xl mx-auto p-3.5 rounded-[12px] bg-[#141414]/85 border border-[#FF6F32]/35 backdrop-blur-md shadow-2xl flex items-start space-x-3 text-left">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-[#FF6F32]" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-white tracking-wide">Notice:</span>
              <span className="text-white/80 ml-1">
                The contract is actively deployed on <span className="text-[#FF6F32] font-mono">Sepolia Testnet</span> for developers. Mainnet deployment is in progress.
              </span>
            </div>
          </div>
        </div>

        {/* The Signature Curved Horizon Arc / Planet Rim */}
        <div className="dev-planet-horizon-crest mt-8">
          <div className="dev-planet-arc-body" />
        </div>
      </section>

      {/* ── 3. Main Content with Sticky Sidebar Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-1 bg-[#121212] p-4 rounded-[16px] border border-[#222222]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 px-3 py-2">
                Documentation Nav
              </div>
              
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white bg-white/[0.06] border-l-2 border-[#FF6F32]'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#FF6F32] shadow-[0_0_8px_#FF6F32]' : 'bg-white/20'}`} />
                    <span>{item.label}</span>
                  </a>
                );
              })}

              <div className="pt-4 mt-4 border-t border-[#222222]">
                <a
                  href="https://github.com/abrar-0020/Tokenized-Academic-Credential-Verification-System"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-[#FF6F32]" />
                    <span>GitHub Repository</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content Body */}
          <main className="lg:col-span-9 space-y-16">
            
            {/* 01 Overview */}
            <section className="scroll-mt-32 space-y-4" id="overview">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>01</span>
                <span>/</span>
                <span>Introduction</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Overview</h2>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                TokCred provides tamper-proof, non-fungible educational and credential verification on public EVM ledgers. 
                Because operations execute over standard JSON-RPC nodes, developers can seamlessly query verify status directly with any provider without needing an intermediate proprietary backend.
              </p>
            </section>

            {/* 02 Prerequisites */}
            <section className="scroll-mt-32 space-y-6 pt-4 border-t border-[#1C1C1C]" id="prerequisites">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>02</span>
                <span>/</span>
                <span>Setup</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Prerequisites</h2>
              <p className="text-white/70 text-sm sm:text-base">
                Make sure your environment meets the runtime dependencies before interacting with the TokCred smart contract:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Item 1 */}
                <div className="p-4 rounded-[12px] bg-[#121212] border border-[#222222] flex items-start space-x-3.5">
                  <div className="p-2 rounded-[8px] bg-white/5 text-[#FF6F32] mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Node.js 18 or later</h4>
                    <p className="text-xs text-white/50 mt-1">Recommended LTS v18.x or v20.x for native Fetch &amp; crypto primitives.</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 rounded-[12px] bg-[#121212] border border-[#222222] flex items-start space-x-3.5">
                  <div className="p-2 rounded-[8px] bg-white/5 text-[#FF6F32] mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">ethers.js v6</h4>
                    <p className="text-xs text-white/50 mt-1">Latest version 6 of the ethers library (v5 requires syntax changes).</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-4 rounded-[12px] bg-[#121212] border border-[#222222] flex items-start space-x-3.5">
                  <div className="p-2 rounded-[8px] bg-white/5 text-[#FF6F32] mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Sepolia RPC Endpoint</h4>
                    <p className="text-xs text-white/50 mt-1">Infura, Alchemy, or public endpoint like <span className="font-mono text-white/70">rpc.sepolia.org</span>.</p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="p-4 rounded-[12px] bg-[#121212] border border-[#222222] flex items-start space-x-3.5">
                  <div className="p-2 rounded-[8px] bg-white/5 text-[#FF6F32] mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Browser Wallet (MetaMask)</h4>
                    <p className="text-xs text-white/50 mt-1">Required strictly for write operations (issuing, revoking).</p>
                  </div>
                </div>
              </div>

              {/* Copyable CLI Command Card */}
              <div className="rounded-[12px] overflow-hidden bg-[#121212] border border-[#242424] shadow-xl">
                <div className="px-4 py-2.5 bg-[#171717] border-b border-[#242424] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="text-xs font-mono text-white/40 ml-2">bash — install</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('npm install ethers', 'npm-install')}
                    className="text-xs text-white/60 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'npm-install' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#FF6F32]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 font-mono text-sm text-white/90 flex items-center space-x-3">
                  <span className="text-[#FF6F32] select-none">$</span>
                  <span>npm install <span className="text-white font-semibold">ethers</span></span>
                </div>
              </div>
            </section>

            {/* 03 Verify a credential */}
            <section className="scroll-mt-32 space-y-6 pt-4 border-t border-[#1C1C1C]" id="verify-credential">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>03</span>
                <span>/</span>
                <span>Read Operations</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Verify a credential</h2>
                <p className="text-white/70 text-sm sm:text-base mt-2">
                  Verification is a read-only operation. No wallet connection is required. The result is returned directly from the blockchain via standard JSON-RPC query.
                </p>
              </div>

              {/* Code Snippet Container */}
              <div className="rounded-[12px] overflow-hidden bg-[#111111] border border-[#222222] shadow-2xl">
                <div className="px-4 py-2.5 bg-[#161616] border-b border-[#222222] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FF6F32]" />
                    <span className="font-mono text-xs text-white/80 font-medium">verify-credential.js</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(CODE_VERIFY, 'verify-code')}
                    className="text-xs font-mono text-white/50 hover:text-[#FF6F32] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'verify-code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-white/85 bg-[#0C0C0C]/50">
                  <code>{CODE_VERIFY}</code>
                </pre>
              </div>

              {/* Return Shape Specification */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-mono text-white/50">Return Shape Specification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {RETURN_SHAPES.map((shape) => (
                    <div key={shape.name} className="p-3.5 rounded-[8px] bg-[#141414] border border-[#222222]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm text-[#FF6F32] font-semibold">{shape.name}</span>
                        <span className="text-[11px] font-mono text-white/40">{shape.type}</span>
                      </div>
                      <p className="text-xs text-white/70">{shape.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 04 Issue a credential */}
            <section className="scroll-mt-32 space-y-6 pt-4 border-t border-[#1C1C1C]" id="issue-credential">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>04</span>
                <span>/</span>
                <span>Write Operations</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Issue a credential</h2>
                <p className="text-white/70 text-sm sm:text-base mt-2">
                  Requires the connected wallet to hold <code className="text-white bg-white/10 px-1.5 py-0.5 rounded-[4px] font-mono text-xs">ISSUER_ROLE</code> on the contract. Role assignment is managed exclusively by the contract owner (<code className="text-white bg-white/10 px-1.5 py-0.5 rounded-[4px] font-mono text-xs">DEFAULT_ADMIN_ROLE</code>).
                </p>
              </div>

              {/* Code Snippet Container */}
              <div className="rounded-[12px] overflow-hidden bg-[#111111] border border-[#222222] shadow-2xl">
                <div className="px-4 py-2.5 bg-[#161616] border-b border-[#222222] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FF6F32]" />
                    <span className="font-mono text-xs text-white/80 font-medium">issue-credential.js</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(CODE_ISSUE, 'issue-code')}
                    className="text-xs font-mono text-white/50 hover:text-[#FF6F32] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'issue-code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-white/85 bg-[#0C0C0C]/50">
                  <code>{CODE_ISSUE}</code>
                </pre>
              </div>
            </section>

            {/* 05 Revoke a credential */}
            <section className="scroll-mt-32 space-y-6 pt-4 border-t border-[#1C1C1C]" id="revoke-credential">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>05</span>
                <span>/</span>
                <span>Revocation</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Revoke a credential</h2>
                <p className="text-white/70 text-sm sm:text-base mt-2">
                  Only the original issuing wallet (holding <code className="text-white bg-white/10 px-1.5 py-0.5 rounded-[4px] font-mono text-xs">ISSUER_ROLE</code>) may revoke. Revocation sets <code className="text-[#FF6F32] font-mono text-xs">revoked = true</code> on the credential. The token remains immutably on-chain for record verification, but <code className="text-[#FF6F32] font-mono text-xs">isCredentialValid</code> will subsequently return <code className="text-white font-mono text-xs">false</code>.
                </p>
              </div>

              {/* Code Snippet Container */}
              <div className="rounded-[12px] overflow-hidden bg-[#111111] border border-[#222222] shadow-2xl">
                <div className="px-4 py-2.5 bg-[#161616] border-b border-[#222222] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FF6F32]" />
                    <span className="font-mono text-xs text-white/80 font-medium">revoke-credential.js</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(CODE_REVOKE, 'revoke-code')}
                    className="text-xs font-mono text-white/50 hover:text-[#FF6F32] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'revoke-code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-white/85 bg-[#0C0C0C]/50">
                  <code>{CODE_REVOKE}</code>
                </pre>
              </div>
            </section>

            {/* 06 Contract ABI reference */}
            <section className="scroll-mt-32 space-y-6 pt-4 border-t border-[#1C1C1C]" id="abi-reference">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>06</span>
                <span>/</span>
                <span>Interface</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Contract ABI reference</h2>
                <p className="text-white/70 text-sm sm:text-base mt-2">
                  Comprehensive list of primary callable functions available on the deployed TokCred contract interface.
                </p>
              </div>

              {/* ABI Table */}
              <div className="overflow-x-auto rounded-[12px] border border-[#222222] bg-[#121212]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#171717] text-white/50 font-mono text-xs uppercase border-b border-[#242424]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold" scope="col">Method Signature</th>
                      <th className="py-3.5 px-4 font-semibold" scope="col">Returns</th>
                      <th className="py-3.5 px-4 font-semibold" scope="col">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F] font-mono text-xs">
                    {ABI_METHODS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className={`py-3.5 px-4 font-medium ${row.isPrimary ? 'text-[#FF6F32]' : 'text-white'}`}>
                          {row.sig}
                        </td>
                        <td className="py-3.5 px-4 text-white/60">{row.returns}</td>
                        <td className="py-3.5 px-4">
                          {row.isAdmin ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] bg-red-500/10 text-red-400 border border-red-500/30 font-sans font-medium">
                              {row.access}
                            </span>
                          ) : row.isPrimary ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] bg-[#FF6F32]/10 text-[#FF6F32] border border-[#FF6F32]/30 font-sans font-medium">
                              {row.access}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] bg-white/5 text-white/80 border border-white/10 font-sans">
                              {row.access}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 07 Networks & addresses */}
            <section className="scroll-mt-32 space-y-6 pt-4 border-t border-[#1C1C1C] pb-16" id="networks">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FF6F32] uppercase">
                <span>07</span>
                <span>/</span>
                <span>Deployments</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Networks &amp; addresses</h2>
                <p className="text-white/70 text-sm sm:text-base mt-2">
                  Verified deployments on Ethereum testnets and local development environments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sepolia Card */}
                <div className="p-5 rounded-[12px] bg-[#121212] border border-[#242424] relative overflow-hidden group hover:border-[#FF6F32]/50 transition-colors">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FF6F32]/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white flex items-center space-x-2">
                      <span>Sepolia Testnet</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FF6F32]/20 text-[#FF6F32] border border-[#FF6F32]/30 uppercase tracking-wide">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white/60">
                      <span>Chain ID</span>
                      <span className="font-mono text-white">11155111</span>
                    </div>
                    <div className="text-white/60">
                      <div className="mb-1">Contract Address</div>
                      <div className="flex items-center justify-between bg-[#181818] p-2 rounded-[6px] border border-[#282828]">
                        <span className="font-mono text-white text-[11px] truncate">
                          {CONTRACT_ADDRESS_SEPOLIA}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(CONTRACT_ADDRESS_SEPOLIA, 'sepolia-addr')}
                          className="text-white/50 hover:text-[#FF6F32] ml-2 flex-shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'sepolia-addr' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Localhost Card */}
                <div className="p-5 rounded-[12px] bg-[#121212] border border-[#242424] relative overflow-hidden group hover:border-white/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white flex items-center space-x-2">
                      <span>Localhost (Hardhat)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/10 text-white/60 border border-white/20 uppercase tracking-wide">
                      Dev Only
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white/60">
                      <span>Chain ID</span>
                      <span className="font-mono text-white">31337</span>
                    </div>
                    <div className="text-white/60">
                      <div className="mb-1">Contract Address</div>
                      <div className="flex items-center justify-between bg-[#181818] p-2 rounded-[6px] border border-[#282828]">
                        <span className="font-mono text-white text-[11px] truncate">
                          {CONTRACT_ADDRESS_LOCAL}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(CONTRACT_ADDRESS_LOCAL, 'local-addr')}
                          className="text-white/50 hover:text-[#FF6F32] ml-2 flex-shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'local-addr' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Developers;
