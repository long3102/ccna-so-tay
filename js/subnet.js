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

if (typeof document !== "undefined" && document.getElementById("a-net")) {
  Shell.render({ active: "subnet", root: "../" });

  let current = null;

  function newQuestion() {
    const prefix = 16 + Math.floor(Math.random() * 13);
    const block = 2 ** (32 - prefix);
    const base = Math.floor(Math.random() * (2 ** prefix)) * block;
    const network = base >>> 0;
    const hostOffset = prefix >= 31 ? 0 : 1 + Math.floor(Math.random() * Math.max(1, block - 2));
    const ip = (network + hostOffset) >>> 0;
    current = Subnet.analyze([24, 16, 8, 0].map((shift) => (ip >>> shift) & 255).join("."), prefix);
    document.getElementById("prompt").textContent = `${current.ip}/${prefix}`;
    ["a-net", "a-first", "a-last", "a-bcast", "a-hosts"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("verdict").textContent = "";
  }

  document.getElementById("explain").addEventListener("click", () => {
    const info = Subnet.analyze(document.getElementById("ip").value, Number(document.getElementById("prefix").value));
    document.getElementById("explain-out").innerHTML = info ? Subnet.explain(info) : "<p class='bad'>Địa chỉ hoặc prefix không hợp lệ.</p>";
  });

  document.getElementById("new").addEventListener("click", newQuestion);

  document.getElementById("check").addEventListener("click", () => {
    if (!current) return;
    const answers = {
      "a-net": current.network,
      "a-first": current.first,
      "a-last": current.last,
      "a-bcast": current.broadcast
    };
    let good = true;
    Object.entries(answers).forEach(([id, expected]) => {
      const input = document.getElementById(id);
      const typed = Subnet.ipToInt(input.value);
      const wanted = Subnet.ipToInt(expected);
      const ok = typed !== null && typed === wanted;
      input.style.borderColor = ok ? "#0f6e45" : "#9d2c2c";
      if (!ok) good = false;
    });
    const hosts = Number(document.getElementById("a-hosts").value);
    const hostInput = document.getElementById("a-hosts");
    const hostsOk = hosts === current.hosts;
    hostInput.style.borderColor = hostsOk ? "#0f6e45" : "#9d2c2c";
    if (!hostsOk) good = false;
    const verdict = document.getElementById("verdict");
    verdict.className = good ? "ok" : "bad";
    verdict.textContent = good
      ? "Đúng cả năm ô. Lấy đề mới ngay, đừng dừng khi vừa đúng một câu."
      : `Có ô sai. Mạng ${current.network}, đầu ${current.first}, cuối ${current.last}, broadcast ${current.broadcast}, host dùng được ${current.hosts}. Tự tính lại đề này trước khi bấm đề mới.`;
  });

  newQuestion();
}
