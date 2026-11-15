window.LESSON = {
  id: "0.1",
  title: "Mạng là gì, và cách học bộ này",
  exam: "Nền tảng, học trước miền 1.0",
  keywords: ["host", "switch", "router", "SOHO", "access", "core"],
  objectives: [
    "Chỉ đúng host, switch, router, access point và firewall trong một sơ đồ nhà hoặc văn phòng nhỏ",
    "Phân biệt mạng SOHO, hai tầng và ba tầng bằng lời của chính bạn",
    "Biết một buổi trong sổ tay này học theo thứ tự nào, và lab làm ở đâu"
  ],
  opener: "Bạn gửi một tấm ảnh cho người ở thành phố khác. Tấm ảnh không nhảy một phát tới điện thoại của họ. Nó bị cắt nhỏ, ghi địa chỉ, rồi đi qua modem, nhà mạng, nhiều router, và cuối cùng mới vào mạng của người nhận. CCNA là nghề đọc được đường đi đó và sửa khi nó đứt.",
  blocks: [
    { type: "h2", text: "Bốn thứ bạn sẽ gặp suốt khóa" },
    { type: "p", text: "Host là máy đầu cuối: laptop, điện thoại, máy in, camera, máy chủ. Host tạo dữ liệu và là nơi dữ liệu dừng lại. Switch nối các host trong cùng một mạng cục bộ và chuyển frame theo địa chỉ MAC. Router nối các mạng khác nhau và chuyển packet theo địa chỉ IP. Access point đưa host không dây vào switch. Firewall quyết định traffic nào được phép đi qua." },
    { type: "flow", items: [
      { label: "Laptop", note: "host" },
      { label: "Switch", note: "cùng LAN" },
      { label: "Router", note: "sang mạng khác" },
      { label: "Internet", note: "nhiều router" }
    ] },
    { type: "callout", tone: "remember", title: "Một câu để khỏi lẫn", text: "Switch nghĩ bằng MAC, trong một mạng. Router nghĩ bằng IP, giữa các mạng. Access point không thay việc của router; nó chỉ là cửa không dây vào switch." },
    { type: "h2", text: "Ba kiểu sơ đồ đề thi hay nhắc" },
    { type: "p", text: "SOHO là mạng nhà hoặc văn phòng rất nhỏ. Một hộp của nhà mạng thường ôm luôn modem, router, switch và Wi-Fi. Hai tầng gồm lớp access, nơi cắm máy người dùng, và lớp distribution/core gộp lại, nơi định tuyến và chính sách. Ba tầng tách thêm lớp core chỉ để chuyển thật nhanh giữa các khối distribution. Trung tâm dữ liệu lớn còn dùng spine-leaf: mọi leaf nối lên mọi spine, đường đi ngắn và đều." },
    { type: "table", headers: ["Kiểu", "Gặp ở đâu", "Bạn nhớ gì"], rows: [
      ["SOHO", "Nhà, quán, văn phòng vài người", "Một hộp làm nhiều việc, dễ có một điểm chết"],
      ["Hai tầng", "Công ty nhỏ và vừa", "Access ở tầng, khối lõi vừa định tuyến vừa nối WAN"],
      ["Ba tầng", "Khuôn viên lớn", "Access, distribution, core tách vai"],
      ["Spine-leaf", "Trung tâm dữ liệu", "Leaf xuống máy chủ, spine chỉ nối các leaf"]
    ] },
    { type: "h2", text: "Cách dùng sổ tay này" },
    { type: "ol", items: [
      "Học đúng thứ tự. Buổi sau dùng từ của buổi trước.",
      "Với mỗi lab, tự làm trên giấy hoặc Packet Tracer trước khi mở đáp án.",
      "Tự kiểm dưới 80% thì ở lại buổi đó. Đừng đánh dấu đã học chỉ vì đã kéo tới cuối trang.",
      "Lệnh Cisco trong bài viết cho lab. Mật khẩu mẫu không được đem lên thiết bị thật."
    ] },
    { type: "link", href: "huong-dan.html", label: "Xem cách cài Packet Tracer" },
    { type: "lab", title: "Lab 0.1 — Vẽ mạng đang nuôi bạn", goal: "Bạn không cấu hình gì cả. Bạn tập gọi đúng tên đồ vật.", tasks: [
      "Vẽ nhà bạn: chỗ cáp nhà mạng chui vào, hộp modem hoặc router, các máy đang dùng, máy nào dùng Wi-Fi.",
      "Ghi chữ host cạnh mỗi máy người dùng. Ghi chữ router cạnh hộp đang phát địa chỉ.",
      "Hỏi một người trong nhà: khi Wi-Fi chết nhưng máy bàn vẫn vào mạng được thì hỏng nằm ở đoạn nào trên hình của bạn?"
    ], hint: "Máy bàn đi cáp thẳng tới switch hoặc router. Wi-Fi chết mà máy bàn sống thì access point hoặc băng tần Wi-Fi là nghi phạm đầu, chưa chắc router đã chết.", solution: "Hình mỗi nhà một khác. Đáp án đúng là hình có đủ: đường vào ISP, một thiết bị làm router, các host, và một ghi chú nói Wi-Fi là một cửa vào chứ không phải cả mạng. Nếu bạn chỉ vẽ một đám mây ghi chữ Internet thì làm lại." },
    { type: "callout", tone: "warn", title: "Bẫy của người mới", text: "Gọi mọi hộp có đèn nhấp nháy là router. Hộp đó có thể chỉ là switch. Chưa thấy nó nối hai mạng IP khác nhau thì đừng kết luận." }
  ],
  terms: [
    { t: "Host", d: "Máy tạo hoặc nhận dữ liệu, không có nhiệm vụ chuyển giúp máy khác." },
    { t: "LAN", d: "Mạng cục bộ, thường một nhà hoặc một tầng, nơi switch là trung tâm." },
    { t: "WAN", d: "Đường nối các mặt bằng ở xa nhau, thường do nhà mạng cung cấp." },
    { t: "SOHO", d: "Small office/home office, mạng nhỏ gộp nhiều chức năng trong ít thiết bị." }
  ],
  quiz: [
    { q: "Việc riêng của router, switch không làm thay, là gì?", choices: ["Nhớ địa chỉ MAC của laptop", "Nối các mạng IP khác nhau", "Phát sóng Wi-Fi", "Cấp điện cho điện thoại IP"], answer: 1, why: "Chuyển giữa các mạng IP là việc của router. MAC trong một LAN là việc của switch." },
    { q: "Mạng nhà chỉ có một hộp của nhà mạng, vừa phát Wi-Fi vừa cấp IP, thuộc kiểu nào?", choices: ["Spine-leaf", "Ba tầng", "SOHO", "Core thuần"], answer: 2, why: "Một thiết bị gộp modem, router, switch và AP là sơ đồ SOHO." },
    { q: "Access point đứng ở đâu trong đường đi của một laptop Wi-Fi?", choices: ["Nó thay router để ra Internet", "Nó là cửa không dây đưa laptop vào LAN", "Nó cấp địa chỉ public", "Nó chỉ dùng khi có firewall"], answer: 1, why: "AP nối host không dây vào hạ tầng có dây. Ra mạng khác vẫn phải qua router." },
    { q: "Bạn vừa đọc xong buổi học nhưng chưa làm lab và chưa chấm câu hỏi. Cách đánh dấu nào trung thực?", choices: ["Đánh dấu đã học vì đã kéo tới cuối", "Ở lại, làm lab rồi chấm", "Nhảy sang OSPF cho kịp đề", "Xóa buổi này vì chưa có mã đề"], answer: 1, why: "Phần nền không có mã đề riêng, nhưng các miền sau giả định bạn đã làm được những việc này." }
  ]
};
