const Progress = (() => {
  const KEY = "ccna-so-tay-v2";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function write(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function all() {
    const data = read();
    data.done = data.done || {};
    data.notes = data.notes || {};
    data.quiz = data.quiz || {};
    return data;
  }

  return {
    isDone(id) {
      return Boolean(all().done[id]);
    },
    setDone(id, value) {
      const data = all();
      if (value) data.done[id] = new Date().toISOString();
      else delete data.done[id];
      write(data);
    },
    note(id) {
      return all().notes[id] || "";
    },
    setNote(id, text) {
      const data = all();
      data.notes[id] = text;
      write(data);
    },
    setQuiz(id, score, total) {
      const data = all();
      data.quiz[id] = { score, total };
      write(data);
    },
    quiz(id) {
      return all().quiz[id];
    },
    countDone(ids) {
      const done = all().done;
      return ids.filter((id) => done[id]).length;
    },
    reset() {
      localStorage.removeItem(KEY);
    }
  };
})();
