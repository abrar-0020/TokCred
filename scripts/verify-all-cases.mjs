import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';
import { computeCredentialDataHash } from '../api/credential-crypto.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const testDir = path.resolve(rootDir, 'test-artifacts');

const RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
const CONTRACT_ADDRESS = '0xE8cb94E530Ee82c0EEbDB2FB092Bd32eDDD1dab1';

const CONTRACT_ABI = [
  'function ISSUER_ROLE() view returns (bytes32)',
  'function hasRole(bytes32, address) view returns (bool)',
  'function getTotalCredentials() view returns (uint256)',
  'function verifyCredential(uint256) view returns (tuple(uint256 tokenId, address student, string metadataURI, uint256 issueTimestamp, bool revoked))',
  'function getCredentialDetails(uint256) view returns (tuple(uint256 tokenId, address student, string metadataURI, uint256 issueTimestamp, bool revoked))',
  'function ownerOf(uint256) view returns (address)'
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

function extractTokCredPdfDataFromBuffer(buffer) {
  const text = buffer.toString('binary');

  // 1. Uncompressed TokCred marker
  const markerMatch = text.match(/%TOKCRED_CREDENTIAL_DATA_BEGIN%\s*([\s\S]*?)\s*%TOKCRED_CREDENTIAL_DATA_END%/);
  if (markerMatch) {
    try {
      const data = JSON.parse(markerMatch[1]);
      if (data && (data.credentialId || data.hash)) return data;
    } catch {}
  }

  // 2. PDF Subject dictionary property
  const subjectMatch = text.match(/\/Subject\s*\(([\s\S]*?)\)\s*\/Keywords/);
  if (subjectMatch) {
    try {
      const unescaped = subjectMatch[1].replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
      const data = JSON.parse(unescaped);
      if (data && (data.credentialId || data.hash)) return data;
    } catch {}
  }

  return null;
}

async function verifyPdfFile(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size > 10 * 1024 * 1024) {
    return {
      status: 'Invalid File',
      message: 'File size exceeds maximum allowed limit of 10 MB.',
      details: null
    };
  }

  if (!filePath.toLowerCase().endsWith('.pdf')) {
    return {
      status: 'Invalid File',
      message: 'Selected file is not a PDF document.',
      details: null
    };
  }

  const buffer = fs.readFileSync(filePath);
  const data = extractTokCredPdfDataFromBuffer(buffer);

  if (!data || !data.credentialId || !data.hash) {
    return {
      status: 'Invalid File',
      message: 'Not a TokCred PDF or the QR / hash cannot be read.',
      details: null
    };
  }

  const details = {
    name: data.studentName || 'Unknown',
    degree: data.degree || 'Unknown',
    enrollmentNumber: data.enrollmentNumber || 'Not Recorded',
    credentialId: data.credentialId,
    issuer: data.issuerName || 'Unknown',
    issueDate: data.issueDate || 'Unknown',
    grade: data.grade || ''
  };

  // Step 2: Recompute the SHA-256 hash of the credential data
  const canonicalData = {
    credentialId: String(data.credentialId || '').trim(),
    degree: String(data.degree || '').trim(),
    enrollmentNumber: String(data.enrollmentNumber || '').trim(),
    grade: String(data.grade || '').trim(),
    issueDate: String(data.issueDate || '').trim(),
    issuerName: String(data.issuerName || '').trim(),
    studentName: String(data.studentName || '').trim()
  };

  const recomputedHash = computeCredentialDataHash(canonicalData);
  if (recomputedHash.toLowerCase() !== String(data.hash).toLowerCase()) {
    return {
      status: 'Tampered — Do Not Trust',
      message: 'The credential data has been modified after issuance. The cryptographic hash does not match.',
      details,
      tampered: true
    };
  }

  // Step 3: Compare it to the hash stored on-chain for that credential ID
  let onChainRecord = null;
  try {
    const rawId = String(data.credentialId).trim();
    let parsedTokenId = null;
    if (/^\d+$/.test(rawId)) {
      parsedTokenId = BigInt(rawId);
    } else if (/^TC-TOKEN-(\d+)$/i.test(rawId)) {
      parsedTokenId = BigInt(rawId.match(/^TC-TOKEN-(\d+)$/i)[1]);
    } else if (data.tokenId !== undefined && /^\d+$/.test(String(data.tokenId))) {
      parsedTokenId = BigInt(data.tokenId);
    }

    if (parsedTokenId !== null) {
      const cred = await contract.verifyCredential(parsedTokenId);
      onChainRecord = { credential: cred };
    }
  } catch (err) {
    const msg = err?.reason || err?.message || '';
    if (msg.includes('Credential does not exist') || msg.includes('ERC721NonexistentToken') || msg.includes('missing revert data')) {
      return {
        status: 'Not Found',
        message: 'This credential ID does not exist in the on-chain registry.',
        details
      };
    }
  }

  if (!onChainRecord) {
    return {
      status: 'Not Found',
      message: 'This credential ID does not exist in the on-chain registry.',
      details
    };
  }

  // Step 4: Check issuer signature
  if (!data.signature) {
    return {
      status: 'Tampered — Do Not Trust',
      message: 'Issuer signature is missing from credential data.',
      details,
      tampered: true
    };
  }

  try {
    const recoveredSigner = ethers.verifyMessage(data.hash, data.signature);
    const issuerRole = await contract.ISSUER_ROLE();
    const hasIssuerRole = await contract.hasRole(issuerRole, recoveredSigner);
    if (!hasIssuerRole) {
      return {
        status: 'Tampered — Do Not Trust',
        message: 'The signature on this credential was not signed by an authorized university issuer.',
        details,
        tampered: true
      };
    }
  } catch (err) {
    return {
      status: 'Tampered — Do Not Trust',
      message: 'Invalid cryptographic signature.',
      details,
      tampered: true
    };
  }

  // Step 5: Check revoked status
  if (onChainRecord.credential.revoked) {
    return {
      status: 'Revoked — Invalid',
      message: 'This credential was officially revoked by the issuing institution.',
      details
    };
  }

  return {
    status: 'Authentic — Valid',
    message: 'The document matches the on-chain record, issuer signature is valid, and the credential is active.',
    details
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('TOKCRED PDF VERIFICATION TEST SUITE');
  console.log('====================================================\n');

  const cases = [
    {
      name: 'Case 1: Upload the correct signed PDF',
      file: path.join(testDir, 'case1-valid-credential.pdf'),
      expected: 'Authentic — Valid'
    },
    {
      name: 'Case 2: Edit the name in a copy of the PDF and upload it',
      file: path.join(testDir, 'case2-tampered-credential.pdf'),
      expected: 'Tampered — Do Not Trust'
    },
    {
      name: 'Case 3: Upload a revoked demo credential PDF',
      file: path.join(testDir, 'case3-revoked-credential.pdf'),
      expected: 'Revoked — Invalid'
    },
    {
      name: 'Case 4: Upload a random non-TokCred PDF',
      file: path.join(testDir, 'case4-random.pdf'),
      expected: 'Invalid File'
    },
    {
      name: 'Case 5A: Same-name test (Student 1)',
      file: path.join(testDir, 'case5-samename-student1.pdf'),
      expectedEnrollment: 'ENR-2026-8801',
      expectedId: 'TC-DEMO-001'
    },
    {
      name: 'Case 5B: Same-name test (Student 2)',
      file: path.join(testDir, 'case5-samename-student2.pdf'),
      expectedEnrollment: 'ENR-2026-8802',
      expectedId: 'TC-DEMO-002'
    }
  ];

  let passedCount = 0;

  for (const c of cases) {
    console.log(`Testing: ${c.name}`);
    console.log(`File: ${path.basename(c.file)}`);
    const res = await verifyPdfFile(c.file);
    console.log(`Verdict: "${res.status}"`);
    console.log(`Message: "${res.message}"`);
    if (res.details) {
      console.log('Extracted Details:', JSON.stringify(res.details, null, 2));
    }

    if (c.expected) {
      if (res.status === c.expected) {
        console.log(`✅ PASS: Matches expected status "${c.expected}"\n`);
        passedCount++;
      } else {
        console.log(`❌ FAIL: Expected "${c.expected}", got "${res.status}"\n`);
      }
    } else if (c.expectedEnrollment) {
      const enrMatch = res.details?.enrollmentNumber === c.expectedEnrollment;
      const idMatch = res.details?.credentialId === c.expectedId;
      if (enrMatch && idMatch) {
        console.log(`✅ PASS: Correctly distinguished enrollment "${res.details.enrollmentNumber}" and ID "${res.details.credentialId}"\n`);
        passedCount++;
      } else {
        console.log(`❌ FAIL: Enrollment or ID mismatch\n`);
      }
    }
  }

  console.log('====================================================');
  console.log(`Summary: ${passedCount} / ${cases.length} tests passed.`);
  console.log('====================================================');
}

runTests().catch(console.error);
