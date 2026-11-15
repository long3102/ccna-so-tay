window.LESSON = {
  id: "2.4",
  title: "Xử lý sự cố lớp 2 và lớp 3",
  exam: "2.4 — Troubleshoot L2/L3 connectivity",
  keywords: ["show", "extended ping", "traceroute", "capture"],
  objectives: [
    "Đi từ triệu chứng tới một lệnh show, không nhảy thẳng vào cấu hình",
    "Dùng ping thường và extended ping để chọn đúng địa chỉ nguồn",
    "Đọc một mẩu bắt gói đủ để nói lỗi đang nằm ở ARP, TCP hay ICMP"
  ],
  opener: "Xử lý sự cố không phải lúc bạn gõ nhiều lệnh nhất. Đó là lúc mỗi lệnh trả lời một câu hỏi có/không. Đề v2.0 rất thích đưa output và hỏi bước tiếp theo. Bạn thắng nếu có thứ tự, thua nếu thấy gì sửa nấy.",
  blocks: [
    { type: "h2", text: "Một thang từ dưới lên" },
    { type: "ol", items: [
      "Tầng 1: `show ip interface brief` hoặc `show interfaces status`. notconnect thì dừng ở cáp và shutdown.",
      "Tầng 2: `show vlan brief`, `show interfaces trunk`, `show mac address-table`. Máy có đang ở đúng VLAN không, switch có thấy MAC không.",
      "Tầng 3: `show ip route`, `show ip arp`, ping gateway. Có đường không, có ai trả lời ARP không.",
      "Tầng 4 trở lên: traceroute, rồi bắt gói nếu đường đi im lặng một cách khó hiểu."
    ] },
    { type: "p", text: "`show logging` nằm trong cùng hộp dụng cụ. Một cổng err-disabled, một native VLAN mismatch, một neighbor OSPF vừa rớt: log nói trước khi bảng định tuyến nói. Hãy đọc giờ trong log. Một dòng tối qua không phải bệnh sáng nay." },
    { type: "h2", text: "Ping có nguồn" },
    { type: "p", text: "Router ping bằng địa chỉ của cổng nó chọn để ra ngoài. Extended ping cho bạn chỉ định nguồn. Điều này quan trọng khi bạn đứng trên router và muốn giả làm một mạng ở phía sau nó. Gõ `ping` rồi Enter, đừng gõ kèm địa chỉ, IOS sẽ hỏi từng tham số." },
    { type: "cli", title: "Extended ping từ địa chỉ LAN", code: "R1# ping\nProtocol [ip]:\nTarget IP address: 192.168.20.10\nRepeat count [5]: 3\nDatagram size [100]:\nTimeout in seconds [2]:\nExtended commands [n]: y\nSource address or interface: 192.168.10.1\nType escape sequence to abort.\nSending 3, 100-byte ICMP Echos..." },
    { type: "p", text: "Traceroute in từng chặng cho đến chỗ các dấu sao bắt đầu. Chặng cuối cùng còn tên là chỗ gói còn đi được. Sao liên tục có thể là ACL chặn ICMP, không chắc là cáp đứt. Đừng kết luận mạnh hơn chứng cứ." },
    { type: "h2", text: "Ba mẩu bắt gói" },
    { type: "table", headers: ["Bạn thấy", "Nghĩa"], rows: [
      ["ARP who has gateway, không ai reply", "Sai VLAN, gateway tắt, hoặc nhầm địa chỉ gateway"],
      ["DHCP Discover lặp, không Offer", "Relay, pool, hoặc snooping. Xem buổi 1.7 và 4.7"],
      ["TCP SYN đi, không SYN-ACK", "Máy đích im, không có route về, hoặc ACL chặn"]
    ] },
    { type: "steps", title: "Ví dụ: PC1 không ping được PC2 khác VLAN", items: [
      "PC1 ipconfig có 192.168.10.10/24 và gateway 192.168.10.1. Không phải APIPA.",
      "PC1 ping 192.168.10.1 được. Tầng 2 và gateway của VLAN 10 còn sống.",
      "PC1 ping 192.168.20.10 thất bại. Trên switch lớp 3, show ip route có mạng 192.168.20.0/24 connected.",
      "show vlan brief: PC2 đang ở VLAN 1, không phải VLAN 20, dù IP của nó thuộc VLAN 20. Sửa access VLAN. Đây là lỗi lớp 2 đội lốt lớp 3."
    ] },
    { type: "lab", title: "Lab 2.4 — Một phiếu, năm lệnh", goal: "Dựng lại topology buổi 2.1 rồi cố ý bỏ PC2 ở VLAN 1. Tự viết nhật ký xử lý, mỗi dòng một lệnh và một câu kết luận.", tasks: [
      "Bắt đầu từ PC, không bắt đầu từ OSPF. Ghi IP, mask, gateway.",
      "Ping gateway, rồi ping PC2, rồi traceroute.",
      "Trên switch, show mac address-table và show vlan brief cho cả hai PC.",
      "Sửa đúng một thứ. Ping lại. Nếu vẫn hỏng, kiểm tra đường về chứ đừng sửa thêm lung tung."
    ], hint: "MAC của PC2 xuất hiện ở VLAN 1 là bằng chứng access port sai, mạnh hơn một linh cảm.", solution: "Nhật ký đạt yêu cầu có dạng: PC2 có IP 192.168.20.10 nhưng show vlan brief cho cổng của PC2 ở VLAN 1; MAC của PC2 học ở VLAN 1; SVI VLAN 20 không thấy ARP của PC2. Sửa switchport access vlan 20. Ping từ PC1 tới PC2 thành công sau khi PC2 về đúng broadcast domain và ARP tới gateway .20.1." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Sửa cùng lúc VLAN, trunk, route và ACL. Sau đó hết lỗi và bạn không biết thuốc nào đã chữa. Mỗi lần một thay đổi, rồi thử lại." }
  ],
  terms: [
    { t: "Extended ping", d: "Ping chủ động chọn được địa chỉ hoặc cổng nguồn." },
    { t: "Traceroute", d: "Liệt kê các chặng lớp 3 cho tới đích hoặc tới chỗ bị chặn." },
    { t: "show logging", d: "Nhật ký thiết bị, gồm lỗi cổng và cảnh báo giao thức." },
    { t: "Packet capture", d: "Bản ghi từng gói trên dây, đủ để thấy ARP, DHCP và bắt tay TCP." }
  ],
  quiz: [
    { q: "Extended ping cho phép đổi thứ ping thường không hỏi?", choices: ["Tên VLAN", "Địa chỉ nguồn, kích thước, số lần", "Mật khẩu enable", "Kênh Wi-Fi"], answer: 1, why: "Điểm đáng tiền nhất là chọn source interface để thử đúng mạng." },
    { q: "Bắt gói thấy SYN mà không thấy SYN-ACK. Nhận định nào vừa đủ?", choices: ["Cáp giữa PC và switch chắc chắn rút", "Phía đích không trả lời bắt tay, hoặc đường về bị chặn", "Duplex mismatch đã được chứng minh", "DNS hỏng"], answer: 1, why: "SYN đã đi được tới điểm bắt. Việc thiếu là lời đáp TCP." },
    { q: "ARP xin gateway mà không có reply. Nghi gì trước?", choices: ["Hết bộ nhớ flash", "Host và gateway không cùng VLAN hoặc gateway không lên", "Sai bản ghi MX", "Ansible chưa chạy"], answer: 1, why: "ARP chỉ trong một mạng lớp 2. Im lặng nghĩa là không ai cùng VLAN mang địa chỉ đó." },
    { q: "Lệnh nào xem nhanh cổng nào up/up và IP nào đã gán?", choices: ["show vlan brief", "show ip interface brief", "show cdp neighbors", "show etherchannel summary"], answer: 1, why: "show ip interface brief là cái nhìn đầu tiên cho tầng 1 và địa chỉ." }
  ]
};
