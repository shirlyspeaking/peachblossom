export default {
  fetch() {
    return new Response(
      "桃花源網站由 Cloudflare Pages 提供。這個 Worker 只讓 Git 建置有進入點。",
      {
        headers: { "content-type": "text/plain; charset=utf-8" },
      },
    )
  },
}
