import { useEffect, useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

/** The real address the page is being viewed at (no hash, no query). */
const pageUrl = () => `${window.location.origin}${window.location.pathname}`;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older in-app browsers
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

export function ShareSection() {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => setCanShare(typeof navigator.share === "function"), []);
  useEffect(() => {
    if (copied === "idle") return;
    const id = window.setTimeout(() => setCopied("idle"), 2600);
    return () => clearTimeout(id);
  }, [copied]);

  const whatsapp = () => {
    const text = `${wedding.share.message}\n\n${pageUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const copy = async () => setCopied((await copyText(pageUrl())) ? "done" : "failed");

  const native = async () => {
    try {
      await navigator.share({ title: wedding.share.title, text: wedding.share.message, url: pageUrl() });
    } catch {
      /* the guest dismissed the share sheet */
    }
  };

  return (
    <section id="share" className="section-pad relative overflow-hidden bg-grey">
      <div className="wrap flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">Spread the Joy</p>
        </Reveal>
        <Reveal variant="heading" delay={0.08}>
          <h2 className="heading mt-5">Share Our Special Day</h2>
        </Reveal>

        <RevealGroup className="mt-10 flex w-full max-w-[720px] flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <RevealItem>
            <button type="button" className="btn btn-primary w-full" onClick={whatsapp}>
              <MessageCircle size={16} strokeWidth={1.6} aria-hidden="true" />
              Share on WhatsApp
            </button>
          </RevealItem>
          <RevealItem>
            <button type="button" className="btn btn-ghost w-full" onClick={copy}>
              {copied === "done" ? (
                <Check size={16} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Link2 size={16} strokeWidth={1.6} aria-hidden="true" />
              )}
              {copied === "done" ? "Link Copied" : "Copy Invitation Link"}
            </button>
          </RevealItem>
          {canShare && (
            <RevealItem>
              <button type="button" className="btn btn-ghost w-full" onClick={native}>
                <Share2 size={16} strokeWidth={1.6} aria-hidden="true" />
                Share
              </button>
            </RevealItem>
          )}
        </RevealGroup>
        <p className="mt-4 min-h-5 font-sans text-[0.78rem] text-forest" aria-live="polite">
          {copied === "done" && "The invitation link is on your clipboard."}
          {copied === "failed" && "Copying was blocked — please copy the address from your browser bar."}
        </p>
      </div>
    </section>
  );
}
