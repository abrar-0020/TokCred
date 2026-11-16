import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  ArrowLeft, 
  RotateCcw,
  Building,
  GraduationCap,
  Calendar,
  Hash,
  User,
  ExternalLink
} from 'lucide-react';
import { verifyUploadedPdf } from '../utils/pdfVerifier';

const VerifyUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target?.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setErrorMsg(null);
    setSelectedFile(file);

    // Validate size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setResult({
        status: 'Invalid File',
        message: 'File size exceeds maximum allowed limit of 10 MB.',
        details: null,
      });
      return;
    }

    // Validate PDF type
    const isPdf = (file.type && file.type === 'application/pdf') || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setResult({
        status: 'Invalid File',
        message: 'Only PDF files (.pdf) are supported.',
        details: null,
      });
      return;
    }

    try {
      setVerifying(true);
      const res = await verifyUploadedPdf(file);
      setResult(res);
    } catch (err) {
      console.error('Verification error:', err);
      setResult({
        status: 'Invalid File',
        message: err?.message || 'Failed to process PDF document.',
        details: null,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Authentic — Valid':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          title: 'Authentic — Valid',
          description: 'Document matches on-chain cryptographic proof, issuer signature is valid, and record is active.',
        };
      case 'Tampered — Do Not Trust':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          badgeBg: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          title: 'Tampered — Do Not Trust',
          description: 'The cryptographic hash of the document data does not match the signed attestation. Details were edited after issuance.',
        };
      case 'Revoked — Invalid':
        return {
          bg: 'bg-red-50 border-red-200 text-red-900',
          badgeBg: 'bg-red-600 text-white',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          title: 'Revoked — Invalid',
          description: 'This credential was officially revoked on-chain by the issuing university.',
        };
      case 'Not Found':
        return {
          bg: 'bg-slate-50 border-slate-300 text-slate-800',
          badgeBg: 'bg-slate-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-slate-600" />,
          title: 'Not Found',
          description: 'The credential ID from the PDF does not exist in the decentralized registry.',
        };
      case 'Invalid File':
      default:
        return {
          bg: 'bg-red-50 border-red-200 text-red-800',
          badgeBg: 'bg-red-600 text-white',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          title: 'Invalid File',
          description: 'Not a recognized TokCred signed PDF or the cryptographic attestation could not be read.',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#CDCDCD] text-[#292333] font-['Inter'] flex flex-col selection:bg-[#7053AD]/20 selection:text-[#513582]">
      {/* ── HEADER NAVIGATION ────────────────────────────────────────── */}
      <div className="w-full pt-[16px] sm:pt-[24px] flex justify-center px-4 sm:px-6 lg:px-16 z-[100] mb-4 shrink-0">
        <div className="w-full max-w-[1312px] flex items-center justify-between relative">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity h-[48px] sm:h-[56px] -ml-2 sm:-ml-6" onClick={() => navigate('/')}>
            <img 
              src="/tokcred_logo-removebg-preview.png" 
              alt="TokCred" 
              className="h-[75px] sm:h-[90px] lg:h-[120px] max-w-none object-contain relative transition-all duration-300" 
            />
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center h-[56px] px-[36px] rounded-full text-[15px] font-[400] gap-[32px] tracking-[-0.01em] shadow-[0_8px_24px_rgba(0,0,0,0.02)] transition-colors duration-300 bg-white text-[#101014]">
            <Link to="/" className="cursor-pointer hover:opacity-70 transition-opacity">Home</Link>
            <Link to="/features" className="cursor-pointer hover:opacity-70 transition-opacity">Features</Link>
            <Link to="/developers" className="cursor-pointer hover:opacity-70 transition-opacity">Developers</Link>
            <Link to="/public-verify" className="cursor-pointer hover:opacity-70 transition-opacity font-semibold text-[#513582]">Public Verify</Link>
          </div>

          {/* Back to Public Verify */}
          <div>
            <button
              type="button"
              onClick={() => navigate('/public-verify')}
              className="h-[44px] sm:h-[50px] px-4 rounded-full bg-white hover:bg-white/90 text-[#292333] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#7053AD]" />
              <span>Back to Lookup</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-16 max-w-[1100px] mx-auto w-full pt-4 sm:pt-8 pb-16">
        
        {/* Title & Context */}
        <div className="flex flex-col items-center text-center max-w-[680px] mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white text-[12px] font-semibold text-[#7053AD] mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic PDF Attestation · No Wallet Required</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-['Cormorant_Garamond'] font-medium leading-[110%] text-[#292333] mb-3">
            Verify Signed Credential PDF
          </h1>

          <p className="text-[14px] sm:text-[15px] leading-[160%] text-[#5B5565]">
            Upload an official TokCred signed PDF certificate. The verifier directly recomputes the SHA-256 hash from the document data, checks the university’s on-chain signature, and verifies active revocation status on Sepolia Ethereum.
          </p>
        </div>

        {/* ── UPLOAD DROPZONE / RESULTS CARD ──────────────────────────── */}
        <div className="w-full bg-white rounded-[24px] border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06)] p-6 sm:p-10 flex flex-col items-center">
          
          {!result ? (
            /* Upload State */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-[760px] min-h-[280px] sm:min-h-[320px] rounded-[18px] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-[#7053AD] bg-[#7053AD]/5 scale-[1.01]' 
                  : 'border-[#D4CEE0] bg-[#FBF9FD] hover:border-[#7053AD]/60 hover:bg-[#F8F5FC]'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-[#513582]/10 text-[#513582] flex items-center justify-center mb-4 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-[18px] font-semibold text-[#292333] mb-1">
                {verifying ? 'Analyzing Cryptographic Attestation...' : 'Drop your signed TokCred PDF here'}
              </h3>

              <p className="text-[13px] text-[#756F80] max-w-[420px] mb-4">
                {verifying 
                  ? 'Recomputing SHA-256 hash and checking on-chain Sepolia registry...'
                  : 'or click to browse your computer. Maximum file size 10 MB (PDF only).'
                }
              </p>

              {verifying ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#513582] text-white text-[13px] font-medium animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                  <span>Verifying on-chain...</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-[#513582] hover:bg-[#41276b] text-white text-[13px] font-medium transition-all shadow-sm"
                >
                  Select PDF Document
                </button>
              )}
            </div>
          ) : (
            /* Result State */
            <div className="w-full max-w-[820px] flex flex-col gap-6">
              
              {/* Status Banner */}
              {(() => {
                const statusInfo = getStatusBadge(result.status);
                return (
                  <div className={`w-full rounded-[16px] border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${statusInfo.bg}`}>
                    <div className="flex items-start gap-3.5">
                      <div className="mt-0.5 shrink-0">{statusInfo.icon}</div>
                      <div className="flex flex-col">
                        <span className="text-[12px] uppercase tracking-wider font-bold opacity-75">
                          Verification Verdict
                        </span>
                        <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight">
                          {statusInfo.title}
                        </h2>
                        <p className="text-[13px] mt-1 opacity-90">
                          {result.message || statusInfo.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-full bg-white text-[#292333] hover:bg-white/80 border border-black/10 text-[12px] font-medium flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer self-end sm:self-center"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#513582]" />
                      <span>Verify another file</span>
                    </button>
                  </div>
                );
              })()}

              {/* Credential Details (Read strictly from the uploaded PDF) */}
              {result.details && (
                <div className="w-full rounded-[16px] border border-[#E5E0EE] bg-[#FAF8FC] p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-[#E5E0EE] pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#7053AD]" />
                      <span className="text-[13px] font-semibold text-[#292333]">
                        Document Attributes (As read from uploaded PDF)
                      </span>
                    </div>
                    {selectedFile && (
                      <span className="text-[12px] font-mono text-[#756F80] truncate max-w-[240px]">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Student Name</span>
                      <span className="text-[15px] font-semibold text-[#292333]">{result.details.name}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Degree Conferred</span>
                      <span className="text-[15px] font-semibold text-[#292333]">{result.details.degree}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Enrolment / Registration No.</span>
                      <span className="text-[14px] font-mono font-medium text-[#292333]">{result.details.enrollmentNumber}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Unique Credential ID</span>
                      <span className="text-[14px] font-mono font-medium text-[#513582]">{result.details.credentialId}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Issuing Institution</span>
                      <span className="text-[14px] font-medium text-[#292333]">{result.details.issuer}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Issue Date</span>
                      <span className="text-[14px] font-medium text-[#292333]">{result.details.issueDate}</span>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:col-span-2 pt-2 border-t border-[#E5E0EE]/70">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#756F80]">Verification Status</span>
                      <span className="text-[14px] font-bold text-[#292333]">{result.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MANDATORY PLAIN WORDS NOTE ───────────────────────────── */}
              <div className="w-full p-4 sm:p-5 rounded-[14px] bg-[#FFFBF0] border border-[#F0E2BE] flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[13px] leading-[150%]">
                  <span className="font-semibold text-amber-950">Important Verifier Notice</span>
                  <p className="text-amber-900 font-medium">
                    This checks that the document is authentic. It does not prove the person presenting it is the owner. Check the enrolment number and the presenter's ID.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default VerifyUpload;
