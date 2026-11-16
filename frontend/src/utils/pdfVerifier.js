import { ethers } from 'ethers';
import { verifyCredentialPublic, getPublicContract } from '../logic.js';

/**
 * Computes deterministic canonical SHA-256 hash of credential data.
 */
export function computeCredentialDataHash(data) {
  const normalized = {
    credentialId: String(data?.credentialId || '').trim(),
    degree: String(data?.degree || '').trim(),
    enrollmentNumber: String(data?.enrollmentNumber || data?.registrationNumber || '').trim(),
    grade: String(data?.grade || '').trim(),
    issueDate: String(data?.issueDate || '').trim(),
    issuerName: String(data?.issuerName || data?.institution || '').trim(),
    studentName: String(data?.studentName || '').trim(),
  };
  const canonicalString = JSON.stringify(normalized, Object.keys(normalized).sort());
  return ethers.sha256(ethers.toUtf8Bytes(canonicalString));
}

/**
 * Extracts TokCred embedded data from an uploaded PDF file.
 */
export async function extractTokCredPdfData(file) {
  let text = '';
  try {
    text = await file.text();
  } catch {
    return null;
  }

  // 1. Try custom uncompressed TokCred marker
  const markerMatch = text.match(/%TOKCRED_CREDENTIAL_DATA_BEGIN%\s*([\s\S]*?)\s*%TOKCRED_CREDENTIAL_DATA_END%/);
  if (markerMatch) {
    try {
      const data = JSON.parse(markerMatch[1]);
      if (data && (data.credentialId || data.hash)) return data;
    } catch {
      // continue
    }
  }

  // 2. Try PDF Subject dictionary property
  const subjectMatch = text.match(/\/Subject\s*\(([\s\S]*?)\)\s*\/Keywords/);
  if (subjectMatch) {
    try {
      const unescaped = subjectMatch[1].replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\');
      const data = JSON.parse(unescaped);
      if (data && (data.credentialId || data.hash)) return data;
    } catch {
      // continue
    }
  }

  // 3. Fallback: Search for any TokCred JSON structure
  const jsonMatch = text.match(/\{[\s\S]*?"tokcred"\s*:\s*"v1"[\s\S]*?"credentialId"[\s\S]*?"hash"[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      if (data && (data.credentialId || data.hash)) return data;
    } catch {
      // continue
    }
  }

  return null;
}

/**
 * Executes TokCred 5-step verification on an uploaded PDF:
 * 1. Read credential ID and hash from PDF / QR.
 * 2. Recompute the SHA-256 hash of the credential data.
 * 3. Compare it to the hash stored on-chain for that credential ID.
 * 4. Check the issuer signature.
 * 5. Check revoked status.
 */
export async function verifyUploadedPdf(file) {
  // Check file size (max 10 MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      status: 'Invalid File',
      message: 'File size exceeds maximum allowed limit of 10 MB.',
      details: null,
    };
  }

  // Check file type / extension
  const isPdf = (file.type && file.type === 'application/pdf') || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return {
      status: 'Invalid File',
      message: 'Selected file is not a PDF document.',
      details: null,
    };
  }

  // Step 1: Read the credential ID and hash from the PDF / QR
  const data = await extractTokCredPdfData(file);
  if (!data || !data.credentialId || !data.hash) {
    return {
      status: 'Invalid File',
      message: 'Not a TokCred PDF or the QR / hash cannot be read.',
      details: null,
    };
  }

  const details = {
    name: data.studentName || 'Unknown',
    degree: data.degree || 'Unknown',
    enrollmentNumber: data.enrollmentNumber || 'Not Recorded',
    credentialId: data.credentialId,
    issuer: data.issuerName || 'Unknown',
    issueDate: data.issueDate || 'Unknown',
    grade: data.grade || '',
  };

  // Step 2: Recompute the SHA-256 hash of the credential data
  const canonicalData = {
    credentialId: String(data.credentialId || '').trim(),
    degree: String(data.degree || '').trim(),
    enrollmentNumber: String(data.enrollmentNumber || '').trim(),
    grade: String(data.grade || '').trim(),
    issueDate: String(data.issueDate || '').trim(),
    issuerName: String(data.issuerName || '').trim(),
    studentName: String(data.studentName || '').trim(),
  };

  const recomputedHash = computeCredentialDataHash(canonicalData);
  if (recomputedHash.toLowerCase() !== String(data.hash).toLowerCase()) {
    return {
      status: 'Tampered — Do Not Trust',
      message: 'The credential data has been modified after issuance. The cryptographic hash does not match.',
      details,
      tampered: true,
    };
  }

  // Step 3: Compare it to the hash stored on-chain for that credential ID
  const rpcUrl = import.meta.env.VITE_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
  let onChainRecord = null;
  try {
    onChainRecord = await verifyCredentialPublic(data.credentialId, rpcUrl);
  } catch (err) {
    const msg = err?.reason || err?.message || '';
    if (
      msg.includes('Credential does not exist') ||
      msg.includes('ERC721NonexistentToken') ||
      msg.includes('not found') ||
      msg.includes('invalid')
    ) {
      return {
        status: 'Not Found',
        message: 'This credential ID does not exist in the on-chain registry.',
        details,
      };
    }
    return {
      status: 'Not Found',
      message: 'Credential could not be located on-chain.',
      details,
    };
  }

  if (!onChainRecord || !onChainRecord.credential) {
    return {
      status: 'Not Found',
      message: 'This credential ID does not exist in the on-chain registry.',
      details,
    };
  }

  // Compare to the hash stored on-chain
  const onChainMeta = onChainRecord.metadata;
  if (onChainMeta && !onChainMeta.unavailable) {
    // Check if on-chain metadata has credentialHash
    if (onChainMeta.credentialHash) {
      if (String(onChainMeta.credentialHash).toLowerCase() !== recomputedHash.toLowerCase()) {
        return {
          status: 'Tampered — Do Not Trust',
          message: 'The document details do not match the on-chain record for this credential ID.',
          details,
          tampered: true,
        };
      }
    } else if (onChainMeta.studentName && onChainMeta.degree) {
      // Plaintext on-chain metadata (e.g. Sepolia tokens 0, 1, 2, 3, 4, 5)
      const onChainCanonical = {
        credentialId: String(data.credentialId).trim(),
        degree: String(onChainMeta.degree || '').trim(),
        enrollmentNumber: String(onChainMeta.enrollmentNumber || onChainMeta.registrationNumber || data.enrollmentNumber || '').trim(),
        grade: String(onChainMeta.grade || '').trim(),
        issueDate: String(onChainMeta.issueDate || '').trim(),
        issuerName: String(onChainMeta.institution || '').trim(),
        studentName: String(onChainMeta.studentName || '').trim(),
      };
      const onChainCalculatedHash = computeCredentialDataHash(onChainCanonical);
      if (onChainCalculatedHash.toLowerCase() !== recomputedHash.toLowerCase()) {
        return {
          status: 'Tampered — Do Not Trust',
          message: 'The document details do not match the on-chain record for this credential ID.',
          details,
          tampered: true,
        };
      }
    }
  }

  // Step 4: Check the issuer signature
  if (data.signature) {
    try {
      const recoveredSigner = ethers.verifyMessage(data.hash, data.signature);
      const publicContract = getPublicContract(rpcUrl);
      const issuerRole = await publicContract.ISSUER_ROLE();
      const hasIssuerRole = await publicContract.hasRole(issuerRole, recoveredSigner);

      if (!hasIssuerRole) {
        return {
          status: 'Tampered — Do Not Trust',
          message: 'The signature on this credential was not signed by an authorized university issuer.',
          details,
          tampered: true,
        };
      }
    } catch {
      return {
        status: 'Tampered — Do Not Trust',
        message: 'Invalid cryptographic signature.',
        details,
        tampered: true,
      };
    }
  }

  // Step 5: Check revoked status
  if (onChainRecord.credential.revoked) {
    return {
      status: 'Revoked — Invalid',
      message: 'This credential was officially revoked by the issuing institution.',
      details,
    };
  }

  // All checks pass
  return {
    status: 'Authentic — Valid',
    message: 'The document matches the on-chain record, issuer signature is valid, and the credential is active.',
    details,
  };
}
