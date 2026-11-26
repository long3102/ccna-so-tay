const SUBNET_BANK = (() => {
  function mulberry32(seed) {
    let state = seed;
    return function next() {
      state |= 0;
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(20261125);
  const seen = new Set();
  const bank = [];
  const octetNames = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư"];

  function code(value) {
    return "`" + value + "`";
  }

  function makeQuestion(type, text, correct, distractors, why) {
    const expect = String(correct);
    const pool = [expect];
    const used = new Set([expect]);
    distractors.forEach((item) => {
      if (typeof item === "number" && !(item > 0)) return;
      const value = String(item);
      if (!value || used.has(value)) return;
      used.add(value);
      pool.push(value);
    });
    if (pool.length < 4 || seen.has(text)) return;
    const picked = pool.slice(0, 4);
    for (let i = picked.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      const swap = picked[i];
      picked[i] = picked[j];
      picked[j] = swap;
    }
    seen.add(text);
    bank.push({
      type,
      q: text,
      choices: picked.map(code),
      answer: picked.indexOf(expect),
      why,
      expect
    });
  }

  function sizeOf(prefix) {
    return 2 ** (32 - prefix);
  }

  function lanHosts(prefix) {
    if (prefix >= 32) return 1;
    if (prefix === 31) return 2;
    return sizeOf(prefix) - 2;
  }

  function shift(info, delta) {
    const value = (Subnet.ipToInt(info.network) + delta) >>> 0;
    return Subnet.intToIp(value);
  }

  function inRange(info, delta) {
    const base = Subnet.ipToInt(info.network);
    const next = base + delta;
    if (next < 0 || next > 0xffffffff) return "";
    return Subnet.intToIp(next >>> 0);
  }

  function outside(info) {
    const size = sizeOf(info.prefix);
    const net = Subnet.ipToInt(info.network);
    const raw = [];
    if (net >= size) raw.push(net - 1);
    if (net + size <= 0xffffffff) raw.push(net + size);
    if (net + size + 1 <= 0xffffffff) raw.push(net + size + 1);
    raw.push((net ^ 0x80000000) >>> 0);
    const found = [];
    const used = new Set();
    raw.forEach((value) => {
      const ip = Subnet.intToIp(value >>> 0);
      if (used.has(ip)) return;
      const other = Subnet.analyze(ip, info.prefix);
      if (!other || other.network === info.network) return;
      used.add(ip);
      found.push(ip);
    });
    return found;
  }

  function addSample(ipText, prefix) {
    const info = Subnet.analyze(ipText, prefix);
    if (!info) return;
    const label = info.ip + "/" + info.prefix;
    const size = sizeOf(prefix);
    const near = [
      inRange(info, size),
      inRange(info, -size),
      info.ip,
      info.broadcast,
      info.first,
      info.last,
      inRange(info, -1),
      inRange(info, 1)
    ];

    makeQuestion(
      "network",
      "Địa chỉ mạng của " + code(label) + " là gì?",
      info.network,
      near,
      label + " có mask " + info.mask + ". Địa chỉ mạng = IP AND mask = " + info.network + ". Broadcast của mạng đó là " + info.broadcast + "."
    );

    makeQuestion(
      "broadcast",
      "Broadcast của " + code(label) + " là gì?",
      info.broadcast,
      [info.network, info.last, info.first, inRange(info, size), shift(info, size - 1)].concat(near),
      "Broadcast = mạng OR wildcard " + info.wildcard + " = " + info.broadcast + ". Host cuối gán được là " + info.last + "."
    );

    const firstWhy = prefix >= 31
      ? "Prefix /" + prefix + " không trừ hai địa chỉ theo kiểu LAN. Địa chỉ đầu trong khối là " + info.first + "."
      : "Host đầu gán được là địa chỉ mạng cộng 1: " + info.first + ". " + info.network + " là địa chỉ mạng, không gán cho máy.";
    makeQuestion(
      "first",
      "Host gán được đầu tiên của " + code(label) + " là gì?",
      info.first,
      [info.network, info.broadcast, info.last, inRange(info, 2), inRange(info, size)],
      firstWhy
    );

    const lastWhy = prefix >= 31
      ? "Prefix /" + prefix + " dùng các địa chỉ trong khối. Địa chỉ cuối là " + info.last + "."
      : "Host cuối gán được là broadcast trừ 1: " + info.last + ". " + info.broadcast + " là broadcast.";
    makeQuestion(
      "last",
      "Host gán được cuối cùng của " + code(label) + " là gì?",
      info.last,
      [info.broadcast, info.first, info.network, inRange(info, size - 3), inRange(info, -1)],
      lastWhy
    );

    const hostWhy = prefix >= 31
      ? "/" + prefix + " có " + info.hosts + " địa chỉ dùng được. /31 dùng cho đường điểm-nối-điểm, /32 là một host."
      : "/" + prefix + " có " + size + " địa chỉ. Bỏ địa chỉ mạng và broadcast, còn " + info.hosts + " host gán được.";
    makeQuestion(
      "hosts",
      code(label) + " có bao nhiêu host gán được?",
      info.hosts,
      [size, size - 1, size + 2, 1, 4, 8, 16, 32, lanHosts(Math.max(8, prefix - 1)), lanHosts(Math.min(32, prefix + 1))],
      hostWhy
    );

    if (prefix <= 30) {
      const outs = outside(info);
      let insider = info.last !== info.ip ? info.last : info.first;
      if (insider === info.ip) insider = info.first;
      if (insider !== info.ip) {
        makeQuestion(
          "member",
          "Địa chỉ nào nằm cùng subnet với " + code(label) + "?",
          insider,
          outs,
          insider + " thuộc mạng " + info.network + "/" + info.prefix + ", từ " + info.first + " đến " + info.last + ". Các địa chỉ còn lại thuộc mạng khác."
        );
      }
      makeQuestion(
        "usable",
        "Trong mạng của " + code(label) + ", địa chỉ nào gán được cho một host?",
        info.first,
        [info.network, info.broadcast].concat(outs),
        "Trong " + info.network + "/" + info.prefix + ", " + info.network + " là địa chỉ mạng và " + info.broadcast + " là broadcast. " + info.first + " nằm giữa hai địa chỉ đó nên gán được cho host."
      );
    }
  }

  [
    ["172.16.20.45", 20],
    ["192.168.1.70", 26],
    ["10.1.5.9", 22],
    ["192.168.10.130", 25],
    ["10.20.30.40", 27],
    ["172.20.5.10", 28],
    ["192.168.0.10", 30],
    ["10.0.0.5", 8],
    ["172.31.4.10", 16],
    ["192.168.100.20", 29],
    ["10.10.10.10", 23],
    ["172.16.100.50", 21],
    ["192.168.5.15", 28],
    ["10.50.12.80", 19],
    ["172.18.40.90", 18],
    ["192.168.1.1", 24],
    ["203.0.113.45", 26],
    ["198.51.100.20", 27],
    ["192.0.2.130", 25],
    ["10.8.8.8", 13],
    ["172.25.130.10", 22],
    ["192.168.77.200", 28],
    ["10.64.10.5", 18],
    ["172.19.200.15", 24],
    ["10.2.3.4", 20],
    ["172.30.15.80", 23],
    ["192.168.50.90", 27],
    ["10.100.50.25", 29],
    ["172.17.8.8", 26],
    ["192.168.200.129", 25],
    ["10.15.0.1", 17],
    ["172.28.64.10", 19],
    ["192.168.8.6", 30],
    ["10.0.15.200", 21],
    ["172.16.255.250", 28],
    ["192.168.16.63", 26],
    ["10.1.1.255", 24],
    ["172.16.31.200", 20],
    ["192.168.4.100", 29],
    ["10.255.1.1", 30],
    ["192.168.33.45", 26],
    ["172.24.80.15", 22],
    ["10.40.7.90", 27],
    ["192.168.120.10", 28],
    ["172.16.5.10", 32],
    ["10.1.1.1", 32],
    ["192.168.1.10", 31],
    ["203.0.113.1", 31]
  ].forEach((pair) => addSample(pair[0], pair[1]));

  [8, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].forEach((prefix) => {
    const info = Subnet.analyze("10.1.1.1", prefix);
    const neighbors = [prefix - 1, prefix + 1, prefix - 8, prefix + 8]
      .filter((item) => item >= 8 && item <= 30 && item !== prefix);
    makeQuestion(
      "mask",
      "Prefix " + code("/" + prefix) + " có subnet mask nào?",
      info.mask,
      neighbors.map((item) => Subnet.analyze("10.1.1.1", item).mask).concat([info.wildcard, "255.255.255.255", "0.0.0.0"]),
      "Prefix /" + prefix + " bật " + prefix + " bit đầu. Mask là " + info.mask + "."
    );
    makeQuestion(
      "wildcard",
      "Wildcard của prefix " + code("/" + prefix) + " là gì?",
      info.wildcard,
      [info.mask, "0.0.0.0", "255.255.255.255"].concat(neighbors.map((item) => Subnet.analyze("10.1.1.1", item).wildcard)),
      "Wildcard đảo bit của mask " + info.mask + ", ra " + info.wildcard + ". Bit 0 của wildcard là bit phải khớp."
    );
    makeQuestion(
      "prefix",
      "Subnet mask " + code(info.mask) + " là prefix nào?",
      "/" + prefix,
      neighbors.map((item) => "/" + item).concat(["/32", "/0"]),
      info.mask + " có " + prefix + " bit 1 liên tiếp từ trái, nên prefix là /" + prefix + "."
    );
  });

  for (let prefix = 9; prefix <= 30; prefix += 1) {
    if (prefix % 8 === 0) continue;
    const bits = prefix % 8;
    const block = 2 ** (8 - bits);
    const name = octetNames[Math.floor(prefix / 8)];
    makeQuestion(
      "block",
      "Prefix " + code("/" + prefix) + " có bước nhảy bao nhiêu ở octet " + name + "?",
      block,
      [block / 2, block * 2, prefix, 256, 1, block - 2],
      "/" + prefix + " đặt " + bits + " bit mạng vào octet " + name + ". Bước nhảy = 2^(8-" + bits + ") = " + block + "."
    );
  }

  [2, 4, 10, 14, 20, 30, 50, 80, 100, 126, 200, 300, 500, 1000, 2000, 4000].forEach((need) => {
    let prefix = 30;
    while (prefix > 8 && lanHosts(prefix) < need) prefix -= 1;
    const shorter = Math.max(8, prefix - 1);
    const longerPrefix = prefix + 1;
    const enough = "Cần " + need + " host trên LAN, đã trừ địa chỉ mạng và broadcast. /" + prefix + " có " + lanHosts(prefix) + " host và là prefix dài nhất vẫn đủ. /" + shorter + " có " + lanHosts(shorter) + " host, đủ nhưng ngắn hơn.";
    const tooSmall = lanHosts(longerPrefix) < need
      ? " /" + longerPrefix + " chỉ có " + lanHosts(longerPrefix) + " host nên không đủ."
      : " /31 và /32 không dùng công thức trừ 2 của mạng LAN.";
    makeQuestion(
      "fit",
      "Cần ít nhất " + need + " host trên một mạng LAN. Prefix dài nhất vẫn đủ là prefix nào?",
      "/" + prefix,
      ["/" + longerPrefix, "/" + (prefix + 2), "/" + shorter, "/" + Math.max(8, prefix - 2)],
      enough + tooSmall
    );
  });

  [
    [24, 25], [24, 26], [24, 27], [24, 28], [24, 30],
    [16, 18], [16, 20], [16, 24],
    [20, 22], [20, 24],
    [22, 26], [23, 27],
    [8, 12], [8, 16],
    [25, 28], [26, 30], [18, 22], [19, 23], [21, 24], [28, 30]
  ].forEach((pair) => {
    const parent = pair[0];
    const child = pair[1];
    const count = 2 ** (child - parent);
    makeQuestion(
      "split",
      "Chia một mạng " + code("/" + parent) + " thành các subnet " + code("/" + child) + " thì được bao nhiêu subnet?",
      count,
      [count / 2, count * 2, child - parent, count - 2, lanHosts(child), 2 ** (child - parent + 1)],
      "Từ /" + parent + " sang /" + child + " mượn thêm " + (child - parent) + " bit. Số subnet = 2^" + (child - parent) + " = " + count + "."
    );
  });

  return bank;
})();

