import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Import jsPDF from frontend node_modules
const { jsPDF } = await import('../frontend/node_modules/jspdf/dist/jspdf.es.min.js');

// Import computeCredentialDataHash
import { computeCredentialDataHash } from '../api/credential-crypto.js';

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(rootDir, '.env') });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is required');
}
const issuerWallet = new ethers.Wallet(PRIVATE_KEY);
console.log('Issuer Address:', issuerWallet.address);

const testDir = path.resolve(rootDir, 'test-artifacts');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

async function createTokCredPdf({
  filename,
  credentialId,
  studentName,
  degree,
  enrollmentNumber = 'Not Recorded',
  grade = '9.0',
  issuerName = 'Presidency University',
  issueDate = '2026-09-23',
  tokenId = '0',
  tamperField = null,
  tamperValue = null,
  tamperHash = false,
  isRandomPdf = false
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  if (isRandomPdf) {
    doc.text('This is a random document unrelated to TokCred.', 20, 20);
    const pdfBuf = Buffer.from(doc.output('arraybuffer'));
    const filePath = path.join(testDir, filename);
    fs.writeFileSync(filePath, pdfBuf);
    return filePath;
  }

  // Canonical data
  const canonicalData = {
    credentialId: String(credentialId).trim(),
    degree: String(degree).trim(),
    enrollmentNumber: String(enrollmentNumber).trim(),
    grade: String(grade).trim(),
    issueDate: String(issueDate).trim(),
    issuerName: String(issuerName).trim(),
    studentName: String(studentName).trim(),
  };

  const realHash = computeCredentialDataHash(canonicalData);
  const signature = await issuerWallet.signMessage(realHash);

  // If tampering data, modify after hash and signature are computed
  const embeddedData = {
    tokcred: 'v1',
    credentialId,
    studentName: tamperField === 'studentName' ? tamperValue : studentName,
    degree: tamperField === 'degree' ? tamperValue : degree,
    enrollmentNumber: tamperField === 'enrollmentNumber' ? tamperValue : enrollmentNumber,
    issuerName,
    issueDate,
    grade,
    tokenId,
    hash: tamperHash ? ethers.keccak256(ethers.toUtf8Bytes('fake-hash')) : realHash,
    signature,
  };

  const payloadString = JSON.stringify(embeddedData);

  doc.setProperties({
    title: 'TokCred Signed Degree Certificate',
    subject: payloadString,
    keywords: 'tokcred,signed-pdf',
    author: issuerName,
  });

  doc.text(`TokCred Degree Certificate`, 20, 20);
  doc.text(`Student: ${embeddedData.studentName}`, 20, 30);
  doc.text(`Degree: ${embeddedData.degree}`, 20, 40);
  doc.text(`Credential ID: ${embeddedData.credentialId}`, 20, 50);

  const baseBuf = Buffer.from(doc.output('arraybuffer'));
  const marker = `\n%TOKCRED_CREDENTIAL_DATA_BEGIN%\n${payloadString}\n%TOKCRED_CREDENTIAL_DATA_END%\n`;
  const fullBuf = Buffer.concat([baseBuf, Buffer.from(marker, 'utf8')]);

  const filePath = path.join(testDir, filename);
  fs.writeFileSync(filePath, fullBuf);
  return filePath;
}

console.log('Generating test PDFs...');

// 1. Correct signed PDF (Token 0: John Doe, active on Sepolia)
const validPdf = await createTokCredPdf({
  filename: 'case1-valid-credential.pdf',
  credentialId: '0',
  studentName: 'John Doe',
  degree: 'Bachelor of Science in Computer Science',
  enrollmentNumber: 'Not Recorded',
  grade: '8',
  issuerName: 'Presidency University',
  issueDate: '2026-09-23',
  tokenId: '0'
});

// 2. Tampered PDF (Name edited from John Doe to Jane Doe)
const tamperedPdf = await createTokCredPdf({
  filename: 'case2-tampered-credential.pdf',
  credentialId: '0',
  studentName: 'John Doe',
  degree: 'Bachelor of Science in Computer Science',
  enrollmentNumber: 'Not Recorded',
  grade: '8',
  issuerName: 'Presidency University',
  issueDate: '2026-09-23',
  tokenId: '0',
  tamperField: 'studentName',
  tamperValue: 'Jane Doe'
});

// 3. Revoked demo credential PDF (Token 4: James Smith, revoked: true on Sepolia)
const revokedPdf = await createTokCredPdf({
  filename: 'case3-revoked-credential.pdf',
  credentialId: '4',
  studentName: 'James Smith',
  degree: 'B.Tech',
  enrollmentNumber: 'Not Recorded',
  grade: '9.1',
  issuerName: 'Presidency University',
  issueDate: '21 October 2026',
  tokenId: '4'
});

// 4. Random non-TokCred PDF
const randomPdf = await createTokCredPdf({
  filename: 'case4-random.pdf',
  isRandomPdf: true
});

// 5. Same-name test: two credentials with same name & degree, different enrollment & ID
const sameNamePdf1 = await createTokCredPdf({
  filename: 'case5-samename-student1.pdf',
  credentialId: 'TC-DEMO-001',
  studentName: 'Sarah Jenkins',
  degree: 'Master of Science in Cybersecurity',
  enrollmentNumber: 'ENR-2026-8801',
  grade: '9.5',
  issuerName: 'Presidency University',
  issueDate: '2026-05-15',
  tokenId: '1'
});

const sameNamePdf2 = await createTokCredPdf({
  filename: 'case5-samename-student2.pdf',
  credentialId: 'TC-DEMO-002',
  studentName: 'Sarah Jenkins',
  degree: 'Master of Science in Cybersecurity',
  enrollmentNumber: 'ENR-2026-8802',
  grade: '9.5',
  issuerName: 'Presidency University',
  issueDate: '2026-05-15',
  tokenId: '2'
});

console.log('Test PDFs successfully generated in', testDir);
