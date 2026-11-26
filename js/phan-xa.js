function shuffleReflex(list) {
  const copy = list.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const hold = copy[index];
    copy[index] = copy[swap];
    copy[swap] = hold;
  }
  return copy;
}

function drawFive(bank) {
  const groups = new Map();
  bank.forEach((item) => {
    if (!groups.has(item.type)) groups.set(item.type, []);
    groups.get(item.type).push(item);
  });
  const picked = [];
  const used = new Set();
  shuffleReflex([...groups.keys()]).forEach((type) => {
    if (picked.length >= 5) return;
    const list = groups.get(type);
    const choice = list[Math.floor(Math.random() * list.length)];
    picked.push(choice);
    used.add(choice);
  });
  if (picked.length < 5) {
    shuffleReflex(bank.filter((item) => !used.has(item))).slice(0, 5 - picked.length).forEach((item) => {
      picked.push(item);
    });
  }
  return picked;
}

function showReflex() {
  document.getElementById("practice-meta").textContent = `Ngân hàng ${SUBNET_BANK.length} câu, mỗi câu có lời giải. Lượt này hỏi 5 câu.`;
  Quiz.mount(document.getElementById("quiz"), drawFive(SUBNET_BANK));
}

Shell.render({ active: "reflex" });
document.getElementById("new-set").addEventListener("click", showReflex);
showReflex();
