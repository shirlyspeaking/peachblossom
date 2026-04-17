"use client";

import { useCallback, useEffect, useState } from "react";

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

type SessionPayload = {
  authenticated: boolean;
  user?: { id: string; email: string; name: string | null; picture: string | null };
  appAccess?: { "font-admin"?: boolean };
};

function authBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_PEACHBLOSSOM_AUTH_URL || "").replace(/\/$/, "");
}

export default function Page() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const base = authBaseUrl();

  const refreshSession = useCallback(async () => {
    if (!base) {
      setSession({ authenticated: false });
      setSessionLoading(false);
      return;
    }
    setSessionLoading(true);
    try {
      const res = await fetch(`${base}/auth/session`, { credentials: "include", cache: "no-store" });
      const json = (await res.json()) as SessionPayload;
      setSession(json);
    } catch {
      setSession({ authenticated: false });
    } finally {
      setSessionLoading(false);
    }
  }, [base]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const saved = window.localStorage.getItem("font-admin-key");
    if (saved) {
      setAdminKey(saved);
    }
    setLoading(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fonts-health", {
        cache: "no-store",
        headers: adminKey ? { "x-font-admin-key": adminKey } : undefined,
      });
      const json = (await res.json()) as HealthResponse;
      setData(json);
      if (res.ok && json.ok) setAuthorized(true);
      else setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const googleOk = Boolean(session?.authenticated && session.appAccess?.["font-admin"]);

  useEffect(() => {
    if (sessionLoading || !googleOk) return;
    void load();
  }, [sessionLoading, googleOk, load]);

  async function saveKeyAndLoad() {
    if (!adminKey.trim()) return;
    window.localStorage.setItem("font-admin-key", adminKey.trim());
    await load();
  }

  function startGoogleLogin() {
    if (!base) return;
    const returnTo = window.location.href;
    window.location.href = `${base}/auth/apps/font-admin/login?returnTo=${encodeURIComponent(returnTo)}`;
  }

  function logout() {
    if (!base) return;
    const returnTo = window.location.href;
    window.location.href = `${base}/auth/apps/font-admin/logout?returnTo=${encodeURIComponent(returnTo)}`;
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
      link.download = "copybook-platform-report.json";
      link.click();
      URL.revokeObjectURL(link.href);
      return;
    }

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "copybook-platform-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const canUseApi = authorized;

  return (
    <main className="container">
      <h1>書法字帖平台維運後台</h1>
      <p>資產來源：`calligraphy-studio/public/fonts`（跨 app 檢查）</p>
      <p>
        <a href="../index.html">返回桃花源首頁</a>
      </p>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 8 }}>登入</h2>
        {base ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {sessionLoading ? (
              <span>登入狀態檢查中…</span>
            ) : session?.authenticated ? (
              <>
                <span>
                  已登入：{session.user?.email ?? "（無信箱）"}
                  {session.appAccess?.["font-admin"] ? "" : "（此帳號尚無 font-admin 權限，請於 Auth Worker 設定 AUTH_ADMIN_EMAILS 或寫入 user_roles）"}
                </span>
                <button type="button" onClick={() => logout()}>
                  Google 登出（全站）
                </button>
              </>
            ) : (
              <button type="button" onClick={() => startGoogleLogin()}>
                以 Google 登入桃花源
              </button>
            )}
          </div>
        ) : (
          <p className="warn">
            未設定 NEXT_PUBLIC_PEACHBLOSSOM_AUTH_URL。請設定中央 Auth Worker 網址，或暫用下方管理金鑰。
          </p>
        )}

        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="password"
            placeholder="管理金鑰（FONT_ADMIN_KEY，可選）"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={{ minWidth: 280, padding: 8 }}
          />
          <button onClick={() => void saveKeyAndLoad()} disabled={loading || !adminKey.trim()}>
            以金鑰驗證
          </button>
          <button onClick={() => void load()} disabled={loading}>
            {loading ? "檢查中..." : "重新檢查"}
          </button>
          <button onClick={() => void exportReport("json")} disabled={!canUseApi}>
            匯出 JSON
          </button>
          <button onClick={() => void exportReport("csv")} disabled={!canUseApi}>
            匯出 CSV
          </button>
        </div>
        {data?.ok ? (
          <p>
            共 {data.total} 項，缺失 {data.missing} 項，授權到期 {data.reviewExpired} 項，30 天內到期{" "}
            {data.reviewDueSoon} 項
          </p>
        ) : (
          <p className="warn">{data?.message || "請先以 Google 登入（具 font-admin 權限）或輸入管理金鑰"}</p>
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
