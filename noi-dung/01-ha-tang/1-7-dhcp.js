window.LESSON = {
  id: "1.7",
  title: "Sửa DHCP client, server và relay",
  exam: "1.7 — Troubleshoot DHCPv4 client, server, and relay",
  keywords: ["DORA", "helper-address", "excluded-address", "pool"],
  objectives: [
    "Kể đúng thứ tự Discover, Offer, Request, Ack và nói gói nào là broadcast",
    "Cấu hình router làm DHCP server cho một LAN và làm relay khi server ở mạng khác",
    "Từ một máy 169.254, khoanh được lỗi pool, helper, hay cổng client"
  ],
  opener: "DHCP là người phát số nhà. Máy mới vào mạng la lên tôi cần một địa chỉ. Server trả một tờ giấy ghi IP, mask, gateway và DNS. Nếu server ở bên kia router, tiếng la broadcast sẽ chết ở router trừ khi router được bảo chuyển giúp. Buổi trước bạn thấy 169.254. Hôm nay bạn sửa cái máy lẽ ra phải trả lời.",
  blocks: [
    { type: "h2", text: "Bốn bước DORA" },
    { type: "ol", items: [
      "Discover: client broadcast, hỏi có server nào không.",
      "Offer: server đề nghị một địa chỉ.",
      "Request: client broadcast, xin đúng địa chỉ đó để server khác biết mà rút đề nghị.",
      "Ack: server xác nhận. Client bắt đầu dùng địa chỉ."
    ] },
    { type: "p", text: "Thiếu Ack thì client chưa được cấp. Thấy Discover lặp lại mà không có Offer thì server không nghe, hoặc tiếng la không được relay, hoặc pool hết, hoặc một tính năng bảo mật đang vứt gói. DHCP snooping ở buổi 4.7 chính là thứ hay vứt gói này nếu cổng uplink quên trust." },
    { type: "cli", title: "Router vừa làm gateway vừa làm DHCP server", code: "R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10\nR1(config)# ip dhcp pool LAN10\nR1(dhcp-config)# network 192.168.10.0 255.255.255.0\nR1(dhcp-config)# default-router 192.168.10.1\nR1(dhcp-config)# dns-server 1.1.1.1\nR1(dhcp-config)# exit\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip address 192.168.10.1 255.255.255.0\nR1(config-if)# no shutdown" },
    { type: "p", text: "`excluded-address` giữ lại địa chỉ gateway và máy in gán tĩnh. Quên dòng này, server có thể phát trúng 192.168.10.1 cho một laptop và hai máy đánh nhau. Pool phải đúng mạng của cổng client đang cắm. `default-router` là gateway sẽ ghi vào máy, không phải một địa chỉ ở mạng khác." },
    { type: "h2", text: "Khi server ở xa: relay" },
    { type: "topo", title: "Client và server cách một router", code: "PC VLAN 10 -- SW -- Gi0/0 R1 Gi0/1 -- 10.0.0.0/24 -- DHCP server 10.0.0.10" },
    { type: "cli", title: "Helper trên cổng hướng về client", code: "R1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip helper-address 10.0.0.10" },
    { type: "p", text: "Helper biến broadcast DHCP thành unicast gửi tới 10.0.0.10, và nói với server rằng client thuộc mạng của Gi0/0. Đặt helper trên cổng hướng về server là đặt sai cửa. Server ở xa cũng cần một pool cho 192.168.10.0/24, không phải pool của mạng nó đang ngồi. Router client thì gõ `ip address dhcp` trên cổng muốn xin địa chỉ." },
    { type: "cli", title: "Xem server có phát thật không", code: "R1# show ip dhcp pool\nR1# show ip dhcp binding\nR1# show ip dhcp conflict" },
    { type: "table", headers: ["Bạn thấy", "Nghĩ tới"], rows: [
      ["Binding trống, client 169.254", "Discover không tới server: helper, VLAN, snooping, cáp"],
      ["Pool 100% leased", "Hết địa chỉ, rút ngắn lease hoặc nới mạng"],
      ["Client có IP nhưng không ra ngoài", "default-router trong pool sai hoặc DNS sai"],
      ["Conflict", "Một máy tĩnh đang chiếm địa chỉ pool định phát"]
    ] },
    { type: "lab", title: "Lab 1.7 — Hai mạng, một server", goal: "Packet Tracer: R1 nối LAN 192.168.10.0/24 và một server 10.0.0.10. Đừng để R1 làm DHCP server. Hãy để server làm, R1 chỉ relay.", tasks: [
      "Tạo trên server một pool 192.168.10.0/24, gateway 192.168.10.1, DNS 1.1.1.1, trừ địa chỉ .1.",
      "Đặt helper đúng cổng trên R1.",
      "PC để DHCP. Nếu nó vẫn 169.254, viết ba lệnh show hoặc ba chỗ cấu hình bạn sẽ kiểm tra.",
      "Sửa pool để gateway thành 10.0.0.10 một cách cố ý. PC nhận IP xong sẽ hỏng việc gì?"
    ], hint: "Helper nằm trên interface cùng subnet với PC. Server phải có route về 192.168.10.0/24.", solution: "Helper: interface Gi phía LAN, ip helper-address 10.0.0.10. Nếu vẫn 169.254: show ip interface brief xem cổng up, kiểm tra helper có đúng cổng không, server có route về mạng LAN không, pool có đúng 192.168.10.0 không. Gateway sai thành 10.0.0.10 khiến PC nhận IP 192.168.10.x nhưng cửa ra nằm khác mạng, nên không đi đâu được dù đã có địa chỉ." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Cấp được IP rồi tuyên bố DHCP xong. Hãy nhìn luôn default-router và dns-server. Một pool thiếu gateway tạo ra những máy ping được hàng xóm và không bao giờ ra khỏi VLAN." }
  ],
  terms: [
    { t: "DORA", d: "Discover, Offer, Request, Ack. Bốn bước xin địa chỉ." },
    { t: "DHCP pool", d: "Tập địa chỉ và các thông số server được phép phát." },
    { t: "ip helper-address", d: "Lệnh biến router thành relay, đặt ở cổng phía client." },
    { t: "Excluded address", d: "Địa chỉ bị cấm phát, dành cho gateway và máy gán tĩnh." }
  ],
  quiz: [
    { q: "Thứ tự đúng của DHCP?", choices: ["Offer, Discover, Ack, Request", "Discover, Offer, Request, Ack", "Request, Discover, Offer, Ack", "Ack, Offer, Request, Discover"], answer: 1, why: "Client hỏi trước, server đề nghị, client xin, server chốt." },
    { q: "Lệnh relay đúng là gì?", choices: ["ip dhcp relay 10.0.0.10", "ip helper-address 10.0.0.10", "dhcp server 10.0.0.10", "ip forward dhcp 10.0.0.10"], answer: 1, why: "Trên IOS, relay là ip helper-address đặt dưới interface phía client." },
    { q: "Vì sao phải excluded-address địa chỉ của chính router?", choices: ["Để router khỏi chạy OSPF", "Để server không phát địa chỉ gateway cho một PC", "Để tắt NAT", "Để bật IPv6"], answer: 1, why: "Trùng địa chỉ gateway là sự cố khó nhìn, vì lúc thì được lúc mất tùy máy nào lên trước." },
    { q: "Client vẫn 169.254, show ip dhcp binding trên server không có gì mới. Kết luận sát?", choices: ["DNS sai", "Lời xin DHCP không tới được server hoặc server từ chối pool", "Default route của Internet hỏng", "WPA3 sai"], answer: 1, why: "Không có binding mới nghĩa là server không hoàn tất một lần cấp. Nhìn đường Discover trước." }
  ]
};
