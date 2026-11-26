const Shell = (() => {
  const LINKS = [
    { id: "home", href: "index.html", label: "Lộ trình" },
    { id: "review", href: "ontap.html", label: "Ôn tập" },
    { id: "subnet", href: "cong-cu/subnet.html", label: "Subnet" },
    { id: "reflex", href: "phan-xa.html", label: "Phản xạ" },
    { id: "lab", href: "huong-dan.html", label: "Cách lab" }
  ];

  function render(options) {
    const active = options.active;
    const root = options.root || "";
    const total = typeof LESSONS === "undefined" ? 0 : LESSONS.length;
    const done = total ? Progress.countDone(LESSONS.map((lesson) => lesson.id)) : 0;
    const links = LINKS.map((link) => {
      const current = link.id === active ? ' aria-current="page"' : "";
      return `<a href="${root}${link.href}"${current}>${link.label}</a>`;
    }).join("");
    document.body.insertAdjacentHTML("afterbegin", `
      <a class="skip" href="#content">Tới nội dung</a>
      <header class="topbar">
        <a class="brand" href="${root}index.html"><span class="mark">L0</span> CCNA Sổ tay</a>
        <nav class="nav">${links}<span class="progress-chip">${done}/${total} buổi</span></nav>
      </header>
    `);
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="site-footer">Giáo án tự học bám đề cương CCNA 200-301 v2.0. Đây không phải tài liệu chính thức của Cisco. Lệnh trong bài dùng cho lab, hãy đổi mật khẩu trước khi đưa lên thiết bị thật.</footer>
    `);
  }

  return { render };
})();
