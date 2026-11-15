window.LESSON = {
  id: "1.4",
  title: "Sửa địa chỉ IPv6 và prefix",
  exam: "1.4 — Troubleshoot IPv6 addressing and prefix",
  keywords: ["EUI-64", "/64", "link-local", "SLAAC"],
  objectives: [
    "Rút gọn và viết lại một địa chỉ IPv6 theo đúng luật, chỉ một lần `::`",
    "Phân loại global unicast, link-local, unique local và multicast",
    "Tự tính interface ID kiểu modified EUI-64 từ một địa chỉ MAC"
  ],
  opener: "IPv6 không phải IPv4 viết dài ra. Nó dài 128 bit, viết bằng hexa, và một LAN gần như luôn là /64. Đề v2.0 không hỏi bạn kể tên cho vui. Nó đưa một địa chỉ sai prefix, sai cách rút gọn, hoặc một máy không có gateway IPv6, rồi hỏi bạn thấy gì.",
  blocks: [
    { type: "h2", text: "Viết cho ngắn mà vẫn đúng" },
    { type: "ol", items: [
      "Mỗi nhóm hexa bỏ các số 0 bên trái: `0db8` thành `db8`. Nhóm `0000` thành `0`.",
      "Một chuỗi các nhóm 0 liên tiếp được thay bằng `::`. Chỉ được thay một chỗ. Hai dấu `::` là địa chỉ không xác định được độ dài.",
      "Chữ hoa hay thường đều được. Khi so sánh, hãy viết thường cho đỡ nhầm."
    ] },
    { type: "steps", title: "Ví dụ: 2001:0db8:0000:0000:0000:0000:0000:0001", items: [
      "Bỏ số 0 đầu: 2001:db8:0:0:0:0:0:1.",
      "Thay một dãy nhóm 0 bằng :: thành 2001:db8::1.",
      "2001::db8::1 sai vì có hai lần ::. 2001:db8:1 cũng sai vì cụt nhóm."
    ] },
    { type: "h2", text: "Bốn loại bạn phải nhìn mặt là ra" },
    { type: "table", headers: ["Loại", "Dải", "Việc"], rows: [
      ["Global unicast", "2000::/3, thường gặp 2001:", "Địa chỉ đi được ra ngoài mạng"],
      ["Link-local", "fe80::/10", "Chỉ sống trên một đường nối, mọi cổng IPv6 đều có"],
      ["Unique local", "fc00::/7, hay dùng fd00::/8", "Như địa chỉ private, không đi ra Internet"],
      ["Multicast", "ff00::/8", "Một nhóm máy. ff02::1 là mọi máy trên link"]
    ] },
    { type: "p", text: "Không có broadcast IPv6. Việc broadcast ngày xưa chuyển cho multicast. Anycast là cùng một địa chỉ unicast gán cho nhiều máy, mạng sẽ đưa bạn tới máy gần. Nó không có một prefix riêng để nhìn. Prefix LAN chuẩn là /64. /64 cũng là điều kiện để SLAAC tự nhét địa chỉ cho host. Thấy một LAN để /48 hoặc /120 cho máy người dùng thì hãy nghi người cấu hình." },
    { type: "h2", text: "Modified EUI-64" },
    { type: "p", text: "Máy có thể tự tạo 64 bit host từ MAC. Lấy MAC 48 bit, chèn `fffe` vào giữa, rồi đảo bit universal/local. Bit đó là bit có giá trị 2 trong octet đầu: 0 thành 2, 2 thành 0, theo kiểu XOR với `02`." },
    { type: "steps", title: "MAC 00:1a:2b:3c:4d:5e trên mạng 2001:db8:1::/64", items: [
      "Chèn fffe vào giữa: 001a:2bff:fe3c:4d5e.",
      "Octet đầu 00 XOR 02 thành 02.",
      "Interface ID là 021a:2bff:fe3c:4d5e.",
      "Địa chỉ global: 2001:db8:1::021a:2bff:fe3c:4d5e, viết ngắn 2001:db8:1:0:21a:2bff:fe3c:4d5e.",
      "Link-local cùng cách tính: fe80::21a:2bff:fe3c:4d5e."
    ] },
    { type: "cli", title: "Bật IPv6 trên router lab", code: "R1(config)# ipv6 unicast-routing\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ipv6 address 2001:db8:1::1/64\nR1(config-if)# no shutdown" },
    { type: "p", text: "Thiếu `ipv6 unicast-routing` thì router vẫn có địa chỉ nhưng không chuyển packet IPv6 giúp người khác. Host nhận địa chỉ bằng SLAAC khi nghe router advertisement, hoặc bằng DHCP, hoặc gán tĩnh. Xử lý sự cố: ping được link-local của hàng xóm thì cáp và VLAN còn sống; không ping được global thì nhìn prefix và gateway." },
    { type: "lab", title: "Lab 1.4 — Ba địa chỉ, một MAC", goal: "Làm trên giấy, rồi nếu có router thì gõ cấu hình và `show ipv6 interface brief`.", tasks: [
      "Rút gọn 2001:0db8:00aa:0000:0000:0000:0000:0010. Viết một dạng sai có hai dấu ::.",
      "Từ MAC 00:1a:2b:3c:4d:5e, viết link-local EUI-64.",
      "Hai máy cùng cáp: A là 2001:db8:1::10/64, B là 2001:db8:2::10/64. Chúng có xem nhau là cùng mạng không? Thiếu thứ gì trên router để chúng đi được sang nhau?"
    ], hint: "Cùng /64 thì 64 bit đầu phải giống. 2001:db8:1:: và 2001:db8:2:: khác nhau ở nhóm thứ tư.", solution: "Dạng đúng: 2001:db8:aa::10. Dạng sai ví dụ: 2001:db8:aa::0::10. Link-local: fe80::21a:2bff:fe3c:4d5e. A và B khác prefix /64 nên khác mạng. Router cần ipv6 unicast-routing, mỗi mạng một cổng hoặc một SVI có địa chỉ /64, và mỗi máy có default gateway." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Dùng `::` hai lần cho nhanh. Người đọc không biết mỗi chỗ phải lấp bao nhiêu nhóm 0, nên địa chỉ đó không hợp lệ." }
  ],
  terms: [
    { t: "SLAAC", d: "Host tự tạo địa chỉ từ prefix trong router advertisement." },
    { t: "Link-local", d: "Địa chỉ fe80::/10, chỉ dùng trên một link, không đi qua router." },
    { t: "Modified EUI-64", d: "Cách biến MAC 48 bit thành interface ID 64 bit." },
    { t: "Global unicast", d: "Địa chỉ 2000::/3, định danh một host trên mạng IPv6 công cộng." }
  ],
  quiz: [
    { q: "Dạng rút gọn đúng của 2001:0db8:0000:0000:0000:0000:0000:0001?", choices: ["2001:db8::1", "2001::db8::1", "2001:db8:1", "2001:0db8::1::"], answer: 0, why: "Một lần :: thay cả dãy nhóm 0 ở giữa, và các số 0 đầu nhóm được bỏ." },
    { q: "Prefix nào là chuẩn cho một LAN IPv6 có SLAAC?", choices: ["/48", "/56", "/64", "/96"], answer: 2, why: "/64 dành 64 bit cho interface ID. SLAAC cần đúng độ dài này." },
    { q: "fe80::1 là loại địa chỉ gì?", choices: ["Global unicast", "Link-local", "Multicast", "Loopback IPv4"], answer: 1, why: "fe80::/10 là link-local. ff00::/8 mới là multicast." },
    { q: "MAC 00:1a:2b:3c:4d:5e. Octet đầu của interface ID sau khi đảo bit U/L là gì?", choices: ["00", "02", "ff", "fe"], answer: 1, why: "00 XOR 02 bằng 02. fffe được chèn vào giữa, không đứng ở octet đầu." }
  ]
};
