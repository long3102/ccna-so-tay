window.LESSON = {
  id: "2.3",
  title: "Đối chiếu sơ đồ bằng CDP và LLDP",
  exam: "2.3 — Validate documentation with CDP and LLDP",
  keywords: ["CDP", "LLDP", "neighbor", "holdtime"],
  objectives: [
    "Dùng CDP trên thiết bị Cisco để đọc tên hàng xóm, cổng mình và cổng phía kia",
    "Bật LLDP khi hàng xóm không phải Cisco và đọc bảng tương đương",
    "Sửa một dòng sai trên sơ đồ thay vì sửa cho khớp một niềm tin cũ"
  ],
  opener: "Sơ đồ mạng trong ngăn kéo thường già hơn thiết bị. Ai đó đã chuyển uplink từ cổng 24 sang cổng 23 và không sửa Visio. CDP và LLDP là hai người đi hỏi từng cổng: phía kia là ai, tên gì, đang cắm vào cổng nào. Việc của bạn là tin bảng hàng xóm, rồi sửa tài liệu.",
  blocks: [
    { type: "h2", text: "CDP là tiếng nói giữa thiết bị Cisco" },
    { type: "p", text: "CDP bật sẵn trên hầu hết thiết bị Cisco. Khoảng 60 giây nó gửi một lần trên cổng. Holdtime khoảng 180 giây: quá hạn không nghe thì xóa hàng xóm. Nó cho bạn hostname, cổng local, cổng remote, model, và ở bản chi tiết còn có IP quản trị." },
    { type: "cli", title: "Đọc một hàng xóm", code: "SW1# show cdp neighbors\nDevice ID    Local Intrfce   Holdtme  Capability  Platform  Port ID\nR1           Gig 1/0/24      150      R           ISR4331   Gig 0/0/1\nSW2          Gig 1/0/23      170      S I         C9200     Gig 1/0/23\n\nSW1# show cdp neighbors detail" },
    { type: "steps", title: "Sơ đồ cũ nói SW1 Gi1/0/24 nối SW2. Bảng trên nói gì?", items: [
      "Gi1/0/24 của SW1 đang gặp R1 cổng Gi0/0/1, không phải SW2.",
      "SW2 lại nằm ở Gi1/0/23 của SW1, và phía SW2 cũng là Gi1/0/23.",
      "Sửa sơ đồ theo hai dòng này. Đừng rút cáp cho khớp cái hình cũ."
    ] },
    { type: "h2", text: "LLDP khi bên kia không nói tiếng Cisco" },
    { type: "p", text: "LLDP là chuẩn IEEE 802.1AB. Điện thoại IP, AP, switch hãng khác và nhiều máy chủ dùng LLDP. Trên Cisco nó thường tắt cho đến khi bạn gõ `lldp run`. Sau đó `show lldp neighbors` đọc gần giống CDP." },
    { type: "cli", title: "Bật LLDP", code: "SW1(config)# lldp run\nSW1# show lldp neighbors\nSW1# show lldp neighbors detail" },
    { type: "callout", tone: "remember", title: "Tắt ở cổng xuống người lạ", text: "CDP và LLDP rất có ích trong tủ mạng, và rất hào phóng với người đang cắm laptop vào cổng hành lang: họ học được tên switch, cổng, và VLAN voice. Trên cổng edge, `no cdp enable` và `no lldp transmit` cùng `no lldp receive` là thói quen tốt. Giữ chúng trên uplink." },
    { type: "lab", title: "Lab 2.3 — Sơ đồ nói dối", goal: "Dựng hai switch và một router. Cố ý ghi một sơ đồ giấy sai cổng, rồi dùng CDP sửa lại. Nếu có một thiết bị không phải Cisco trong Packet Tracer, bật LLDP.", tasks: [
      "Viết sơ đồ giả: SW1 Gi1/0/1 nối R1 Gi0/0. Cắm thực tế vào một cổng khác.",
      "Dùng show cdp neighbors để viết lại ba cột: thiết bị local, cổng local, cổng remote.",
      "Tắt CDP trên một cổng access xuống PC. show cdp neighbors không còn được phép thấy PC đó là một thiết bị phát CDP, và giải thích vì sao làm vậy với cổng người dùng."
    ], hint: "Cột Local Intrfce là cổng của chính máy bạn đang đứng. Port ID là cổng của hàng xóm.", solution: "Bảng CDP thắng sơ đồ giấy. Ghi đúng cổng đã cắm, ví dụ SW1 Gi1/0/24 — R1 Gi0/0/1 nếu đó là chỗ cáp đang nằm. no cdp enable dưới cổng access để laptop người dùng không học được topology. Uplink vẫn để CDP để lần sau còn đối chiếu." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Đọc ngược cột. Local Interface là cổng mình. Port ID là cổng người ta. Sửa nhầm đầu cáp là sự cố tự gây trong giờ bảo trì." }
  ],
  terms: [
    { t: "CDP", d: "Cisco Discovery Protocol, khám phá hàng xóm Cisco." },
    { t: "LLDP", d: "Chuẩn mở tương đương CDP, bật bằng lldp run." },
    { t: "Holdtime", d: "Thời gian còn giữ một hàng xóm sau lần nghe gần nhất." },
    { t: "Neighbor", d: "Thiết bị nối trực tiếp, chưa phải mọi thiết bị trong mạng." }
  ],
  quiz: [
    { q: "Chuẩn mở thay cho CDP là gì?", choices: ["STP", "LLDP", "HSRP", "NAT"], answer: 1, why: "LLDP là IEEE 802.1AB. STP là chống loop, HSRP là gateway dự phòng." },
    { q: "Lệnh nào liệt kê hàng xóm Cisco cùng cổng hai đầu?", choices: ["show ip route", "show cdp neighbors", "show vlan brief", "show mac address-table"], answer: 1, why: "show cdp neighbors có Device ID, Local Intrfce và Port ID." },
    { q: "LLDP không hiện hàng xóm trên một switch Cisco mới vào lab. Việc nên thử?", choices: ["ip routing", "lldp run", "enable secret", "no shutdown VLAN 1"], answer: 1, why: "LLDP thường tắt mặc định. CDP thì thường đã bật." },
    { q: "Vì sao tắt CDP trên cổng xuống PC nhân viên?", choices: ["Để PC nhận DHCP nhanh hơn", "Để người lạ không học được tên switch và số cổng", "Vì CDP làm hỏng PoE", "Vì access port cấm mọi frame"], answer: 1, why: "CDP phát thông tin topology. Cổng công cộng không nên phát." }
  ]
};
