const LessonApp = (() => {
  function start() {
    Shell.render({ active: "lesson" });
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const meta = lessonById(id);
    const app = document.getElementById("app");
    if (!meta) {
      app.innerHTML = `<div class="lesson"><h1>Không thấy buổi học</h1><p>Mã này không có trong lộ trình. Về <a href="index.html">trang lộ trình</a> để chọn buổi.</p></div>`;
      return;
    }
    const script = document.createElement("script");
    script.src = meta.file;
    script.onload = () => render(meta);
    script.onerror = () => {
      app.innerHTML = `<div class="lesson"><h1>Chưa tải được bài</h1><p>Thiếu file <code>${Format.esc(meta.file)}</code>. Nếu bạn đang mở bằng file:// và trình duyệt chặn script, hãy xem trang Cách lab để chạy máy chủ tĩnh.</p></div>`;
    };
    document.body.appendChild(script);
  }

  function render(meta) {
    const lesson = window.LESSON;
    const index = lessonIndex(meta.id);
    const moduleInfo = moduleById(meta.module);
    document.title = `${lesson.title} · CCNA Sổ tay`;
    const app = document.getElementById("app");
    app.innerHTML = `${sidebar(meta.id)}<article class="lesson" id="content">${body(lesson, meta, index, moduleInfo)}</article>`;
    document.getElementById("open-menu").addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("open");
    });
    bindCopies(app);
    bindLab(app);
    bindNotes(meta.id);
    bindDone(meta.id);
    Quiz.mount(document.getElementById("quiz"), lesson.quiz, {
      onGrade(score, total) {
        Progress.setQuiz(meta.id, score, total);
      }
    });
  }

  function sidebar(activeId) {
    const groups = MODULES.map((moduleInfo) => {
      const items = LESSONS.filter((lesson) => lesson.module === moduleInfo.id).map((lesson) => {
        const tick = Progress.isDone(lesson.id) ? `<span class="tick">✓</span>` : "";
        const active = lesson.id === activeId ? "active" : "";
        return `<li><a class="${active}" href="bai.html?id=${lesson.id}">${tick}${lesson.id} ${Format.esc(lesson.title)}</a></li>`;
      }).join("");
      return `<div class="side-module"><p>${Format.esc(moduleInfo.title)}</p><ol>${items}</ol></div>`;
    }).join("");
    return `<aside class="sidebar">${groups}</aside>`;
  }

  function body(lesson, meta, index, moduleInfo) {
    const keywords = (lesson.keywords || []).map((word) => `<span>${Format.esc(word)}</span>`).join("");
    const goals = Format.list("ul", lesson.objectives);
    const blocks = lesson.blocks.map(renderBlock).join("");
    const terms = (lesson.terms || []).map((term) => `<div><strong>${Format.inline(term.t)}</strong> — ${Format.inline(term.d)}</div>`).join("");
    const prev = LESSONS[index - 1];
    const next = LESSONS[index + 1];
    const done = Progress.isDone(meta.id);
    return `
      <button class="btn ghost menu-btn" id="open-menu" type="button">Mục lục</button>
      <p class="kicker">Buổi ${String(index + 1).padStart(2, "0")} · ${Format.esc(moduleInfo.title)} · ${meta.minutes} phút</p>
      <h1>${Format.esc(lesson.title)}</h1>
      <p>Mã đề: <strong>${Format.esc(lesson.exam)}</strong></p>
      <div class="keywords">${keywords}</div>
      <section class="objectives"><h2>Sau buổi này bạn làm được</h2>${goals}</section>
      <p class="opener">${Format.inline(lesson.opener)}</p>
      ${blocks}
      <h2>Từ cần nhớ</h2>
      <div class="terms">${terms}</div>
      <section class="notes noprint"><h2>Ghi chú của bạn</h2><p>Ghi chú nằm trên máy này, không gửi đi đâu.</p><textarea id="note">${Format.esc(Progress.note(meta.id))}</textarea></section>
      <h2>Tự kiểm</h2>
      <form class="quiz" id="quiz"></form>
      <div class="pager noprint">
        ${prev ? `<a class="btn ghost" href="bai.html?id=${prev.id}">← ${prev.id}</a>` : "<span></span>"}
        <button class="btn copper" id="done" type="button">${done ? "Bỏ đánh dấu đã học" : "Tôi đã học xong buổi này"}</button>
        ${next ? `<a class="btn" href="bai.html?id=${next.id}">${next.id} →</a>` : `<a class="btn" href="ontap.html">Ôn tập →</a>`}
      </div>
    `;
  }

  function renderBlock(block) {
    if (block.type === "h2") return `<h2>${Format.inline(block.text)}</h2>`;
    if (block.type === "h3") return `<h3>${Format.inline(block.text)}</h3>`;
    if (block.type === "p") return `<p>${Format.inline(block.text)}</p>`;
    if (block.type === "ul") return Format.list("ul", block.items);
    if (block.type === "ol") return Format.list("ol", block.items);
    if (block.type === "callout") {
      return `<aside class="callout ${block.tone}"><h2>${Format.inline(block.title)}</h2><p>${Format.inline(block.text)}</p></aside>`;
    }
    if (block.type === "table") {
      const head = block.headers.map((cell) => `<th>${Format.inline(cell)}</th>`).join("");
      const rows = block.rows.map((row) => `<tr>${row.map((cell) => `<td>${Format.inline(cell)}</td>`).join("")}</tr>`).join("");
      return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    if (block.type === "cli" || block.type === "topo") {
      const className = block.type === "cli" ? "cli" : "topo";
      const button = block.type === "cli" ? `<button class="copy" type="button">Chép</button>` : "";
      return `<figure class="${className}"><header><span>${Format.esc(block.title)}</span>${button}</header><pre>${Format.esc(block.code)}</pre></figure>`;
    }
    if (block.type === "flow") {
      const nodes = block.items.map((item) => `<div class="flow-node">${Format.inline(item.label)}<small>${Format.esc(item.note || "")}</small></div>`).join(`<span>→</span>`);
      return `<div class="flow">${nodes}</div>`;
    }
    if (block.type === "stack") {
      const rows = block.rows.map((row) => `<li><strong>${Format.inline(row.name)}</strong><span>${Format.inline(row.note)}</span></li>`).join("");
      return `<ol class="stack">${rows}</ol>`;
    }
    if (block.type === "compare") {
      return `<div class="compare"><div><h3>${Format.inline(block.left.title)}</h3>${Format.list("ul", block.left.items)}</div><div><h3>${Format.inline(block.right.title)}</h3>${Format.list("ul", block.right.items)}</div></div>`;
    }
    if (block.type === "steps") {
      return `<section class="steps"><header><strong>${Format.inline(block.title)}</strong></header>${Format.list("ol", block.items)}</section>`;
    }
    if (block.type === "lab") {
      return `<section class="lab"><header><strong>${Format.inline(block.title)}</strong></header><p>${Format.inline(block.goal)}</p>${Format.list("ol", block.tasks)}<details><summary>Gợi ý</summary><p>${Format.inline(block.hint)}</p></details><details class="solution"><summary>Đáp án lab</summary><pre>${Format.esc(block.solution)}</pre></details></section>`;
    }
    if (block.type === "link") {
      return `<p><a class="btn secondary" href="${Format.esc(block.href)}">${Format.esc(block.label)}</a></p>`;
    }
    return "";
  }

  function bindCopies(app) {
    app.querySelectorAll(".copy").forEach((button) => {
      button.addEventListener("click", async () => {
        const text = button.parentElement.nextElementSibling.textContent;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Đã chép";
        } catch (error) {
          button.textContent = "Hãy tự bôi đen";
        }
      });
    });
  }

  function bindLab() {}

  function bindNotes(id) {
    const box = document.getElementById("note");
    box.addEventListener("input", () => Progress.setNote(id, box.value));
  }

  function bindDone(id) {
    const button = document.getElementById("done");
    button.addEventListener("click", () => {
      const next = !Progress.isDone(id);
      Progress.setDone(id, next);
      button.textContent = next ? "Bỏ đánh dấu đã học" : "Tôi đã học xong buổi này";
      document.querySelector(".sidebar").outerHTML = sidebar(id);
    });
  }

  return { start };
})();

LessonApp.start();
