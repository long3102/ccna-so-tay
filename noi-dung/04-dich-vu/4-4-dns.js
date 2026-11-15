window.LESSON = {
  id: "4.4",
  title: "Chẩn đoán bản ghi DNS",
  exam: "4.4 — Diagnose DNS records",
  keywords: ["A", "AAAA", "CNAME", "MX", "NS", "PTR"],
  objectives: [
    "Chọn đúng loại bản ghi cho web IPv4, web IPv6, bí danh, thư, name server và tra ngược",
    "Dùng nslookup hoặc dig để chứng minh một tên đang trỏ sai",
    "Tách sự cố DNS khỏi sự cố đường truyền bằng một ping tới địa chỉ số"
  ],
  opener: "Người dùng nói trang web chết. Bạn ping địa chỉ IP của trang thì sống, ping cái tên thì không. Lúc đó đường truyền đang khỏe và danh bạ đang sai. DNS là danh bạ: tên bên trái, thứ người ta cần bên phải. Mỗi loại bản ghi trả về một loại thứ khác nhau.",
  blocks: [
    { type: "h2", text: "Sáu loại trong đề" },
    { type: "table", headers: ["Bản ghi", "Trả về", "Ví dụ"], rows: [
      ["A", "Một IPv4", "www.example.com → 203.0.113.10"],
      ["AAAA", "Một IPv6", "www.example.com → 2001:db8::10"],
      ["CNAME", "Một tên khác, không phải địa chỉ", "shop.example.com → www.example.com"],
      ["MX", "Máy nhận thư, kèm số ưu tiên", "example.com → mail.example.com ưu tiên 10"],
      ["NS", "Máy chủ tên có thẩm quyền với miền", "example.com → ns1.example.com"],
      ["PTR", "Tên ứng với một địa chỉ, tra ngược", "10.113.0.203.in-addr.arpa → www.example.com"]
    ] },
    { type: "p", text: "A và AAAA có thể cùng tồn tại. Máy thích IPv6 sẽ hỏi AAAA trước. CNAME là bí danh: sửa địa chỉ ở một chỗ, các bí danh đi theo. Đừng trỏ CNAME vào một CNAME thành một chuỗi dài vô ích, và đừng để MX trỏ vào CNAME nếu bạn có thể trỏ vào tên có bản ghi A. NS nói ai mới là người được quyền trả lời về miền. PTR thiếu làm nhiều máy thư nghi ngờ thư của bạn." },
    { type: "steps", title: "Ví dụ: shop.example.com mở nhầm trang cũ", items: [
      "ping 203.0.113.10 được. Đường tới web mới còn sống.",
      "nslookup shop.example.com trả CNAME www.example.com, rồi www trả A 198.51.100.20.",
      "Web mới của công ty là 203.0.113.10. Bản ghi A của www đang trỏ số cũ.",
      "Sửa A của www. Đợi TTL. Trong thời gian TTL, máy người dùng có thể vẫn nhớ số cũ. Đó không phải là router hỏng."
    ] },
    { type: "cli", title: "Hỏi một tên", code: "C:\\> nslookup www.example.com\nServer:  dns.lab.local\nAddress:  10.1.1.53\n\nName:    www.example.com\nAddress:  203.0.113.10" },
    { type: "p", text: "Dòng Server là máy DNS mà máy bạn đang hỏi, không phải máy web. Nếu Server im, sự cố là resolver nội bộ hoặc đường tới nó. Nếu Server trả lời nhưng Address sai, sự cố là dữ liệu trong vùng DNS. Trên router, `ip name-server 1.1.1.1` giúp chính router phân giải tên khi cần. Host người dùng nhận DNS từ DHCP, buổi 1.7." },
    { type: "lab", title: "Lab 4.4 — Viết vùng cho một công ty nhỏ", goal: "Công ty example.test muốn: web IPv4, web IPv6, tên shop trỏ cùng chỗ với www, thư vào mail.example.test, và một PTR cho địa chỉ web IPv4. Làm trên giấy hoặc trên một DNS server trong Packet Tracer.", tasks: [
      "Liệt kê đúng loại bản ghi cho từng yêu cầu, kèm giá trị ví dụ.",
      "Viết kết quả nslookup bạn mong thấy cho shop.example.test.",
      "Người dùng ping 203.0.113.10 được nhưng trình duyệt báo sai tên. Khoanh bản ghi đáng nghi.",
      "Thư gửi đến example.test bị từ chối vì không có máy nhận. Thiếu loại bản ghi nào?"
    ], hint: "shop không cần địa chỉ riêng nếu nó là bí danh. Thư cần MX, và tên trong MX cần có A hoặc AAAA.", solution: "A www → 203.0.113.10. AAAA www → 2001:db8::10. CNAME shop → www.example.test. MX example.test → mail.example.test priority 10, cộng A mail → một địa chỉ. PTR cho 203.0.113.10 trỏ www. nslookup shop sẽ cho CNAME rồi địa chỉ của www. Trình duyệt sai trong khi IP đúng: A hoặc CNAME đang trỏ tên hoặc số cũ. Thư rơi vì thiếu MX." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nhầm NS với máy chủ web. NS là người giữ danh bạ. A mới là địa chỉ của trang. Sửa NS khi chỉ muốn đổi IP web là đổi luôn người có quyền trả lời." }
  ],
  terms: [
    { t: "A", d: "Tên sang IPv4." },
    { t: "AAAA", d: "Tên sang IPv6." },
    { t: "CNAME", d: "Bí danh từ tên này sang tên khác." },
    { t: "MX", d: "Máy nhận thư cho miền." },
    { t: "PTR", d: "Tra từ địa chỉ ra tên." }
  ],
  quiz: [
    { q: "Bản ghi nào map tên sang IPv6?", choices: ["A", "AAAA", "PTR", "NS"], answer: 1, why: "A là IPv4. AAAA là IPv6. Bốn chữ A nhắc 128 bit gấp bốn lần 32 bit." },
    { q: "Thư của một miền được chỉ đường bằng bản ghi nào?", choices: ["CNAME", "MX", "PTR", "AAAA"], answer: 1, why: "MX là mail exchanger, có số ưu tiên khi có nhiều máy thư." },
    { q: "shop trỏ tới www mà không tự cầm địa chỉ. Đó là bản ghi gì?", choices: ["CNAME", "NS", "MX", "PTR"], answer: 0, why: "CNAME là bí danh. Địa chỉ nằm ở bản ghi A hoặc AAAA của tên đích." },
    { q: "Ping IP được, ping tên không được. Hướng xử lý?", choices: ["Thay cáp uplink", "Kiểm tra resolver và bản ghi của tên đó", "Tắt NAT", "Đổi root bridge"], answer: 1, why: "Đường IP còn. Danh bạ hoặc máy DNS đang hỏng." }
  ]
};
