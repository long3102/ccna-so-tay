function bootHome() {
  Shell.render({ active: "home" });
  const plan = document.getElementById("plan");
  plan.innerHTML = PLAN.map((item) => `<article><strong>Tuần ${item.week}</strong><p>${item.text}</p></article>`).join("");
  const search = document.getElementById("search");
  const host = document.getElementById("modules");
  const draw = () => {
    const query = search.value.trim().toLowerCase();
    host.innerHTML = MODULES.map((moduleInfo) => {
      const lessons = LESSONS.filter((lesson) => lesson.module === moduleInfo.id).filter((lesson) => {
        const haystack = `${lesson.id} ${lesson.title}`.toLowerCase();
        return haystack.includes(query);
      });
      if (!lessons.length) return "";
      const done = Progress.countDone(lessons.map((lesson) => lesson.id));
      const items = lessons.map((lesson) => {
        const on = Progress.isDone(lesson.id) ? "on" : "";
        const quiz = Progress.quiz(lesson.id);
        const quizText = quiz ? ` · quiz ${quiz.score}/${quiz.total}` : "";
        return `<li><a href="bai.html?id=${lesson.id}"><i class="done-dot ${on}"></i><span><b>${lesson.id}</b> ${Format.esc(lesson.title)}</span><span class="mins">${lesson.minutes} phút${quizText}</span></a></li>`;
      }).join("");
      return `<section class="module"><header><div><p class="kicker">${moduleInfo.weeks}</p><h3>${Format.esc(moduleInfo.title)}</h3></div><span class="weight">${moduleInfo.weight} · ${done}/${lessons.length}</span></header><p>${moduleInfo.blurb}</p><div class="bar" aria-hidden="true"><span style="width:${Math.round((done / lessons.length) * 100)}%"></span></div><ol class="lesson-list">${items}</ol></section>`;
    }).join("");
  };
  search.addEventListener("input", draw);
  document.getElementById("reset").addEventListener("click", () => {
    if (confirm("Xóa toàn bộ buổi đã học, ghi chú và điểm quiz trên máy này?")) {
      Progress.reset();
      draw();
      location.reload();
    }
  });
  draw();
}

bootHome();
