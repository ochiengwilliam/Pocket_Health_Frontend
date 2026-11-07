import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";

// Android package generated with PWABuilder (Trusted Web Activity wrapping the hosted PWA).
// The signing keystore lives OUTSIDE this repo; assetlinks.json in /public/.well-known must
// keep matching its fingerprint or the app will show a browser URL bar.
const ANDROID_APK_URL = "/downloads/pocket-health.apk";

type Platform = "android" | "ios" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS 13+ reports itself as a Mac, so also check for touch support
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    return "ios";
  }
  return "other";
}

function isInstalledApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari home-screen apps
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    // Android TWA launches carry this referrer
    document.referrer.startsWith("android-app://")
  );
}

const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M17.6 9.48l1.84-3.18a.38.38 0 00-.65-.38l-1.87 3.23A11.4 11.4 0 0012 8.2c-1.77 0-3.43.38-4.92 1.05L5.2 5.92a.38.38 0 00-.65.38L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M16.37 12.73c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.15.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.65zM14.1 5.98c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.51 2.68-1.27z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="inline size-4 align-text-bottom" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AppDownload() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [installed, setInstalled] = useState(false);
  const [iosOpen, setIosOpen] = useState(false);
  const [androidStarted, setAndroidStarted] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isInstalledApp());
  }, []);

  // Already running as the installed app — nothing to offer
  if (installed) return null;

  const isIosSafari =
    platform === "ios" && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);

  const btnBase =
    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40";
  const primary = "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100";
  const secondary =
    "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-white/[0.03]";

  return (
    <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
      <p className="mb-1 text-sm font-medium text-gray-800 dark:text-white/90">Get the Pocket Health app</p>
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        Install it on your phone for quicker access, full-screen use and offline support.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={ANDROID_APK_URL}
          download="PocketHealth.apk"
          onClick={() => setAndroidStarted(true)}
          className={`${btnBase} ${platform === "ios" ? secondary : primary}`}
        >
          <AndroidIcon />
          <span className="leading-tight">
            <span className="block text-[11px] opacity-75">Download for</span>
            <span className="block text-sm font-semibold">Android</span>
          </span>
        </a>

        <button
          type="button"
          onClick={() => setIosOpen(true)}
          className={`${btnBase} ${platform === "ios" ? primary : secondary}`}
        >
          <AppleIcon />
          <span className="leading-tight">
            <span className="block text-[11px] opacity-75">Install on</span>
            <span className="block text-sm font-semibold">iPhone / iPad</span>
          </span>
        </button>
      </div>

      {androidStarted && (
        <div className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
          Downloading… When it finishes, open <strong>PocketHealth.apk</strong> from your notifications or
          Downloads. If Android asks, allow your browser to <em>install unknown apps</em>, then tap{" "}
          <strong>Install</strong>.
        </div>
      )}

      <Modal isOpen={iosOpen} onClose={() => setIosOpen(false)} className="m-4 max-w-[440px] p-6 sm:p-8">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          Install Pocket Health on iPhone / iPad
        </h4>

        {platform !== "ios" ? (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Open <strong className="text-gray-700 dark:text-gray-300">{window.location.host}</strong> in{" "}
            <strong>Safari</strong> on your iPhone or iPad, then follow the steps below.
          </p>
        ) : !isIosSafari ? (
          <p className="mb-4 rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
            For the best result, open this page in <strong>Safari</strong>.
          </p>
        ) : (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Apple installs web apps straight from Safari — it only takes three taps:
          </p>
        )}

        <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {[
            <>Tap the <strong>Share</strong> button <ShareIcon /> in the Safari toolbar.</>,
            <>Scroll down and tap <strong>Add to Home Screen</strong>.</>,
            <>Tap <strong>Add</strong>. Pocket Health now opens from your Home Screen like any other app.</>,
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => setIosOpen(false)}
          className="mt-6 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600"
        >
          Got it
        </button>
      </Modal>
    </div>
  );
}
