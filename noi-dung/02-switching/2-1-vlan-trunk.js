window.LESSON = {
  id: "2.1",
  title: "Nối switch với switch và router",
  exam: "2.1 — Switch-to-switch and switch-to-router connectivity",
  keywords: ["VLAN", "802.1Q", "native VLAN", "SVI", "LACP"],
  objectives: [
    "Tạo VLAN, gán access, và giải thích vì sao hai VLAN không tự nói chuyện với nhau",
    "Dựng trunk 802.1Q, chọn native VLAN, và đưa một SVI lên để định tuyến",
    "Gom hai cổng bằng LACP và đọc trạng thái bundle"
  ],
  opener: "Một switch không VLAN là một phòng duy nhất: broadcast của ai cũng vọng sang bàn người khác. VLAN dựng tường trong switch. Trunk là cánh cửa cho nhiều phòng đi chung một sợi cáp. SVI là địa chỉ nhà của từng phòng khi switch bắt đầu kiêm việc của router.",
  blocks: [
    { type: "h2", text: "Access là một phòng" },
    { type: "cli", title: "Hai VLAN và một máy thuộc VLAN 10", code: "SW1(config)# vlan 10\nSW1(config-vlan)# name KE_TOAN\nSW1(config-vlan)# vlan 20\nSW1(config-vlan)# name KY_THUAT\nSW1(config-vlan)# exit\nSW1(config)# interface GigabitEthernet1/0/1\nSW1(config-if)# switchport mode access\nSW1(config-if)# switchport access vlan 10\nSW1(config-if)# spanning-tree portfast" },
    { type: "p", text: "VLAN thông thường dùng cho đề này nằm trong dải 1 đến 1005. VLAN 1 là default, đừng dùng nó cho người dùng. Máy ở VLAN 10 không nói chuyện với VLAN 20 dù cắm cùng switch, vì đó là hai broadcast domain. Muốn chúng đi sang nhau cần một cổng lớp 3." },
    { type: "h2", text: "Trunk là nhiều phòng trên một sợi cáp" },
    { type: "p", text: "802.1Q thêm một tag 4 byte vào frame để nói frame này thuộc VLAN nào. Native VLAN là VLAN được đi không tag. Hai đầu trunk phải cùng native VLAN. Lệch native làm traffic rơi nhầm phòng và CDP sẽ báo lỗi. Hãy chọn một VLAN không dùng cho người dùng, rồi cho phép tường minh danh sách VLAN được qua." },
    { type: "cli", title: "Trunk giữa hai switch", code: "SW1(config)# interface GigabitEthernet1/0/24\nSW1(config-if)# switchport mode trunk\nSW1(config-if)# switchport trunk native vlan 999\nSW1(config-if)# switchport trunk allowed vlan 10,20\nSW1(config-if)# switchport nonegotiate" },
    { type: "p", text: "Đầu kia phải lặp lại cùng native và cùng danh sách, hoặc danh sách có chủ đích khác nếu bạn thật sự muốn lọc. `show interfaces trunk` cho biết cổng nào đang trunk, native là gì, VLAN nào được phép và VLAN nào đang forwarding." },
    { type: "h2", text: "Đưa VLAN lên lớp 3" },
    { type: "p", text: "SVI là `interface vlan 10`. Nó lên up/up khi VLAN tồn tại và có ít nhất một cổng access hoặc trunk đang forwarding cho VLAN đó. Trên switch lớp 3, `ip routing` cho phép các SVI chuyển packet giữa các VLAN. Cổng nối router cũng có thể bỏ switching bằng `no switchport`, trở thành cổng routed có IP riêng. Router-on-a-stick là cách cũ: một cổng router tách subinterface, mỗi subinterface một `encapsulation dot1Q`." },
    { type: "cli", title: "SVI làm gateway cho VLAN 10", code: "SW1(config)# ip routing\nSW1(config)# interface vlan 10\nSW1(config-if)# ip address 192.168.10.1 255.255.255.0\nSW1(config-if)# no shutdown" },
    { type: "h2", text: "LACP gom nhiều sợi thành một đường" },
    { type: "p", text: "Hai sợi cáp giữa hai switch mà không gom thì spanning tree sẽ tắt một sợi. EtherChannel dùng LACP để cả hai sợi cùng sống trong một cổng logic. `active` chủ động mời, `passive` chỉ đồng ý khi được mời. Hai đầu passive thì không bao giờ thành bundle. Các cổng thành viên phải cùng tốc độ, duplex, và cùng kiểu access hoặc trunk trước khi gom." },
    { type: "cli", title: "Bundle số 1 bằng LACP", code: "SW1(config)# interface range gi1/0/23-24\nSW1(config-if-range)# switchport mode trunk\nSW1(config-if-range)# channel-group 1 mode active\nSW1(config-if-range)# exit\nSW1(config)# interface port-channel 1\nSW1(config-if)# switchport mode trunk\nSW1(config-if)# switchport trunk allowed vlan 10,20" },
    { type: "p", text: "`show etherchannel summary` nhìn cột PO. Cờ SU nghĩa là bundle lớp 2 đang dùng được, các cổng thành viên có chữ P nghĩa là đã vào bundle. Chữ khác thường là thông số cổng không giống nhau." },
    { type: "lab", title: "Lab 2.1 — Hai phòng, hai switch, một gateway", goal: "Packet Tracer: SW1 và SW2, mỗi bên một PC. PC1 VLAN 10 địa chỉ .10, PC2 VLAN 20 địa chỉ .10. Gateway là SVI trên SW1.", tasks: [
      "Tạo VLAN 10 và 20 trên cả hai switch. Access cho đúng PC.",
      "Nối hai switch bằng hai cáp, gom LACP mode active, trunk allowed 10 và 20, native 999.",
      "Tạo SVI 192.168.10.1/24 và 192.168.20.1/24 trên SW1, bật ip routing.",
      "Ping từ PC1 tới PC2. Nếu fail, kiểm tra lần lượt: VLAN của access, trunk allowed, SVI up, PC có gateway đúng chưa."
    ], hint: "PC2 ở VLAN 20 phải có gateway 192.168.20.1, mask /24. SW2 không cần SVI nếu SW1 là gateway, nhưng SW2 phải có VLAN 20 đang active.", solution: "PC1: 192.168.10.10/24 gateway 192.168.10.1. PC2: 192.168.20.10/24 gateway 192.168.20.1. Trunk mang cả 10 và 20. show etherchannel summary ra SU. show ip interface brief trên SW1 cho hai SVI up/up. Ping chéo VLAN đi qua SVI của SW1. Quên ip routing trên một số switch lớp 3 thì SVI có IP nhưng không chuyển giùm." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Cấu hình trunk rất đẹp trên interface vật lý rồi gom EtherChannel, nhưng port-channel lại về access VLAN 1. Lệnh có hiệu lực với bundle là lệnh trên interface port-channel. Hãy show trunk và nhìn tên Po1, đừng chỉ nhìn Gi1/0/24." }
  ],
  terms: [
    { t: "Access port", d: "Cổng một VLAN, không tag, dành cho host." },
    { t: "802.1Q", d: "Cách gắn tag VLAN lên frame khi qua trunk." },
    { t: "Native VLAN", d: "VLAN đi không tag trên trunk. Hai đầu phải giống nhau." },
    { t: "SVI", d: "Interface vlan, cổng ảo lớp 3 của một VLAN." },
    { t: "LACP", d: "Giao thức gom cổng. active với active, hoặc active với passive." }
  ],
  quiz: [
    { q: "Frame native VLAN đi trên trunk 802.1Q ra sao?", choices: ["Hai lớp tag", "Không tag", "Bị mã hóa AES", "Chỉ đi được một chiều"], answer: 1, why: "Native VLAN untagged. VLAN khác được gắn tag 802.1Q." },
    { q: "Hai cổng LACP để passive và passive. Bundle?", choices: ["Lên ngay", "Không thương lượng được", "Tự chuyển sang trunk VLAN 1", "Thành routed port"], answer: 1, why: "Passive không chủ động gửi lời mời. Cần một đầu active." },
    { q: "SVI VLAN 10 vẫn down/down dù đã gán IP. Nguyên nhân hay gặp?", choices: ["Chưa có cổng nào của VLAN 10 đang up và forwarding", "Thiếu WPA3", "Prefix là /24", "Đã bật PortFast"], answer: 0, why: "SVI cần VLAN tồn tại và có đường lớp 2 đang sống, nếu không nó không up." },
    { q: "Vì sao không nên để người dùng ở VLAN 1 và native VLAN cũng là 1?", choices: ["VLAN 1 không chuyển được frame", "Traffic không tag dễ trộn với traffic mặc định, khó kiểm soát", "LACP cấm VLAN 1", "IPv4 không chạy trên VLAN 1"], answer: 1, why: "Tách native VLAN sang một VLAN không dùng, và đưa user sang VLAN riêng." }
  ]
};
