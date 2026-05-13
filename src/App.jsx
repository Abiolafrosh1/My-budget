import { useState, useEffect } from "react";
import {
BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
PieChart, Pie, Cell, Legend
} from "recharts";

const initialTransactions = [
{ id: 1, title: "Salary", amount: 450000, type: "income", category: "Work", date: "2026-05-01" },
{ id: 2, title: "Rent", amount: 80000, type: "expense", category: "Housing", date: "2026-05-02" },
{ id: 3, title: "Groceries", amount: 12000, type: "expense", category: "Food", date: "2026-05-04" },
{ id: 4, title: "Freelance", amount: 75000, type: "income", category: "Work", date: "2026-05-06" },
{ id: 5, title: "Electricity", amount: 8500, type: "expense", category: "Utilities", date: "2026-05-07" },
{ id: 6, title: "Airtime", amount: 3000, type: "expense", category: "Telecom", date: "2026-05-08" },
{ id: 7, title: "Transport", amount: 15000, type: "expense", category: "Transport", date: "2026-05-09" },
{ id: 8, title: "Restaurant", amount: 7500, type: "expense", category: "Food", date: "2026-05-10" },
{ id: 9, title: "Investment Return", amount: 22000, type: "income", category: "Investment", date: "2026-05-11" },
{ id: 10, title: "Clothes", amount: 18000, type: "expense", category: "Shopping", date: "2026-05-12" },
];

const monthlyData = [
{ month: "Jan", income: 420000, expenses: 190000 },
{ month: "Feb", income: 390000, expenses: 210000 },
{ month: "Mar", income: 470000, expenses: 175000 },
{ month: "Apr", income: 510000, expenses: 230000 },
{ month: "May", income: 547000, expenses: 144000 },
];

const CATEGORY_COLORS = {
Housing: "#D4A853",
Food: "#7EC8A4",
Utilities: "#5B9BD5",
Transport: "#E07B7B",
Shopping: "#C47EC8",
Telecom: "#7BC4C4",
Work: "#D4A853",
Investment: "#7EC8A4",
};

const CHART_COLORS = ["#D4A853", "#7EC8A4", "#5B9BD5", "#E07B7B", "#C47EC8", "#7BC4C4"];

const formatNaira = (val) =>
"₦" + Number(val).toLocaleString("en-NG");

export default function App() {
const [transactions, setTransactions] = useState(initialTransactions);
const [showModal, setShowModal] = useState(false);
const [activeTab, setActiveTab] = useState("overview");
const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "Food", date: "" });
const [animIn, setAnimIn] = useState(false);

useEffect(() => {
setTimeout(() => setAnimIn(true), 50);
}, []);

const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
const balance = totalIncome - totalExpenses;
const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

const categorySpend = transactions.filter(t => t.type === "expense").reduce((acc, t) => {
acc[t.category] = (acc[t.category] || 0) + t.amount;
return acc;
}, {});
const pieData = Object.entries(categorySpend).map(([name, value]) => ({ name, value }));

const handleAdd = () => {
if (!form.title || !form.amount || !form.date) return;
setTransactions(prev => [
{ id: Date.now(), ...form, amount: parseFloat(form.amount) },
...prev,
]);
setForm({ title: "", amount: "", type: "expense", category: "Food", date: "" });
setShowModal(false);
};

return (
<div style={{
minHeight: "100vh",
background: "#0D0F14",
fontFamily: "'DM Sans', sans-serif",
color: "#E8E0D5",
padding: "0",
}}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet" />

<style>{`
* { box-sizing: border-box; margin: 0; padding: 0; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0D0F14; }
::-webkit-scrollbar-thumb { background: #D4A853; border-radius: 2px; }
.card { background: #13161E; border: 1px solid #1E2230; border-radius: 16px; }
.card:hover { border-color: #D4A85355; transition: border-color 0.3s; }
.gold { color: #D4A853; }
.fade-in { opacity: ${animIn ? 1 : 0}; transform: translateY(${animIn ? 0 : 20}px); transition: all 0.6s ease; }
.tab-btn { background: none; border: none; color: #8B8FA8; cursor: pointer; padding: 8px 18px; border-radius: 8px; font-family: inherit; font-size: 14px; font-weight: 500; transition: all 0.2s; }
.tab-btn.active { background: #1E2230; color: #D4A853; }
.tab-btn:hover { color: #E8E0D5; }
.add-btn { background: #D4A853; color: #0D0F14; border: none; border-radius: 10px; padding: 10px 22px; font-family: inherit; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.add-btn:hover { background: #E8C070; transform: translateY(-1px); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
.input { background: #1E2230; border: 1px solid #2A2F40; border-radius: 8px; color: #E8E0D5; padding: 10px 14px; font-family: inherit; font-size: 14px; width: 100%; outline: none; }
.input:focus { border-color: #D4A853; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-income { background: #7EC8A422; color: #7EC8A4; }
.badge-expense { background: #E07B7B22; color: #E07B7B; }
.progress-bar { height: 5px; background: #1E2230; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
@keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
.slide-up { animation: slideUp 0.5s ease forwards; }
`}</style>

{/* Header */}
<div style={{ borderBottom: "1px solid #1E2230", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>
<span className="gold">₦</span> Vault
</div>
<div style={{ fontSize: 12, color: "#8B8FA8", marginTop: 2 }}>Personal Finance Dashboard</div>
</div>
<div style={{ textAlign: "center" }}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#8B8FA8", letterSpacing: 2, textTransform: "uppercase" }}>Owned by</div>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#D4A853", letterSpacing: 3 }}>ABIOLAFROSH</div>
</div>
<button className="add-btn" onClick={() => setShowModal(true)}>+ Add Transaction</button>
</div>

<div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

{/* Summary Cards */}
<div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
{[
{ label: "Balance", value: formatNaira(balance), sub: "Current", accent: "#D4A853" },
{ label: "Income", value: formatNaira(totalIncome), sub: "This month", accent: "#7EC8A4" },
{ label: "Expenses", value: formatNaira(totalExpenses), sub: "This month", accent: "#E07B7B" },
{ label: "Savings Rate", value: savingsRate + "%", sub: "Of income saved", accent: "#5B9BD5" },
].map((c, i) => (
<div key={i} className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
<div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: c.accent + "10", borderRadius: "0 16px 0 80px" }} />
<div style={{ fontSize: 12, color: "#8B8FA8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: c.accent }}>{c.value}</div>
<div style={{ fontSize: 12, color: "#8B8FA8", marginTop: 4 }}>{c.sub}</div>
</div>
))}
</div>

{/* Tabs */}
<div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
{["overview", "transactions", "categories"].map(tab => (
<button key={tab} className={`tab-btn${activeTab === tab ? " active" : ""}`}
onClick={() => setActiveTab(tab)} style={{ textTransform: "capitalize" }}>
{tab}
</button>
))}
</div>

{/* Overview Tab */}
{activeTab === "overview" && (
<div className="slide-up" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
<div className="card" style={{ padding: 24 }}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Monthly Overview</div>
<ResponsiveContainer width="100%" height={220}>
<BarChart data={monthlyData} barCategoryGap="30%">
<XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8B8FA8", fontSize: 12 }} />
<YAxis axisLine={false} tickLine={false} tick={{ fill: "#8B8FA8", fontSize: 11 }} tickFormatter={v => "₦" + (v / 1000) + "k"} />
<Tooltip
contentStyle={{ background: "#13161E", border: "1px solid #1E2230", borderRadius: 10, fontSize: 12 }}
formatter={(v) => formatNaira(v)}
labelStyle={{ color: "#E8E0D5" }}
/>
<Bar dataKey="income" fill="#D4A853" radius={[4, 4, 0, 0]} />
<Bar dataKey="expenses" fill="#E07B7B" radius={[4, 4, 0, 0]} />
</BarChart>
</ResponsiveContainer>
<div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8B8FA8" }}>
<div style={{ width: 10, height: 10, borderRadius: 2, background: "#D4A853" }} /> Income
</div>
<div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8B8FA8" }}>
<div style={{ width: 10, height: 10, borderRadius: 2, background: "#E07B7B" }} /> Expenses
</div>
</div>
</div>
<div className="card" style={{ padding: 24 }}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Spending Breakdown</div>
<ResponsiveContainer width="100%" height={200}>
<PieChart>
<Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
{pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
</Pie>
<Tooltip formatter={(v) => formatNaira(v)} contentStyle={{ background: "#13161E", border: "1px solid #1E2230", borderRadius: 10, fontSize: 12 }} />
<Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#8B8FA8" }} />
</PieChart>
</ResponsiveContainer>
</div>
</div>
)}

{/* Transactions Tab */}
{activeTab === "transactions" && (
<div className="card slide-up" style={{ padding: 24 }}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>All Transactions</div>
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
{transactions.map((t, i) => (
<div key={t.id} style={{
display: "flex", alignItems: "center", justifyContent: "space-between",
padding: "14px 16px", background: "#0D0F14", borderRadius: 10,
border: "1px solid #1E2230",
animation: `slideUp 0.3s ease ${i * 0.04}s forwards`, opacity: 0
}}>
<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
<div style={{
width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
background: (CATEGORY_COLORS[t.category] || "#D4A853") + "22",
color: CATEGORY_COLORS[t.category] || "#D4A853", fontSize: 16
}}>
{t.type === "income" ? "↑" : "↓"}
</div>
<div>
<div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
<div style={{ fontSize: 11, color: "#8B8FA8", marginTop: 2 }}>{t.date} · {t.category}</div>
</div>
</div>
<div style={{ textAlign: "right" }}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 16, color: t.type === "income" ? "#7EC8A4" : "#E07B7B" }}>
{t.type === "income" ? "+" : "-"}{formatNaira(t.amount)}
</div>
<span className={`badge badge-${t.type}`}>{t.type}</span>
</div>
</div>
))}
</div>
</div>
)}

{/* Categories Tab */}
{activeTab === "categories" && (
<div className="card slide-up" style={{ padding: 24 }}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Spending by Category</div>
<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
{Object.entries(categorySpend).sort((a, b) => b[1] - a[1]).map(([cat, amt], i) => {
const pct = Math.round((amt / totalExpenses) * 100);
const color = CATEGORY_COLORS[cat] || "#D4A853";
return (
<div key={cat} style={{ animation: `slideUp 0.3s ease ${i * 0.06}s forwards`, opacity: 0 }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
<span style={{ fontSize: 14 }}>{cat}</span>
</div>
<div style={{ display: "flex", gap: 16, alignItems: "center" }}>
<span style={{ fontSize: 13, color: "#8B8FA8" }}>{pct}%</span>
<span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 16 }}>{formatNaira(amt)}</span>
</div>
</div>
<div className="progress-bar">
<div className="progress-fill" style={{ width: pct + "%", background: color }} />
</div>
</div>
);
})}
</div>
</div>
)}
</div>

{/* Add Transaction Modal */}
{showModal && (
<div className="modal-overlay" onClick={() => setShowModal(false)}>
<div className="card slide-up" style={{ padding: 28, width: 400 }} onClick={e => e.stopPropagation()}>
<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 22 }}>
New Transaction
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
<input className="input" placeholder="Title (e.g. Salary, Rent)" value={form.title}
onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
<input className="input" type="number" placeholder="Amount (₦)" value={form.amount}
onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
<input className="input" type="date" value={form.date}
onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
<select className="input" value={form.type}
onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
<option value="income">Income</option>
<option value="expense">Expense</option>
</select>
<select className="input" value={form.category}
onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
{["Food", "Housing", "Utilities", "Transport", "Shopping", "Telecom", "Work", "Investment", "Other"].map(c =>
<option key={c} value={c}>{c}</option>
)}
</select>
<div style={{ display: "flex", gap: 10, marginTop: 6 }}>
<button onClick={() => setShowModal(false)} style={{
flex: 1, background: "none", border: "1px solid #2A2F40", color: "#8B8FA8",
borderRadius: 10, padding: 11, cursor: "pointer", fontFamily: "inherit"
}}>Cancel</button>
<button className="add-btn" style={{ flex: 1 }} onClick={handleAdd}>Save</button>
</div>
</div>
</div>
</div>
)}
</div>
);
}