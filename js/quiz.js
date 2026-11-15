const Quiz = (() => {
  function mount(host, questions, options) {
    const opts = options || {};
    host.innerHTML = questions.map((question, index) => {
      const choices = question.choices.map((choice, choiceIndex) => `
        <label class="choice">
          <input type="radio" name="q${index}" value="${choiceIndex}">
          <span>${Format.inline(choice)}</span>
        </label>
      `).join("");
      return `
        <fieldset data-q="${index}">
          <legend>Câu ${index + 1}. ${Format.inline(question.q)}</legend>
          ${choices}
          <p class="why" hidden></p>
        </fieldset>
      `;
    }).join("") + `<p class="score" hidden></p><button class="btn" type="button">Chấm bài</button>`;

    const button = host.querySelector("button");
    button.addEventListener("click", () => grade(host, questions, opts, button));
  }

  function grade(host, questions, opts, button) {
    if (button.dataset.state === "reset") {
      mount(host, questions, opts);
      return;
    }
    let score = 0;
    questions.forEach((question, index) => {
      const field = host.querySelector(`[data-q="${index}"]`);
      const chosen = field.querySelector("input:checked");
      const picked = chosen ? Number(chosen.value) : -1;
      if (picked === question.answer) score += 1;
      field.querySelectorAll(".choice").forEach((label, choiceIndex) => {
        label.classList.remove("good", "bad");
        if (choiceIndex === question.answer) label.classList.add("good");
        else if (choiceIndex === picked) label.classList.add("bad");
      });
      const why = field.querySelector(".why");
      why.hidden = false;
      const verdict = picked === question.answer ? "Đúng." : "Chưa đúng.";
      why.innerHTML = `<strong>${verdict}</strong> ${Format.inline(question.why)}`;
    });
    const scoreEl = host.querySelector(".score");
    scoreEl.hidden = false;
    scoreEl.textContent = `Bạn đúng ${score}/${questions.length}. Đọc phần giải thích dưới mỗi câu, rồi làm lại nếu muốn.`;
    button.textContent = "Làm lại";
    button.dataset.state = "reset";
    if (opts.onGrade) opts.onGrade(score, questions.length);
  }

  return { mount };
})();
