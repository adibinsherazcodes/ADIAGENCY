import { useEffect, useRef, useState } from "react";
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

function HlsBackgroundVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);
  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
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
  useEffect(() => {
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = logoIcon;
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  );
}

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const scrollToId = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollToId) return;
    window.setTimeout(() => {
      scrollToSection(scrollToId);
    }, 80);
  }, [location.state]);

  return (
    <div className="bg-black text-foreground capitalize">
      <Navbar />
      <Hero />
      <div className="bg-black">
        <StartSection />
        <FeaturesChess />
        <FeaturesGrid />
        <Stats />
        <Testimonials />
        <CtaFooter />
      </div>
    </div>
  );
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY < 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(id: string) {
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
            />
          </div>
          <span className="hidden font-heading text-2xl italic text-white/90 sm:inline-block">
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
          onClick={() => scrollToSection("contact")}
          className="liquid-glass-strong glass-interactive rounded-full px-4 py-2 text-xs md:hidden"
        >
          Start
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="relative h-[960px] overflow-visible md:h-[1000px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero_bg.jpeg"
        className="absolute left-0 z-0 h-auto w-full object-contain"
        style={{ top: "20%" }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 z-0 bg-black/5" />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[300px] w-full"
        style={{ background: "linear-gradient(to bottom, transparent, black)" }}
      />
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center px-5 pb-8 pt-[140px] text-center sm:px-8 md:pt-[150px] lg:px-16">
        <div className="liquid-glass mb-10 inline-flex items-center gap-2 rounded-full px-1 py-1 font-body text-xs">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-black">
            New
          </span>
          <span className="px-2">Introducing Premium Web Design And Development Services.</span>
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
              window.location.href = "/pricing";
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

function StartSection() {
  return (
    <section
      id="process"
      className="relative min-h-[500px] overflow-hidden px-5 py-20 sm:px-8 md:py-24 lg:px-16"
    >
      <HlsBackgroundVideo src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8" />
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
        <img src={image} alt={title} className="h-full w-full object-cover" />
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

function Stats() {
  const stats = [
    ["200+", "Sites Launched"],
    ["98%", "Client Satisfaction"],
    ["3.2x", "More Conversions"],
    ["5 Days", "Average Delivery"],
  ];
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-16">
      <HlsBackgroundVideo
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
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

function CtaFooter() {
  return (
    <section id="contact" className="relative overflow-hidden px-5 py-20 sm:px-8 md:py-24 lg:px-16">
      <HlsBackgroundVideo src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" />
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
              window.location.href = "/pricing";
            }}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform duration-300 hover:-translate-y-0.5"
          >
            View Pricing
          </button>
        </div>
        <footer className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>(c) 2026 {AGENCY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              title="Email"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Mail size={16} />
            </a>
            <a
              href={PHONE_LINK}
              aria-label="Phone"
              title="Phone"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Phone size={16} />
            </a>
            <a
              href={INSTAGRAM_URL}
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
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-black text-foreground capitalize">
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
              <button
                onClick={() => {
                  openWhatsAppForPlan(plan.name, plan.features);
                }}
                className="liquid-glass-strong glass-interactive mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
              >
                Request {plan.name} <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>(c) 2026 {AGENCY_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              title="Email"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Mail size={16} />
            </a>
            <a
              href={PHONE_LINK}
              aria-label="Phone"
              title="Phone"
              className="liquid-glass-strong glass-interactive rounded-full p-2.5 text-white/85 transition-colors hover:text-white"
            >
              <Phone size={16} />
            </a>
            <a
              href={INSTAGRAM_URL}
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
