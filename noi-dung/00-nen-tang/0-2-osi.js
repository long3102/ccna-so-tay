window.LESSON = {
  id: "0.2",
  title: "OSI, TCP/IP và đường đi của dữ liệu",
  exam: "Nền tảng, dùng khi xử lý sự cố mục 2.4",
  keywords: ["OSI", "TCP", "UDP", "encapsulation", "PDU"],
  objectives: [
    "Kể việc của bảy tầng OSI và xếp chúng vào bốn tầng TCP/IP",
    "Gọi đúng tên đơn vị dữ liệu: bit, frame, packet, segment",
    "Giải thích vì sao một ứng dụng chọn TCP hoặc UDP"
  ],
  opener: "Hai người ở hai nước muốn hợp tác. Họ không cần biết nhà máy điện của nhau hoạt động ra sao. Họ chỉ cần thỏa thuận ngôn ngữ, phong bì, và bưu điện. Mạng cũng chia việc như vậy. Mỗi tầng chỉ nói chuyện với tầng ngang hàng bên kia, rồi nhờ tầng dưới chuyển giúp.",
  blocks: [
    { type: "h2", text: "Bảy tầng, nhớ bằng việc chứ không bằng thơ" },
    { type: "stack", rows: [
      { name: "7 Ứng dụng", note: "HTTP, DNS, SSH: phần mềm nói gì" },
      { name: "6 Trình bày", note: "Định dạng, mã hóa dữ liệu cho ứng dụng" },
      { name: "5 Phiên", note: "Mở, giữ, đóng một cuộc hội thoại" },
      { name: "4 Giao vận", note: "TCP hoặc UDP, số cổng" },
      { name: "3 Mạng", note: "IP, chọn đường giữa các mạng" },
      { name: "2 Liên kết dữ liệu", note: "MAC, frame, switch" },
      { name: "1 Vật lý", note: "Bit, cáp, sóng, đèn cổng" }
    ] },
    { type: "p", text: "Mô hình TCP/IP mà kỹ sư dùng hàng ngày gộp tầng 5–7 thành ứng dụng, giữ nguyên giao vận và Internet (tương đương tầng mạng), rồi gộp tầng 1–2 thành truy cập mạng. Khi đề nói lớp 2, họ đang nói switch và frame. Lớp 3 là router và IP. Lớp 4 là cổng TCP/UDP. Lớp 1 là cáp và tín hiệu." },
    { type: "h2", text: "Đóng gói: phong bì lồng phong bì" },
    { type: "p", text: "Máy gửi đi từ trên xuống. Ứng dụng đưa dữ liệu cho giao vận. TCP thêm header, trong đó có cổng nguồn và cổng đích, được gọi là segment. IP thêm địa chỉ nguồn và đích, được gọi là packet. Ethernet thêm MAC nguồn và đích, được gọi là frame. Cáp biến frame thành bit. Máy nhận bóc ngược lại." },
    { type: "steps", title: "Ví dụ: mở https://example.com", items: [
      "DNS, ở tầng ứng dụng, đổi tên example.com thành một địa chỉ IP.",
      "TCP cổng đích 443 bắt tay ba bước: SYN, SYN-ACK, ACK. Chưa xong bước này thì chưa có dữ liệu web.",
      "IP ghi địa chỉ máy bạn và địa chỉ máy chủ. Router chỉ nhìn packet này để chọn next hop.",
      "Trong từng chặng, switch nhìn frame Ethernet. MAC nguồn và MAC đích đổi ở mỗi chặng, địa chỉ IP hai đầu không đổi."
    ] },
    { type: "callout", tone: "remember", title: "IP bền, MAC đổi", text: "Địa chỉ IP nguồn và đích của hai host giữ nguyên suốt đường đi. Địa chỉ MAC trên frame chỉ có nghĩa trong một chặng, từ host tới router, hoặc từ router này tới router kế." },
    { type: "h2", text: "TCP và UDP" },
    { type: "compare", left: { title: "TCP", items: ["Có kết nối, bắt tay trước khi gửi", "Gửi lại khi mất, dữ liệu đúng thứ tự", "Dùng cho web, SSH, mail", "Nặng hơn vì phải quản lý phiên"] }, right: { title: "UDP", items: ["Không bắt tay, gửi là đi", "Không hứa gửi lại", "Dùng cho DNS thông thường, thoại, video, DHCP", "Nhẹ, ít trễ"] } },
    { type: "p", text: "Số cổng cho biết ứng dụng nào nhận dữ liệu. Máy chủ web lắng nghe 80 hoặc 443. SSH lắng nghe 22. Máy client dùng một cổng nguồn tạm, thường lớn hơn 1023. Nhìn một gói bắt được: có SYN mà không có SYN-ACK nghĩa là bắt tay TCP đang đứt. Đó là manh mối lớp 4, chưa chắc cáp đã hỏng." },
    { type: "lab", title: "Lab 0.2 — Bóc một lần tải trang", goal: "Tập gọi tên từng phong bì trước khi đụng tới lệnh Cisco.", tasks: [
      "Viết năm dòng cho việc laptop của bạn mở một trang web: DNS, TCP, IP, Ethernet, cáp.",
      "Với mỗi dòng, ghi PDU tương ứng: dữ liệu, segment, packet, frame, bit.",
      "Chỉ ra thứ nào đổi khi packet qua một router: MAC hai đầu frame, hay IP hai host?"
    ], hint: "Router bóc frame cũ, chọn đường bằng IP, rồi đóng frame mới với MAC của chặng kế tiếp.", solution: "Thứ tự phong bì từ trong ra ngoài lúc gửi: dữ liệu ứng dụng, segment TCP, packet IP, frame Ethernet, bit. IP nguồn của laptop và IP đích của web không đổi khi qua router. MAC nguồn và MAC đích của frame đổi theo từng chặng." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Thuộc một câu thơ bảy tầng rồi không trả lời được ping đứt nằm ở tầng nào. Khi học xử lý sự cố, luôn hỏi: đèn cổng có sáng không (tầng 1), switch có thấy MAC không (tầng 2), có route không (tầng 3), cổng TCP có trả lời không (tầng 4)." }
  ],
  terms: [
    { t: "PDU", d: "Protocol data unit, tên gọi của dữ liệu ở một tầng: bit, frame, packet, segment." },
    { t: "Encapsulation", d: "Tầng trên đưa dữ liệu xuống, tầng dưới thêm header của mình." },
    { t: "Port", d: "Số cổng tầng 4, giúp một IP chạy nhiều ứng dụng cùng lúc." },
    { t: "Handshake", d: "Ba gói SYN, SYN-ACK, ACK để TCP mở kết nối." }
  ],
  quiz: [
    { q: "Đơn vị dữ liệu ở tầng mạng gọi là gì?", choices: ["Frame", "Packet", "Bit", "Session"], answer: 1, why: "Frame thuộc tầng liên kết dữ liệu. Packet thuộc tầng mạng, nơi IP sống." },
    { q: "Khi một packet đi qua router, thứ nào thay đổi?", choices: ["IP đích của máy chủ web", "MAC nguồn và MAC đích của frame", "Số cổng TCP đích", "Tên miền"], answer: 1, why: "Router đóng frame mới cho chặng kế. IP hai host và cổng TCP giữ nguyên." },
    { q: "Ứng dụng nào hợp với UDP hơn là TCP?", choices: ["Tải một file cấu hình phải nguyên vẹn", "Cuộc gọi thoại, thà mất một mẫu còn hơn chờ gửi lại", "Phiên SSH vào router", "Tải trang ngân hàng"], answer: 1, why: "Thoại cần ít trễ. Mất một mẫu âm thanh chấp nhận được; chờ TCP gửi lại thì cuộc gọi giật." },
    { q: "Bắt gói thấy client gửi SYN, không thấy SYN-ACK. Nhận định sát nhất?", choices: ["Cáp chắc chắn đứt", "Bắt tay TCP chưa xong: máy đích im hoặc có thứ chặn", "DNS đã hỏng", "Duplex đang mismatch"], answer: 1, why: "SYN đi được tới chỗ bạn bắt gói nên chưa thể kết luận cáp đứt. Vế còn thiếu là lời đáp của máy đích." }
  ]
};
