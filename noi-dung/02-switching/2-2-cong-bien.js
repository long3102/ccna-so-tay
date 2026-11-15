window.LESSON = {
  id: "2.2",
  title: "Cấu hình cổng cho máy đầu cuối",
  exam: "2.2 — Edge-host connectivity",
  keywords: ["voice VLAN", "PoE", "access point", "IoT"],
  objectives: [
    "Viết cấu hình access cho PC, máy in, điện thoại IP và thiết bị cần nguồn trên cáp",
    "Chọn access hoặc trunk cho AP đứng một mình và AP gắn controller",
    "Giữ cổng edge hết sức ít quyền: đúng VLAN, PortFast, không trở thành đường trunk vô tình"
  ],
  opener: "Cổng xuống máy người dùng là chỗ lạ nhất tòa nhà. Hôm nay là PC, ngày mai có người cắm thêm một switch mua ở cửa hàng. Buổi này chọn thuộc tính cổng theo đúng loài thiết bị, để máy được vào đúng VLAN và không được quyền hơn mức đó.",
  blocks: [
    { type: "h2", text: "PC, máy in, IoT" },
    { type: "p", text: "Những máy này cần một access VLAN. Máy in và camera thường gán IP tĩnh hoặc reservation DHCP, nhưng cổng switch vẫn chỉ là access. IoT không được ngồi chung VLAN với kế toán chỉ vì cùng một loại dây. PortFast cho cổng edge lên forwarding ngay. Buổi 2.5 sẽ thêm BPDU guard để nếu ai cắm switch lạ thì cổng tắt." },
    { type: "h2", text: "Điện thoại IP ngồi giữa PC và switch" },
    { type: "p", text: "Cáp từ switch vào điện thoại, cáp từ điện thoại ra PC. Điện thoại cần một voice VLAN, PC giữ data VLAN. Switch gửi CDP hoặc LLDP để điện thoại biết voice VLAN nào. PoE cấp điện trên chính sợi cáp, nên điện thoại và AP không cần cục nguồn riêng." },
    { type: "cli", title: "Một cổng vừa thoại vừa máy tính", code: "SW1(config)# interface gi1/0/5\nSW1(config-if)# switchport mode access\nSW1(config-if)# switchport access vlan 10\nSW1(config-if)# switchport voice vlan 30\nSW1(config-if)# spanning-tree portfast\nSW1(config-if)# power inline auto" },
    { type: "p", text: "`power inline never` cắt nguồn khi cổng đó không được phép nuôi thiết bị. Chuẩn thường gặp: 802.3af khoảng 15 W, 802.3at khoảng 30 W, 802.3bt cao hơn cho AP đời mới. `show power inline` nói cổng đang cấp bao nhiêu. Hết ngân sách nguồn của switch thì thiết bị sau không sáng dù cấu hình VLAN đúng." },
    { type: "h2", text: "Access point và máy chủ ảo" },
    { type: "table", headers: ["Thiết bị", "Cổng switch thường là", "Vì"], rows: [
      ["AP một mình, một SSID", "Access", "Một VLAN người dùng"],
      ["AP một mình, nhiều SSID map nhiều VLAN", "Trunk", "AP tự tag theo SSID"],
      ["AP gắn WLC, dữ liệu chạy trong CAPWAP", "Access ở VLAN quản trị", "Traffic người dùng đã được đóng ống về controller"],
      ["Máy chủ ảo hóa nhiều VLAN", "Trunk", "Switch ảo cần đưa nhiều VLAN ra ngoài"],
      ["Tủ thiết bị có hai cổng LACP", "Port-channel", "Máy chủ hoặc appliance chịu được LACP"]
    ] },
    { type: "callout", tone: "remember", title: "Đừng để cổng edge tự thương lượng trunk", text: "`switchport mode access` viết tường minh. Một cổng để dynamic có thể bị thuyết phục thành trunk, và lúc đó mọi VLAN trên switch đi xuống bàn nhân viên." },
    { type: "lab", title: "Lab 2.2 — Bàn làm việc của một nhân viên", goal: "Một cổng switch, một IP phone, phía sau phone là PC. VLAN dữ liệu 10, VLAN thoại 30. AP văn phòng có ba SSID map ba VLAN thì viết riêng loại cổng.", tasks: [
      "Viết đủ lệnh cho cổng điện thoại, gồm voice VLAN và PoE để auto.",
      "PC vẫn phải ở VLAN 10. Nói frame của PC và frame của phone khác nhau thế nào trên đường về switch.",
      "Viết loại cổng cho AP ba SSID. Giải thích vì sao không dùng cùng mẫu lệnh của cái điện thoại."
    ], hint: "Phone tách VLAN bằng voice VLAN và tag. AP nhiều SSID cần mang nhiều VLAN nên là trunk, kèm danh sách allowed.", solution: "Cổng phone: mode access, access vlan 10, voice vlan 30, portfast, power inline auto. PC không tag, ở VLAN 10. Phone tag VLAN 30. AP ba SSID: switchport mode trunk, allowed đúng ba VLAN đó, không bật voice VLAN như một điện thoại. Nếu AP là loại CAPWAP chỉ cần VLAN quản trị thì dùng access, và bài phải nói rõ điều đó." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Bật trunk cho mọi cổng cho chắc. Cổng xuống PC mà trunk là mở cả tòa nhà cho một máy. Access là mặc định đúng cho host một VLAN." }
  ],
  terms: [
    { t: "Voice VLAN", d: "VLAN dành cho điện thoại IP cắm trước PC." },
    { t: "PoE", d: "Cấp điện qua cáp Ethernet cho phone, AP, camera." },
    { t: "CAPWAP", d: "Đường ống giữa AP và wireless controller, thường khiến cổng AP chỉ cần VLAN quản trị." },
    { t: "PortFast", d: "Đưa cổng edge vào forwarding ngay vì phía sau không phải switch." }
  ],
  quiz: [
    { q: "Lệnh nào tách thoại IP sang VLAN riêng khi PC cắm sau điện thoại?", choices: ["switchport trunk native vlan", "switchport voice vlan", "power inline never", "channel-group 1 mode passive"], answer: 1, why: "voice vlan là lệnh dành cho kiểu cắm phone-then-PC." },
    { q: "PoE dùng để làm gì?", choices: ["Mã hóa Wi-Fi", "Cấp điện cho thiết bị trên cáp Ethernet", "Tăng tốc độ lên 10 Gbps", "Chặn BPDU"], answer: 1, why: "Điện và dữ liệu đi chung cáp. Tắt bằng power inline never khi không muốn cấp." },
    { q: "AP tự phát ba SSID map ba VLAN, không qua controller. Cổng switch nên là?", choices: ["Access VLAN 1", "Trunk cho phép đúng các VLAN đó", "Routed port không switchport", "Cổng bị shutdown"], answer: 1, why: "Nhiều VLAN từ một AP độc lập cần trunk." },
    { q: "Vì sao cổng xuống PC nên ghim `switchport mode access`?", choices: ["Để bật OSPF", "Để cổng không bị thương lượng thành trunk", "Để thành native VLAN 999", "Để tắt MAC learning"], answer: 1, why: "Access tường minh khóa cổng ở một VLAN và chặn việc biến thành trunk." }
  ]
};
