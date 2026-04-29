import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Instagram,
  Mail,
  Palette,
  Phone,
  Shield,
  Zap,
} from "lucide-react";
import { BlurText } from "@/components/BlurText";
import logoIcon from "../Logo.jpg";
import featureOne from "@/assets/feature-1.gif";
import featureTwo from "@/assets/feature-2.gif";

const AGENCY_NAME = "ADI Agency";
const FOUNDER_NAME = "ADI BIN SHERAZ";
const CONTACT_EMAIL = "adi.binsheraz@gmail.com";
const INSTAGRAM_HANDLE = "@adibinsheraz";
const INSTAGRAM_URL = "https://instagram.com/adibinsheraz";
const PHONE_DISPLAY = "92+3007537001";
const PHONE_LINK = "tel:+923007537001";
const WHATSAPP_NUMBER = "923007537001";
const HERO_VIDEO_MP4 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";
const PROCESS_VIDEO_HLS = "https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8";
const STATS_VIDEO_HLS = "https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8";
const CTA_VIDEO_HLS = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";
const SITE_URL = "https://adiagency.netlify.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T | undefined>((resolve) => {
    const timeoutId = window.setTimeout(() => resolve(undefined), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch(() => resolve(undefined))
      .finally(() => window.clearTimeout(timeoutId));
  });
}

function setMetaTag(name: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector(`meta[${name}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(name, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(url: string) {
  let canonical = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function trackEvent(event: string, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) gtag("event", event, params);
}

function addHeadLink(rel: string, href: string, crossOrigin = true) {
  const existing = document.head.querySelector(`link[rel="${rel}"][href="${href}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (crossOrigin) link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

function InitialLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white">
      <img src={logoIcon} alt={`${AGENCY_NAME} logo`} className="h-20 w-20 rounded-full object-contain" />
      <p className="mt-5 font-heading text-3xl italic">{AGENCY_NAME}</p>
      <div className="mt-8 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <p className="mt-3 text-xs text-white/60">Loading experience...</p>
    </div>
  );
}

function HlsBackgroundVideo({
  src,
  className,
  liteMode = false,
}: {
  src: string;
  className?: string;
  liteMode?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "250px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => undefined);
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: !liteMode,
        backBufferLength: liteMode ? 12 : 30,
        maxBufferLength: liteMode ? 10 : 20,
        maxMaxBufferLength: liteMode ? 20 : 40,
        capLevelToPlayerSize: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      const onManifestParsed = () => {
        video.play().catch(() => undefined);
      };
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        hls.destroy();
      });
      return () => {
        hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
        hls.destroy();
      };
    }
  }, [src, liteMode, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
          return;
        }
        video.pause();
      },
      { threshold: 0.12 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload={liteMode ? "metadata" : "auto"}
      disablePictureInPicture
      className={className ?? "absolute inset-0 h-full w-full object-cover"}
    />
  );
}

const navItems = [
  { label: "Home", id: "home" },
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Process", id: "process" },
  { label: "Pricing", id: "pricing" },
];
const reveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65 },
  },
};

export default function App() {
  const [isBootReady, setIsBootReady] = useState(false);
  const location = useLocation();
  const isLiteMode = useMemo(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const saveData = connection?.saveData ?? false;
    const slowNetwork = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    return reducedMotion || saveData || slowNetwork || lowCpu || memory <= 4;
  }, []);
  const isMobile = useMemo(
    () =>
      window.matchMedia?.("(max-width: 768px)")?.matches ??
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const minLoaderTime = new Promise((resolve) => window.setTimeout(resolve, 650));
    const criticalAssets = [logoIcon];
    const preloadAssets = Promise.allSettled(criticalAssets.map((asset) => preloadImage(asset)));
    const waitForFonts = document.fonts?.ready ?? Promise.resolve();
    const preloadTimeout = isMobile ? 2000 : 1500;

    addHeadLink("preconnect", "https://d8j0ntlcm91z4.cloudfront.net");
    addHeadLink("preconnect", "https://stream.mux.com");
    addHeadLink("dns-prefetch", "//d8j0ntlcm91z4.cloudfront.net", false);
    addHeadLink("dns-prefetch", "//stream.mux.com", false);

    Promise.all([
      minLoaderTime,
      withTimeout(preloadAssets, preloadTimeout),
      withTimeout(waitForFonts, preloadTimeout),
    ]).finally(() => {
      if (!cancelled) setIsBootReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isMobile]);

  useEffect(() => {
    const isPricing = location.pathname === "/pricing";
    const title = isPricing
      ? `${AGENCY_NAME} Pricing - Premium Web Solutions`
      : `${AGENCY_NAME} - Premium Web Design & Development`;
    const description = isPricing
      ? "Transparent pricing for landing pages, e-commerce stores, and 3D animated websites by ADI Agency."
      : "ADI Agency builds premium websites focused on conversion, speed, and measurable growth.";
    const pageUrl = `${SITE_URL}${isPricing ? "/pricing" : "/"}`;
    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", pageUrl);
    setMetaTag("property", "og:image", DEFAULT_OG_IMAGE);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", DEFAULT_OG_IMAGE);
    setCanonical(pageUrl);
  }, [location.pathname]);

  useEffect(() => {
    trackEvent("page_view", { page_path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          trackEvent("web_vital", { metric: "LCP", value: String(Math.round(entry.startTime)) });
        }
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = logoIcon;
  }, []);

  if (!isBootReady) return <InitialLoader />;

  return (
    <Routes>
      <Route path="/" element={<HomePage liteMode={isLiteMode} />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  );
}

function HomePage({ liteMode }: { liteMode: boolean }) {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollToId) return;
    window.setTimeout(() => {
      scrollToSection(scrollToId);
    }, 80);
  }, [location.state]);

  return (
    <div className="bg-black text-foreground">
      <a
        href="#main-content"
        className="sr-only z-[130] rounded bg-white px-3 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero liteMode={liteMode} />
        <div className="bg-black">
        <StartSection liteMode={liteMode} />
        <FeaturesChess />
        <FeaturesGrid />
        <Stats liteMode={liteMode} />
        <Testimonials />
        <CtaFooter liteMode={liteMode} />
        </div>
      </main>
      <button
        onClick={() => {
          scrollToSection("contact");
          trackEvent("cta_click", { location: "sticky_mobile", action: "get_started" });
        }}
        className="fixed bottom-4 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg md:hidden"
      >
        Start Your Project
      </button>
    </div>
  );
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY < 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(id: string) {
    setIsMenuOpen(false);
    if (id === "pricing") {
      navigate("/pricing");
      return;
    }
    if (location.pathname === "/") {
      scrollToSection(id);
      return;
    }
    navigate("/", { state: { scrollTo: id } });
  }

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] px-5 py-3 transition-all duration-300 sm:px-8 lg:px-16 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="liquid-glass-strong flex h-12 w-12 items-center justify-center rounded-full p-1">
            <img
              src={logoIcon}
              alt={`${AGENCY_NAME} logo`}
              className="h-full w-full rounded-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
          <span className="font-heading text-lg italic text-white/90 sm:text-2xl">
            {AGENCY_NAME}
          </span>
        </div>
        <div className="liquid-glass hidden items-center rounded-full px-1.5 py-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-white font-body"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("contact")}
            className="ml-1 flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-sm text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get Started <ArrowUpRight size={14} />
          </button>
        </div>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          className="liquid-glass-strong glass-interactive rounded-full px-4 py-2 text-xs md:hidden"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
        </div>
      </nav>
      {isMenuOpen ? (
        <div id="mobile-nav-menu" className="fixed inset-0 z-[120] bg-black/90 px-5 pt-24 backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-sm flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="liquid-glass-strong w-full rounded-full px-4 py-3 text-left text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                scrollToSection("contact");
                setIsMenuOpen(false);
                trackEvent("cta_click", { location: "mobile_nav", action: "get_started" });
              }}
              className="mt-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black"
            >
              Get Started
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Hero({ liteMode }: { liteMode: boolean }) {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative h-[960px] overflow-visible md:h-[1000px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload={liteMode ? "none" : "metadata"}
        disablePictureInPicture
        className="absolute left-0 z-0 h-auto w-full object-contain"
        style={{ top: "20%" }}
      >
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-black/5" />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[300px] w-full"
        style={{ background: "linear-gradient(to bottom, transparent, black)" }}
      />
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center px-5 pb-8 pt-[140px] text-center sm:px-8 md:pt-[150px] lg:px-16">
        <div className="liquid-glass mb-8 inline-flex items-center gap-1.5 rounded-full px-1 py-1 font-body text-[11px] sm:text-xs">
          <span className="inline-flex items-center rounded-full bg-white px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.08em] leading-none text-black sm:px-2.5 sm:py-1 sm:text-[10px]">
            New
          </span>
          <span className="px-1.5 pr-2 sm:px-2">Introducing Premium Web Design And Development Services.</span>
        </div>
        <BlurText
          text="The Website Your Brand Deserves"
          by="word"
          delay={100}
          direction="bottom"
          className="max-w-2xl text-5xl font-heading italic leading-[0.8] tracking-[-2px] text-foreground sm:text-6xl sm:tracking-[-3px] md:text-7xl lg:text-[5.5rem] lg:tracking-[-4px]"
        />
        <motion.p
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.65, ease: "easeOut" }}
          className="mt-8 max-w-xl text-sm font-light leading-tight text-white md:text-base"
        >
          Strategic Design. Exceptional Performance. Crafted By Professionals
          To Deliver Measurable Growth, Faster Delivery, And Long-Term Scalability.
        </motion.p>
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.65, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          <button
            onClick={() => {
              navigate("/pricing");
            }}
            className="liquid-glass-strong glass-interactive inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            Get Started <ArrowUpRight size={15} />
          </button>
        </motion.div>
        <div className="mt-auto w-full pb-8 pt-16">
          <div className="liquid-glass mx-auto mb-8 inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white">
            Trusted By The Teams Behind
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 text-2xl font-heading italic text-white md:gap-16 md:text-3xl">
            {["Stripe", "Vercel", "Linear", "Notion", "Figma"].map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StartSection({ liteMode }: { liteMode: boolean }) {
  return (
    <section
      id="process"
      className="relative min-h-[500px] overflow-hidden px-5 py-20 sm:px-8 md:py-24 lg:px-16"
    >
      <HlsBackgroundVideo src={PROCESS_VIDEO_HLS} liteMode={liteMode} />
      <GradientFades />
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center text-center"
      >
        <SectionBadge text="How It Works" />
        <h2 className="mt-6 text-4xl font-heading italic leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
          You Define The Vision. We Deliver The Result.
        </h2>
        <p className="mt-5 max-w-2xl text-sm font-light text-white/60 md:text-base">
          From Planning And Design To Development And Launch, Our Team Manages
          The Full Journey With Clear Communication, Reliable Delivery, And Premium Quality.
        </p>
        <button
          onClick={() => scrollToSection("contact")}
          className="liquid-glass-strong glass-interactive mt-10 rounded-full px-6 py-3 text-sm font-medium"
        >
          Get Started
        </button>
      </motion.div>
    </section>
  );
}

function FeaturesChess() {
  return (
    <section id="work" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-24 lg:px-16">
      <div className="mb-14 text-center">
        <SectionBadge text="Capabilities" />
        <h2 className="mt-6 text-4xl font-heading italic leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
          Premium Features. Zero Complexity.
        </h2>
      </div>
      <FeatureRow
        title="Designed To Convert. Built To Perform."
        body="Every Pixel Is Intentional. We Combine Proven UX Strategy With Performance Engineering To Help Your Website Convert, Scale, And Lead In Your Market."
        buttonText="Learn More"
        targetId="services"
        image={featureOne}
      />
      <FeatureRow
        reverse
        title="Built To Scale With Your Business."
        body="Your Website Is Built On A Strong Technical Foundation, Making It Easy To Expand Pages, Features, And Campaigns As Your Brand Continues To Grow."
        buttonText="See How It Works"
        targetId="process"
        image={featureTwo}
      />
    </section>
  );
}

function FeatureRow({
  title,
  body,
  buttonText,
  targetId,
  image,
  reverse = false,
}: {
  title: string;
  body: string;
  buttonText: string;
  targetId: string;
  image: string;
  reverse?: boolean;
}) {
  return (
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      className={`mb-10 flex flex-col items-center gap-8 lg:mb-16 lg:gap-16 ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="w-full lg:w-1/2">
        <h3 className="text-3xl font-heading italic leading-tight md:text-4xl">
          {title}
        </h3>
        <p className="mt-5 max-w-xl text-sm font-light text-white/70 md:text-base">
          {body}
        </p>
        <button
          onClick={() => scrollToSection(targetId)}
          className="liquid-glass-strong glass-interactive mt-8 rounded-full px-5 py-2.5 text-sm font-medium"
        >
          {buttonText}
        </button>
      </div>
      <div className="liquid-glass w-full overflow-hidden rounded-2xl lg:w-1/2">
        <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
    </motion.div>
  );
}

function FeaturesGrid() {
  const items = [
    {
      icon: Zap,
      title: "Days, Not Months",
      text: "From Concept To Launch At A Pace That Redefines Speed. Because Waiting Is Not A Strategy.",
    },
    {
      icon: Palette,
      title: "Obsessively Crafted",
      text: "Every Detail Is Considered. Every Element Is Refined. Design So Precise, It Feels Inevitable.",
    },
    {
      icon: BarChart3,
      title: "Built to Convert",
      text: "Layouts Informed By Data. Decisions Backed By Performance. Results You Can Measure And Scale.",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      text: "Enterprise-Grade Protection Comes Standard. SSL, DDoS Mitigation, And Compliance Included By Default.",
    },
  ];
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:px-16">
      <div className="mb-12 text-center">
        <SectionBadge text="Why Us" />
        <h2 className="mt-6 text-4xl font-heading italic leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
          The Difference Is Everything.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <motion.article
            key={title}
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="liquid-glass rounded-2xl p-6"
          >
            <div className="liquid-glass-strong mb-5 flex h-10 w-10 items-center justify-center rounded-full">
              <Icon size={18} />
            </div>
            <h3 className="text-xl font-heading italic">{title}</h3>
            <p className="mt-3 text-sm font-light text-white/70">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Stats({ liteMode }: { liteMode: boolean }) {
  const stats = [
    ["200+", "Sites Launched"],
    ["98%", "Client Satisfaction"],
    ["3.2x", "More Conversions"],
    ["5 Days", "Average Delivery"],
  ];
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-16">
      <HlsBackgroundVideo
        src={STATS_VIDEO_HLS}
        liteMode={liteMode}
        className="absolute inset-0 h-full w-full object-cover saturate-0"
      />
      <GradientFades />
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="liquid-glass rounded-3xl p-12 md:p-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={value}>
                <p className="text-4xl font-heading italic md:text-5xl lg:text-6xl">
                  {value}
                </p>
                <p className="mt-2 text-sm font-light text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote:
        "ADI Agency Delivered A Premium Website Experience That Feels Modern, Fast, And Purpose-Built For Real Business Growth.",
      name: "ADI BIN SHERAZ",
      role: "CEO, Luminary",
    },
    {
      quote:
        "Conversions Increased By 4x. This Is Not A Typo. The Execution Works Differently When Strategy, Design, And Performance Are Aligned.",
      name: "Marcus Webb",
      role: "Head of Growth, Arcline",
    },
    {
      quote:
        "They Did Not Just Design Our Website. They Elevated Our Brand Positioning. World-Class Is An Understatement.",
      name: "Elena Voss",
      role: "Brand Director, Helix",
    },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-24 lg:px-16">
      <div className="mb-12 text-center">
        <SectionBadge text="What They Say" />
        <h2 className="mt-6 text-4xl font-heading italic leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
          Do Not Take Our Word For It.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <motion.article
            key={item.name}
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="liquid-glass rounded-2xl p-8"
          >
            <p className="text-sm font-light italic text-white/80">{item.quote}</p>
            <p className="mt-6 text-sm font-medium text-white">{item.name}</p>
            <p className="text-xs font-light text-white/50">{item.role}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function CtaFooter({ liteMode }: { liteMode: boolean }) {
  const navigate = useNavigate();
  return (
    <section id="contact" className="relative overflow-hidden px-5 py-20 sm:px-8 md:py-24 lg:px-16">
      <HlsBackgroundVideo src={CTA_VIDEO_HLS} liteMode={liteMode} />
      <GradientFades />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <h2 className="text-5xl font-heading italic leading-[0.85] md:text-6xl lg:text-7xl">
          Your Next Website Starts Here.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm font-light text-white/70 md:text-base">
          Discuss Your Website Goals With Our Team And Receive A Clear Plan For
          Design, Development, And Launch. No Pressure, Only Expert Guidance.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              trackEvent("cta_click", { location: "home_footer", action: "view_pricing" });
              navigate("/pricing");
            }}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            View Pricing
          </button>
        </div>
        <footer className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© 2026 {AGENCY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() => trackEvent("contact_click", { channel: "email_home_footer" })}
              aria-label="Email"
              title="Email"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Mail size={16} />
            </a>
            <a
              href={PHONE_LINK}
              onClick={() => trackEvent("contact_click", { channel: "phone_home_footer" })}
              aria-label="Phone"
              title="Phone"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Phone size={16} />
            </a>
            <a
              href={INSTAGRAM_URL}
              onClick={() => trackEvent("contact_click", { channel: "instagram_home_footer" })}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title={INSTAGRAM_HANDLE}
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Instagram size={16} />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}

function SectionBadge({ text }: { text: string }) {
  return (
    <div className="liquid-glass inline-flex rounded-full px-3.5 py-1 text-xs font-medium text-white font-body">
      {text}
    </div>
  );
}

function GradientFades() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-[200px] w-full"
        style={{ background: "linear-gradient(to bottom, black, transparent)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[200px] w-full"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />
    </>
  );
}

function PricingPage() {
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);
  const plans = [
    {
      name: "Landing Page",
      price: "$799",
      period: "/project",
      description: "A high-converting, premium landing page built to present your brand with clarity and impact.",
      features: [
        "Custom UI/UX design with brand-focused messaging",
        "Conversion-optimized structure and call-to-action flow",
        "Technical on-page SEO foundations",
        "Fast, mobile-first development and deployment support",
      ],
    },
    {
      name: "E-commerce Store",
      price: "$1,999",
      period: "/project",
      description:
        "A complete e-commerce experience designed to maximize trust, product discovery, and checkout conversions.",
      features: [
        "Storefront design for product, category, and collection pages",
        "Cart and checkout journey optimized for sales",
        "Product SEO setup and performance tuning",
        "Analytics integration and post-launch support",
      ],
      featured: true,
    },
    {
      name: "3D Animated Website",
      price: "$3,499",
      period: "/project",
      description:
        "An immersive, high-end website combining cinematic 3D visuals with modern web performance standards.",
      features: [
        "Interactive 3D scenes and animation direction",
        "Story-driven page architecture and transitions",
        "Performance optimization for smooth rendering",
        "Advanced technical SEO and launch consultation",
      ],
    },
  ];

  function openWhatsAppForPlan(planName: string, planFeatures: string[]) {
    const requirementDetails = planFeatures.join(", ");
    const message = `Hi, I want a ${planName} website from ${AGENCY_NAME}. My requirement includes: ${requirementDetails}. Please share the process, timeline, and final quotation.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    trackEvent("cta_click", { location: "pricing_card", action: planName });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  function openEmailForPlan(planName: string, planFeatures: string[]) {
    const subject = `Website Request: ${planName}`;
    const body = `Hi,\n\nI want a ${planName} website from ${AGENCY_NAME}.\n\nMy requirements include:\n- ${planFeatures.join('\n- ')}\n\nPlease share the process, timeline, and final quotation.\n\nBest regards,`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    trackEvent("cta_click", { location: "pricing_card_email", action: planName });
    window.location.href = mailtoUrl;
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navbar />
      <section className="mx-auto max-w-[1400px] px-5 pb-20 pt-36 sm:px-8 lg:px-16">
        <div className="text-center">
          <SectionBadge text="Pricing" />
          <h1 className="mt-6 text-5xl font-heading italic leading-[0.9] md:text-6xl">
            Professional Web Solutions Tailored To Your Growth.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-white/70 md:text-base">
            From Focused Landing Pages To Full E-Commerce Systems And Premium 3D Experiences, Each Package Is
            Strategically Delivered By {AGENCY_NAME} Under Direct Leadership By {FOUNDER_NAME}.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`liquid-glass rounded-2xl p-7 ${plan.featured ? "ring-1 ring-white/40" : ""}`}
            >
              <p className="text-sm text-white/70">{plan.name}</p>
              <div className="mt-3 flex items-end gap-1">
                <p className="text-4xl font-heading italic">{plan.price}</p>
                <p className="pb-1 text-sm text-white/60">{plan.period}</p>
              </div>
              <p className="mt-4 text-sm text-white/70">{plan.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/80">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              {showOptionsFor === plan.name ? (
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openWhatsAppForPlan(plan.name, plan.features)}
                    className="liquid-glass-strong glass-interactive inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                  >
                    WhatsApp <ArrowUpRight size={15} />
                  </button>
                  <button
                    onClick={() => openEmailForPlan(plan.name, plan.features)}
                    className="liquid-glass-strong glass-interactive inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                  >
                    Email <ArrowUpRight size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowOptionsFor(plan.name)}
                  className="liquid-glass-strong glass-interactive mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                >
                  Request {plan.name} <ArrowUpRight size={15} />
                </button>
              )}
            </article>
          ))}
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© 2026 {AGENCY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() => trackEvent("contact_click", { channel: "email_pricing_footer" })}
              aria-label="Email"
              title="Email"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Mail size={16} />
            </a>
            <a
              href={PHONE_LINK}
              onClick={() => trackEvent("contact_click", { channel: "phone_pricing_footer" })}
              aria-label="Phone"
              title="Phone"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Phone size={16} />
            </a>
            <a
              href={INSTAGRAM_URL}
              onClick={() => trackEvent("contact_click", { channel: "instagram_pricing_footer" })}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title={INSTAGRAM_HANDLE}
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Instagram size={16} />
            </a>
          </div>
        </footer>
      </section>
    </div>
  );
}
