window.LESSON = {
  id: "3.3",
  title: "OSPF một vùng cho IPv4 và IPv6",
  exam: "3.3 — Single-area OSPFv2 and OSPFv3",
  keywords: ["area 0", "router ID", "DR", "BDR", "OSPFv3"],
  objectives: [
    "Bật OSPFv2 và OSPFv3 trên đúng cổng, cùng một area 0",
    "Giải thích router ID được chọn thế nào và DR/BDR được bầu khi nào",
    "Nhìn neighbor bị kẹt và khoanh area, subnet, timer, passive, hoặc loại mạng"
  ],
  opener: "Static là bạn tự vẽ mũi tên. OSPF là các router kể cho nhau những mạng chúng đang cầm, rồi tự tính đường ngắn nhất. Với CCNA bạn chỉ cần một vùng, area 0. Đủ để một công ty nhỏ hết phải gõ route tay mỗi lần thêm một LAN.",
  blocks: [
    { type: "h2", text: "Bật trên cổng, đừng bật trên cả thế giới" },
    { type: "cli", title: "OSPFv2 giữa R1 và R2", code: "R1(config)# router ospf 1\nR1(config-router)# router-id 1.1.1.1\nR1(config-router)# passive-interface default\nR1(config-router)# no passive-interface GigabitEthernet0/0\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip ospf 1 area 0\nR1(config)# interface GigabitEthernet0/1\nR1(config-if)# ip ospf 1 area 0" },
    { type: "p", text: "Số 1 sau chữ ospf là process ID, chỉ có nghĩa trên router đó. Hai đầu không cần trùng process ID. Chúng cần trùng area, trùng subnet trên đường nối, trùng hello và dead, và không được passive trên cổng dành để kết bạn. `passive-interface default` rồi mở lại đúng cổng nối router là thói quen an toàn: LAN người dùng không phát hello, không có kẻ lạ gia nhập OSPF." },
    { type: "p", text: "Router ID là tên của router trong OSPF, dạng địa chỉ IPv4. Thứ tự chọn: lệnh `router-id` thắng, không có thì lấy IP loopback cao nhất, không có loopback thì lấy IP cổng active cao nhất. Đổi router ID xong phải `clear ip ospf process` thì neighbor mới thấy tên mới. Hai router cùng router ID thì quan hệ không đứng vững." },
    { type: "h2", text: "DR và BDR chỉ có trên mạng broadcast" },
    { type: "p", text: "Trên Ethernet, OSPF bầu một DR và một BDR để đỡ phải kết bạn mọi cặp. Priority cao nhất thắng, mặc định là 1. Hòa thì router ID cao nhất thắng. Priority 0 nghĩa là từ chối làm DR. Trên link point-to-point không có bầu cử này. Hai router để network type khác nhau, một bên broadcast một bên point-to-point, sẽ không đầy đủ neighbor." },
    { type: "steps", title: "Ba router trên một switch, priority mặc định", items: [
      "R1 router ID 1.1.1.1, R2 là 2.2.2.2, R3 là 3.3.3.3.",
      "DR là R3 vì router ID cao nhất.",
      "BDR là R2. R1 là DROther.",
      "R1 và R2 đứng ở 2-Way với nhau là bình thường. Chúng chỉ Full với DR và BDR."
    ] },
    { type: "h2", text: "OSPFv3 không phải một giao thức lạ" },
    { type: "cli", title: "Cùng một area cho IPv6", code: "R1(config)# ipv6 unicast-routing\nR1(config)# ipv6 router ospf 1\nR1(config-rtr)# router-id 1.1.1.1\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ipv6 address 2001:db8:1::1/64\nR1(config-if)# ipv6 ospf 1 area 0" },
    { type: "p", text: "OSPFv3 dùng link-local để nói chuyện với hàng xóm. `show ipv6 ospf neighbor` hiện địa chỉ fe80:: chứ không hiện địa chỉ global. Thiếu router-id dạng IPv4 thì OSPFv3 có thể từ chối chạy dù bạn không định tuyến IPv4. Area, hello, dead và passive vẫn là những chỗ làm neighbor kẹt." },
    { type: "table", headers: ["Triệu chứng", "Kiểm tra"], rows: [
      ["Không thấy neighbor", "Cùng area chưa, cổng có passive không, ACL có chặn 224.0.0.5 không, subnet có khớp không"],
      ["Kẹt ExStart hoặc Exchange", "MTU hai đầu có khác nhau không"],
      ["2-Way mãi giữa hai DROther", "Bình thường trên broadcast"],
      ["Bảng không có mạng LAN của hàng xóm", "Cổng LAN có vào OSPF chưa, và có bị passive đúng chỗ không"]
    ] },
    { type: "lab", title: "Lab 3.3 — Area 0 cho cả hai họ địa chỉ", goal: "R1 và R2 nối Ethernet 10.0.0.0/30 và 2001:db8:12::/64. Mỗi router một LAN IPv4 và một LAN IPv6.", tasks: [
      "Đặt router-id 1.1.1.1 và 2.2.2.2. Đưa cổng nối và cổng LAN vào area 0 cho cả OSPFv2 lẫn OSPFv3.",
      "Passive mọi cổng rồi mở cổng nối. show ip ospf neighbor phải Full.",
      "Từ PC sau R1, ping LAN IPv4 và ping LAN IPv6 sau R2.",
      "Cố ý đổi hello của một đầu thành 5 giây. Ghi neighbor biến mất, rồi trả hello về 10."
    ], hint: "Dead interval cũng phải khớp. Đổi hello trên IOS thường kéo dead theo gấp bốn, nhưng hai đầu vẫn phải giống nhau.", solution: "Neighbor Full trên cổng /30, không bầu DR nếu bạn đặt ip ospf network point-to-point; để mặc định broadcast thì một bên làm DR và vẫn Full. Bảng mỗi router có mạng LAN của router kia với chữ O. Ping IPv6 cần ipv6 unicast-routing và PC có gateway IPv6. Hello lệch làm neighbor rớt sau dead interval. Trả về 10 và 40 thì neighbor trở lại." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Thấy 2-Way là tưởng hỏng. Trên mạng broadcast, hai router không phải DR/BDR chỉ cần 2-Way với nhau. Hỏng là khi router lẽ ra Full với DR mà vẫn mãi 2-Way, hoặc không có neighbor nào." }
  ],
  terms: [
    { t: "Area 0", d: "Vùng xương sống. Một thiết kế một vùng thì mọi cổng đều ở area 0." },
    { t: "Router ID", d: "Định danh 32 bit của router trong OSPF." },
    { t: "DR/BDR", d: "Hai router đại diện trên mạng broadcast, để các router khác kết bạn với chúng." },
    { t: "OSPFv3", d: "OSPF cho IPv6. OSPFv2 là cho IPv4." }
  ],
  quiz: [
    { q: "Trên mạng broadcast, ai làm DR?", choices: ["Router ID thấp nhất", "Priority cao nhất, hòa thì router ID cao nhất", "Process ID cao nhất", "Máy bật OSPF sau cùng"], answer: 1, why: "Priority mặc định 1. Priority 0 thì không tham gia bầu." },
    { q: "Không cấu hình router-id, không có loopback. OSPF lấy gì?", choices: ["0.0.0.0", "IP active cao nhất trên các cổng", "Địa chỉ MAC", "IP thấp nhất"], answer: 1, why: "Thứ tự là router-id tay, rồi loopback cao nhất, rồi IP cổng active cao nhất." },
    { q: "IPv6 dùng OSPF phiên bản nào?", choices: ["OSPFv2", "OSPFv3", "OSPFv6", "RIPng thay OSPF bắt buộc"], answer: 1, why: "OSPFv2 mang IPv4. OSPFv3 mang IPv6." },
    { q: "Hai DROther trên cùng một switch hiện 2-Way với nhau. Việc đúng?", choices: ["Sửa ngay vì phải Full mọi cặp", "Coi là bình thường nếu cả hai đều Full với DR", "Tắt area 0", "Đổi sang static"], answer: 1, why: "DROther không cần Full với nhau. Chúng Full với DR và BDR." }
  ]
};
