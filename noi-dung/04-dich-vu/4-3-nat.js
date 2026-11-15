window.LESSON = {
  id: "4.3",
  title: "NAT và PAT",
  exam: "4.3 — Configure NAT/PAT",
  keywords: ["inside", "outside", "overload", "static NAT", "pool"],
  objectives: [
    "Đánh dấu đúng cổng inside và outside trước khi viết luật NAT",
    "Cấu hình PAT để cả phòng dùng một địa chỉ public, và static NAT cho một server cần được gọi từ ngoài",
    "Đọc show ip nat translations để chứng minh một máy trong đã được đổi địa chỉ"
  ],
  opener: "Mạng phòng bạn dùng 192.168.1.0/24. Internet không định tuyến dải đó cho riêng bạn, vì hàng triệu phòng khác cũng đang dùng. NAT đứng ở cửa: khi ra ngoài, nó đổi địa chỉ nguồn thành địa chỉ public của công ty. Khi trả lời về, nó đổi ngược lại. PAT làm việc này cho nhiều máy bằng cách nhớ số cổng.",
  blocks: [
    { type: "h2", text: "Inside là phía nhà, outside là phía phố" },
    { type: "p", text: "Địa chỉ inside local là địa chỉ thật của PC, ví dụ 192.168.1.10. Địa chỉ inside global là địa chỉ public mà Internet nhìn thấy. Trên router, cổng nối LAN là `ip nat inside`. Cổng nối nhà mạng là `ip nat outside`. Quên một trong hai dấu, hoặc dán ngược, là NAT im lặng và rất khó nhìn vì route vẫn đúng." },
    { type: "cli", title: "Cả phòng chia nhau một IP public", code: "R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255\nR1(config)# ip nat inside source list 1 interface GigabitEthernet0/0 overload\nR1(config)# interface GigabitEthernet0/1\nR1(config-if)# ip nat inside\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip address 203.0.113.5 255.255.255.252\nR1(config-if)# ip nat outside" },
    { type: "p", text: "ACL 1 chọn ai được NAT. Wildcard 0.0.0.255 là cả /24. `overload` chính là PAT: nhiều inside local dùng chung 203.0.113.5, mỗi phiên một cổng nguồn khác nhau. Không có overload, một địa chỉ public chỉ phục vụ một máy tại một thời điểm." },
    { type: "h3", text: "Pool khi công ty có nhiều địa chỉ public" },
    { type: "cli", title: "NAT động bằng pool, vẫn overload nếu muốn PAT", code: "R1(config)# ip nat pool RA 203.0.113.10 203.0.113.20 netmask 255.255.255.0\nR1(config)# ip nat inside source list 1 pool RA overload" },
    { type: "h3", text: "Static khi người ngoài phải gọi đúng một server" },
    { type: "cli", title: "Web nội bộ luôn hiện ra là 203.0.113.10", code: "R1(config)# ip nat inside source static 192.168.1.50 203.0.113.10" },
    { type: "p", text: "PAT cho phép người trong đi ra. Nó không cho người ngoài bắt đầu một kết nối tới PC, vì không có luật cố định. Server cần được thấy từ ngoài thì dùng static, và vẫn phải có đường từ Internet tới địa chỉ public đó. `show ip nat translations` hiện từng cặp. `show ip nat statistics` cho biết gói nào được dịch, gói nào trượt. `clear ip nat translation *` xóa bảng động khi bạn vừa sửa ACL và muốn thử lại sạch." },
    { type: "steps", title: "Ví dụ đọc một dòng translation", items: [
      "Inside local 192.168.1.10:50312.",
      "Inside global 203.0.113.5:50312.",
      "Outside global là địa chỉ web thật, ví dụ 1.1.1.1:443.",
      "Router đã đổi nguồn 192.168.1.10 thành 203.0.113.5 và nhớ cổng 50312 để biết trả lời thuộc về PC nào."
    ] },
    { type: "lab", title: "Lab 4.3 — Một địa chỉ public, một server cố định", goal: "R1 có LAN 192.168.1.0/24 ở Gi0/1 và WAN 203.0.113.5/30 ở Gi0/0. Một PC .10 và một server web .50.", tasks: [
      "PAT cả LAN ra Gi0/0.",
      "Static NAT server .50 thành 203.0.113.10 nếu bạn giả lập có thêm địa chỉ đó, hoặc ghi rõ vì sao một /30 không đủ chỗ cho thêm .10.",
      "Từ PC, ping ra ngoài. show ip nat translations phải có dòng ICMP hoặc TCP của .10.",
      "Bỏ chữ overload, ping từ hai PC và ghi điều gì xảy ra với PC thứ hai."
    ], hint: "203.0.113.5/30 chỉ có hai địa chỉ dùng được trong mạng WAN. Một địa chỉ là nhà mạng, một là router. Muốn thêm public cho server thì cần một mạng public rộng hơn hoặc một thiết kế khác. Lab có thể để static sang chính địa chỉ khác nếu bạn gán thêm IP cho cổng outside.", solution: "PAT: access-list 1 permit 192.168.1.0 0.0.0.255, ip nat inside source list 1 interface Gi0/0 overload, nat inside trên LAN, nat outside trên WAN. Translation của PC .10 hiện inside global là 203.0.113.5. Một /30 không chứa thêm 203.0.113.10; địa chỉ đó thuộc mạng khác. Để lab static, gán cho outside một mạng ví dụ 203.0.113.0/28 rồi static 192.168.1.50 203.0.113.10. Bỏ overload thì địa chỉ public chỉ giữ một phiên inside; PC thứ hai không được dịch." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Viết ACL NAT bằng subnet mask 255.255.255.0. IOS hiểu đó là wildcard và gần như không khớp đúng mạng bạn tưởng. NAT dùng wildcard: 0.0.0.255." }
  ],
  terms: [
    { t: "Inside local", d: "Địa chỉ riêng của host trước khi bị dịch." },
    { t: "Inside global", d: "Địa chỉ public đại diện cho host đó với Internet." },
    { t: "PAT / overload", d: "Nhiều host trong chia một địa chỉ public, phân biệt bằng số cổng." },
    { t: "Static NAT", d: "Một cặp địa chỉ cố định, để người ngoài gọi vào được." }
  ],
  quiz: [
    { q: "PAT overload cho phép điều gì?", choices: ["Một host trong chiếm nhiều IP public cùng lúc làm mặc định", "Nhiều host trong chia một IP public nhờ số cổng", "Bỏ được default gateway", "Mã hóa gói"], answer: 1, why: "overload nhớ cổng nguồn đã đổi để ghép phiên." },
    { q: "Cổng nối PC phải mang lệnh nào?", choices: ["ip nat outside", "ip nat inside", "ip nat pool", "ip nat trunk"], answer: 1, why: "Inside là phía địa chỉ riêng. Outside là phía public." },
    { q: "Vì sao server public cần static NAT chứ không chỉ PAT?", choices: ["PAT không có bảng", "Người ngoài không biết cổng động nào đang trỏ vào server", "Static NAT tắt được firewall", "PAT chỉ chạy IPv6"], answer: 1, why: "PAT tạo cặp khi người trong đi ra. Kết nối do người ngoài bắt đầu cần một cặp cố định." },
    { q: "ACL cho NAT của mạng 192.168.1.0/24 viết wildcard nào?", choices: ["255.255.255.0", "0.0.0.255", "0.0.0.0", "255.255.255.255"], answer: 1, why: "Wildcard đảo mask. /24 là 0.0.0.255." }
  ]
};
