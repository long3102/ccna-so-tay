window.LESSON = {
  id: "0.3",
  title: "Ethernet, địa chỉ MAC và switch",
  exam: "Nền tảng cho miền 2.0",
  keywords: ["MAC", "flood", "learn", "aging", "broadcast"],
  objectives: [
    "Đọc một địa chỉ MAC và phân biệt unicast với broadcast",
    "Mô tả switch học MAC, chuyển frame, flood và quên mục cũ",
    "Giải thích vì sao một vòng lặp giữa các switch là tai họa"
  ],
  opener: "Trong một phòng họp, bạn không cần biết đường tới thành phố. Bạn chỉ cần biết người nghe đang ngồi ghế nào. Ethernet làm việc đó trong một LAN: frame mang địa chỉ MAC của người ngồi cạnh, và switch là người giữ sơ đồ ghế.",
  blocks: [
    { type: "h2", text: "Địa chỉ MAC" },
    { type: "p", text: "MAC dài 48 bit, thường viết thành 12 số hexa, ví dụ `3c:22:fb:a1:09:10`. Nửa đầu là mã nhà sản xuất, nửa sau do nhà sản xuất gán cho từng cổng. Địa chỉ này nằm trong card mạng hoặc trong máy ảo, và đi theo frame Ethernet." },
    { type: "table", headers: ["Loại", "Dấu hiệu", "Ai nhận"], rows: [
      ["Unicast", "Bit đầu của byte đầu là 0, ví dụ 3c:22:...", "Đúng một cổng"],
      ["Multicast", "Bit đó là 1 nhưng không phải toàn F", "Một nhóm máy đã đăng ký"],
      ["Broadcast", "ff:ff:ff:ff:ff:ff", "Mọi máy trong LAN, hoặc trong VLAN"]
    ] },
    { type: "h2", text: "Bốn việc switch làm với bảng MAC" },
    { type: "ol", items: [
      "Học: thấy frame vào cổng Gi1/0/3 với MAC nguồn A, ghi A nằm ở Gi1/0/3.",
      "Chuyển: frame có MAC đích đã có trong bảng thì đẩy đúng một cổng đó.",
      "Flood: MAC đích chưa biết, hoặc đích là broadcast, thì đẩy ra mọi cổng khác trong cùng VLAN, trừ cổng vừa nhận.",
      "Quên: sau thời gian aging, mặc định 300 giây không thấy MAC đó, xóa mục. Cắm máy sang cổng khác thì mục được học lại."
    ] },
    { type: "topo", title: "Ba máy, một switch, bảng còn trống", code: "PC-A                PC-B\nMAC ...:01           MAC ...:02\n   \\                  /\n    \\-- Gi1/0/1      /\n        Gi1/0/2 -- SW1\n        Gi1/0/3\n          |\n        PC-C  MAC ...:03" },
    { type: "steps", title: "Ví dụ: A gửi một frame cho B, bảng đang trống", items: [
      "Frame vào Gi1/0/1. Switch học MAC của A tại Gi1/0/1.",
      "MAC của B chưa có trong bảng. Switch flood ra Gi1/0/2 và Gi1/0/3.",
      "B nhận, C nhận rồi bỏ vì MAC đích không phải mình.",
      "Khi B trả lời, switch học MAC của B tại Gi1/0/2. Frame trả lời cho A đi đúng Gi1/0/1, không vào phòng của C nữa."
    ] },
    { type: "callout", tone: "remember", title: "Switch không hiểu IP", text: "Ở mức cơ bản, switch không mở packet để xem IP. Nó chỉ nhìn MAC. Muốn hai VLAN nói chuyện với nhau phải có một thiết bị lớp 3: router hoặc switch có SVI. Việc đó để buổi 2.1." },
    { type: "p", text: "Nếu hai switch nối với nhau bằng hai sợi cáp mà không có spanning tree, broadcast đi một vòng rồi bị nhân bản mãi. Bảng MAC nhảy lung tung vì cùng một MAC xuất hiện ở hai cổng. Mạng tắt dù đèn cổng vẫn xanh. Đó là lý do buổi 2.5 tồn tại." },
    { type: "lab", title: "Lab 0.3 — Đọc bảng MAC như người trực ca", goal: "Giả lập trong đầu, hoặc làm trên Packet Tracer với một switch và ba PC.", tasks: [
      "A ping B. Trước ping, bảng MAC trống. Viết bảng sau khi A đã gửi và B đã trả lời: MAC nào ở cổng nào.",
      "Rút cáp B, cắm B sang cổng thứ tư, bảo B nói một frame. Mục cũ của B còn đúng không?",
      "A gửi tới ff:ff:ff:ff:ff:ff. Liệt kê các cổng frame đó đi ra."
    ], hint: "Switch học MAC nguồn, không học MAC đích. Flood không quay lại cổng vừa nhận frame.", solution: "Sau hai chiều A-B: MAC A ở cổng của A, MAC B ở cổng của B. Khi B chuyển cổng, mục cũ sai cho đến khi B gửi frame mới và switch học lại, hoặc đến khi mục cũ hết hạn. Broadcast từ A đi ra mọi cổng khác trong VLAN, không đi ra cổng của A." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Thấy switch flood một frame unicast rồi kết luận switch hỏng. Lần đầu tiên tới một MAC lạ, flood là đúng việc. Chỉ đáng ngờ khi một MAC quen vẫn bị flood mãi, hoặc cùng một MAC nhảy qua nhảy lại giữa hai cổng." }
  ],
  terms: [
    { t: "MAC address table", d: "Bảng switch ghi MAC nguồn vừa thấy và cổng tương ứng." },
    { t: "Flood", d: "Gửi frame ra mọi cổng cùng VLAN trừ cổng nhận, khi chưa biết đích." },
    { t: "Aging", d: "Xóa một mục MAC nếu lâu không thấy nó, mặc định khoảng 300 giây." },
    { t: "Broadcast domain", d: "Vùng mà một frame broadcast lan tới. Một VLAN là một vùng như vậy." }
  ],
  quiz: [
    { q: "Switch học địa chỉ MAC nào để điền bảng?", choices: ["MAC đích", "MAC nguồn của frame vừa vào", "IP nguồn", "IP của default gateway"], answer: 1, why: "Cổng nào đưa frame vào thì MAC nguồn của frame đó đang sống ở cổng ấy." },
    { q: "Bảng chưa có MAC đích unicast. Switch làm gì?", choices: ["Hủy frame", "Flood trong VLAN, trừ cổng nhận", "Gửi lên CPU và dừng", "Chỉ gửi ra cổng Gi1/0/1"], answer: 1, why: "Chưa biết thì phải hỏi cả phòng, nhưng không gửi ngược lại cửa frame vừa bước vào." },
    { q: "Địa chỉ nào là broadcast Ethernet?", choices: ["00:00:00:00:00:00", "01:00:5e:00:00:01", "ff:ff:ff:ff:ff:ff", "192.168.1.255"], answer: 2, why: "Toàn bit 1 ở tầng 2 là broadcast. 192.168.1.255 là broadcast IP, một chuyện khác." },
    { q: "Hai cáp nối cùng một cặp switch, không có STP. Chuyện gì xảy ra với broadcast?", choices: ["Đi một lần rồi dừng", "Bị nhân bản liên tục và làm nghẽn mạng", "Tự chuyển thành unicast", "Chỉ hỏng một VLAN voice"], answer: 1, why: "Mỗi switch lại flood broadcast sang sợi kia. Không có cơ chế dừng thì bão broadcast hình thành." }
  ]
};
