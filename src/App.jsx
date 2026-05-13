import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────────────────

const CURRENCIES = [
  { symbol: "₦", code: "NGN", name: "Nigerian Naira" },
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "R", code: "ZAR", name: "South African Rand" },
  { symbol: "KSh", code: "KES", name: "Kenyan Shilling" },
];

const SUGGESTED_CATEGORIES = [
  "Sales Revenue","Service Revenue","Consulting","Investment Return",
  "Salaries","Rent","Utilities","Marketing","Office Supplies",
  "Travel & Transport","Insurance","Equipment","Software & Tools",
  "Legal & Compliance","Taxes","Maintenance","Inventory","Shipping",
  "Training & Development","Research & Development","Other",
];

const initialTransactions = [
  { id: 1,  title: "Product Sales",      amount: 450000, type: "income",  category: "Sales Revenue",       date: "2026-05-01" },
  { id: 2,  title: "Office Rent",         amount: 80000,  type: "expense", category: "Rent",                date: "2026-05-02" },
  { id: 3,  title: "Staff Salaries",      amount: 120000, type: "expense", category: "Salaries",            date: "2026-05-03" },
  { id: 4,  title: "Consulting Fee",      amount: 75000,  type: "income",  category: "Consulting",          date: "2026-05-06" },
  { id: 5,  title: "Electricity Bill",    amount: 8500,   type: "expense", category: "Utilities",           date: "2026-05-07" },
  { id: 6,  title: "Office Supplies",     amount: 3000,   type: "expense", category: "Office Supplies",     date: "2026-05-08" },
  { id: 7,  title: "Marketing Campaign",  amount: 25000,  type: "expense", category: "Marketing",           date: "2026-05-09" },
  { id: 8,  title: "Business Travel",     amount: 7500,   type: "expense", category: "Travel & Transport",  date: "2026-05-10" },
  { id: 9,  title: "Software License",    amount: 15000,  type: "expense", category: "Software & Tools",    date: "2026-05-11" },
  { id: 10, title: "Investment Return",   amount: 22000,  type: "income",  category: "Investment Return",   date: "2026-05-12" },
];

const monthlyData = [
  { month: "Jan", income: 420000, expenses: 190000 },
  { month: "Feb", income: 390000, expenses: 210000 },
  { month: "Mar", income: 470000, expenses: 175000 },
  { month: "Apr", income: 510000, expenses: 230000 },
  { month: "May", income: 547000, expenses: 259000 },
];

const PALETTE = ["#E8A53A","#34BF8B","#4F86F7","#E05C5C","#9B6EE0","#2BBDBD","#E87C3E","#7EC4E6","#B8D460","#F77FBE"];

function categoryColor(cat) {
  const h = [...cat].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[h % PALETTE.length];
}

// ── Icons (inline SVG) ────────────────────────────────────────────────────────

const Ic = ({ d, size = 18 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

const IcGrid   = () => <Ic d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />;
const IcList   = () => <Ic d="M3 7h18M3 12h18M3 17h18" />;
const IcPie    = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const IcPlus   = () => <Ic d="M12 5v14M5 12h14" size={16} />;
const IcSearch = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const IcEdit   = () => <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
const IcChevD  = () => <Ic d="m6 9 6 6 6-6" size={14} />;
const IcX      = () => <Ic d="M18 6 6 18M6 6l12 12" size={16} />;
const IcUp     = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
const IcDown   = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
const IcTrUp   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IcTrDn   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, fmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#111520", border: "1px solid #1E2338", borderRadius: 10, padding: "10px 14px", fontSize: 12, fontFamily: "inherit" }}>
      <div style={{ color: "#8B94B0", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: 2, background: p.color }} />
          <span style={{ color: "#A8B0C8" }}>{p.name}:</span>
          <span style={{ color: "#EBE8F4", fontWeight: 600 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [transactions, setTransactions]   = useState(initialTransactions);
  const [showModal, setShowModal]         = useState(false);
  const [view, setView]                   = useState("overview");
  const [form, setForm]                   = useState({ title: "", amount: "", type: "expense", category: "", date: "" });
  const [currency, setCurrency]           = useState(CURRENCIES[0]);
  const [ownerName, setOwnerName]         = useState("ABIOLAFROSH");
  const [editingOwner, setEditingOwner]   = useState(false);
  const [ownerDraft, setOwnerDraft]       = useState("");
  const [searchQ, setSearchQ]             = useState("");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [showCurrMenu, setShowCurrMenu]   = useState(false);
  const [mounted, setMounted]             = useState(false);

  const ownerRef  = useRef(null);
  const currRef   = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  useEffect(() => {
    if (editingOwner && ownerRef.current) {
      ownerRef.current.focus();
      ownerRef.current.select();
    }
  }, [editingOwner]);

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (currRef.current && !currRef.current.contains(e.target)) setShowCurrMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fmt = (v) => currency.symbol + Number(v).toLocaleString();

  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t)  => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const catSpend = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const pieData = Object.entries(catSpend).map(([name, value]) => ({ name, value }));

  const filtered = transactions.filter(t => {
    const q = searchQ.toLowerCase();
    return (typeFilter === "all" || t.type === typeFilter) &&
           (t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  });

  const handleAdd = () => {
    if (!form.title || !form.amount || !form.date) return;
    setTransactions(prev => [{ id: Date.now(), ...form, category: form.category || "Other", amount: parseFloat(form.amount) }, ...prev]);
    setForm({ title: "", amount: "", type: "expense", category: "", date: "" });
    setShowModal(false);
  };

  const saveOwner = () => {
    const trimmed = ownerDraft.trim();
    if (trimmed) setOwnerName(trimmed.toUpperCase());
    setEditingOwner(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#090B10", fontFamily: "'Epilogue', 'Outfit', sans-serif", color: "#EBE8F4", display: "flex" }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Epilogue:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#090B10;}
        ::-webkit-scrollbar-thumb{background:#1E2338;border-radius:2px;}
        ::-webkit-scrollbar-thumb:hover{background:#2D3455;}

        .sidebar{
          width:232px;min-height:100vh;background:#0C0E16;
          border-right:1px solid #181C2C;display:flex;flex-direction:column;flex-shrink:0;
        }
        .nav-btn{
          display:flex;align-items:center;gap:10px;width:100%;
          padding:10px 14px;border-radius:9px;cursor:pointer;
          color:#546080;font-size:13px;font-weight:500;
          background:none;border:none;font-family:inherit;
          transition:color .15s,background .15s;margin:1px 0;
        }
        .nav-btn:hover{color:#C8C4D8;background:#13172200;}
        .nav-btn:hover{background:#13172280;}
        .nav-btn.active{color:#E8A53A;background:#1C1608;}
        .nav-btn.active svg{stroke:#E8A53A;}

        .card{background:#0F1219;border:1px solid #181C2C;border-radius:14px;transition:border-color .25s;}
        .card:hover{border-color:#222840;}

        .kpi{
          background:#0F1219;border:1px solid #181C2C;border-radius:14px;
          padding:20px;position:relative;overflow:hidden;
          transition:border-color .25s,transform .25s,box-shadow .25s;
        }
        .kpi:hover{border-color:#222840;transform:translateY(-2px);box-shadow:0 10px 36px rgba(0,0,0,.35);}

        .input{
          background:#0C0E16;border:1px solid #1E2338;border-radius:9px;
          color:#EBE8F4;padding:10px 14px;font-family:inherit;font-size:13.5px;
          width:100%;outline:none;transition:border-color .2s,box-shadow .2s;
          appearance:none;-webkit-appearance:none;
        }
        .input:focus{border-color:#E8A53A55;box-shadow:0 0 0 3px #E8A53A10;}
        .input::placeholder{color:#3A4060;}
        .input option{background:#0F1219;color:#EBE8F4;}

        .btn-gold{
          display:flex;align-items:center;justify-content:center;gap:6px;
          background:#E8A53A;color:#090B10;border:none;border-radius:9px;
          padding:9px 18px;font-family:inherit;font-weight:700;font-size:13px;
          cursor:pointer;transition:background .2s,transform .2s;
        }
        .btn-gold:hover{background:#F5BB55;transform:translateY(-1px);}

        .btn-outline{
          background:none;border:1px solid #1E2338;color:#6B7494;
          border-radius:8px;padding:8px 14px;font-family:inherit;font-size:13px;
          cursor:pointer;transition:border-color .2s,color .2s;
        }
        .btn-outline:hover{border-color:#2D3455;color:#C8C4D8;}

        .filter-btn{
          background:none;border:1px solid #181C2C;color:#546080;
          border-radius:7px;padding:5px 12px;font-family:inherit;
          font-size:12px;cursor:pointer;transition:all .15s;
        }
        .filter-btn.active{background:#1C1608;color:#E8A53A;border-color:#E8A53A38;}
        .filter-btn:not(.active):hover{border-color:#2D3455;color:#C8C4D8;}

        .tx-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:12px 14px;background:#0C0E16;border-radius:10px;
          border:1px solid #181C2C;transition:background .15s,border-color .15s;
        }
        .tx-row:hover{background:#0F1219;border-color:#222840;}

        .badge{
          display:inline-block;padding:2px 9px;border-radius:20px;
          font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;
        }
        .badge-income {background:#34BF8B18;color:#34BF8B;border:1px solid #34BF8B28;}
        .badge-expense{background:#E05C5C18;color:#E05C5C;border:1px solid #E05C5C28;}

        .modal-bg{
          position:fixed;inset:0;background:rgba(0,0,0,.78);
          display:flex;align-items:center;justify-content:center;
          z-index:100;backdrop-filter:blur(7px);
        }

        .owner-display{
          display:flex;align-items:center;gap:5px;
          font-family:'Syne',sans-serif;font-size:15px;font-weight:700;
          color:#E8A53A;letter-spacing:2px;cursor:pointer;
          padding:3px 6px;border-radius:6px;transition:background .18s;
        }
        .owner-display:hover{background:#E8A53A18;}
        .owner-display .hint{opacity:0;transition:opacity .18s;color:#546080;}
        .owner-display:hover .hint{opacity:1;}

        .curr-menu{
          position:absolute;top:calc(100% + 6px);right:0;
          background:#0F1219;border:1px solid #1E2338;border-radius:11px;
          overflow:hidden;z-index:60;min-width:196px;
          box-shadow:0 12px 40px rgba(0,0,0,.5);
        }
        .curr-opt{
          display:flex;align-items:center;gap:10px;
          padding:9px 14px;cursor:pointer;font-size:13px;
          transition:background .12s;
        }
        .curr-opt:hover{background:#161924;}
        .curr-opt.sel{color:#E8A53A;background:#1C1608;}

        .prog-bar{height:4px;background:#181C2C;border-radius:2px;overflow:hidden;}
        .prog-fill{height:100%;border-radius:2px;transition:width 1s ease;}

        .search-wrap{
          display:flex;align-items:center;gap:8px;
          background:#0C0E16;border:1px solid #181C2C;
          border-radius:9px;padding:8px 12px;
          transition:border-color .2s;
        }
        .search-wrap:focus-within{border-color:#E8A53A44;}
        .search-in{
          background:none;border:none;outline:none;
          color:#EBE8F4;font-family:inherit;font-size:13px;width:180px;
        }
        .search-in::placeholder{color:#3A4060;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .fu {animation:fadeUp .4s ease both;}
        .fu-1{animation:fadeUp .4s .06s ease both;}
        .fu-2{animation:fadeUp .4s .12s ease both;}
        .fu-3{animation:fadeUp .4s .18s ease both;}
        .fu-4{animation:fadeUp .4s .24s ease both;}

        .section-title{
          font-family:'Syne',sans-serif;font-size:14.5px;
          font-weight:600;color:#EBE8F4;letter-spacing:.2px;
        }

        datalist option{background:#0F1219;}
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div style={{ padding: "22px 20px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#E8A53A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="15" height="15" fill="none" stroke="#090B10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: 0.3 }}>
                Ledger<span style={{ color: "#E8A53A" }}>Pro</span>
              </div>
              <div style={{ fontSize: 10, color: "#3A4060", letterSpacing: 0.5 }}>Business Finance</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: "0 16px", height: 1, background: "#181C2C" }} />

        {/* Nav */}
        <nav style={{ padding: "12px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "#3A4060", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 6px 8px", fontWeight: 600 }}>Main Menu</div>
          {[
            { id: "overview",      label: "Overview",     Icon: IcGrid },
            { id: "transactions",  label: "Transactions", Icon: IcList },
            { id: "categories",    label: "Categories",   Icon: IcPie  },
          ].map(({ id, label, Icon }) => (
            <button key={id} className={`nav-btn${view === id ? " active" : ""}`} onClick={() => setView(id)}>
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ margin: "0 16px", height: 1, background: "#181C2C" }} />

        {/* Owner */}
        <div style={{ padding: "16px 18px 20px" }}>
          <div style={{ fontSize: 10, color: "#3A4060", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Owned by</div>
          {editingOwner ? (
            <input
              ref={ownerRef}
              value={ownerDraft}
              onChange={e => setOwnerDraft(e.target.value)}
              onBlur={saveOwner}
              onKeyDown={e => {
                if (e.key === "Enter") saveOwner();
                if (e.key === "Escape") { setOwnerDraft(ownerName); setEditingOwner(false); }
              }}
              style={{
                background: "#0C0E16", border: "1px solid #E8A53A55", borderRadius: 7,
                color: "#E8A53A", fontFamily: "'Syne', sans-serif", fontSize: 13,
                fontWeight: 700, letterSpacing: 2, padding: "5px 9px", width: "100%",
                outline: "none", textTransform: "uppercase",
              }}
            />
          ) : (
            <div
              className="owner-display"
              onClick={() => { setOwnerDraft(ownerName); setEditingOwner(true); }}
              title="Click to edit"
            >
              {ownerName}
              <span className="hint"><IcEdit /></span>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>

        {/* Top bar */}
        <header style={{
          padding: "14px 28px", borderBottom: "1px solid #181C2C",
          background: "#0C0E16", display: "flex",
          justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: 0.2 }}>
              {view === "overview" ? "Financial Overview" : view === "transactions" ? "Transactions" : "Spending Categories"}
            </div>
            <div style={{ fontSize: 11.5, color: "#546080", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {view === "transactions" && (
              <div className="search-wrap">
                <span style={{ color: "#546080" }}><IcSearch /></span>
                <input className="search-in" placeholder="Search transactions…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              </div>
            )}

            {/* Currency selector */}
            <div ref={currRef} style={{ position: "relative" }}>
              <button className="btn-outline" onClick={() => setShowCurrMenu(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#E8A53A", fontWeight: 700 }}>{currency.symbol}</span>
                <span>{currency.code}</span>
                <IcChevD />
              </button>
              {showCurrMenu && (
                <div className="curr-menu">
                  {CURRENCIES.map(c => (
                    <div key={c.code} className={`curr-opt${currency.code === c.code ? " sel" : ""}`}
                      onClick={() => { setCurrency(c); setShowCurrMenu(false); }}>
                      <span style={{ fontWeight: 700, width: 24, textAlign: "center", flexShrink: 0 }}>{c.symbol}</span>
                      <span style={{ color: currency.code === c.code ? "#E8A53A" : "#8B94B0" }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn-gold" onClick={() => setShowModal(true)}>
              <IcPlus />Add Transaction
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "22px 28px", overflowY: "auto", flex: 1 }}>

          {/* KPI cards — always shown */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14,
            marginBottom: 22,
            opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(12px)",
            transition: "opacity .5s, transform .5s",
          }}>
            {[
              { label: "Net Balance",    value: fmt(balance),       sub: `${savingsRate}% of revenue retained`, accent: "#E8A53A", positive: balance >= 0 },
              { label: "Total Revenue",  value: fmt(totalIncome),   sub: "+5.2% vs last month",                 accent: "#34BF8B", positive: true },
              { label: "Total Expenses", value: fmt(totalExpenses), sub: "-3.1% vs last month",                 accent: "#E05C5C", positive: false },
              { label: "Savings Rate",   value: savingsRate + "%",  sub: "Of revenue retained",                 accent: "#4F86F7", positive: savingsRate >= 20 },
            ].map((c, i) => (
              <div className="kpi" key={i}>
                {/* top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${c.accent}, ${c.accent}00)`,
                  borderRadius: "14px 14px 0 0",
                }} />
                <div style={{ fontSize: 10.5, color: "#546080", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: c.accent, lineHeight: 1.15, marginBottom: 9 }}>{c.value}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                  <span style={{ color: c.positive ? "#34BF8B" : "#E05C5C" }}>
                    {c.positive ? <IcTrUp /> : <IcTrDn />}
                  </span>
                  <span style={{ color: "#546080" }}>{c.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── OVERVIEW ─────────────────────────────────────── */}
          {view === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 16 }}>

                {/* Bar chart */}
                <div className="card fu-1" style={{ padding: 22 }}>
                  <div className="section-title" style={{ marginBottom: 18 }}>Revenue vs Expenses</div>
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={monthlyData} barCategoryGap="36%">
                      <XAxis dataKey="month" axisLine={false} tickLine={false}
                        tick={{ fill: "#546080", fontSize: 11, fontFamily: "Epilogue" }} />
                      <YAxis axisLine={false} tickLine={false}
                        tick={{ fill: "#546080", fontSize: 11 }}
                        tickFormatter={v => currency.symbol + (v / 1000) + "k"} />
                      <Tooltip content={<CustomTooltip fmt={fmt} />} cursor={{ fill: "#E8A53A08" }} />
                      <Bar dataKey="income"   fill="#34BF8B" radius={[4, 4, 0, 0]} name="Revenue"  />
                      <Bar dataKey="expenses" fill="#E05C5C" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 10 }}>
                    {[["Revenue", "#34BF8B"], ["Expenses", "#E05C5C"]].map(([lbl, col]) => (
                      <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#546080" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} /> {lbl}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie chart */}
                <div className="card fu-2" style={{ padding: 22 }}>
                  <div className="section-title" style={{ marginBottom: 14 }}>Expense Breakdown</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                        {pieData.map((e, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip
                        formatter={v => [fmt(v)]}
                        contentStyle={{ background: "#111520", border: "1px solid #1E2338", borderRadius: 10, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
                    {pieData.slice(0, 5).map((e, i) => (
                      <div key={e.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 7, height: 7, borderRadius: 1.5, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#8B94B0" }}>{e.name}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#546080", fontWeight: 600 }}>
                          {totalExpenses ? Math.round(e.value / totalExpenses * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="card fu-3" style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div className="section-title">Recent Activity</div>
                  <button className="btn-outline" style={{ fontSize: 12, padding: "5px 12px" }}
                    onClick={() => setView("transactions")}>View all</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {transactions.slice(0, 5).map(t => (
                    <TxRow key={t.id} t={t} fmt={fmt} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ─────────────────────────────────── */}
          {view === "transactions" && (
            <div className="card fu" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div className="section-title">All Transactions <span style={{ color: "#546080", fontWeight: 400 }}>({filtered.length})</span></div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["all", "income", "expense"].map(f => (
                    <button key={f} className={`filter-btn${typeFilter === f ? " active" : ""}`}
                      onClick={() => setTypeFilter(f)} style={{ textTransform: "capitalize" }}>{f}</button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "52px 0", color: "#3A4060" }}>
                  <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
                    <svg width="36" height="36" fill="none" stroke="#3A4060" strokeWidth="1.4" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>No transactions found</div>
                  <div style={{ fontSize: 12, marginTop: 5 }}>Try adjusting the search or filter</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filtered.map((t, i) => (
                    <div key={t.id} style={{ animation: `fadeUp .3s ${i * .03}s ease both` }}>
                      <TxRow t={t} fmt={fmt} showBadge />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CATEGORIES ───────────────────────────────────── */}
          {view === "categories" && (
            <div className="card fu" style={{ padding: 22 }}>
              <div className="section-title" style={{ marginBottom: 20 }}>Spending by Category</div>
              {Object.keys(catSpend).length === 0 ? (
                <div style={{ textAlign: "center", padding: "52px 0", color: "#3A4060", fontSize: 13 }}>No expense data yet</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {Object.entries(catSpend).sort((a, b) => b[1] - a[1]).map(([cat, amt], i) => {
                    const pct = totalExpenses ? Math.round(amt / totalExpenses * 100) : 0;
                    const col = categoryColor(cat);
                    return (
                      <div key={cat} style={{ animation: `fadeUp .35s ${i * .05}s ease both` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: col, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{cat}</span>
                          </div>
                          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#546080" }}>{pct}%</span>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14 }}>{fmt(amt)}</span>
                          </div>
                        </div>
                        <div className="prog-bar">
                          <div className="prog-fill" style={{ width: pct + "%", background: col }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="card fu" style={{ padding: 28, width: 430, maxWidth: "90vw" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 19, fontWeight: 700 }}>New Transaction</div>
              <button onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#546080", cursor: "pointer", padding: 4, borderRadius: 6, transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#EBE8F4"}
                onMouseLeave={e => e.currentTarget.style.color = "#546080"}>
                <IcX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={{ fontSize: 11, color: "#546080", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 6 }}>Title</label>
                <input className="input" placeholder="e.g. Office Rent, Product Sales…" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#546080", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 6 }}>Amount ({currency.symbol})</label>
                  <input className="input" type="number" placeholder="0.00" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#546080", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 6 }}>Date</label>
                  <input className="input" type="date" value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    style={{ colorScheme: "dark" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: "#546080", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 6 }}>Type</label>
                <select className="input" value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="income">Income / Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: "#546080", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Category <span style={{ color: "#3A4060", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(type freely or pick a suggestion)</span>
                </label>
                <input
                  className="input"
                  list="cat-list"
                  placeholder="e.g. Marketing, Salaries, Custom…"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                />
                <datalist id="cat-list">
                  {SUGGESTED_CATEGORIES.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button className="btn-outline" style={{ flex: 1, padding: "11px 0" }}
                  onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 1 }} onClick={handleAdd}>Save Transaction</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared row component ──────────────────────────────────────────────────────

function TxRow({ t, fmt, showBadge }) {
  const isIncome = t.type === "income";
  const col = isIncome ? "#34BF8B" : "#E05C5C";
  return (
    <div className="tx-row">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: col + "18", flexShrink: 0 }}>
          <span style={{ color: col }}>{isIncome ? <IcUp /> : <IcDown />}</span>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.title}</div>
          <div style={{ fontSize: 11, color: "#546080", marginTop: 1.5 }}>{t.date} · {t.category}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBadge && <span className={`badge badge-${t.type}`}>{t.type}</span>}
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: col, minWidth: 100, textAlign: "right" }}>
          {isIncome ? "+" : "−"}{fmt(t.amount)}
        </div>
      </div>
    </div>
  );
}
