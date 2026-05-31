import { useState, useEffect, useRef } from "react";

const SB_URL = "https://ntmngqjhqyptzmizuyqn.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bW5ncWpocXlwdHptaXp1eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDU5ODYsImV4cCI6MjA5NTQyMTk4Nn0.L7sBVwpGhbytDgo5n38N7CbId8fulGF6SyG0ChWdafY";
const SB_H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };
const LOGO_URL = "https://i.ibb.co/Z60PfC4r/logo-1.png";

const sbGet = (table, q) =>
  fetch(`${SB_URL}/rest/v1/${table}?${q}`, { headers: SB_H }).then(r => r.json());
const sbPost = (table, body) =>
  fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...SB_H, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(body),
  }).then(r => r.json());
const sbDelete = (table, id) =>
  fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: SB_H });
const uploadImg = async (file) => {
  const fname = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const r = await fetch(`${SB_URL}/storage/v1/object/product-images/${fname}`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": file.type },
    body: file,
  });
  if (!r.ok) return null;
  return `${SB_URL}/storage/v1/object/public/product-images/${fname}`;
};

const CATEGORIES = [
  { name: "Bags & Footwear", slug: "/bags-fo...", sub: 24 },
  { name: "Beauty & Health", slug: "/beauty-...", sub: 38 },
  { name: "Books", slug: "/books", sub: 12 },
  { name: "Car & Motorbike", slug: "/car-mot...", sub: 12 },
  { name: "Electronics", slug: "/electron...", sub: 15 },
  { name: "Grocery", slug: "/grocery", sub: 10 },
  { name: "Home & Kitchen", slug: "/home-ki...", sub: 41 },
  { name: "Jewellery & Accessories", slug: "/jeweller...", sub: 18 },
  { name: "Kids & Toys", slug: "/kids-toys", sub: 17 },
  { name: "Kurti, Saree & Lehenga", slug: "/kurti-sar...", sub: 46 },
  { name: "Lingerie", slug: "/lingerie", sub: 15 },
  { name: "Men", slug: "/men", sub: 33 },
  { name: "Musical Instruments", slug: "/musical-i...", sub: 6 },
  { name: "Office Supplies & Stationery", slug: "/office-su...", sub: 6 },
  { name: "Pet Supplies", slug: "/pet-suppl...", sub: 6 },
  { name: "Popular", slug: "/popular", sub: 16 },
  { name: "Sports & Fitness", slug: "/sports-fi...", sub: 17 },
  { name: "Watches", slug: "/watches", sub: 4 },
  { name: "Women Western", slug: "/women-...", sub: 25 },
];
const CAT_ICONS = ["🛍️","💄","📚","🚗","📱","🛒","🏠","💍","🧸","👗","👙","👕","🎸","✏️","🐾","⭐","🏋️","⌚","👗"];

const ADMIN_SECTIONS = {
  trending: {
    label: "Trending Products", icon: "📈", color: "#2563eb",
    table: "products", extra: { tab: "trending" }, tabFilter: "tab=eq.trending",
    fields: [
      { key: "name", label: "Product Name *", type: "textarea", required: true },
      { key: "price", label: "Price (₹)", type: "number" },
      { key: "rating", label: "Rating (0-5)", type: "number", step: 0.1 },
      { key: "reviews", label: "Reviews Count (e.g. 115.2k)", type: "text" },
      { key: "ratings_count", label: "Ratings Count (e.g. 345.3k)", type: "text" },
      { key: "badge", label: "Badge (e.g. Hot Seller)", type: "text" },
      { key: "meesho_url", label: "Meesho Product URL", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "revenue", label: "Revenue (e.g. ₹187.2M)", type: "text" },
      { key: "sold_count", label: "Sold Count (e.g. 807k)", type: "text" },
      { key: "star5", label: "5★ Count (e.g. 169.5k)", type: "text" },
      { key: "star4", label: "4★ Count (e.g. 90.9k)", type: "text" },
      { key: "star3", label: "3★ Count (e.g. 48.7k)", type: "text" },
      { key: "star2", label: "2★ Count (e.g. 12.2k)", type: "text" },
      { key: "star1", label: "1★ Count (e.g. 24.4k)", type: "text" },
    ],
  },
  growing: {
    label: "Growing Products", icon: "⚡", color: "#0d9488",
    table: "products", extra: { tab: "growing" }, tabFilter: "tab=eq.growing",
    fields: [
      { key: "name", label: "Product Name *", type: "textarea", required: true },
      { key: "price", label: "Price (₹)", type: "number" },
      { key: "rank", label: "Rank (#1, #2...)", type: "number" },
      { key: "growth", label: "Growth % (e.g. +304%)", type: "text" },
      { key: "demand", label: "Demand % (e.g. +67%)", type: "text" },
      { key: "engage", label: "Engage % (e.g. +28%)", type: "text" },
      { key: "analysis", label: "Analysis (e.g. 23d analysis)", type: "text" },
      { key: "meesho_url", label: "Meesho Product URL", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "revenue", label: "Revenue (e.g. ₹187.2M)", type: "text" },
      { key: "sold_count", label: "Sold Count (e.g. 807k)", type: "text" },
      { key: "star5", label: "5★ Count (e.g. 169.5k)", type: "text" },
      { key: "star4", label: "4★ Count (e.g. 90.9k)", type: "text" },
      { key: "star3", label: "3★ Count (e.g. 48.7k)", type: "text" },
      { key: "star2", label: "2★ Count (e.g. 12.2k)", type: "text" },
      { key: "star1", label: "1★ Count (e.g. 24.4k)", type: "text" },
    ],
  },
  suppliers: {
    label: "Suppliers", icon: "👥", color: "#7c3aed",
    table: "suppliers", extra: {}, tabFilter: "",
    fields: [
      { key: "name", label: "Supplier Name *", type: "text", required: true },
      { key: "handle", label: "Handle (@PVariety)", type: "text" },
      { key: "rating", label: "Rating (0-5)", type: "number", step: 0.1 },
      { key: "best_products", label: "Best Products Count", type: "number" },
      { key: "reviews", label: "Reviews (e.g. 1,630,539)", type: "text" },
      { key: "category", label: "Category", type: "text" },
    ],
  },
  brands: {
    label: "Brands", icon: "🏪", color: "#0d9488",
    table: "brands", extra: {}, tabFilter: "",
    fields: [
      { key: "name", label: "Brand Name *", type: "text", required: true },
      { key: "initials", label: "Initials (D, MA...)", type: "text" },
      { key: "color", label: "Brand Color", type: "color" },
      { key: "rating", label: "Rating (0-5)", type: "number", step: 0.1 },
      { key: "reviews", label: "Reviews (e.g. 322.5K)", type: "text" },
      { key: "products", label: "Products Count", type: "number" },
      { key: "price_range", label: "Price Range (₹76 – ₹479)", type: "text" },
    ],
  },
};

function Stars({ rating }) {
  const r = Math.round(Number(rating) || 0);
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ color:i<=r?"#f59e0b":"#d1d5db", fontSize:11 }}>★</span>)}
    </span>
  );
}

function ProductImg({ src, emoji="🛍️" }) {
  const [err, setErr] = useState(false);
  if (src && !err) return <img src={src} alt="" onError={()=>setErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />;
  return <span style={{ fontSize:40 }}>{emoji}</span>;
}

// ── PRODUCT DETAIL MODAL ──────────────────────────────────────
function ProductDetailModal({ p, onClose }) {
  const [buyPrice, setBuyPrice] = useState("");
  const margin = buyPrice ? (((p.price - Number(buyPrice)) / p.price) * 100).toFixed(1) : null;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:500, overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", margin:"16px auto 40px", borderRadius:20, maxWidth:430, overflow:"hidden" }}>

        {/* Image */}
        <div style={{ position:"relative", background:"#f8f9fa", height:240, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          <ProductImg src={p.image_url} emoji="🛍️" />
          <button onClick={onClose} style={{ position:"absolute", top:12, right:12, width:34, height:34, background:"rgba(0,0,0,0.45)", border:"none", borderRadius:"50%", color:"#fff", fontSize:18, cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          {p.badge && <span style={{ position:"absolute", top:12, left:12, background:"#16a34a", color:"#fff", fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>↗ {p.badge}</span>}
          {p.rank && <span style={{ position:"absolute", top:12, left:12, background:"#f97316", color:"#fff", fontSize:13, fontWeight:800, width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>#{p.rank}</span>}
          {p.growth && <span style={{ position:"absolute", top:12, right:50, background:"#0d9488", color:"#fff", fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>⚡ {p.growth}</span>}
        </div>

        <div style={{ padding:"18px 16px 0" }}>
          {/* Title */}
          <h3 style={{ fontSize:17, fontWeight:800, color:"#111", margin:"0 0 6px", lineHeight:1.4 }}>{p.name}</h3>
          <p style={{ fontSize:24, fontWeight:900, color:"#111", margin:"0 0 2px" }}>₹{p.price}</p>
          <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 16px" }}>incl. all fees • Current price</p>

          {/* Stats */}
          {(p.revenue || p.reviews || p.sold_count) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
              {p.revenue && <div style={{ background:"#f9fafb", borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                <p style={{ fontSize:10, color:"#9ca3af", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:0.5 }}>₹ REVENUE</p>
                <p style={{ fontSize:14, fontWeight:800, color:"#111", margin:0 }}>{p.revenue}</p>
                <p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0" }}>All-time est.</p>
              </div>}
              {p.reviews && <div style={{ background:"#f9fafb", borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                <p style={{ fontSize:10, color:"#9ca3af", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:0.5 }}>REVIEWS</p>
                <p style={{ fontSize:14, fontWeight:800, color:"#111", margin:0 }}>{p.reviews}</p>
                <p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0" }}>All-time</p>
              </div>}
              {p.sold_count && <div style={{ background:"#f9fafb", borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                <p style={{ fontSize:10, color:"#9ca3af", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:0.5 }}>SOLD</p>
                <p style={{ fontSize:14, fontWeight:800, color:"#f97316", margin:0 }}>{p.sold_count}</p>
                <p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0" }}>All-time est.</p>
              </div>}
            </div>
          )}

          {/* Rating Distribution */}
          {(p.star5||p.star4||p.star3||p.star2||p.star1) && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <p style={{ fontSize:15, fontWeight:800, color:"#111", margin:0 }}>Rating Distribution</p>
                <span style={{ fontSize:12, color:"#9ca3af" }}>All-time</span>
              </div>
              {[[5,p.star5],[4,p.star4],[3,p.star3],[2,p.star2],[1,p.star1]].map(([s,count])=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                  <span style={{ fontSize:12, color:"#6b7280", width:10, textAlign:"right" }}>{s}</span>
                  <span style={{ color:"#f59e0b", fontSize:12 }}>★</span>
                  <div style={{ flex:1, height:7, background:"#e5e7eb", borderRadius:4 }}>
                    <div style={{ height:7, borderRadius:4, background: s>=4?"#f59e0b":s===3?"#f97316":"#ef4444", width:`${Math.max(4,100-(5-s)*18)}%`, transition:"width 0.3s" }} />
                  </div>
                  <span style={{ fontSize:12, color:"#6b7280", width:48, textAlign:"right" }}>{count||"—"}</span>
                </div>
              ))}
            </div>
          )}

          {/* Demand / Engage for growing */}
          {(p.demand||p.engage) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {p.demand && <div style={{ background:"#f0fdf4", borderRadius:12, padding:"10px 12px" }}>
                <p style={{ fontSize:10, color:"#6b7280", margin:"0 0 3px", textTransform:"uppercase" }}>📊 DEMAND</p>
                <p style={{ fontSize:20, fontWeight:900, color:"#16a34a", margin:0 }}>{p.demand}</p>
              </div>}
              {p.engage && <div style={{ background:"#eff6ff", borderRadius:12, padding:"10px 12px" }}>
                <p style={{ fontSize:10, color:"#6b7280", margin:"0 0 3px", textTransform:"uppercase" }}>📈 ENGAGE</p>
                <p style={{ fontSize:20, fontWeight:900, color:"#2563eb", margin:0 }}>{p.engage}</p>
              </div>}
            </div>
          )}

          {/* View on Meesho */}
          <a href={p.meesho_url||"https://meesho.com"} target="_blank" rel="noreferrer"
            style={{ display:"block", background:"#2563eb", color:"#fff", borderRadius:14, padding:"14px 0", textAlign:"center", fontSize:15, fontWeight:800, textDecoration:"none", marginBottom:12 }}>
            View listing on Meesho ↗
          </a>

          {/* Profit Calculator */}
          <div style={{ background:"#f9fafb", borderRadius:16, padding:"14px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <p style={{ fontSize:13, fontWeight:800, color:"#111", margin:0, textTransform:"uppercase", letterSpacing:0.5 }}>PROFIT CALCULATOR</p>
              <span style={{ fontSize:11, color:"#9ca3af" }}>per 100 units</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
              <div>
                <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 5px" }}>Your buy price (₹)</p>
                <input type="number" placeholder="e.g. 150" value={buyPrice} onChange={e=>setBuyPrice(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 5px" }}>Sell price</p>
                <div style={{ border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px", background:"#fff" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:"#111", margin:0 }}>₹{p.price}</p>
                </div>
              </div>
            </div>
            {buyPrice && Number(buyPrice) > 0 && (
              <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <p style={{ fontSize:10, color:"#6b7280", margin:"0 0 3px", textTransform:"uppercase" }}>PROFIT PER 100 SOLD</p>
                    <p style={{ fontSize:22, fontWeight:900, color:"#16a34a", margin:0 }}>₹{Math.round((p.price - Number(buyPrice)) * 100).toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:10, color:"#6b7280", margin:"0 0 3px", textTransform:"uppercase" }}>MARGIN</p>
                    <p style={{ fontSize:22, fontWeight:900, color:"#16a34a", margin:0 }}>{margin}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <button style={{ width:"100%", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:14, padding:"13px 0", fontSize:14, fontWeight:700, color:"#374151", cursor:"pointer", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            🔖 Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TRENDING CARD ─────────────────────────────────────────────
function TrendingCard({ p }) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <>
      <div onClick={()=>setShowDetail(true)} style={{ background:"#fff", borderRadius:16, border:"1px solid #f0f0f0", minWidth:220, maxWidth:240, flexShrink:0, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer" }}>
        <div style={{ position:"relative", background:"#f8f9fa", height:160, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          {p.badge && <span style={{ position:"absolute", top:10, left:10, background:"#16a34a", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>↗ {p.badge}</span>}
          <ProductImg src={p.image_url} emoji="🛍️" />
        </div>
        <div style={{ padding:"10px 12px 12px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:"0 0 6px", lineHeight:1.4, height:38, overflow:"hidden" }}>{p.name}</p>
          <p style={{ fontSize:18, fontWeight:800, color:"#111", margin:"0 0 8px" }}>₹{p.price}</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              {p.rating && <span style={{ background:"#fef3c7", color:"#92400e", fontSize:12, fontWeight:700, padding:"2px 7px", borderRadius:8 }}>⭐ {p.rating}</span>}
              {p.reviews && <p style={{ fontSize:10, color:"#6b7280", margin:"3px 0 0", textTransform:"uppercase" }}>{p.reviews} Reviews</p>}
            </div>
            {p.ratings_count && <>
              <div style={{ width:1, height:30, background:"#e5e7eb" }} />
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:13, fontWeight:700, color:"#111", margin:0 }}>{p.ratings_count}</p>
                <p style={{ fontSize:10, color:"#6b7280", margin:"2px 0 0", textTransform:"uppercase" }}>Ratings</p>
              </div>
            </>}
          </div>
          {/* Rating bars mini */}
          {(p.star5||p.star4||p.star3||p.star2||p.star1) && (
            <div style={{ marginBottom:8 }}>
              {[[5,p.star5],[4,p.star4],[3,p.star3],[2,p.star2],[1,p.star1]].map(([s,count])=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:4, marginBottom:2 }}>
                  <span style={{ fontSize:9, color:"#6b7280", width:8 }}>{s}</span>
                  <span style={{ color:"#f59e0b", fontSize:9 }}>★</span>
                  <div style={{ flex:1, height:3, background:"#e5e7eb", borderRadius:2 }}>
                    <div style={{ height:3, borderRadius:2, background:s>=4?"#f59e0b":s===3?"#f97316":"#ef4444", width:`${Math.max(4,100-(5-s)*18)}%` }} />
                  </div>
                  <span style={{ fontSize:9, color:"#6b7280", width:30, textAlign:"right" }}>{count||""}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={e=>{e.stopPropagation();}} style={{ width:34, height:34, background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, cursor:"pointer" }}>🔖</button>
            <button onClick={e=>{e.stopPropagation();}} style={{ width:34, height:34, background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, cursor:"pointer" }}>↗️</button>
            <a href={p.meesho_url||"https://meesho.com"} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
              style={{ flex:1, background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#2563eb", textDecoration:"none", padding:"6px 0" }}>
              Meesho ↗
            </a>
          </div>
        </div>
      </div>
      {showDetail && <ProductDetailModal p={p} onClose={()=>setShowDetail(false)} />}
    </>
  );
}

// ── GROWING CARD ──────────────────────────────────────────────
function GrowingCard({ p }) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <>
      <div onClick={()=>setShowDetail(true)} style={{ background:"#fff", borderRadius:16, border:"1px solid #f0f0f0", minWidth:220, maxWidth:240, flexShrink:0, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer" }}>
        <div style={{ position:"relative", background:"#f8f9fa", height:160, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          {p.rank && <span style={{ position:"absolute", top:10, left:10, background:"#f97316", color:"#fff", fontSize:12, fontWeight:800, width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>#{p.rank}</span>}
          {p.growth && <span style={{ position:"absolute", top:10, right:10, background:"#0d9488", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>⚡ {p.growth}</span>}
          <ProductImg src={p.image_url} emoji="📦" />
        </div>
        <div style={{ padding:"10px 12px 12px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#111", margin:"0 0 4px", lineHeight:1.4, height:38, overflow:"hidden" }}>{p.name}</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <p style={{ fontSize:18, fontWeight:800, color:"#111", margin:0 }}>₹{p.price}</p>
            {p.analysis && <span style={{ fontSize:11, color:"#6b7280", background:"#f3f4f6", padding:"2px 8px", borderRadius:10 }}>{p.analysis}</span>}
          </div>
          {(p.demand||p.engage) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
              {p.demand && <div style={{ background:"#f0fdf4", borderRadius:10, padding:"6px 8px" }}>
                <p style={{ fontSize:10, color:"#6b7280", margin:"0 0 2px", textTransform:"uppercase" }}>📊 DEMAND</p>
                <p style={{ fontSize:14, fontWeight:800, color:"#16a34a", margin:0 }}>{p.demand}</p>
              </div>}
              {p.engage && <div style={{ background:"#eff6ff", borderRadius:10, padding:"6px 8px" }}>
                <p style={{ fontSize:10, color:"#6b7280", margin:"0 0 2px", textTransform:"uppercase" }}>📈 ENGAGE</p>
                <p style={{ fontSize:14, fontWeight:800, color:"#2563eb", margin:0 }}>{p.engage}</p>
              </div>}
            </div>
          )}
          <a href={p.meesho_url||"https://meesho.com"} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
            style={{ display:"block", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 0", fontSize:13, fontWeight:600, color:"#374151", textDecoration:"none", textAlign:"center" }}>
            🔗 Meesho ↗
          </a>
        </div>
      </div>
      {showDetail && <ProductDetailModal p={p} onClose={()=>setShowDetail(false)} />}
    </>
  );
}

// ── SUPPLIER CARD ─────────────────────────────────────────────
function SupplierCard({ s }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f0f0f0", minWidth:200, maxWidth:220, flexShrink:0, padding:"16px 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#ede9fe,#ddd6fe)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", overflow:"hidden" }}>
        {s.image_url ? <img src={s.image_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:28 }}>🏪</span>}
      </div>
      <p style={{ fontWeight:800, fontSize:14, color:"#111", margin:"0 0 2px" }}>{s.name}</p>
      {s.handle && <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 8px" }}>{s.handle}</p>}
      {s.rating && <div style={{ background:"#fef3c7", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", marginBottom:10 }}>
        <span style={{ color:"#f59e0b" }}>★</span><span style={{ fontSize:13, fontWeight:700, color:"#92400e" }}>{s.rating}</span>
      </div>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        <div><p style={{ fontSize:15, fontWeight:800, color:"#111", margin:0 }}>{s.best_products||0}</p><p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0", textTransform:"uppercase" }}>Best Products</p></div>
        <div><p style={{ fontSize:12, fontWeight:700, color:"#111", margin:0 }}>{s.reviews||"—"}</p><p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0", textTransform:"uppercase" }}>Reviews</p></div>
      </div>
      <button style={{ width:"100%", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 0", fontSize:12, fontWeight:600, color:"#7c3aed", cursor:"pointer" }}>🔗 View on Meesho</button>
    </div>
  );
}

// ── BRAND CARD ────────────────────────────────────────────────
function BrandCard({ b }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f0f0f0", minWidth:200, maxWidth:220, flexShrink:0, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ background:"#1f2937", height:80, display:"flex", alignItems:"center", padding:"0 16px" }}>
        <div style={{ width:48, height:48, borderRadius:14, background:b.color||"#6d28d9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff" }}>
          {b.initials||(b.name||"B")[0].toUpperCase()}
        </div>
      </div>
      <div style={{ padding:"12px 14px" }}>
        <p style={{ fontWeight:800, fontSize:15, color:"#111", margin:"0 0 4px" }}>{b.name}</p>
        <div style={{ display:"flex", gap:3, marginBottom:8, alignItems:"center" }}><Stars rating={b.rating} />{b.rating && <span style={{ fontSize:12, color:"#6b7280", marginLeft:3 }}>{b.rating}</span>}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
          {b.reviews && <div style={{ background:"#f9fafb", borderRadius:10, padding:"6px 10px" }}><p style={{ fontSize:13, fontWeight:800, color:"#111", margin:0 }}>{b.reviews}</p><p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0", textTransform:"uppercase" }}>Reviews</p></div>}
          {b.products!==undefined && <div style={{ background:"#f9fafb", borderRadius:10, padding:"6px 10px" }}><p style={{ fontSize:13, fontWeight:800, color:"#111", margin:0 }}>{b.products}</p><p style={{ fontSize:10, color:"#9ca3af", margin:"2px 0 0", textTransform:"uppercase" }}>Products</p></div>}
        </div>
        {b.price_range && <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 10px" }}>{b.price_range}</p>}
        <button style={{ width:"100%", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"7px 0", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>View Brand ↗</button>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, total, btnLabel, btnColor }) {
  return (
    <div style={{ padding:"0 16px 12px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <p style={{ margin:0, fontSize:16, fontWeight:700, color:"#111" }}>{title}</p>
      </div>
      <p style={{ margin:"0 0 8px 26px", fontSize:12, color:"#6b7280" }}>Products • Just for you</p>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:13, color:"#6b7280", fontWeight:600 }}>1 / {total}</span>
        <button style={{ background:btnColor, color:"#fff", border:"none", borderRadius:20, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{btnLabel}</button>
      </div>
      <div style={{ height:3, background:"#e5e7eb", borderRadius:2, marginTop:8 }}>
        <div style={{ height:3, width:"7%", background:btnColor, borderRadius:2 }} />
      </div>
    </div>
  );
}

// ── SIGN IN MODAL ─────────────────────────────────────────────
function SignInModal({ onClose, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError(""); setLoading(true);
    try {
      const ep = isSignUp ? "signup" : "token?grant_type=password";
      const r = await fetch(`${SB_URL}/auth/v1/${ep}`, {
        method:"POST", headers:{ apikey:SB_KEY, "Content-Type":"application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (data.error || data.error_code) throw new Error(data.error_description || data.msg || "Auth failed");
      onSignIn(data.user || { email });
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:500, padding:"24px 20px 32px" }}>
        <div style={{ width:40, height:4, background:"#e5e7eb", borderRadius:2, margin:"0 auto 20px" }} />
        <h2 style={{ fontSize:22, fontWeight:800, color:"#111", margin:"0 0 4px", textAlign:"center" }}>{isSignUp?"Create Account":"Welcome Back"}</h2>
        <p style={{ fontSize:13, color:"#6b7280", textAlign:"center", margin:"0 0 20px" }}>Supplix account mein sign {isSignUp?"up":"in"} karo</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"12px 14px", fontSize:14, marginBottom:10, outline:"none", boxSizing:"border-box" }} />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"12px 14px", fontSize:14, marginBottom:14, outline:"none", boxSizing:"border-box" }} />
        {error && <p style={{ color:"#dc2626", fontSize:12, marginBottom:10 }}>❌ {error}</p>}
        <button onClick={handleAuth} disabled={loading} style={{ width:"100%", background:"linear-gradient(135deg,#6d28d9,#db2777)", color:"#fff", border:"none", borderRadius:12, padding:"14px 0", fontSize:15, fontWeight:800, cursor:"pointer", marginBottom:12, opacity:loading?0.7:1 }}>
          {loading?"Loading...":(isSignUp?"Create Account":"Sign In")}
        </button>
        <p style={{ textAlign:"center", fontSize:13, color:"#6b7280", margin:0 }}>
          {isSignUp?"Already have an account? ":"Don't have an account? "}
          <span onClick={()=>setIsSignUp(!isSignUp)} style={{ color:"#7c3aed", fontWeight:700, cursor:"pointer" }}>{isSignUp?"Sign In":"Sign Up"}</span>
        </p>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────
function AdminPanel({ onExit }) {
  const [section, setSection] = useState("trending");
  const [items, setItems]     = useState([]);
  const [form, setForm]       = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [imgUrl, setImgUrl]   = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg]         = useState({ text:"", ok:true });
  const fileRef = useRef();
  const sec = ADMIN_SECTIONS[section];

  const loadItems = async () => {
    setFetching(true);
    const q = sec.tabFilter ? `select=*&${sec.tabFilter}&order=created_at.desc` : "select=*&order=created_at.desc";
    const data = await sbGet(sec.table, q);
    setItems(Array.isArray(data) ? data : []);
    setFetching(false);
  };

  useEffect(() => { setForm({}); setImgFile(null); setImgPreview(""); setImgUrl(""); setMsg({text:"",ok:true}); loadItems(); }, [section]);

  const pickImg = (e) => { const f=e.target.files[0]; if(!f) return; setImgFile(f); setImgPreview(URL.createObjectURL(f)); setImgUrl(""); };

  const handleSubmit = async () => {
    if (!form.name?.trim()) { setMsg({text:"❗ Name zaroori hai!",ok:false}); return; }
    setLoading(true); setMsg({text:"",ok:true});
    let image_url = imgUrl.trim() || null;
    if (imgFile) {
      setMsg({text:"⏳ Image upload ho rahi hai...",ok:true});
      image_url = await uploadImg(imgFile);
      if (!image_url) { setMsg({text:"❌ Image upload fail. Storage bucket check karo.",ok:false}); setLoading(false); return; }
    }
    const payload = { ...sec.extra, ...form, image_url };
    ["price","rating","rank","products","best_products"].forEach(k => {
      if (payload[k]!=="" && payload[k]!==undefined) payload[k]=Number(payload[k]);
      else delete payload[k];
    });
    const result = await sbPost(sec.table, payload);
    if (result && !result.code && !result.error) {
      setMsg({text:"✅ Save ho gaya!",ok:true}); setForm({}); setImgFile(null); setImgPreview(""); setImgUrl(""); await loadItems();
    } else {
      setMsg({text:`❌ ${result?.message||result?.details||"Error aaya"}`,ok:false});
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete karna chahte ho?")) return;
    await sbDelete(sec.table, id);
    setMsg({text:"🗑 Delete ho gaya!",ok:true}); await loadItems();
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:"#f4f4f8", minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#6d28d9,#9333ea,#db2777)", padding:"16px 16px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src={LOGO_URL} alt="Supplix" style={{ height:36, width:"auto" }} />
          <div>
            <p style={{ margin:0, fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Admin Panel</p>
          </div>
        </div>
        <button onClick={onExit} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>← Site</button>
      </div>

      <div style={{ background:"#fff", display:"flex", overflowX:"auto", scrollbarWidth:"none", borderBottom:"1px solid #e5e7eb" }}>
        {Object.entries(ADMIN_SECTIONS).map(([key,s]) => (
          <button key={key} onClick={()=>setSection(key)} style={{ background:"none", border:"none", padding:"12px 16px", cursor:"pointer", fontSize:12, fontWeight:700, whiteSpace:"nowrap", color:section===key?s.color:"#9ca3af", borderBottom:`2.5px solid ${section===key?s.color:"transparent"}` }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, maxWidth:600, margin:"0 auto" }}>
        <div style={{ background:"#fff", borderRadius:18, padding:18, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:900, color:"#111" }}>➕ Naya {sec.label} Add Karo</h3>

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>📸 Image</label>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div onClick={()=>fileRef.current?.click()} style={{ width:90, height:90, border:"2px dashed #d1d5db", borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", background:"#f9fafb", overflow:"hidden", flexShrink:0 }}>
                {imgPreview||imgUrl ? <img src={imgPreview||imgUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{e.target.style.display="none"}} /> : <><span style={{ fontSize:24, marginBottom:3 }}>📷</span><span style={{ fontSize:10, color:"#9ca3af" }}>Upload</span></>}
              </div>
              <div style={{ flex:1 }}>
                <input ref={fileRef} type="file" accept="image/*" onChange={pickImg} style={{ display:"none" }} />
                <button onClick={()=>fileRef.current?.click()} style={{ width:"100%", background:sec.color, color:"#fff", border:"none", borderRadius:10, padding:"9px 0", fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:8 }}>📁 File Choose Karo</button>
                <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 5px", textAlign:"center" }}>— ya URL paste karo —</p>
                <input value={imgUrl} onChange={e=>{setImgUrl(e.target.value);setImgFile(null);setImgPreview("");}} placeholder="https://..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"8px 10px", fontSize:12, boxSizing:"border-box", outline:"none" }} />
              </div>
            </div>
          </div>

          {sec.fields.map(f => (
            <div key={f.key} style={{ marginBottom:12 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>{f.label}</label>
              {f.type==="color" ? (
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <input type="color" value={form[f.key]||"#6d28d9"} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{ width:50, height:38, border:"1.5px solid #e5e7eb", borderRadius:10, cursor:"pointer" }} />
                  <div style={{ width:38, height:38, borderRadius:10, background:form[f.key]||"#6d28d9", border:"1.5px solid #e5e7eb" }} />
                </div>
              ) : f.type==="textarea" ? (
                <textarea value={form[f.key]||""} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.label} rows={3} style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" }} />
              ) : (
                <input type={f.type} step={f.step} min={f.min} max={f.max} value={form[f.key]||""} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.label} style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
              )}
            </div>
          ))}

          {msg.text && <div style={{ background:msg.ok?"#f0fdf4":"#fef2f2", border:`1px solid ${msg.ok?"#86efac":"#fca5a5"}`, borderRadius:12, padding:"10px 14px", fontSize:13, color:msg.ok?"#15803d":"#dc2626", marginBottom:12 }}>{msg.text}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", background:loading?"#e5e7eb":`linear-gradient(135deg,${sec.color},#db2777)`, color:loading?"#9ca3af":"#fff", border:"none", borderRadius:14, padding:"14px 0", fontSize:15, fontWeight:900, cursor:loading?"not-allowed":"pointer" }}>
            {loading?"⏳ Saving...":`💾 Save ${sec.label}`}
          </button>
        </div>

        <div style={{ background:"#fff", borderRadius:18, padding:18, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h3 style={{ margin:0, fontSize:15, fontWeight:900, color:"#111" }}>📋 Saved <span style={{ background:sec.color, color:"#fff", borderRadius:20, fontSize:12, padding:"2px 10px", marginLeft:6 }}>{items.length}</span></h3>
            <button onClick={loadItems} style={{ background:"#f3f4f6", border:"none", borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>🔄</button>
          </div>
          {fetching ? <div style={{ textAlign:"center", padding:"30px 0", color:"#9ca3af" }}>⏳ Loading...</div>
          : items.length===0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#9ca3af" }}>
              <div style={{ fontSize:40, marginBottom:8 }}>📭</div>
              <p style={{ margin:0, fontSize:14, fontWeight:600 }}>Abhi koi item nahi</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {items.map(item => (
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, background:"#f9fafb", borderRadius:14, padding:"10px 12px", border:"1px solid #f0f0f0" }}>
                  <div style={{ width:50, height:50, borderRadius:10, background:"#e5e7eb", flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                    {item.image_url ? <img src={item.image_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : sec.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#111", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {item.price && <span style={{ fontSize:11, background:"#ede9fe", color:"#6d28d9", padding:"2px 7px", borderRadius:8, fontWeight:700 }}>₹{item.price}</span>}
                      {item.badge && <span style={{ fontSize:11, background:"#dcfce7", color:"#166534", padding:"2px 7px", borderRadius:8, fontWeight:700 }}>{item.badge}</span>}
                      {item.growth && <span style={{ fontSize:11, background:"#ccfbf1", color:"#134e4a", padding:"2px 7px", borderRadius:8, fontWeight:700 }}>{item.growth}</span>}
                    </div>
                  </div>
                  <button onClick={()=>handleDelete(item.id)} style={{ background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:10, padding:"7px 10px", fontSize:16, cursor:"pointer", flexShrink:0 }}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => window.location.hash === "#admin" ? "admin" : "home");
  const [activeTab, setActiveTab] = useState("trending");
  const [showCats, setShowCats]   = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [user, setUser]           = useState(null);
  const [showScrollTop, setScrollTop] = useState(false);
  const [trending,  setTrending]  = useState([]);
  const [growing,   setGrowing]   = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brands,    setBrands]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const handler = () => setPage(window.location.hash === "#admin" ? "admin" : "home");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    if (page !== "home") return;
    const load = async () => {
      setLoading(true);
      const [tr,gr,sup,br] = await Promise.all([
        sbGet("products","select=*&tab=eq.trending&order=created_at.desc"),
        sbGet("products","select=*&tab=eq.growing&order=created_at.desc"),
        sbGet("suppliers","select=*&order=created_at.desc"),
        sbGet("brands","select=*&order=created_at.desc"),
      ]);
      setTrending(Array.isArray(tr)?tr:[]);
      setGrowing(Array.isArray(gr)?gr:[]);
      setSuppliers(Array.isArray(sup)?sup:[]);
      setBrands(Array.isArray(br)?br:[]);
      setLoading(false);
    };
    load();
  }, [page]);

  useEffect(() => {
    const el = scrollRef.current; if(!el) return;
    const h = () => setScrollTop(el.scrollTop > 300);
    el.addEventListener("scroll",h); return ()=>el.removeEventListener("scroll",h);
  }, []);

  if (page === "admin") return <AdminPanel onExit={()=>{ window.location.hash=""; setPage("home"); }} />;

  const TC = { trending:"#2563eb", growing:"#0d9488", suppliers:"#7c3aed", brands:"#0d9488" };
  const tc = TC[activeTab];
  const filteredCats = CATEGORIES.filter(c=>c.name.toLowerCase().includes(catSearch.toLowerCase()));
  const growingGroups = growing.reduce((acc,p)=>{ const c=p.category||"general"; if(!acc[c])acc[c]=[]; acc[c].push(p); return acc; },{});
  const supplierGroups = suppliers.reduce((acc,s)=>{ const c=s.category||"general"; if(!acc[c])acc[c]=[]; acc[c].push(s); return acc; },{});

  const EmptyState = ({tab}) => (
    <div style={{ textAlign:"center", padding:"40px 20px", color:"#9ca3af" }}>
      <div style={{ fontSize:50, marginBottom:10 }}>📭</div>
      <p style={{ margin:"0 0 4px", fontSize:15, fontWeight:700, color:"#6b7280" }}>Koi {tab} nahi mila</p>
      <p style={{ margin:0, fontSize:13 }}>Admin Panel se add karo!</p>
    </div>
  );

  return (
    <div ref={scrollRef} style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f4f4f8", minHeight:"100vh", maxWidth:430, margin:"0 auto", overflowY:"auto", overflowX:"hidden", position:"relative" }}>

      {/* HEADER */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"#fff", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 8px rgba(0,0,0,0.07)" }}>
        <button onClick={()=>setShowDrawer(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", flexDirection:"column", gap:4 }}>
          {[0,1,2].map(i=><span key={i} style={{ display:"block", width:22, height:2.5, background:"#374151", borderRadius:2 }}/>)}
        </button>
        <img src={LOGO_URL} alt="Supplix" style={{ height:36, width:"auto", objectFit:"contain" }} />
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button style={{ background:"#f3f4f6", border:"none", borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:700, color:"#374151", cursor:"pointer" }}>⟳ BRANDS</button>
          <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, padding:2 }}>🔍</button>
          <button onClick={()=>setShowCats(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 }}>
              {[0,1,2,3].map(i=><div key={i} style={{ width:7, height:7, background:"#374151", borderRadius:2 }}/>)}
            </div>
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ margin:16, borderRadius:20, background:"linear-gradient(135deg,#6d28d9 0%,#9333ea 40%,#ec4899 80%,#f43f5e 100%)", padding:"28px 20px", color:"#fff" }}>
        <h1 style={{ fontSize:22, fontWeight:900, margin:"0 0 12px", textAlign:"center", lineHeight:1.3 }}>Find Winning Meesho Products Instantly.</h1>
        <p style={{ fontSize:14, textAlign:"center", margin:0, opacity:0.9, lineHeight:1.6 }}>See what's trending on Meesho. Discover what sells, understand why. No noise. No confusion. Just clear data on what's selling today and what to sell next.</p>
      </div>

      {/* TABS */}
      <div style={{ margin:"0 16px 16px", background:"#fff", borderRadius:16, padding:6, display:"flex", gap:4, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        {[{key:"trending",icon:"📈",label:"Trending"},{key:"growing",icon:"⚡",label:"Growing"},{key:"suppliers",icon:"👥",label:"Suppliers"},{key:"brands",icon:"🏪",label:"Brands"}].map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ flex:1, background:activeTab===tab.key?"#fff":"transparent", border:"none", borderRadius:12, padding:"8px 4px", cursor:"pointer", boxShadow:activeTab===tab.key?"0 2px 8px rgba(0,0,0,0.1)":"none" }}>
            <div style={{ fontSize:16 }}>{tab.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:activeTab===tab.key?"#111":"#9ca3af", marginTop:2 }}>{tab.label}</div>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ paddingBottom:100 }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"50px 20px", color:"#9ca3af" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>⏳</div>
            <p style={{ fontSize:15, fontWeight:600 }}>Products load ho rahe hain...</p>
          </div>
        ) : <>
          {activeTab==="trending" && (trending.length===0 ? <EmptyState tab="trending products" /> : <>
            <SectionHeader icon="⚡" title="Trending Top Products on Meesho" total={trending.length} btnLabel="View All in Top Products" btnColor={tc} />
            <div style={{ display:"flex", gap:12, overflowX:"auto", padding:"0 16px 20px", scrollbarWidth:"none" }}>
              {trending.map(p=><TrendingCard key={p.id} p={p} />)}
            </div>
          </>)}
          {activeTab==="growing" && (growing.length===0 ? <EmptyState tab="growing products" /> :
            Object.entries(growingGroups).map(([cat,prods])=>(
              <div key={cat} style={{ marginBottom:16 }}>
                <SectionHeader icon="⚡" title={`Growing ${cat==="general"?"Top Products":cat} on Meesho`} total={prods.length} btnLabel={`View All`} btnColor={tc} />
                <div style={{ display:"flex", gap:12, overflowX:"auto", padding:"0 16px 8px", scrollbarWidth:"none" }}>
                  {prods.map(p=><GrowingCard key={p.id} p={p} />)}
                </div>
              </div>
            ))
          )}
          {activeTab==="suppliers" && (suppliers.length===0 ? <EmptyState tab="suppliers" /> :
            Object.entries(supplierGroups).map(([cat,sups])=>(
              <div key={cat} style={{ marginBottom:16 }}>
                <SectionHeader icon="👥" title={`Top Suppliers on Meesho`} total={sups.length} btnLabel="View All Suppliers" btnColor={tc} />
                <div style={{ display:"flex", gap:12, overflowX:"auto", padding:"0 16px 8px", scrollbarWidth:"none" }}>
                  {sups.map(s=><SupplierCard key={s.id} s={s} />)}
                </div>
              </div>
            ))
          )}
          {activeTab==="brands" && (brands.length===0 ? <EmptyState tab="brands" /> : <>
            <SectionHeader icon="🏪" title="Top Brands on Meesho" total={brands.length} btnLabel="View All Brands" btnColor={tc} />
            <div style={{ display:"flex", gap:12, overflowX:"auto", padding:"0 16px 20px", scrollbarWidth:"none" }}>
              {brands.map(b=><BrandCard key={b.id} b={b} />)}
            </div>
          </>)}
        </>}
      </div>

      {/* CATEGORIES MODAL */}
      {showCats && (
        <div onClick={()=>setShowCats(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"flex-end" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", width:"100%", maxWidth:430, margin:"0 auto", borderRadius:"20px 20px 0 0", maxHeight:"85vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px 16px 0", flexShrink:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:800, letterSpacing:1.5, color:"#9ca3af", textTransform:"uppercase" }}>CATEGORIES</span>
                <button onClick={()=>setShowCats(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:10, width:32, height:32, cursor:"pointer", fontSize:18, fontWeight:700 }}>✕</button>
              </div>
              <div style={{ position:"relative", marginBottom:12 }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>🔍</span>
                <input value={catSearch} onChange={e=>setCatSearch(e.target.value)} placeholder="Search categories..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"10px 12px 10px 36px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
              </div>
              <button style={{ width:"100%", background:"#2563eb", color:"#fff", border:"none", borderRadius:12, padding:"12px 16px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span>All products</span>
                <span style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"2px 10px", fontSize:12 }}>380 categories</span>
              </button>
            </div>
            <div style={{ overflowY:"auto", padding:"0 16px 24px" }}>
              {filteredCats.map((cat,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:"1px solid #f3f4f6" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:"#f9fafb", border:"1px solid #f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{CAT_ICONS[i%CAT_ICONS.length]}</div>
                    <div>
                      <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111" }}>{cat.name}</p>
                      <p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{cat.slug} · {cat.sub} Sub-Categories</p>
                    </div>
                  </div>
                  <button style={{ background:"none", border:"none", color:"#9ca3af", fontSize:12, fontWeight:700, cursor:"pointer" }}>VIEW ▾</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIDE DRAWER */}
      {showDrawer && (
        <div onClick={()=>setShowDrawer(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:300, display:"flex" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", width:"75%", maxWidth:300, height:"100%", padding:"20px 0 0", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 16px 20px" }}>
              <img src={LOGO_URL} alt="Supplix" style={{ height:30, width:"auto" }} />
              <button onClick={()=>setShowDrawer(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:10, width:34, height:34, cursor:"pointer", fontSize:18, fontWeight:700 }}>✕</button>
            </div>
            <div style={{ borderTop:"1px solid #f0f0f0" }}>
              <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                <span>💰</span><span style={{ fontSize:15, fontWeight:600, color:"#374151" }}>Pricing</span>
              </div>
              <a href="#admin" style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", textDecoration:"none" }}>
                <span>⚙️</span><span style={{ fontSize:15, fontWeight:600, color:"#9ca3af" }}>Admin Panel</span>
              </a>
            </div>
            <div style={{ borderTop:"1px solid #f0f0f0", padding:"12px 16px" }}>
              {user ? (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:8, background:"#f9fafb", borderRadius:12, marginBottom:10 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#6d28d9,#db2777)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff" }}>
                      {(user.email||"U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111" }}>{user.email?.split("@")[0]}</p>
                      <p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{user.email}</p>
                    </div>
                  </div>
                  <div onClick={()=>{setUser(null);setShowDrawer(false);}} style={{ padding:"12px 4px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                    <span style={{ color:"#dc2626" }}>↪</span><span style={{ fontSize:14, fontWeight:600, color:"#dc2626" }}>Sign Out</span>
                  </div>
                </>
              ) : (
                <button onClick={()=>{setShowDrawer(false);setShowSignIn(true);}} style={{ width:"100%", background:"linear-gradient(135deg,#6d28d9,#db2777)", color:"#fff", border:"none", borderRadius:14, padding:"14px 0", fontSize:15, fontWeight:800, cursor:"pointer" }}>
                  ↪ Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showSignIn && <SignInModal onClose={()=>setShowSignIn(false)} onSignIn={(u)=>{setUser(u);setShowSignIn(false);}} />}

      <a href="https://wa.me" target="_blank" rel="noreferrer" style={{ position:"fixed", bottom:24, right:20, width:54, height:54, background:"#25d366", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(37,211,102,0.45)", textDecoration:"none", zIndex:50, fontSize:24 }}>💬</a>

      {showScrollTop && (
        <button onClick={()=>scrollRef.current?.scrollTo({top:0,behavior:"smooth"})} style={{ position:"fixed", bottom:88, right:20, width:46, height:46, background:"#374151", borderRadius:"50%", border:"none", color:"#fff", fontSize:18, cursor:"pointer", boxShadow:"0 4px 12px rgba(0,0,0,0.2)", zIndex:50 }}>↑</button>
      )}
    </div>
  );
}
