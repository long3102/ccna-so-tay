window.LESSON = {
  id: "4.7",
  title: "Bảo mật lớp 2",
  exam: "4.7 — Configure Layer 2 security",
  keywords: ["port security", "DHCP snooping", "DAI", "storm control", "RA guard"],
  objectives: [
    "Khóa một cổng access bằng port security và biết cách mở lại khi nó bị err-disable",
    "Bật DHCP snooping rồi DAI, đúng cổng trust",
    "Giới hạn bão broadcast và chặn router advertisement IPv6 giả trên cổng xuống host"
  ],
  opener: "Tường lửa ở cửa Internet không thấy những trò xảy ra trong VLAN. Một chiếc router mini cắm dưới bàn phát DHCP. Một laptop giả địa chỉ MAC của gateway. Một sợi cáp vòng do chính nhân viên tạo ra. Năm tính năng buổi này đứng ngay tại cổng xuống bàn, nơi trò đó bắt đầu.",
  blocks: [
    { type: "h2", text: "Port security: cổng này chỉ dành cho máy này" },
    { type: "cli", title: "Học MAC và dán chặt", code: "SW1(config)# interface gi1/0/7\nSW1(config-if)# switchport mode access\nSW1(config-if)# switchport port-security\nSW1(config-if)# switchport port-security maximum 2\nSW1(config-if)# switchport port-security mac-address sticky\nSW1(config-if)# switchport port-security violation shutdown" },
    { type: "p", text: "Maximum 2 dành cho điện thoại cộng PC. Máy in một mình thì maximum 1. Sticky ghi MAC đã học vào running-config, nhớ copy startup nếu muốn giữ sau reboot. Violation shutdown đưa cổng vào err-disabled. restrict bỏ frame lạ và ghi log. protect bỏ frame lạ mà im lặng, khó vận hành. Mở lại cổng err-disable: rút máy lạ, `shutdown` rồi `no shutdown`." },
    { type: "h2", text: "DHCP snooping và DAI đi thành cặp" },
    { type: "p", text: "DHCP snooping chia cổng thành trust và untrust. Cổng uplink về DHCP server là trust. Cổng xuống host là untrust, không được phép gửi DHCP Offer. Switch ghi lại binding: MAC nào nhận IP nào trên cổng nào. DAI dùng chính bảng đó để xét ARP. Ai tuyên bố IP của gateway bằng một MAC lạ thì gói ARP bị vứt." },
    { type: "cli", title: "Tin uplink, nghi ngờ bàn nhân viên", code: "SW1(config)# ip dhcp snooping\nSW1(config)# ip dhcp snooping vlan 10\nSW1(config)# interface gi1/0/24\nSW1(config-if)# ip dhcp snooping trust\nSW1(config)# ip arp inspection vlan 10\nSW1(config)# interface gi1/0/24\nSW1(config-if)# ip arp inspection trust" },
    { type: "p", text: "Quên trust trên uplink thì chính Offer của server bị vứt, cả VLAN nhận 169.254, và bạn vừa gây sự cố bằng một tính năng an ninh. Máy gán IP tĩnh không có binding DHCP nên DAI sẽ chặn ARP của nó trừ khi bạn thêm một binding tĩnh. Đó là việc cần nhớ với máy in gán tay." },
    { type: "h2", text: "Storm control và RA guard" },
    { type: "p", text: "Storm control giới hạn mức broadcast, multicast hoặc unicast trên một cổng. Vượt ngưỡng thì gói thừa bị rơi, cổng không nhất thiết chết. Nó hãm một máy hoặc một vòng lặp đang hét, không thay spanning tree. RA guard chặn router advertisement IPv6 trên cổng không được phép có router. Một laptop phát RA có thể trở thành default gateway IPv6 của cả VLAN." },
    { type: "cli", title: "Hãm bão và không tin RA từ host", code: "SW1(config)# interface gi1/0/7\nSW1(config-if)# storm-control broadcast level 20\nSW1(config)# ipv6 nd raguard policy HOST\nSW1(config-nd-raguard)# device-role host\nSW1(config)# interface gi1/0/7\nSW1(config-if)# ipv6 nd raguard attach-policy HOST" },
    { type: "callout", tone: "remember", title: "Năm việc, năm bệnh", text: "Port security chặn máy lạ. DHCP snooping chặn server DHCP lạ. DAI chặn ARP giả. Storm control hãm bão. RA guard chặn router IPv6 giả. Đọc đề và gắn đúng tên, đừng gọi tất cả là port security." },
    { type: "lab", title: "Lab 4.7 — Cắm một router lạ dưới bàn", goal: "Một switch, VLAN 10, DHCP server thật ở uplink Gi1/0/24, một PC ở Gi1/0/7.", tasks: [
      "Bật DHCP snooping cho VLAN 10 và trust đúng cổng server. PC vẫn xin được IP.",
      "Cố ý bỏ trust. PC phải mất khả năng xin IP mới. Rồi trả trust lại.",
      "Bật port security maximum 1 sticky trên cổng PC. Đổi sang một PC khác và quan sát err-disable. Mở cổng lại đúng quy trình.",
      "Viết một câu: DAI cần bảng nào thì mới biết ARP nào là thật."
    ], hint: "Trust là phía server, không phải phía PC. err-disable không hết bằng cách chỉ cắm lại máy cũ; cổng cần shutdown và no shutdown.", solution: "Với trust đúng, PC nhận IP và show ip dhcp snooping binding có dòng của PC. Bỏ trust thì Offer bị drop. Port security: PC thứ hai làm cổng err-disabled nếu violation shutdown. Phục hồi bằng shutdown / no shutdown sau khi cắm lại máy được phép. DAI cần DHCP snooping binding, nên snooping phải chạy trước và phải có binding." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Bật ip arp inspection vlan 10 trước khi có DHCP snooping. DAI không có bảng để tin, ARP của người dùng bị rơi, gateway im, và trông như thể router vừa hỏng." }
  ],
  terms: [
    { t: "Port security", d: "Giới hạn số MAC và cách xử lý khi có MAC lạ trên một cổng access." },
    { t: "DHCP snooping", d: "Chỉ cổng trust được gửi Offer, đồng thời ghi bảng binding." },
    { t: "DAI", d: "Dynamic ARP inspection, đối chiếu ARP với binding." },
    { t: "RA guard", d: "Chặn IPv6 router advertisement trên cổng của host." }
  ],
  quiz: [
    { q: "Tính năng nào dùng bảng DHCP snooping để chặn ARP giả?", choices: ["Storm control", "DAI", "RA guard", "BPDU guard"], answer: 1, why: "DAI so IP và MAC trong ARP với binding đã học từ DHCP." },
    { q: "RA guard chống điều gì?", choices: ["DHCP server giả", "Router advertisement IPv6 giả", "Bão broadcast", "Loop STP"], answer: 1, why: "RA là lời tự nhận làm router IPv6. Host không được phép phát lời đó." },
    { q: "Storm control làm gì?", choices: ["Giới hạn traffic broadcast, multicast hoặc unicast vượt ngưỡng trên một cổng", "Mã hóa frame", "Bầu root bridge", "Cấp IP"], answer: 0, why: "Nó hãm bão trên cổng. Nó không thay STP và không cấp địa chỉ." },
    { q: "Cổng port security violation shutdown đang err-disabled. Cách mở lại?", choices: ["Chỉ cần cắm lại đúng PC", "shutdown rồi no shutdown sau khi hết MAC lạ", "reload cả tòa nhà", "no spanning-tree"], answer: 1, why: "err-disable giữ cổng tắt cho đến khi bạn tắt và bật lại cổng, trừ khi đã cấu hình recovery tự động." }
  ]
};
