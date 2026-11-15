window.LESSON = {
  id: "3.1",
  title: "Đọc bảng định tuyến",
  exam: "3.1 — Interpret a routing table",
  keywords: ["longest prefix", "AD", "metric", "gateway of last resort"],
  objectives: [
    "Đọc một dòng route: mã giao thức, prefix, mask, AD, metric, next hop",
    "Chọn next hop của một IP bằng longest prefix match trước, rồi mới tới AD",
    "Nói khi nào gói rơi xuống default route, và khi nào bị loại vì không có đường"
  ],
  opener: "Bảng định tuyến là tấm bản đồ router chịu trách nhiệm. Nó không ghi mọi ngõ của thành phố. Nó ghi những mạng nó biết, cửa nào để đi tới mạng đó, và nó tin lời ai. Đọc được tấm bản đồ này thì static route, OSPF và ACL phía sau chỉ là cách thêm hoặc chặn một dòng.",
  blocks: [
    { type: "h2", text: "Giải phẫu một dòng" },
    { type: "cli", title: "Bảng của R1", code: "R1# show ip route\nGateway of last resort is 203.0.113.1 to network 0.0.0.0\n\nS*   0.0.0.0/0 [1/0] via 203.0.113.1\n     10.0.0.0/8 is variably subnetted, 4 subnets, 3 masks\nC       10.1.1.0/24 is directly connected, GigabitEthernet0/0\nL       10.1.1.1/32 is directly connected, GigabitEthernet0/0\nO       10.1.2.0/24 [110/2] via 10.1.1.2, 00:03:11, GigabitEthernet0/0\nS       10.9.0.0/16 [1/0] via 10.1.1.2\nS       172.16.5.10/32 [5/0] via 10.1.1.9" },
    { type: "table", headers: ["Ký hiệu", "Nghĩa", "AD mặc định"], rows: [
      ["C", "Connected, mạng của chính cổng", "0"],
      ["L", "Local, đúng địa chỉ trên cổng của router", "0"],
      ["S", "Static, người quản trị gõ tay", "1"],
      ["O", "OSPF", "110"],
      ["S*", "Static đồng thời là gateway of last resort", "1"]
    ] },
    { type: "p", text: "Số trong ngoặc là `[AD/metric]`. AD hỏi: nếu nhiều nguồn cùng kể về một prefix y hệt, tin ai? Số AD nhỏ hơn được tin. Metric hỏi: trong cùng một giao thức, đường nào gần hơn? OSPF metric 2 gần hơn metric 20. Đừng so metric của OSPF với metric của một giao thức khác." },
    { type: "h2", text: "Thứ tự chọn, không được đảo" },
    { type: "ol", items: [
      "Longest prefix match: dòng nào cụ thể nhất thì thắng, bất kể AD.",
      "Nếu hai dòng cùng độ dài prefix, AD nhỏ hơn thắng.",
      "Nếu cùng giao thức, metric tốt hơn thắng.",
      "Vẫn hòa thì router có thể chia đều, trong giới hạn maximum-paths."
    ] },
    { type: "steps", title: "Năm gói đi qua bảng trên", items: [
      "Tới 10.1.1.1: khớp L /32, chính là cổng router. Không chuyển tiếp đi đâu.",
      "Tới 10.1.1.50: khớp C /24, gửi ARP thẳng trên Gi0/0.",
      "Tới 10.1.2.50: /24 của OSPF cụ thể hơn mọi /16. Next hop 10.1.1.2.",
      "Tới 10.9.1.1: không có /24, khớp static 10.9.0.0/16 qua 10.1.1.2.",
      "Tới 8.8.8.8: không dòng nào khác khớp, dùng 0.0.0.0/0 qua 203.0.113.1.",
      "Tới 172.16.5.10: khớp /32 qua 10.1.1.9. Tới 172.16.5.11: /32 không còn khớp, rơi xuống default route."
    ] },
    { type: "callout", tone: "remember", title: "Một /32 static thắng một /24 OSPF", text: "Không phải vì AD 1 nhỏ hơn AD 110, mà vì /32 dài hơn /24. AD chỉ được so khi prefix bằng nhau. Floating static ở dòng 172.16.5.10 có AD 5, vẫn được lắp vào bảng vì không có nguồn nào khác kể về đúng prefix đó." },
    { type: "lab", title: "Lab 3.1 — Năm gói, không gõ thêm route", goal: "Chỉ dùng bảng trong bài. Viết next hop hoặc chữ delivery cho mỗi đích.", tasks: [
      "10.1.2.9",
      "10.9.255.1",
      "8.8.8.8",
      "172.16.5.10",
      "172.16.5.11"
    ], hint: "Tìm dòng có prefix dài nhất còn khớp. Default chỉ là lưới hứng cuối. /32 không nuốt các địa chỉ hàng xóm.", solution: "10.1.2.9 khớp OSPF 10.1.2.0/24, next hop 10.1.1.2. 10.9.255.1 khớp static 10.9.0.0/16, next hop 10.1.1.2. 8.8.8.8 không khớp dòng nào cụ thể, đi default qua 203.0.113.1. 172.16.5.10 khớp host route /32 qua 10.1.1.9. 172.16.5.11 không còn khớp /32 đó, rơi xuống default qua 203.0.113.1." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Chọn OSPF vì chữ O trông chuyên nghiệp hơn chữ S. Router không có gu thẩm mỹ. Nó chọn prefix dài hơn, rồi AD nhỏ hơn." }
  ],
  terms: [
    { t: "Longest prefix match", d: "Luật chọn dòng khớp dài nhất, xét trước AD." },
    { t: "Administrative distance", d: "Độ tin cậy giữa các nguồn route. Nhỏ hơn thì được tin." },
    { t: "Metric", d: "Chi phí bên trong một giao thức." },
    { t: "Gateway of last resort", d: "Next hop của default route 0.0.0.0/0." }
  ],
  quiz: [
    { q: "AD mặc định của OSPF?", choices: ["1", "20", "110", "120"], answer: 2, why: "OSPF là 110. Static là 1. EIGRP nội bộ 90. RIP 120." },
    { q: "Cùng một đích khớp cả /16 static AD 1 và /24 OSPF AD 110. Dòng nào thắng?", choices: ["Static vì AD nhỏ", "OSPF vì /24 dài hơn", "Dòng nào học trước", "Default route"], answer: 1, why: "Độ dài prefix được xét trước. /24 cụ thể hơn /16." },
    { q: "0.0.0.0/0 dùng khi nào?", choices: ["Khi đích là chính router", "Khi không có prefix cụ thể hơn khớp đích", "Khi metric OSPF bằng 0", "Khi cổng down"], answer: 1, why: "Nó khớp mọi đích nhưng thua mọi dòng dài hơn." },
    { q: "Chữ L cạnh 10.1.1.1/32 nghĩa là gì?", choices: ["Route học từ LLDP", "Địa chỉ local trên cổng router", "Một loop guard", "Route dự phòng AD 5"], answer: 1, why: "L là địa chỉ của chính cổng, /32, dùng để nhận traffic gửi cho router." }
  ]
};
