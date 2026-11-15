window.LESSON = {
  id: "3.2",
  title: "Sửa route tĩnh IPv4 và IPv6",
  exam: "3.2 — Troubleshoot IPv4 and IPv6 static routing",
  keywords: ["default route", "host route", "floating static", "next hop"],
  objectives: [
    "Viết default route, network route và host route cho IPv4 lẫn IPv6",
    "Thêm một floating static có AD cao hơn để nó chỉ lên thay khi đường chính mất",
    "Tìm lỗi thiếu đường về, next hop sai mạng, và route trỏ vào một cổng down"
  ],
  opener: "Route tĩnh là bạn tự vẽ một mũi tên: muốn tới mạng này thì bước tiếp theo là địa chỉ kia. Nó rất rõ, và rất dễ gãy vì mạng bên kia không tự vẽ mũi tên đáp lại. Hầu hết lab static hỏng không phải vì lệnh sai chính tả, mà vì chỉ có một chiều.",
  blocks: [
    { type: "h2", text: "Bốn mũi tên" },
    { type: "table", headers: ["Loại", "IPv4", "IPv6"], rows: [
      ["Default", "ip route 0.0.0.0 0.0.0.0 203.0.113.1", "ipv6 route ::/0 2001:db8:1::1"],
      ["Network", "ip route 10.2.0.0 255.255.0.0 10.1.1.2", "ipv6 route 2001:db8:2::/64 2001:db8:1::2"],
      ["Host", "ip route 10.2.2.9 255.255.255.255 10.1.1.2", "ipv6 route 2001:db8:2::9/128 2001:db8:1::2"],
      ["Floating", "ip route 0.0.0.0 0.0.0.0 198.51.100.1 200", "ipv6 route ::/0 2001:db8:9::1 200"]
    ] },
    { type: "p", text: "Số 200 ở cuối là AD. Đường chính OSPF AD 110 vẫn được tin. Khi OSPF mất, static AD 200 mới được đưa vào bảng. Để AD 1 thì static thắng OSPF ngay và đường dự phòng không còn là dự phòng. Next hop phải là địa chỉ ai đó mình tới được ở chặng kế, thường là đầu kia của một mạng connected." },
    { type: "cli", title: "Hai router, hai LAN, một đường nối", code: "R1(config)# ip route 192.168.20.0 255.255.255.0 10.0.0.2\nR2(config)# ip route 192.168.10.0 255.255.255.0 10.0.0.1\nR1(config)# ipv6 unicast-routing\nR1(config)# ipv6 route 2001:db8:20::/64 2001:db8:1::2" },
    { type: "p", text: "Trên Ethernet, hãy trỏ next hop là địa chỉ IP, đừng chỉ ghi tên cổng. Ghi mỗi tên cổng khiến router ARP từng đích như thể đích nằm trên cáp đó. Với IPv6, router phải có `ipv6 unicast-routing` thì mới chuyển gói giúp host. Một host route /32 hoặc /128 dùng khi một máy đặc biệt phải đi cửa khác phần còn lại của mạng." },
    { type: "h2", text: "Bệnh thường gặp" },
    { type: "ul", items: [
      "R1 có đường sang LAN của R2, R2 không có đường về. Ping từ router đôi khi vẫn được vì nguồn là cổng gần, ping từ PC thì chết. Hãy extended ping từ địa chỉ LAN.",
      "Next hop 10.0.0.2 trong khi cổng mình là 10.0.1.1/30. Hai địa chỉ không cùng mạng, route được cài nhưng không bao giờ dùng được.",
      "Cổng chứa next hop đang down. Static biến mất khỏi bảng. `show ip route static` trống không có nghĩa là bạn chưa gõ lệnh; `show running-config | section ip route` mới cho thấy lệnh còn nằm đó.",
      "IPv6 có route mà host vẫn không đi, vì host chưa có default gateway IPv6, hoặc router chưa bật unicast-routing."
    ] },
    { type: "lab", title: "Lab 3.2 — Đường đi, đường về, và một đường dự phòng", goal: "Hai router nối bằng 10.0.0.0/30. R1 có LAN 192.168.10.0/24. R2 có LAN 192.168.20.0/24. Thêm một đường dự phòng tưởng tượng qua 10.9.9.2 với AD 200.", tasks: [
      "Viết static hai chiều cho hai LAN. Ping từ PC LAN này sang PC LAN kia, không chỉ ping giữa hai router.",
      "Thêm floating default trên R1 qua 10.9.9.2 AD 200. show ip route và nói vì sao nó chưa xuất hiện nếu đã có default AD 1.",
      "Xóa default chính. Cho thấy floating xuất hiện. Viết một câu giải thích AD.",
      "Cố ý không cấu hình đường về trên R2. Mô tả kết quả ping từ PC1 và kết quả ping từ chính R1 sang LAN R2."
    ], hint: "10.0.0.0/30 có hai host .1 và .2. Next hop của R1 là .2. AD chỉ so khi prefix bằng nhau và cả hai cùng đủ điều kiện vào bảng.", solution: "R1: ip route 192.168.20.0 255.255.255.0 10.0.0.2. R2: ip route 192.168.10.0 255.255.255.0 10.0.0.1. Floating: ip route 0.0.0.0 0.0.0.0 10.9.9.2 200, chỉ vào bảng khi không còn default nào có AD tốt hơn và next hop tới được. Thiếu đường về: PC1 ping PC2 thất bại vì PC2 hoặc R2 không biết trả lời về 192.168.10.0/24. R1 ping bằng nguồn 10.0.0.1 có thể thành công nếu R2 coi đó là connected. Đó là lý do phải thử từ PC." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Viết `ip route 0.0.0.0 255.255.255.255` rồi tưởng đó là default. Mask toàn bit 1 là một host route tới 0.0.0.0, không phải cửa ra. Default phải là mask 0.0.0.0." }
  ],
  terms: [
    { t: "Next hop", d: "Địa chỉ của router kế tiếp, phải tới được bằng một mạng connected." },
    { t: "Host route", d: "Một đích duy nhất, /32 với IPv4 và /128 với IPv6." },
    { t: "Floating static", d: "Static có AD cố ý để cao, chỉ nổi lên khi đường chính biến mất." },
    { t: "Recursive lookup", d: "Next hop lại được tra trong bảng để tìm cổng ra thực sự." }
  ],
  quiz: [
    { q: "Lệnh default route IPv4 đúng?", choices: ["ip route 0.0.0.0 255.255.255.0 10.1.1.1", "ip route 0.0.0.0 0.0.0.0 10.1.1.1", "ip default-gateway 10.1.1.1 trên router đang bật ip routing", "ip route default 10.1.1.1"], answer: 1, why: "Default là 0.0.0.0 với mask 0.0.0.0. ip default-gateway chỉ có nghĩa khi thiết bị không định tuyến." },
    { q: "Host route IPv4 có prefix nào?", choices: ["/24", "/30", "/32", "/0"], answer: 2, why: "Một địa chỉ là /32. IPv6 tương ứng là /128." },
    { q: "Floating static dự phòng cho OSPF nên có AD khoảng bao nhiêu?", choices: ["0", "1", "90", "Cao hơn 110, ví dụ 200"], answer: 3, why: "AD phải kém tin hơn OSPF thì OSPF mới được dùng khi còn sống." },
    { q: "PC hai đầu không ping nhau, nhưng hai router ping được cổng nối của nhau. Nghi gì?", choices: ["Cáp giữa hai router đứt", "Thiếu static ở một chiều tới LAN, hoặc PC sai gateway", "STP đang chặn cổng WAN", "WPA3"], answer: 1, why: "Đường nối router còn sống. Thiếu chính là route tới mạng LAN hoặc gateway của PC." }
  ]
};
