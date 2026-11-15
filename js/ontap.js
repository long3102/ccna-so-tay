function sample(list, count) {
  const copy = list.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const hold = copy[index];
    copy[index] = copy[swap];
    copy[swap] = hold;
  }
  return copy.slice(0, count);
}

function drawQuiz() {
  const moduleId = document.getElementById("module").value;
  const pool = moduleId === "all" ? BANK : BANK.filter((item) => item.module === moduleId);
  Quiz.mount(document.getElementById("quiz"), sample(pool, Math.min(20, pool.length)));
}

Shell.render({ active: "review" });
const select = document.getElementById("module");
select.innerHTML = `<option value="all">Cả năm miền và phần nền</option>` + MODULES.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
select.addEventListener("change", drawQuiz);
document.getElementById("again").addEventListener("click", drawQuiz);
drawQuiz();
