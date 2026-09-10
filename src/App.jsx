import React, { useState, useRef, useCallback, useEffect } from "react";
import { User, FolderOpen, FileText, Terminal as TerminalIcon, Mail,
  Trash2, Settings, Wifi, Volume2, ChevronUp, X, Minus, Square,
  Github, Linkedin, Code2, Search, Image as ImageIcon
} from "lucide-react";

/* Portfolio content (edit this to make it yours) */
const PROFILE = {
  name: "Donnelly Nyagoha Amaitsa",
  title: "Software Engineer",
  bio: "Software Developer with hands on experience developing full stack and business oriented applications. I build fast, thoughtful systems from backend architecture to amazing UI. Experienced in backend development, RESTful APIs, relational databases, and translating business requirements into functional software solutions. Based in Nairobi.",
  location: "Nairobi, Kenya",
  email: "amaitsadonnelly@gmail.com"
};

const PROJECTS = [
  { name: "Habit-Grid", ext: "webapp", desc: "A minimalist habit tracker built with React and Postgres. 4k+ monthly active users.", tags: ["React", "Node", "Postgres"] },
  { name: "Ledgerly", ext: "app", desc: "Small-business invoicing tool with automated reminders and Stripe billing.", tags: ["Next.js", "Stripe", "tRPC"] },
  { name: "Pathfinder-CLI", ext: "tool", desc: "A command-line project scaffolder used by 300+ developers, published on npm.", tags: ["TypeScript", "Node"] },
  { name: "Weathergram", ext: "webapp", desc: "Hyperlocal weather visualizer with live radar overlays and offline caching.", tags: ["Vue", "D3.js", "PWA"] },
];

const SKILL_CATEGORIES = [
  {
    category: "Full-Stack Development",
    desc: "Building end-to-end web applications using React, Node.js, Express, HTML, CSS, and JavaScript with a focus on clean architecture and performance.",
  },
  {
    category: "Backend and Database",
    desc: "Designing and optimizing RESTful APIs, relational database, schemas, and queries using PostgreSQL, MySQL, and SQL.",
  },
  {
    category: "Engineering Practices",
    desc: "Strong problem solving skills, experience navigating large codebases, debugging production issues, documenting APIs, and collaborating in fast paced, iterative environments."
  },
];

const REPO_URL = "https://github.com/donnellyCodes/portfolio";

const WALLPAPERS = [
  "radial-gradient(1200px 700px at 20% 10%, #2e5c3e 0%, #1c3b28 38%, #0e2118 75%, #081611 100%)",
  "radial-gradient(1200px 700px at 80% 15%, #3a5c72 0%, #223a4a 40%, #101c24 78%, #0a1216 100%)",
  "radial-gradient(1200px 700px at 50% 90%, #5c3e2e 0%, #3a281c 40%, #1e140e 78%, #100b08 100%)",
]

const APP_META = {
  about: { title: "about-me.txt", icon: User, w: 420, h: 360 },
  projects: { title: "Projects", icon: FolderOpen, w: 560, h: 420 },
  resume: { title: "resume.pdf", icon: FileText, w: 480, h: 500 },
  terminal: { title: "Terminal", icon: TerminalIcon, w: 520, h: 340 },
  contact: { title: "Contact", icon: Mail, w: 380, h: 320 },
  trash: { title: "Trash", icon: Trash2, w: 340, h: 240 },
  settings: { title: "System Settings", icon: Settings, w: 420, h: 320 },
  "about-site": { title: "About This Site", icon: Code2, w: 400, h: 260 },
  photo: { title: "portrait.jpg", icon: ImageIcon, w: 380, h: 440 },
};

let zTop = 10;

export default function MintDesktop() {
  const [windows, setWindows] = useState([]); // {id, app, x,y,w,h, z, minimized}
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 720 : false
  );
  const [booted, setBooted] = useState(false);

  const [wallpaper, setWallpaper] = useState(0);

  const [contextMenu, setContextMenu] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => {
      setToast({
        title: "New message",
        body: "A recruiter is checking out your portfolio. Say hi?",
      });
    }, 15000);
    return () => clearTimeout(t);
  }, [booted]);

  const openApp = useCallback((app) => {
    setMenuOpen(false);
    setWindows((prev) => {
      const existing = prev.find((w) => w.app === app);
      zTop += 1;
      if (existing) {
        return prev.map((w) =>
          w.app === app ? { ...w, minimized: false, z: zTop } : w
        );
      }
      const meta = APP_META[app];
      const count = prev.length;
      return [
        ...prev,
        {
          id: app + "-" + Date.now(),
          app,
          x: 90 + (count % 5) * 34,
          y: 60 + (count % 5) * 28,
          w: meta.w,
          h: meta.h,
          z: zTop,
          minimized: false,
        },
      ];
    });
  }, []);

  const closeApp = (id) => setWindows((prev) => prev.filter((w) => w.id !== id));
  const minimizeApp = (id) =>
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  const focusApp = (id) => {
    zTop += 1;
    const z = zTop;
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
  };
  const toggleMinimizeFromTaskbar = (id) => {
    setWindows((prev) => {
      const w = prev.find((x) => x.id === id);
      if (!w) return prev;
      if (w.minimized) {
        zTop += 1;
        return prev.map((x) => (x.id === id ? { ...x, minimized: false, z: zTop } : x));
      }
      return prev.map((x) => (x.id === id ? { ...x, minimized: true } : x));
    });
  };

  if (!booted) {
    return <BootScreen onDone={() => setBooted(true)} />;
  }

  if (isMobile) {
    return <MobileHome />;
  }

  return (
    <div
      style={{
        fontFamily: "'Ubuntu', 'Segoe UI', system-ui, sans-serif",
        width: "100%",
        height: "100vh",
        minHeight: 640,
        position: "relative",
        overflow: "hidden",
        background: WALLPAPERS[wallpaper],
        transition: "background 0.6s ease",
        userSelect: "none",
      }}
      onClick={() => { setMenuOpen(false); setSelectedIcon(null); setContextMenu(null); }}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuOpen(false);
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .mint-scroll::-webkit-scrollbar { width: 8px; }
        .mint-scroll::-webkit-scrollbar-thumb { background: #4a5e4a; border-radius: 4px; }
        .mint-btn:hover { background: rgba(255,255,255,0.08); }
        .desktop-icon:hover .icon-box { background: rgba(255,255,255,0.10); }
        .desktop-icon.selected .icon-box { background: rgba(135,178,86,0.35); outline: 1px solid rgba(135,178,86,0.6); }
        .taskbar-win:hover { background: rgba(255,255,255,0.10); }
        .menu-item:hover { background: #4a7c3a; color: #fff; }
        .titlebar-btn:hover { filter: brightness(1.3); }
        .portrait-widget { transition: transform 0.15s ease, border-color 0.15s ease; }
        .portrait-widget:hover { transform: scale(1.03); border-color: rgba(135,165,86,0.9); }
        @keyframes toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes window-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>


      {/* subtle texture */}
      <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

      {/* Portrait Widget, top-right */}
      <div
        onClick={(e) => { e.stopPropagation(); openApp("photo"); }}
        style={{
          position: "absolute", top: 20, right: 20, width: 128,
          pointerEvents: "none", textAlign: "center",
        }}
      >
        <div
          className="portrait-widget"
          style={{
            width: 128, height: 156, borderRadius: 10, overflow: "hidden",
            border: "2px solid rgba(135,165,86,0.55)", boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
          }}
        >
          <img
            src="/portrait.jpg"
            alt={PROFILE.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ marginTop: 8, fontFamily: "'Ubuntu Mono', monospace" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, color: "rgba(223,232,222,0.92)", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            {PROFILE.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(135,165,86,0.95)", marginTop: 2 }}>
            {PROFILE.title}
          </div>
        </div>
      </div>

      {/* Desktop icons */}
      <div style={{ position: "absolute", top: 20, left: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        {["about", "projects", "resume", "terminal", "contact", "trash"].map((app) => {
          const meta = APP_META[app];
          const Icon = meta.icon;
          return (
            <div
              key={app}
              className={`desktop-icon${selectedIcon === app ? " selected" : ""}`}
              onClick={(e) => { e.stopPropagation(); setSelectedIcon(app); }}
              onDoubleClick={(e) => { e.stopPropagation(); openApp(app); }}
              style={{ width: 86, textAlign: "center", cursor: "default", padding: 4 }}
            >
              <div className="icon-box" style={{ width: 52, height: 52, margin: "0 auto 4px", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)" }}>
                <Icon size={28} color="#dfe8de" strokeWidth={1.6} />
              </div>
              <div style={{ fontSize: 11.5, color: "#f2f5f0", textShadow: "0 1px 2px rgba(0,0,0,0.7)", lineHeight: 1.2 }}>
                {meta.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Windows */}
      {windows.map((w) => (
        !w.minimized && (
          <MintWindow
            key={w.id}
            win={w}
            onClose={() => closeApp(w.id)}
            onMinimize={() => minimizeApp(w.id)}
            onFocus={() => focusApp(w.id)}
            onMove={(x, y) => setWindows((prev) => prev.map((p) => (p.id === w.id ? { ...p, x, y } : p)))}
          />
        )
      ))}

      {/* Start menu */}
      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", left: 8, bottom: 46, width: 300, height: 380,
            background: "#2b332c", border: "1px solid #445046", borderRadius: 6,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", flexDirection: "column", overflow: "hidden"
          }}
        >
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #3c453d", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "2px solid #87a556", flexShrink: 0 }}>
              <img src="/portrait.jpg" alt={PROFILE.name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            <div>
              <div style={{ color: "#f2f5f0", fontSize: 13.5, fontWeight: 600 }}>{PROFILE.name}</div>
              <div style={{ color: "#9db096", fontSize: 11.5 }}>{PROFILE.title}</div>
            </div>
          </div>
          <div style={{ padding: 8, display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #3c453d" }}>
            <Search size={14} color="#8a9a86" />
            <div style={{ color: "#7c8c78", fontSize: 12 }}>Type to search…</div>
          </div>
          <div className="mint-scroll" style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
            {Object.entries(APP_META).map(([app, meta]) => {
              const Icon = meta.icon;
              return (
                <div
                  key={app}
                  className="menu-item"
                  onClick={() => openApp(app)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", cursor: "default", color: "#dbe4d8", fontSize: 13 }}
                >
                  <Icon size={17} strokeWidth={1.6} />
                  {meta.title}
                </div>
              );
            })}
          </div>
          <div style={{ padding: "8px 16px", borderTop: "1px solid #3c453d", display: "flex", gap: 14 }}>
            <a href="https://github.com/donnellyCodes" target="_blank" rel="noreferrer" style={{ color: "#9db096" }}><Github size={16} /></a>
            <a href="https://www.linkedin.com/in/donnelly-amaitsa/" target="_blank" rel="noreferrer" style={{ color: "#9db096" }}><Linkedin size={16} /></a>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", left: contextMenu.x, top: contextMenu.y, width: 210,
            background: "#2b332c", border: "1px solid #445046", borderRadius: 6,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 10000, overflow: "hidden",
            padding: "4px 0"
          }}
        >
          <div
            className="menu-item"
            onClick={() => { setWallpaper((w) => (w + 1) % WALLPAPERS.length); setContextMenu(null); }}
            style={{ padding: "8px 16px", fontSize: 12.5, color: "#dbe4d8", cursor: "default" }}
          >
            Change Wallpaper
          </div>

          <div
            className="menu-item"
            onClick={() => { openApp("about-site"); setContextMenu(null); }}
            style={{ padding: "8px 16px", fontSize: 12.5, color: "#dbe4d8", cursor: "default" }}
          >
            About This Site
          </div>

          <div
            className="menu-item"
            onClick={() => { window.open(REPO_URL, "_blank"); setContextMenu(null); }}
            style={{ padding: "8px 16px", fontSize: 12.5, color: "#dbe4d8", cursor: "default" }}
          >
            View Source
          </div>

          <div
            className="menu-item"
            onClick={() => { openApp("settings"); setContextMenu(null); }}
            style={{ padding: "8px 16px", fontSize: 12.5, color: "#dbe4d8", cursor: "default" }}
          >
            Display Settings
          </div>
        </div>
      )}

      {/* Notification toast */}
      {toast && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", right: 16, bottom: 50, width: 300,
            background: "#2b332c", border: "1px solid #445046", borderRadius: 8,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 9997, padding: 14,
            animation: "toast-in 0.35s ease"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Mail size={15} color="#87a556" />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#f2f5f0" }}>{toast.title}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              style={{ background: "transparent", border: "none", color: "#7c8c78", cursor: "default", padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#c2ccbf", marginTop: 6, lineHeight: 1.5 }}>{toast.body}</div>
          <button
            onClick={() => { openApp("contact"); setToast(null); }}
            style={{ marginTop: 10, background: "#4a7c3a", border: "none", color: "#fff", fontSize: 12, padding: "5px 12px", borderRadius: 4, cursor: "default" }}
          >
            Open Contact
          </button>
        </div>
      )}

      {/* Bottom panel (Cinnamon taskbar) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 38,
          background: "#242a25", borderTop: "1px solid #3a453c",
          display: "flex", alignItems: "center", padding: "0 6px", gap: 6,
          zIndex: 9998, boxShadow: "0 -2px 8px rgba(0,0,0,0.25)"
        }}
      >
        <button
          className="mint-btn"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: menuOpen ? "rgba(255,255,255,0.1)" : "transparent",
            border: "none", color: "#e7ede4", padding: "5px 10px", borderRadius: 4, cursor: "default", fontSize: 13, fontWeight: 500
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 4, background: "#87a556", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, background: "#1c2419", borderRadius: 2 }} />
          </div>
          Menu
        </button>

        <div style={{ width: 1, height: 20, background: "#3a453c" }} />

        {/* pinned quick launchers */}
        {["about", "projects", "terminal"].map((app) => {
          const Icon = APP_META[app].icon;
          return (
            <button key={app} className="mint-btn" onClick={() => openApp(app)} title={APP_META[app].title}
              style={{ background: "transparent", border: "none", padding: 6, borderRadius: 4, cursor: "default", color: "#c7d3c3" }}>
              <Icon size={16} strokeWidth={1.8} />
            </button>
          );
        })}

        <div style={{ width: 1, height: 20, background: "#3a453c" }} />

        {/* running windows */}
        <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
          {windows.map((w) => {
            const meta = APP_META[w.app];
            const Icon = meta.icon;
            return (
              <button
                key={w.id}
                className="taskbar-win"
                onClick={() => toggleMinimizeFromTaskbar(w.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: w.minimized ? "transparent" : "rgba(135,165,86,0.18)",
                  border: "none", borderBottom: w.minimized ? "2px solid transparent" : "2px solid #87a556",
                  color: "#e7ede4", padding: "4px 10px", borderRadius: 3, cursor: "default", fontSize: 12, maxWidth: 150
                }}
              >
                <Icon size={13} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meta.title}</span>
              </button>
            );
          })}
        </div>

        {/* system tray */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#c7d3c3", paddingRight: 8 }}>
          <Wifi size={15} />
          <Volume2 size={15} />
          <span style={{ fontSize: 12.5, color: "#e7ede4" }}>
            {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <ChevronUp size={13} />
        </div>
      </div>
    </div>
  );
}

/* Draggable window */
function MintWindow({ win, onClose, onMinimize, onFocus, onMove }) {
  const meta = APP_META[win.app];
  const Icon = meta.icon;
  const dragRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    onFocus();
    dragging.current = true;
    offset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    onMove(Math.max(0, e.clientX - offset.current.x), Math.max(0, e.clientY - offset.current.y));
  };
  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: "absolute", left: win.x, top: win.y, width: win.w, height: win.h, maxHeight: "calc(100vH - 90px)",
        background: "#232823", border: "1px solid #3d473e", borderRadius: 7,
        boxShadow: "0 18px 46px rgba(0,0,0,0.45)", zIndex: win.z, display: "flex", flexDirection: "column", overflow: "hidden",
        animation: "window-in 0.16s ease"
      }}
    >
      {/* title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          height: 34, background: "linear-gradient(#3a453c, #2c342d)", display: "flex", alignItems: "center",
          padding: "0 8px", cursor: "grab", borderBottom: "1px solid #1e241f", gap: 8
        }}
      >
        <Icon size={14} color="#c7d3c3" />
        <div style={{ flex: 1, color: "#e7ede4", fontSize: 12.5, fontWeight: 500 }}>{meta.title}</div>
        <button className="titlebar-btn" onClick={onMinimize} style={{ background: "#4a5e4a", border: "none", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" }}>
          <Minus size={11} color="#101410" />
        </button>
        <button className="titlebar-btn" style={{ background: "#e0b04a", border: "none", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" }}>
          <Square size={9} color="#101410" />
        </button>
        <button className="titlebar-btn" onClick={onClose} style={{ background: "#d9604a", border: "none", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" }}>
          <X size={11} color="#101410" />
        </button>
      </div>

      {/* content */}
      <div className="mint-scroll" style={{ flex: 1, minHeight: 0,overflowY: "auto", padding: 18, color: "#dfe8de" }}>
        <AppContent app={win.app} />
      </div>
    </div>
  );
}

/* App content */
function AppContent({ app }) {
  if (app === "about") {
    return (
      <div style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: 13, lineHeight: 1.7 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "2px solid #87a556", marginBottom: 10 }}>
          <img src="/portrait.jpg" alt={PROFILE.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ color: "#87a556", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{PROFILE.name}</div>
        <div style={{ color: "#9db096", marginBottom: 14 }}>{PROFILE.title} · {PROFILE.location}</div>
        <p style={{ margin: 0, color: "#dfe8de" }}>{PROFILE.bio}</p>
        <div style={{ marginTop: 16, color: "#9db096" }}>$ skills --list</div>
        <div style={{ marginTop: 8 }}>
          {SKILL_CATEGORIES.map((s) => (
            <div key={s.category} style={{ marginBottom: 10 }}>
              <div style={{ color: "#87a556", fontWeight: 600, fontSize: 12.5 }}>{s.category}</div>
              <div style={{ color: "#c2ccbf", fontSize: 12, lineHeight: 1.6, marginTop: 2 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (app === "projects") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {PROJECTS.map((p) => (
          <div key={p.name} style={{ background: "#2b332c", border: "1px solid #3c453d", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Code2 size={14} color="#87a556" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f2f5f0" }}>{p.name}</span>
              <span style={{ fontSize: 10.5, color: "#7c8c78" }}>.{p.ext}</span>
            </div>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#c2ccbf", lineHeight: 1.5 }}>{p.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {p.tags.map((t) => (
                <span key={t} style={{ fontSize: 10.5, background: "rgba(135,165,86,0.18)", color: "#a8c48a", padding: "2px 7px", borderRadius: 3 }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (app === "resume") {
    return (
      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f2f5f0" }}>{PROFILE.name}</div>
        <div style={{ color: "#9db096", marginBottom: 14 }}>{PROFILE.title}</div>
        <Section title="Education">
          <Item title="B.Sc. Computer Science | St. Paul's University, Nairobi Campus" period="Spetember 2022 – November 2026" desc="" />
        </Section>
        <Section title="Experience">
          <Item 
            title="Senior Developer | Embrace Media"
            period="Mar 2026 - Sept 2026"
            bullets={[
              "Designed and developed a Delivery Service System for Individuals, companies and shops, with order processing, dispatching, tracking and administrative workflows.",
              "Developed a Cleaning Service System to streamline service requests, customer management, worker assignment, scheduling and operational tracking.",
              "Integrated Google Maps and built RESTful APIs with Node.js and Express, implementing authentication, authorization and business logic.",
              "Designed and managed relational databases in PostgreSQL, implementing JWT-based authentication and role-based access control.",
            ]}
          />
          <Item
            title="IT Intern | United States International University - Africa"
            period="May 2025 - Aug 2025"
            bullets={[
              "Provided technical support for students and staff, and installed software needed by students and lecturers",
              "Installed and configured Kaspersky Antivirus on systems to ensure protection from Malware.",
              "Conducted Internet troubleshooting and network configurion to resolve general connection issues.",
            ]}
          />
        </Section>
        <Section title="Professional Certifications">
          <Item
            title="ALX Africa | Software Engineering Program"
          />
          <Item
            title="OCI | Certified AI Foundations Associate"
          />
        </Section>
        <Section title="Skills / Proficiencies">
          {SKILL_CATEGORIES.map((s) => (
            <div key={s.category} style={{ marginBottom: 10 }}>
              <div style={{ color: "#f2f5f0", fontWeight: 500, fontSize: 12.5 }}>{s.category}</div>
              <div style={{ color: "#c2ccbf", fontSize: 12, lineHeight: 1.6, marginTop: 2 }}>{s.desc}</div>
            </div>
          ))}
        </Section>
      </div>
    );
  }

  if (app === "contact") {
    return (
      <div style={{ fontSize: 13 }}>
        <p style={{ marginTop: 0, color: "#c2ccbf" }}>Feel free to reach out — I usually reply within a day.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <ContactRow icon={<Mail size={15} />} label={PROFILE.email} />
          <ContactRow icon={<Github size={15} />} label="github.com/donnellyCodes" />
          <ContactRow icon={<Linkedin size={15} />} label="linkedin.com/in/donnelly-amaitsa" />
        </div>
      </div>
    );
  }

  if (app === "trash") {
    return (
      <div style={{ textAlign: "center", color: "#7c8c78", fontSize: 12.5, padding: "30px 10px" }}>
        <Trash2 size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
        <div>Trash is empty.</div>
        <div style={{ marginTop: 4, color: "#5c6a58" }}>(no failed projects here — check about-me.txt for those)</div>
      </div>
    );
  }

  if (app === "settings") {
    return (
      <div style={{ fontSize: 13, color: "#c2ccbf" }}>
        <div style={{ marginBottom: 10 }}>Theme: <span style={{ color: "#87a556" }}>Mint-Y-Dark</span></div>
        <div style={{ marginBottom: 10 }}>Desktop: Cinnamon 6.0</div>
        <div>This is a portfolio, not a real OS — but doesn't it feel like one?</div>
      </div>
    );
  }

  if (app === "about-site") {
    return (
      <div style={{ fontSize: 12.5, color: "#c2ccbf", lineHeight: 1.7 }}>
        <p style={{ marginTop: 0 }}>
          This portfolio is styled after the Linux Mint (Cinammon) desktop and it is built with React, styled by hand, no OS was harmed in the making LOL!!.
        </p>
        <p>Right click the desktop any time to change the wallpaper.</p>
        <div
          onClick={() => window.open(REPO_URL, "_blank")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#87a556", cursor: "pointer", marginTop: 4 }}>
            <Github size={15} /> View Source on GitHub
        </div>
      </div>        
    );
  }

  if (app === "photo") {
    return (
      <div style={{ textAlign: "center" }}>
        <img src="/portrait.jpg" alt={PROFILE.name} style={{ width: "100%", borderRadius: 8, border: "1px solid #3c453d" }} />
        <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 600, color: "#f2f5f0" }}>{PROFILE.name}</div>
        <div style={{ fontSize: 12, color: "#9db096", marginTop: 2 }}>{PROFILE.title} · {PROFILE.location}</div>
      </div>
    );
  }

  if (app === "terminal") return <Terminal />;

  return null;
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#87a556", fontWeight: 600, borderBottom: "1px solid #3c453d", paddingBottom: 4, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}
function Item({ title, period, desc, bullets }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
        <span style={{ color: "#f2f5f0", fontWeight: 500 }}>{title}</span>
        <span style={{ color: "#7c8c78", whiteSpace: "nowrap", marginLeft: 10 }}>{period}</span>
      </div>
      {desc && <div style={{ color: "#9db096", fontSize: 12, marginTop: 2 }}>{desc}</div>}
      {bullets && bullets.length > 0 && (
        <ul style={{ margin: "5px 0 0", paddingLeft: 16, color: "#c2ccbf", fontSize: 12, lineHeight: 1.6 }}>
          {bullets.map((b, i) => (
            <li key ={i} style={{ marginBottom: 3 }}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
function ContactRow({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#dfe8de" }}>
      <span style={{ color: "#87a556" }}>{icon}</span>{label}
    </div>
  );
}

/* Boot screen */
const BOOT_LINES = [
  "Booting Portfolio OS...",
  "[ OK ] Loading kernel modules",
  "[ OK ] Mounting / projects",
  "[ OK ] Starting cinnamon-session",
  `[ OK ] Welcome, ${PROFILE.name}`,
];

function BootScreen({ onDone}) {
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (shown < BOOT_LINES.length) {
      const t = setTimeout(() => setShown((s) => s + 1), 200);
      return () => clearTimeout(t);
    }
    const t2 = setTimeout(() => setFading(true), 350);
    const t3 = setTimeout(() => onDone(), 700);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, [shown, onDone]);

  return (
    <div
    style={{
        width: "100%", height: "100vh", minHeight: 640, background: "#0c130d",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Ubuntu Mono', monospace", color: "#87a556",
        opacity: fading ? 0 : 1, transition: "opacity 0.35s ease",
      }}
    >
      <div style={{ width: 420 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#87a556", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 18, height: 18, background: "#0c130d", borderRadius: 4 }} />
          </div>
        </div>
        {BOOT_LINES.slice(0, shown).map((line, i) => (
          <div key={i} style={{ fontSize: 12.5, marginBottom: 4, opacity: i === shown - 1 ? 1 : 0.7 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Mobile home-screen fallback */
function MobileHome() {
  const [open, setOpen] = useState(null);
  const apps = ["about", "projects", "resume", "terminal", "contact"];

  return (
    <div
      style={{
        fontFamily: "'Ubuntu', 'Segoe UI', system-ui, sans-serif",
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(1000px 600px at 30% 0%, #2e5c3e 0%, #1c3b28 40%, #0e2118 80%, #081611 100%)",
        color: "#dfe8de",
      }}
    >
      {/* status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 6px", fontSize: 13, color: "#e7ede4" }}>
        <span>{PROFILE.name}</span>
        <span>Portfolio OS</span>
      </div>

      {!open && (
        <>
          <div style={{ padding: "10px 18px 4px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid #87a556", marginBottom: 10 }}>
              <img src="/portrait.jpg" alt={PROFILE.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f2f5f0" }}>{PROFILE.title}</div>
            <div style={{ fontSize: 12.5, color: "#9db096", marginTop: 2 }}>{PROFILE.location}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, padding: "28px 22px" }}>
            {apps.map((app) => {
              const meta = APP_META[app];
              const Icon = meta.icon;
              return (
                <button
                  key={app}
                  onClick={() => setOpen(app)}
                  style={{ background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#e7ede4" }}
                >
                  <div style={{ width: 54, height: 54, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={26} strokeWidth={1.6} />
                  </div>
                  <span style={{ fontSize: 11.5 }}>{meta.title}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {open && (
        <div style={{ position: "absolute", inset: 0, background: "#232823", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 12px", borderBottom: "1px solid #3c453d" }}>
            <button onClick={() => setOpen(null)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, color: "#e7ede4", padding: "6px 12px", fontSize: 13 }}>
              ← Back
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#f2f5f0" }}>{APP_META[open].title}</span>
          </div>
          <div className="mint-scroll" style={{ flex: 1, overflowY: "auto", padding: 18 }}>
            <AppContent app={open} />
          </div>
        </div>
      )}
    </div>
  );
}

/* Terminal app */
function Terminal() {
  const [lines, setLines] = useState([
    "Linux Mint 22 (Wilma) — portfolio-shell",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [lines]);

  const run = (cmdRaw) => {
    const cmd = cmdRaw.trim();
    let out = [];
    if (cmd === "help") {
      out = ["Available commands:", "  whoami        — who I am", "  skills --list — my skills", "  projects      — list projects", "  contact       — how to reach me", "  clear         — clear the screen", "  sudo hire-me  — try it"];
    } else if (cmd === "whoami") {
      out = [`${PROFILE.name} — ${PROFILE.title}`, PROFILE.bio];
    } else if (cmd === "skills --list" || cmd === "skills") {
      out = SKILLS_CATEGORIES.flatMap((s) => [` ${s.category}:`, ` ${s.desc}`]);
    } else if (cmd === "projects") {
      out = PROJECTS.map((p) => `  ${p.name}.${p.ext}  — ${p.desc}`);
    } else if (cmd === "contact") {
      out = [`  email: ${PROFILE.email}`, "  github: github.com/donnellyCodes", "  linkedin: linkedin.com/in/donnelly-amaitsa"];
    } else if (cmd === "clear") {
      setLines([]);
      return;
    } else if (cmd === "sudo hire-me") {
      out = ["[sudo] password for visitor: ", "Access granted. Redirecting to contact...", "→ " + PROFILE.email];
    } else if (cmd === "") {
      out = [];
    } else {
      out = [`command not found: ${cmd}`, "type 'help' for a list of commands"];
    }
    setLines((prev) => [...prev, "visitor@portfolio:~$ " + cmd, ...out]);
  };

  return (
    <div
      style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: 12.5, color: "#c8e6b8", background: "#151915", borderRadius: 5, padding: 12, minHeight: 220 }}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 2, color: l.startsWith("visitor@") ? "#87a556" : "#c8e6b8" }}>{l}</div>
      ))}
      <div style={{ display: "flex", color: "#87a556" }}>
        <span>visitor@portfolio:~$&nbsp;</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { run(input); setInput(""); }
          }}
          style={{ background: "transparent", border: "none", outline: "none", color: "#e7ede4", flex: 1, fontFamily: "inherit", fontSize: "inherit" }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
