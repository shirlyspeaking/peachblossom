"use client";

import { useEffect, useState } from "react";

type HealthRow = {
  id: string;
  displayName: string;
  fileName: string;
  licenseTag: string;
  licenseNote?: string;
  source?: string;
  reviewDate?: string;
  licenseReviewStatus?: "unknown" | "ok" | "due_soon" | "expired";
  exists: boolean;
  lastUpdated: string | null;
};

type HealthResponse = {
  ok: boolean;
  message?: string;
  targetDir?: string;
  total?: number;
  missing?: number;
  reviewExpired?: number;
  reviewDueSoon?: number;
  rows?: HealthRow[];
};

export default function Page() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");
  const [authorized, setAuthorized] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/fonts-health", {
        cache: "no-store",
        headers: adminKey ? { "x-font-admin-key": adminKey } : undefined,
      });
      const json = (await res.json()) as HealthResponse;
      setData(json);
      if (res.ok && json.ok) setAuthorized(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("font-admin-key");
    if (saved) {
      setAdminKey(saved);
    }
    setLoading(false);
  }, []);

  async function saveKeyAndLoad() {
    if (!adminKey.trim()) return;
    window.localStorage.setItem("font-admin-key", adminKey.trim());
    await load();
  }

  async function exportReport(format: "json" | "csv") {
    const url = `/api/fonts-health${format === "csv" ? "?format=csv" : ""}`;
    const res = await fetch(url, {
      headers: adminKey ? { "x-font-admin-key": adminKey } : undefined,
    });
    if (!res.ok) {
      setData((await res.json()) as HealthResponse);
      return;
    }

    if (format === "json") {
      const json = (await res.json()) as HealthResponse;
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "font-health-report.json";
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "font-health-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <main className="container">
      <h1>管理員字型健康檢查</h1>
      <p>檢查來源：`lovereading/public/fonts`（跨 app 檢查）</p>
      <p>
        <a href="../index.html">返回桃花源首頁</a>
      </p>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="password"
            placeholder="管理金鑰（FONT_ADMIN_KEY）"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={{ minWidth: 280, padding: 8 }}
          />
          <button onClick={() => void saveKeyAndLoad()} disabled={loading || !adminKey.trim()}>
            驗證登入
          </button>
          <button onClick={() => void load()} disabled={loading || !authorized}>
            {loading ? "檢查中..." : "重新檢查"}
          </button>
          <button onClick={() => void exportReport("json")} disabled={!authorized}>
            匯出 JSON
          </button>
          <button onClick={() => void exportReport("csv")} disabled={!authorized}>
            匯出 CSV
          </button>
        </div>
        {data?.ok ? (
          <p>
            共 {data.total} 項，缺失 {data.missing} 項，授權到期 {data.reviewExpired} 項，30 天內到期{" "}
            {data.reviewDueSoon} 項
          </p>
        ) : (
          <p className="warn">{data?.message || "請先輸入管理金鑰"}</p>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>字型</th>
              <th>檔名</th>
              <th>狀態</th>
              <th>授權標記</th>
              <th>授權檢視日</th>
              <th>授權狀態</th>
              <th>來源</th>
              <th>最後更新</th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows || []).map((row) => (
              <tr key={row.id}>
                <td>{row.displayName}</td>
                <td>{row.fileName}</td>
                <td className={row.exists ? "ok" : "warn"}>{row.exists ? "可用" : "缺失"}</td>
                <td>{row.licenseTag}</td>
                <td>{row.reviewDate || "-"}</td>
                <td
                  className={
                    row.licenseReviewStatus === "expired" || row.licenseReviewStatus === "due_soon"
                      ? "warn"
                      : "ok"
                  }
                >
                  {row.licenseReviewStatus === "expired"
                    ? "已到期"
                    : row.licenseReviewStatus === "due_soon"
                      ? "即將到期"
                      : row.licenseReviewStatus === "ok"
                        ? "正常"
                        : "未設定"}
                </td>
                <td>{row.source || "-"}</td>
                <td>{row.lastUpdated ? new Date(row.lastUpdated).toLocaleString("zh-TW") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
