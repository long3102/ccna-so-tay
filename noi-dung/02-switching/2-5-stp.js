window.LESSON = {
  id: "2.5",
  title: "Rapid PVST+",
  exam: "2.5 — Configure Rapid PVST+",
  keywords: ["root bridge", "PortFast", "BPDU guard", "root guard", "loop guard"],
  objectives: [
    "Giải thích vì sao switch cần chặn loop và root được bầu bằng bridge ID nhỏ nhất",
    "Gán root primary, root secondary, và gọi đúng vai cổng: root, designated, alternate",
    "Đặt PortFast, BPDU guard, root guard, loop guard đúng chỗ, không đặt lẫn"
  ],
  opener: "Hai sợi cáp cho chắc lại là cách làm một vòng. Broadcast chạy một vòng, bị nhân đôi, và mạng tắt trong khi mọi đèn vẫn xanh. Rapid PVST+ cho mỗi VLAN một bản đồ không vòng: một switch làm gốc, mỗi switch khác có đúng một cổng hướng về gốc, các đường thừa bị để dành chứ không bị xóa khỏi cấu hình.",
  blocks: [
    { type: "h2", text: "Ai làm gốc" },
    { type: "p", text: "Bridge ID gồm priority và MAC. Priority mặc định 32768 và phải là bội của 4096. Rapid PVST cộng thêm số VLAN vào priority khi so sánh, nên mỗi VLAN có thể có gốc riêng. Số nhỏ hơn thắng. MAC chỉ được dùng khi priority hòa. Bạn không muốn gốc là cái switch vô tình có MAC nhỏ nhất ở góc hành lang. Hãy chỉ định." },
    { type: "cli", title: "Gốc chính và gốc dự phòng cho VLAN 10", code: "SW-CORE(config)# spanning-tree mode rapid-pvst\nSW-CORE(config)# spanning-tree vlan 10 root primary\nSW-DIST(config)# spanning-tree mode rapid-pvst\nSW-DIST(config)# spanning-tree vlan 10 root secondary" },
    { type: "p", text: "`root primary` hạ priority của switch đó xuống thấp hơn các switch khác. `root secondary` đặt một mức dự phòng, để khi gốc chính chết thì gốc phụ lên, không phải một access switch ngẫu nhiên." },
    { type: "h2", text: "Vai cổng và trạng thái" },
    { type: "table", headers: ["Vai", "Ý nghĩa"], rows: [
      ["Root port", "Cổng của switch không phải gốc, có đường tốt nhất về gốc. Đúng một cổng."],
      ["Designated port", "Cổng được phép nói ra một đoạn cáp. Cổng trên root bridge là designated."],
      ["Alternate", "Đường dự bị về gốc, Rapid PVST giữ nó ở discarding để sẵn sàng thay root port."]
    ] },
    { type: "p", text: "Trạng thái Rapid PVST bạn cần nhớ: discarding không chuyển dữ liệu người dùng, learning đang học MAC, forwarding được chuyển. Cổng edge với PortFast nhảy vào forwarding ngay. `show spanning-tree vlan 10` viết Root ID, Bridge ID của chính mình, và từng cổng với vai cùng trạng thái." },
    { type: "h2", text: "Bốn cái bảo vệ, bốn chỗ khác nhau" },
    { type: "table", headers: ["Tính năng", "Đặt ở đâu", "Nó chặn việc gì"], rows: [
      ["PortFast", "Access xuống host", "Khỏi chờ STP trên một cổng không có switch"],
      ["BPDU guard", "Cùng cổng PortFast", "Nếu BPDU xuất hiện, tắt cổng err-disable. Ai đó vừa cắm switch."],
      ["Root guard", "Cổng không được phép sinh ra root mới, thường là downlink", "BPDU tốt hơn thì cổng vào root-inconsistent, gốc hiện tại không bị cướp"],
      ["Loop guard", "Cổng root hoặc alternate hướng uplink", "Nếu đột nhiên im BPDU, khóa cổng thay vì mở ra gây loop một chiều"]
    ] },
    { type: "cli", title: "Cổng xuống PC", code: "SW1(config)# interface gi1/0/1\nSW1(config-if)# spanning-tree portfast\nSW1(config-if)# spanning-tree bpduguard enable" },
    { type: "callout", tone: "remember", title: "Đừng bật PortFast trên trunk giữa hai switch", text: "PortFast nói rằng phía sau không có switch. Nói dối điều đó trên uplink là mời một vòng lặp trong lúc STP còn chưa tính xong. BPDU guard trên uplink cũng sẽ tự tắt uplink ngay khi nghe BPDU của switch kia, tức là tắt nhầm đường chính." },
    { type: "p", text: "Cổng bị err-disable vì BPDU guard không tự sống lại nếu bạn chưa bật `errdisable recovery`. Sửa bằng cách rút thiết bị lạ, rồi `shutdown` và `no shutdown` trên cổng. `show spanning-tree inconsistentports` bắt root guard và loop guard đang khóa cổng nào." },
    { type: "lab", title: "Lab 2.5 — Chọn gốc trước khi gốc chọn bạn", goal: "Ba switch nối thành tam giác. VLAN 10. Bạn muốn SW-CORE làm gốc, SW-DIST làm dự phòng, access switch chỉ là lá.", tasks: [
      "Bật rapid-pvst trên cả ba. Đặt root primary và secondary như bài học.",
      "show spanning-tree vlan 10 trên access switch. Khoanh root port. Nói cổng nào đang alternate.",
      "Trên một cổng xuống PC, bật PortFast và BPDU guard. Cắm thử một switch thứ tư vào đó trong lab và ghi trạng thái cổng.",
      "Giải thích vì sao không đặt root guard trên chính cổng root port hướng lên SW-CORE."
    ], hint: "Root port là cổng hướng về switch có Root ID trùng với Bridge ID của SW-CORE. Root guard trên root port sẽ tự khóa đường lên gốc thật, vì BPDU của gốc là BPDU tốt hơn.", solution: "show spanning-tree vlan 10 phải có dòng This bridge is the root trên SW-CORE. Access switch có một root port hướng về phía core và một alternate hướng đường vòng. Cắm switch lạ vào cổng BPDU guard làm cổng err-disabled. Root guard không thuộc root port: cổng đó phải được nghe BPDU của gốc. Root guard thuộc những cổng mà một switch lạ không được phép giành quyền gốc, ví dụ cổng xuống tầng." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nhớ BPDU filter như một người bạn của PortFast. Đề v2.0 không còn hỏi BPDU filter. Filter nuốt BPDU và có thể giấu một loop. Đừng đưa nó vào lab này." }
  ],
  terms: [
    { t: "Root bridge", d: "Switch có bridge ID nhỏ nhất trong VLAN, làm gốc của cây." },
    { t: "BPDU", d: "Khung STP các switch trao đổi để bầu gốc và vai cổng." },
    { t: "PortFast", d: "Bỏ chờ trên cổng nối host." },
    { t: "BPDU guard", d: "Tắt cổng edge nếu nhận được BPDU." },
    { t: "Root guard", d: "Không cho cổng đó suy tôn một root mới." }
  ],
  quiz: [
    { q: "Root được bầu bằng gì?", choices: ["IP lớn nhất", "Bridge ID nhỏ nhất", "Nhiều cổng PoE nhất", "Hostname đứng trước trong bảng chữ cái"], answer: 1, why: "Priority nhỏ hơn thắng, hòa thì MAC nhỏ hơn thắng." },
    { q: "PortFast đặt ở đâu là đúng?", choices: ["Mọi trunk uplink", "Cổng access nối PC, điện thoại, máy in", "Chỉ trên root bridge", "Trên cổng đang alternate"], answer: 1, why: "Chỉ cổng không có switch phía sau mới được bỏ qua thời gian lắng nghe." },
    { q: "Tính năng nào tắt cổng err-disable khi một switch lạ được cắm vào bàn nhân viên?", choices: ["Root guard", "Loop guard", "BPDU guard", "LACP passive"], answer: 2, why: "BPDU guard trông chờ cổng edge im lặng. Có BPDU là có switch, cổng bị tắt." },
    { q: "Root guard phản ứng thế nào khi nghe BPDU tốt hơn trên cổng downlink?", choices: ["Nhường quyền root ngay", "Đưa cổng vào trạng thái inconsistent và không nhường root", "Tắt cả switch", "Bật NAT"], answer: 1, why: "Mục đích của root guard là bảo vệ gốc đã chọn, không phải bầu lại." }
  ]
};
