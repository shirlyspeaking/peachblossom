/**
 * 桃花源首頁 — 中央 Google 登入（Auth Worker）
 * 生產環境預設：https://auth.peachspring.cc
 * 本機：同網域為 localhost 時改連 http://localhost:8787（wrangler dev）
 *
 * 可於 index.html 前覆寫：window.PEACHBLOSSOM_AUTH_BASE = 'https://你的-auth-網域';
 */
(function () {
  "use strict";

  var APP_ID = "peachspring-home";

  function getAuthBase() {
    if (typeof window.PEACHBLOSSOM_AUTH_BASE === "string" && window.PEACHBLOSSOM_AUTH_BASE.trim()) {
      return window.PEACHBLOSSOM_AUTH_BASE.replace(/\/$/, "");
    }
    var h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") {
      return "http://localhost:8787";
    }
    return "https://auth.peachspring.cc";
  }

  function el(id) {
    return document.getElementById(id);
  }

  function setBar(html) {
    var bar = el("peachblossom-auth-bar");
    if (bar) bar.innerHTML = html;
  }

  function login() {
    var base = getAuthBase();
    var returnTo = window.location.href.split("#")[0];
    window.location.href =
      base + "/auth/apps/" + APP_ID + "/login?returnTo=" + encodeURIComponent(returnTo);
  }

  function logout() {
    var base = getAuthBase();
    var returnTo = window.location.href.split("#")[0];
    window.location.href =
      base + "/auth/apps/" + APP_ID + "/logout?returnTo=" + encodeURIComponent(returnTo);
  }

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function refresh() {
    var base = getAuthBase();
    setBar('<span class="auth-status">登入狀態檢查中…</span>');

    fetch(base + "/auth/session", { credentials: "include", cache: "no-store" })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data && data.authenticated && data.user) {
          var email = data.user.email || "已登入";
          setBar(
            '<span class="auth-user" title="' +
              escapeHtml(email) +
              '">' +
              escapeHtml(email) +
              "</span>" +
              '<button type="button" class="auth-btn auth-btn-out" id="peachblossom-auth-logout">登出</button>'
          );
          var btn = el("peachblossom-auth-logout");
          if (btn) btn.addEventListener("click", logout);
        } else {
          setBar(
            '<button type="button" class="auth-btn auth-btn-in" id="peachblossom-auth-login">Google 登入桃花源</button>'
          );
          var loginBtn = el("peachblossom-auth-login");
          if (loginBtn) loginBtn.addEventListener("click", login);
        }
      })
      .catch(function () {
        setBar(
          '<span class="auth-status auth-warn">無法連線至登入服務（請確認 Auth Worker 已部署且 CORS 已設定）</span>' +
            '<button type="button" class="auth-btn auth-btn-in" id="peachblossom-auth-login-retry">重試</button>'
        );
        var retry = el("peachblossom-auth-login-retry");
        if (retry) retry.addEventListener("click", refresh);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
