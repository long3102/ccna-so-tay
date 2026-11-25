const Subnet = (() => {
  function ipToInt(ip) {
    const parts = ip.trim().split(".");
    if (parts.length !== 4) return null;
    let value = 0;
    for (const part of parts) {
      if (!/^\d{1,3}$/.test(part)) return null;
      const octet = Number(part);
      if (octet > 255) return null;
      value = (value * 256 + octet) >>> 0;
    }
    return value;
  }

  function intToIp(value) {
    return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
  }

  function maskOf(prefix) {
    if (prefix === 0) return 0;
    return (0xffffffff << (32 - prefix)) >>> 0;
  }

  function analyze(ipText, prefix) {
    const ip = ipToInt(ipText);
    if (ip === null || prefix < 0 || prefix > 32) return null;
    const mask = maskOf(prefix);
    const network = (ip & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const size = 2 ** (32 - prefix);
    let first = "";
    let last = "";
    let hosts = 0;
    if (prefix <= 30) {
      first = intToIp(network + 1);
      last = intToIp(broadcast - 1);
      hosts = size - 2;
    } else if (prefix === 31) {
      first = intToIp(network);
      last = intToIp(broadcast);
      hosts = 2;
    } else {
      first = intToIp(network);
      last = intToIp(network);
      hosts = 1;
    }
    const interesting = Math.floor(prefix / 8);
    const octetIndex = Math.min(interesting, 3);
    const bitsInOctet = prefix % 8;
    const block = bitsInOctet === 0 ? 256 : 2 ** (8 - bitsInOctet);
    return {
      ip: intToIp(ip),
      prefix,
      mask: intToIp(mask),
      wildcard: intToIp((~mask) >>> 0),
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      first,
      last,
      hosts,
      block,
      octetIndex
    };
  }

  function explain(info) {
    const names = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư"];
    const special = info.prefix >= 31
      ? "Prefix /31 và /32 không trừ hai địa chỉ theo kiểu mạng LAN thông thường. /31 dùng cho đường điểm-nối-điểm, /32 là một host."
      : "Trên LAN, địa chỉ mạng và broadcast không gán cho máy, nên số host dùng được bằng tổng địa chỉ trừ 2.";
    return `
      <dl class="result">
        <dt>Mask</dt><dd>${info.mask}</dd>
        <dt>Wildcard</dt><dd>${info.wildcard}</dd>
        <dt>Mạng</dt><dd>${info.network}/${info.prefix}</dd>
        <dt>Host đầu</dt><dd>${info.first}</dd>
        <dt>Host cuối</dt><dd>${info.last}</dd>
        <dt>Broadcast</dt><dd>${info.broadcast}</dd>
        <dt>Host dùng được</dt><dd>${info.hosts}</dd>
      </dl>
      <ol>
        <li>Prefix /${info.prefix} che ${info.prefix} bit đầu. Mask là ${info.mask}. Wildcard đảo các bit đó: ${info.wildcard}.</li>
        <li>Octet đáng chú ý là octet ${names[info.octetIndex]}. Bước nhảy ở octet đó là ${info.block === 256 ? "256, nghĩa là octet này bị khóa hoàn toàn hoặc nằm ở octet sau" : info.block}.</li>
        <li>Địa chỉ mạng = IP AND mask = ${info.network}. Broadcast = mạng OR wildcard = ${info.broadcast}.</li>
        <li>${special}</li>
      </ol>`;
  }

  return { analyze, explain, ipToInt, intToIp };
})();

const SubnetPage = (() => {
  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = copy[i];
      copy[i] = copy[j];
      copy[j] = swap;
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
    shuffle([...groups.keys()]).forEach((type) => {
      if (picked.length >= 5) return;
      const list = groups.get(type);
      const choice = list[Math.floor(Math.random() * list.length)];
      picked.push(choice);
      used.add(choice);
    });
    if (picked.length < 5) {
      shuffle(bank.filter((item) => !used.has(item))).slice(0, 5 - picked.length).forEach((item) => {
        picked.push(item);
      });
    }
    return picked;
  }

  function start(bank) {
    const host = document.getElementById("practice-quiz");
    const meta = document.getElementById("practice-meta");

    function show() {
      meta.textContent = `Ngân hàng ${bank.length} câu. Lượt này hỏi 5 câu, mỗi câu một dạng.`;
      Quiz.mount(host, drawFive(bank));
    }

    document.getElementById("new-set").addEventListener("click", show);
    show();
  }

  return { start, drawFive };
})();

if (typeof document !== "undefined") {
  Shell.render({ active: "subnet", root: "../" });

  document.getElementById("explain").addEventListener("click", () => {
    const info = Subnet.analyze(document.getElementById("ip").value, Number(document.getElementById("prefix").value));
    document.getElementById("explain-out").innerHTML = info ? Subnet.explain(info) : "<p class='bad'>Địa chỉ hoặc prefix không hợp lệ.</p>";
  });
}
