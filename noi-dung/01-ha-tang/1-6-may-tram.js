window.LESSON = {
  id: "1.6",
  title: "Sửa kết nối trên máy người dùng",
  exam: "1.6 — Troubleshoot wired and wireless client connectivity",
  keywords: ["ipconfig", "APIPA", "nslookup", "ip addr"],
  objectives: [
    "Đọc địa chỉ, mask, gateway và DNS trên Windows, macOS và Linux",
    "Tách một sự cố thành lỗi IP, lỗi gateway, lỗi DNS, hoặc lỗi Wi-Fi",
    "Biết 169.254 nghĩa là DHCP đã thất bại, chưa biết vì sao thất bại"
  ],
  opener: "Người dùng không gọi cho bạn để nói duplex mismatch. Họ nói không vào được mạng. Máy của họ là nơi rẻ nhất để bắt đầu, vì nếu máy đang cầm địa chỉ rác thì mọi lệnh trên router đều đang nhìn sai bệnh nhân.",
  blocks: [
    { type: "h2", text: "Ba hệ điều hành, cùng một bộ câu hỏi" },
    { type: "table", headers: ["Việc cần xem", "Windows", "macOS", "Linux"], rows: [
      ["Địa chỉ, mask, gateway, DNS", "ipconfig /all", "ipconfig getpacket en0 hoặc ifconfig, và scutil --dns", "ip addr và resolvectl status"],
      ["Có đường ra gateway không", "ping địa chỉ gateway", "ping địa chỉ gateway", "ping địa chỉ gateway"],
      ["Đi được bao xa", "tracert 8.8.8.8", "traceroute 8.8.8.8", "traceroute 8.8.8.8"],
      ["Tên có ra số không", "nslookup example.com", "nslookup example.com", "nslookup hoặc dig example.com"],
      ["Wi-Fi đang dùng chuẩn gì", "netsh wlan show interfaces", "Giữ phím Option rồi bấm biểu tượng Wi-Fi", "nmcli dev wifi"]
    ] },
    { type: "p", text: "Trên macOS đời mới, tên cổng có thể là en0. Trên Linux, tên có thể là eth0 hoặc ens160. Đừng thuộc tên cổng, hãy tìm dòng có địa chỉ inet." },
    { type: "h2", text: "Bốn kết quả và ý nghĩa" },
    { type: "ol", items: [
      "Địa chỉ 169.254.x.x, mask 255.255.0.0, không gateway: máy để DHCP nhưng không nhận được trả lời. APIPA là triệu chứng, không phải nguyên nhân. Nguyên nhân có thể là cáp, VLAN, relay, hoặc pool hết.",
      "Có IP đúng mạng, ping gateway được, ping 8.8.8.8 được, ping tên miền không được: đường đi còn, DNS hỏng.",
      "Có IP, không ping được gateway: sai mask, sai VLAN, sai cổng, hoặc gateway tắt.",
      "Wi-Fi không hiện kết nối dù mật khẩu đúng: lệch chuẩn bảo mật, sai SSID, tín hiệu quá yếu, hoặc AP từ chối vì sai VLAN quản trị."
    ] },
    { type: "steps", title: "Ví dụ: laptop Windows của kế toán", items: [
      "`ipconfig /all` cho Wireless LAN adapter: 169.254.23.4, DHCP Enabled Yes, không có DHCP Server, không Default Gateway.",
      "Máy bên cạnh cùng Wi-Fi vào mạng bình thường. Vậy AP và DHCP chưa chết hoàn toàn.",
      "Nhìn tiếp `netsh wlan show interfaces`. Máy này đang dính một SSID khách, không phải SSID nhân viên.",
      "SSID khách cố ý không có DHCP nội bộ. Việc cần làm là quên mạng khách và nối lại SSID đúng, chưa cần đụng router."
    ] },
    { type: "callout", tone: "remember", title: "Thứ tự rẻ tiền", text: "Địa chỉ của máy, rồi ping gateway, rồi ping một IP public, rồi ping một cái tên. Mỗi bước loại một tầng. Đổi gateway trước khi xem địa chỉ máy là nhảy cóc." },
    { type: "lab", title: "Lab 1.6 — Ba phiếu từ helpdesk", goal: "Viết câu kết luận và một lệnh sẽ gõ tiếp. Không sửa server ở buổi này.", tasks: [
      "Windows: IP 192.168.1.50, mask 255.255.255.0, gateway 192.168.1.1, DNS trống. Ping 192.168.1.1 được, ping 1.1.1.1 được, mở trang web bằng tên thì không.",
      "Linux: `ip addr` ra inet 10.0.5.20/24, `ip route` không có default. Ping 10.0.5.1 thất bại.",
      "macOS: IP 172.16.8.15/24, gateway 172.16.8.1 ping được, mạng Wi-Fi hiện WPA2 trong khi AP công ty đã chuyển WPA3-only. Người dùng chắc chắn gõ đúng passphrase cũ."
    ], hint: "Tách DNS, gateway, và chuẩn Wi-Fi. Ping một IP mà được thì đừng nghi cáp nữa.", solution: "Phiếu 1: thiếu DNS. Hỏi DHCP option hoặc gán DNS tạm, kiểm bằng nslookup. Phiếu 2: không có default route và không tới được gateway cùng mạng, nên kiểm mask thực tế, VLAN và cáp; thiếu dòng default là lỗi cấu hình máy hoặc DHCP không đưa option gateway. Phiếu 3: lệch chuẩn bảo mật. Máy cần được cập nhật để nói WPA3, hoặc AP cần một SSID chuyển tiếp. Passphrase đúng không cứu được sai giao thức." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Thấy ping tên miền thất bại và kết luận đứt Internet. Hãy ping một IP số trước. Nhiều sự cố chỉ là một DNS server chết." }
  ],
  terms: [
    { t: "APIPA", d: "169.254.0.0/16, địa chỉ máy Windows tự gán khi DHCP im lặng." },
    { t: "ipconfig /all", d: "Bản đầy đủ trên Windows, gồm DNS, DHCP và MAC." },
    { t: "nslookup", d: "Hỏi thử một tên miền có được DNS trả về địa chỉ không." },
    { t: "Default route trên host", d: "Đường 0.0.0.0/0 trỏ tới gateway. Không có dòng này thì máy không biết cửa ra." }
  ],
  quiz: [
    { q: "Lệnh Windows nào hiện cả DNS và MAC?", choices: ["ipconfig", "ipconfig /all", "tracert", "netstat -r"], answer: 1, why: "`ipconfig` rút gọn dễ thiếu DNS. `/all` mới đủ để xử lý sự cố." },
    { q: "169.254.8.8 trên laptop nghĩa là gì?", choices: ["Địa chỉ public hợp lệ", "DHCP không cấp được địa chỉ", "Đang dùng IPv6 global", "Mask /30"], answer: 1, why: "Đây là APIPA. Máy đã bỏ cuộc việc xin DHCP." },
    { q: "Ping 1.1.1.1 được, ping cisco.com không được. Sửa hướng nào?", choices: ["Thay cáp", "Kiểm tra DNS", "Bật PortFast", "Đổi kênh Wi-Fi 1 thành 2"], answer: 1, why: "Đường IP còn sống. Cái chết là phép đổi tên thành số." },
    { q: "AP WPA3-only, laptop chỉ hỗ trợ WPA2, mật khẩu gõ đúng. Kết quả?", choices: ["Vào bình thường vì mật khẩu đúng", "Không kết nối được vì lệch giao thức", "Vào nhưng chỉ có IPv6", "Nhận 169.254 rồi vẫn dùng được web"], answer: 1, why: "Hai bên phải thống nhất chuẩn bảo mật trước khi bàn tới IP." }
  ]
};
