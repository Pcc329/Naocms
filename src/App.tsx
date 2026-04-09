import React, { useState, useMemo } from "react";
// 確保 lucide-react 已安裝，否則會白畫面
import {
  Bot,
  ListTodo,
  Send,
  Sparkles,
  MapPin,
  TrendingUp,
  Users,
  Search,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  UploadCloud,
  Globe,
  Clock,
  Database,
  FileText,
  RefreshCcw,
} from "lucide-react";

// --- 1. 確保所有資料庫在組件外部完整定義 ---

const KPI_DATA = [
  {
    label: "申請企業",
    value: "3,847",
    trend: "▲ 12.4%",
    color: "bg-[#1D9E75]",
    unit: "家次",
  },
  {
    label: "申請件數",
    value: "5,291",
    trend: "▲ 8.7%",
    color: "bg-[#0d7a62]",
    unit: "件",
  },
  {
    label: "通過件數",
    value: "3,108",
    trend: "通過率 58.7%",
    color: "bg-[#1a6fab]",
    unit: "件",
  },
  {
    label: "結案件數",
    value: "1,890",
    trend: "▲ 5.3%",
    color: "bg-[#c97d10]",
    unit: "件",
  },
  {
    label: "核定補助",
    value: "42.6",
    trend: "執行率 67.3%",
    color: "bg-[#2e5a6e]",
    unit: "億",
  },
];

const AGENCIES_DATA = [
  { name: "經濟部", total: 8, budget: "14.2億", achieve: 82, status: "正常" },
  { name: "科技部", total: 5, budget: "9.8億", achieve: 74, status: "正常" },
  { name: "農業部", total: 4, budget: "4.1億", achieve: 48, status: "落後" },
  { name: "衛福部", total: 3, budget: "6.3億", achieve: 55, status: "落後" },
];

const ENTERPRISES_LIST = [
  {
    id: "ent-1",
    name: "台北數位創新股份有限公司",
    taxId: "12345678",
    area: "台北市",
    amount: "6.8M",
    initials: "北創",
    history: [
      {
        planName: "服務業創新研發計畫 (SIIR)",
        status: "結案",
        desc: "AI 客服模組研發",
      },
      { planName: "數位服務補助計畫", status: "執行中", desc: "SaaS 雲端化" },
    ],
  },
  {
    id: "ent-2",
    name: "台中精機科技有限公司",
    taxId: "87654321",
    area: "台中市",
    amount: "12.5M",
    initials: "中精",
    history: [
      { planName: "智慧製造升級計畫", status: "結案", desc: "自動化產線建置" },
    ],
  },
];

// --- 2. 主要組件 ---

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "ai" | "overview" | "enterprise" | "data"
  >("ai");
  const [expandedEntId, setExpandedEntId] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content:
        "您好，我是戰情助理。目前 114 年度已分析 42 項計畫。發現「生技醫療研發補助方案」退件率達 42%，遠高於平均值。",
    },
  ]);
  const [input, setInput] = useState("");

  // 渲染邏輯
  return (
    <div className="h-screen w-full bg-[#eef6f1] text-[#1a1a18] font-sans flex flex-col overflow-hidden">
      {/* 導覽列 */}
      <nav className="bg-white border-t-[3px] border-[#0d6e52] border-b border-black/5 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0d6e52] flex items-center justify-center text-white shadow-md">
              <TrendingUp size={18} />
            </div>
            <h1 className="text-[14px] font-bold text-[#0d6e52]">
              補助資源效益戰情室{" "}
              <span className="text-slate-400 font-normal ml-2">V15.3 Fix</span>
            </h1>
          </div>
          <div className="flex gap-1 ml-4 bg-slate-100 p-1 rounded-xl">
            {["ai", "overview", "enterprise", "data"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#0d6e52] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "ai"
                  ? "Agent 運作"
                  : tab === "overview"
                  ? "計畫總覽"
                  : tab === "enterprise"
                  ? "申請企業"
                  : "資料管理"}
              </button>
            ))}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
          管
        </div>
      </nav>

      {/* 內容區塊 */}
      <main className="flex-1 overflow-hidden">
        {/* 分頁：AI 助理 */}
        {activeTab === "ai" && (
          <div className="h-full flex animate-in">
            <div className="w-[380px] bg-white border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 font-bold text-[#0d6e52] text-sm">
                  <Bot size={18} /> 戰情 AI 助理
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] p-3 rounded-2xl text-[12px] ${
                        m.role === "user"
                          ? "bg-green-50 border border-green-200"
                          : "bg-[#e6f5ef] border border-[#9fe1cb] text-[#0d3d2a]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border rounded-xl px-3 py-2 text-xs"
                  placeholder="輸入問題..."
                />
                <button className="bg-[#0d6e52] text-white p-2 rounded-xl">
                  <Send size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#f0f4f0] p-6 overflow-y-auto space-y-6">
              <div className="bg-[#e6f5ef] border border-[#9fe1cb] p-4 rounded-xl">
                <h4 className="text-[11px] font-bold text-[#0d6e52] flex items-center gap-2 mb-2">
                  <Sparkles size={14} /> Agent 分析洞察
                </h4>
                <p className="text-[12px] text-[#0d3d2a]">
                  目前「生技計畫」退件率顯著偏高，主因為財務報表格式不符。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 分頁：計畫總覽 */}
        {activeTab === "overview" && (
          <div className="p-8 h-full overflow-y-auto bg-[#f0f4f0] space-y-8 animate-in">
            <div className="grid grid-cols-5 gap-4">
              {KPI_DATA.map((k) => (
                <div
                  key={k.label}
                  className={`${k.color} p-5 rounded-2xl text-white shadow-md`}
                >
                  <p className="text-[10px] opacity-70 font-bold mb-1">
                    {k.label}
                  </p>
                  <p className="text-3xl font-black">
                    {k.value}
                    <span className="text-xs ml-1 font-normal opacity-50">
                      {k.unit}
                    </span>
                  </p>
                  <p className="text-[10px] mt-2">{k.trend}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl border shadow-sm p-6">
              <h3 className="text-sm font-bold mb-4">機關執行進度排名</h3>
              <div className="space-y-4">
                {AGENCIES_DATA.map((a) => (
                  <div key={a.name} className="flex items-center gap-4">
                    <span className="w-20 text-xs font-bold text-slate-600">
                      {a.name}
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1D9E75] h-full"
                        style={{ width: `${a.achieve}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#0d6e52]">
                      {a.achieve}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 分頁：申請企業 (修正點) */}
        {activeTab === "enterprise" && (
          <div className="p-8 h-full overflow-y-auto bg-[#f0f4f0] space-y-4 animate-in">
            <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-3 sticky top-0 z-10">
              <Search size={16} className="text-slate-400" />
              <input
                className="text-sm outline-none flex-1"
                placeholder="搜尋企業名稱或統編..."
              />
              <button className="bg-[#0d6e52] text-white px-6 py-2 rounded-lg text-xs font-bold">
                搜尋企業
              </button>
            </div>

            {ENTERPRISES_LIST.map((ent) => (
              <div
                key={ent.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden group"
              >
                <div
                  className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${
                    expandedEntId === ent.id
                      ? "bg-[#f8fdf9]"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() =>
                    setExpandedEntId(expandedEntId === ent.id ? null : ent.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#e6f5ef] rounded-lg flex items-center justify-center text-[#0d6e52] font-black text-sm">
                      {ent.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">
                        {ent.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {ent.taxId} ・ {ent.area}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        核定總額
                      </p>
                      <p className="text-sm font-bold text-[#0d6e52]">
                        NT$ {ent.amount}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`text-slate-300 transition-transform ${
                        expandedEntId === ent.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedEntId === ent.id && (
                  <div className="p-5 bg-[#f8fdf9] border-t border-slate-100 space-y-4">
                    <p className="text-[11px] font-bold text-[#0d6e52] flex items-center gap-2">
                      <Database size={14} /> 歷史申請紀錄
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {ent.history?.map((h, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-xl border border-black/5 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-xs text-slate-700">
                              {h.planName}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-bold">
                              {h.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 italic">
                            「{h.desc}」
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 分頁：資料管理 */}
        {activeTab === "data" && (
          <div className="h-full flex items-center justify-center bg-[#f0f4f0] animate-in">
            <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-[#9fe1cb] text-center space-y-6 max-w-lg shadow-xl">
              <div className="w-16 h-16 bg-[#e6f5ef] rounded-2xl flex items-center justify-center mx-auto text-[#0d6e52]">
                <UploadCloud size={32} />
              </div>
              <h3 className="font-bold text-xl">資料同步中心</h3>
              <p className="text-sm text-slate-400">
                請上傳包含計畫編號、統編、核定金額之 Excel 檔案。
              </p>
              <button className="bg-[#0d6e52] text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-green-100">
                選擇上傳檔案
              </button>
            </div>
          </div>
        )}
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(13, 110, 82, 0.2); border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
