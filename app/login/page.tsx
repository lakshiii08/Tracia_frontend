"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [operatorId, setOperatorId] = useState("");
  const [cipher, setCipher] = useState("");
  const [rememberId, setRememberId] = useState(true);
  const [showCipher, setShowCipher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Read the remembered Operator ID after mount only — reading localStorage
    // during the initial render would cause a server/client hydration mismatch.
    const saved = window.localStorage.getItem("tracia_operator_id");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setOperatorId(saved);
  }, []);

  async function handleAuthenticate() {
    setError("");
    const normalizedId = operatorId.trim();
    if (!normalizedId || !cipher) {
      setError("Operator ID and Access Cipher are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorId: normalizedId, cipher }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Authentication failed.");
        return;
      }
      if (rememberId) window.localStorage.setItem("tracia_operator_id", normalizedId.toUpperCase());
      else window.localStorage.removeItem("tracia_operator_id");
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next?.startsWith("/") ? next : "/dashboard");
    } catch {
      setError("Authentication service is unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center text-on-background overflow-hidden relative">
      {/* Decorative background glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(74, 142, 255, 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="z-10 w-full max-w-md px-4 md:px-0">
        {/* Login Card */}
        <div className="bg-surface-container-low rounded-lg ghost-border p-5 md:p-8 flex flex-col gap-6 relative overflow-hidden backdrop-blur-md">
          {/* Branding */}
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uobrx15NX-th2SRzR4twNvC0SzcBuxSIkWGKncDvStNkLGKf6Soahde1aAbhW3FtPn3hPT669jjv1yThKgm9NfcAQq2ykzfJ5h19emOPla1iPuD9LhmfyX1wmurh01NRhvtG7tmHzJBKX0YDM5MLKeQIHCojhG3A781cWSbMwkuV8wwumKxkf48N4u-EtQVK1dgsaOM0XLnzrPojDBGKAnHh2-BMZ7mcuWlzGy296b9MTqDs5qxGc"
              alt="TRACIA Hexagonal Logo"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              unoptimized
            />
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
                TRACIA
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px] mx-auto">
                Trace, Relationship &amp; Criminal Intelligence Analytics
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form
            className="flex flex-col gap-4 mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthenticate();
            }}
          >
            <div className="flex flex-col gap-2">
              <label
                className="font-label-mono text-label-mono text-on-surface-variant"
                htmlFor="operator-id"
              >
                Operator ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  badge
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-outline-variant text-on-surface focus:border-primary focus:ring-1 focus:ring-primary rounded pl-10 pr-3 py-2 font-code-sm text-code-sm transition-all duration-200 outline-none"
                  id="operator-id"
                  placeholder="Enter Operator ID"
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <label
                className="font-label-mono text-label-mono text-on-surface-variant"
                htmlFor="cipher"
              >
                Access Cipher
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  password
                </span>
                <input
                  className="w-full bg-surface-container-lowest border-outline-variant text-on-surface focus:border-primary focus:ring-1 focus:ring-primary rounded pl-10 pr-3 py-2 font-code-sm text-code-sm transition-all duration-200 outline-none"
                  id="cipher"
                  placeholder="••••••••••••"
                  type={showCipher ? "text" : "password"}
                  value={cipher}
                  onChange={(e) => setCipher(e.target.value)}
                  aria-invalid={Boolean(error)}
                />
                <button type="button" aria-label={showCipher ? "Hide Access Cipher" : "Show Access Cipher"} onClick={() => setShowCipher(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-outline hover:text-primary">
                  <span className="material-symbols-outlined text-[18px]">{showCipher ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-entity-risk/30 bg-entity-risk/10 px-3 py-2.5 text-sm text-error">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer select-none">
              <input type="checkbox" checked={rememberId} onChange={(e) => setRememberId(e.target.checked)} className="accent-primary" />
              Remember Operator ID on this terminal
            </label>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-2 bg-surface-container/50 py-2 rounded-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-entity-account text-[16px]">
                verified_user
              </span>
              <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px]">
                Secured with JWT Authentication
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-4 w-full bg-entity-person text-on-surface font-headline-md text-headline-md py-3 rounded flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all duration-200 glow-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <span className="h-5 w-5 rounded-full border-2 border-current/30 border-t-current animate-spin" /> : <span className="material-symbols-outlined text-[20px]">login</span>}
              {loading ? "AUTHENTICATING…" : "AUTHENTICATE"}
            </button>
          </form>

          <div className="border-t border-outline-variant/50 pt-4 mt-2">
            <p className="font-body-sm text-body-sm text-on-surface-variant/70 text-center text-[12px]">
              Authorized roles: Admin / Investigator / Analyst / Auditor
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-0">
        <span className="font-code-sm text-code-sm text-outline-variant text-[11px] uppercase opacity-60">
          SYSTEM_STATUS: SECURE_LINK
        </span>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 text-right z-0">
        <span className="font-code-sm text-code-sm text-outline-variant text-[11px] uppercase opacity-60">
          SESSION_ID: TX-992
        </span>
        <span className="font-code-sm text-code-sm text-outline-variant text-[11px] uppercase opacity-60">
          TERMINAL: TRACIA_CORE_v1.0
        </span>
      </div>
    </div>
  );
}
