window.LESSON = {
  id: "3.4",
  title: "Đọc trạng thái HSRP và VRRP",
  exam: "3.4 — Interpret HSRP and VRRP",
  keywords: ["HSRP", "VRRP", "virtual IP", "preempt", "active"],
  objectives: [
    "Giải thích vì sao host cần một gateway ảo thay vì IP thật của một router",
    "Đọc show standby và show vrrp để biết ai đang chuyển traffic",
    "Phân biệt vai Active/Standby của HSRP với Master/Backup của VRRP"
  ],
  opener: "PC chỉ nhớ một default gateway. Nếu địa chỉ đó là cổng thật của router A, thì hôm router A chết, PC vẫn kiên nhẫn gửi gói vào một địa chỉ đã tắt. FHRP đưa ra một địa chỉ ảo. Router nào còn sống thì đội địa chỉ đó. PC không cần biết hôm nay ai đang trực.",
  blocks: [
    { type: "h2", text: "Hai giao thức, một ý" },
    { type: "table", headers: ["", "HSRP", "VRRP"], rows: [
      ["Chuẩn", "Cisco", "IETF, chuẩn mở"],
      ["Người đang chuyển gói", "Active", "Master"],
      ["Người chờ", "Standby", "Backup"],
      ["Địa chỉ ảo", "Một IP trong cùng subnet, không trùng IP thật", "Có thể trùng IP thật của master"],
      ["Lệnh xem", "show standby brief", "show vrrp brief"]
    ] },
    { type: "cli", title: "HSRP nhóm 1, R1 ưu tiên hơn", code: "R1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip address 192.168.1.2 255.255.255.0\nR1(config-if)# standby 1 ip 192.168.1.1\nR1(config-if)# standby 1 priority 110\nR1(config-if)# standby 1 preempt\n\nR2(config)# interface GigabitEthernet0/0\nR2(config-if)# ip address 192.168.1.3 255.255.255.0\nR2(config-if)# standby 1 ip 192.168.1.1\nR2(config-if)# standby 1 priority 100\nR2(config-if)# standby 1 preempt" },
    { type: "p", text: "PC để gateway 192.168.1.1, không để .2 hay .3. Priority cao hơn làm Active, mặc định 100. Preempt cho phép router ưu tiên cao giành lại vai khi nó sống lại. Không preempt, một router yếu cứ cầm vai Active mãi sau sự cố dù router chính đã về. Virtual MAC của HSRP có dạng 0000.0c07.acXX, XX là số nhóm ở dạng hexa. VRRP dùng 0000.5e00.01XX." },
    { type: "cli", title: "Đọc ai đang trực", code: "R1# show standby brief\nInterface   Grp  Pri P State   Active          Standby         Virtual IP\nGi0/0       1    110 P Active  local           192.168.1.3     192.168.1.1" },
    { type: "steps", title: "Đọc dòng này thành tiếng", items: [
      "Nhóm 1, priority 110, chữ P nghĩa là preempt đang bật.",
      "State Active và Active local: chính R1 đang cầm gateway ảo.",
      "Standby là 192.168.1.3, tức R2 đang chờ.",
      "Virtual IP 192.168.1.1 là địa chỉ PC phải dùng."
    ] },
    { type: "p", text: "Khi R1 chết, R2 lên Active và gửi gratuitous ARP để switch học virtual MAC ở cổng mới. PC vẫn để gateway .1. Nếu PC nào đó bị cấu hình gateway .2, nó không được dự phòng: .2 chết là nó chết theo, dù R2 vẫn cầm .1. Đó là lỗi đưa vào đề dưới dạng một show standby hoàn toàn khỏe mạnh mà người dùng vẫn mất mạng." },
    { type: "lab", title: "Lab 3.4 — Rút điện mà PC không đổi gateway", goal: "Hai router, một switch, một PC. Gateway thiết kế là 192.168.1.1.", tasks: [
      "Cấu hình HSRP như bài. PC gateway .1. Ping 192.168.1.1 và một đích ở xa nếu có.",
      "show standby brief trên cả hai. Ghi ai Active.",
      "Tắt cổng R1 hoặc rút cáp R1. Đợi vài giây. show trên R2 phải thành Active. PC vẫn ping .1.",
      "Bật R1 lại. Nhờ preempt, R1 lấy lại Active. Viết một câu nếu bạn quên preempt thì chuyện gì xảy ra."
    ], hint: "Hello HSRP mặc định 3 giây, hold 10 giây. Đừng kết luận thất bại khi mới rút cáp được hai giây.", solution: "Trước sự cố R1 Active, R2 Standby, virtual IP .1. Sau khi R1 mất, R2 Active. PC không đổi cấu hình. Khi R1 trở lại với priority 110 và preempt, R1 chiếm lại Active. Quên preempt thì R2 tiếp tục Active cho đến khi R2 chết hoặc bị hạ priority. VRRP đọc tương tự: Master là người đang chuyển gói, lệnh show vrrp brief." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Gán virtual IP khác subnet với IP thật của cổng, ví dụ virtual 10.0.0.1 trong khi cổng là 192.168.1.2/24. Hai router không thành nhóm, PC cũng không bao giờ ARP được gateway." }
  ],
  terms: [
    { t: "Virtual IP", d: "Địa chỉ gateway mà host sử dụng, không thuộc riêng một router." },
    { t: "Active", d: "Router HSRP đang chuyển traffic cho virtual IP." },
    { t: "Master", d: "Vai tương đương Active trong VRRP." },
    { t: "Preempt", d: "Cho phép router ưu tiên cao lấy lại vai khi sống lại." }
  ],
  quiz: [
    { q: "Trong HSRP, ai chuyển traffic cho virtual IP?", choices: ["Standby", "Active", "Listen", "Master"], answer: 1, why: "Active của HSRP tương ứng Master của VRRP. Đừng trộn tên vai." },
    { q: "Giao thức nào là chuẩn mở?", choices: ["HSRP", "VRRP", "GLBP", "CDP"], answer: 1, why: "VRRP là IETF. HSRP và GLBP là Cisco." },
    { q: "PC nên đặt default gateway bằng địa chỉ nào?", choices: ["IP thật của router priority cao", "IP thật của router priority thấp", "Virtual IP", "255.255.255.255"], answer: 2, why: "Chỉ virtual IP mới nhảy sang router còn sống." },
    { q: "show standby brief có chữ P cạnh priority. Chữ đó nghĩa là gì?", choices: ["PortFast", "Preempt đang bật", "Passive interface", "PAT"], answer: 1, why: "P viết tắt preempt trong bảng brief của HSRP." }
  ]
};
