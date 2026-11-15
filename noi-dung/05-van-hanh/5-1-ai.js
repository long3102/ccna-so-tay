window.LESSON = {
  id: "5.1",
  title: "AI tác tử trong vận hành mạng",
  exam: "5.1 — Agentic AI in network operations",
  keywords: ["agentic", "predictive", "generative", "human in the loop"],
  objectives: [
    "Phân biệt AI sinh văn bản, AI dự đoán, và AI tác tử biết gọi công cụ",
    "Nói một tác tử mạng có thể làm những bước nào, và bước nào vẫn phải do người duyệt",
    "Từ chối một đề xuất nguy hiểm dù nó được viết rất tự tin"
  ],
  opener: "Một chatbot trả lời VLAN là gì thì hữu ích như một cuốn sách biết nói. Một tác tử thì khác: bạn giao mục tiêu máy in VLAN 20 không ping được, nó gọi show, đọc log, đề xuất sửa, thậm chí chuẩn bị lệnh. Đề v2.0 không hỏi bạn xây mô hình. Nó hỏi bạn còn là người chịu trách nhiệm khi tác tử đề xuất một lệnh.",
  blocks: [
    { type: "h2", text: "Ba chữ hay bị gọi chung là AI" },
    { type: "table", headers: ["Loại", "Việc nó làm trong mạng", "Ví dụ"], rows: [
      ["Sinh", "Viết giải thích, bản nháp cấu hình, tóm tắt log", "Tóm tắt 200 dòng syslog thành năm sự kiện"],
      ["Dự đoán", "Nhìn số liệu cũ để báo thứ có thể hỏng", "Dự báo một uplink sắp đầy băng thông"],
      ["Tác tử", "Chia mục tiêu thành bước, gọi công cụ, nhìn kết quả, làm bước tiếp", "Tự chạy show ip route rồi đề xuất một static"]
    ] },
    { type: "p", text: "Tác tử có vòng quan sát, suy nghĩ, hành động. Công cụ của nó có thể là SSH, API của controller, hoặc một kho cấu hình. Vì nó hành động nhiều bước, một bước sai sớm làm các bước sau rất đúng trên một tiền đề sai. Sự tự tin của câu văn không phải là bằng chứng." },
    { type: "steps", title: "Ví dụ: tác tử đề xuất shutdown uplink để hết loop", items: [
      "Nó thấy MAC nhảy giữa hai cổng và CPU switch cao. Chẩn đoán có loop là hợp lý.",
      "Nó đề xuất shutdown Gi1/0/24, và đó lại là uplink duy nhất của cả tầng.",
      "Việc của bạn: xem show spanning-tree trước. Có thể chỉ cần rút sợi cáp thừa dưới bàn, hoặc cổng đó đang là root port hợp lệ và MAC nhảy vì một lý do khác.",
      "Bạn từ chối lệnh, hoặc thu hẹp lệnh vào đúng cổng edge có BPDU guard đang thiếu. Rồi mới cho chạy."
    ] },
    { type: "callout", tone: "remember", title: "Người duyệt không phải người cản trở", text: "Đề thi muốn bạn kiểm tra chứng cứ và tầm ảnh hưởng trước khi đồng ý. Áp dụng ngay một lệnh shutdown, reload, hoặc no vlan trên mạng đang chạy là sai dù lệnh đó do AI viết. Bỏ qua mọi gợi ý cũng sai: tác tử đọc log nhanh hơn bạn." },
    { type: "ul", items: [
      "Cho nó đọc: show, log, bản vẽ. Những thứ này vẫn có thể chứa bí mật, xem buổi 5.2.",
      "Cho nó nháp lệnh trong cửa sổ lab.",
      "Tự gõ hoặc tự bấm nút trên mạng đang có người dùng, sau khi bạn hiểu lệnh sẽ chạm ai.",
      "Giữ một cách quay lui: backup vừa chép ở buổi 4.2, và một phiên console."
    ] },
    { type: "lab", title: "Lab 5.1 — Duyệt ba đề xuất", goal: "Không cần mô hình AI. Bạn là người trực ca. Viết chấp nhận, sửa lại, hoặc từ chối cho mỗi đề xuất, kèm một lệnh show bạn sẽ xem trước.", tasks: [
      "Tác tử nói: không ai trong VLAN 10 nhận DHCP, hãy shutdown toàn bộ VLAN 10.",
      "Tác tử nói: neighbor OSPF kẹt ExStart, hai đầu khác MTU, hãy kiểm tra `show interface` hai đầu trước khi đổi.",
      "Tác tử nói: để hết chậm Wi-Fi, đổi mọi AP sang kênh 6."
    ], hint: "Shutdown cả VLAN là phá dịch vụ để điều tra. Kiểm tra MTU là một bước đọc. Dồn mọi AP vào một kênh là tăng nhiễu.", solution: "1: Từ chối shutdown VLAN. Xem show ip dhcp snooping, helper, và một bản bắt gói Discover. Có thể uplink chưa trust. 2: Chấp nhận hướng điều tra. show interface hai đầu, so MTU, rồi mới sửa trong giờ phù hợp. 3: Từ chối. Kênh 2.4 GHz của các AP gần nhau phải tách 1, 6, 11 chứ không dồn một kênh." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Tin một bảng lệnh chỉ vì nó có cú pháp IOS đúng. Cú pháp đúng và ý đúng là hai việc. `no ip routing` là một lệnh hợp lệ và cũng là cách làm câm một switch lớp 3." }
  ],
  terms: [
    { t: "AI sinh", d: "Tạo văn bản hoặc bản nháp từ lời nhắc." },
    { t: "AI dự đoán", d: "Ước lượng sự kiện sắp tới từ số liệu đã có." },
    { t: "AI tác tử", d: "Lập kế hoạch, gọi công cụ và đi nhiều bước tới một mục tiêu." },
    { t: "Human in the loop", d: "Người vẫn duyệt hành động có ảnh hưởng trước khi nó chạm mạng thật." }
  ],
  quiz: [
    { q: "Điểm khiến AI tác tử khác một chatbot chỉ trả lời?", choices: ["Nó không dùng dữ liệu", "Nó lập kế hoạch và gọi công cụ để tiến tới mục tiêu", "Nó thay spanning tree", "Nó luôn đúng vì là máy"], answer: 1, why: "Nhiều bước và có công cụ là phần cần người duyệt." },
    { q: "Tác tử đề xuất shutdown uplink lõi để xử lý một loop nghi ngờ. Việc đầu tiên?", choices: ["Áp dụng ngay vì loop là khẩn", "Xem chứng cứ và ảnh hưởng trước khi đồng ý", "Tắt AI vĩnh viễn", "Reload mọi switch"], answer: 1, why: "Đề v2.0 chấm thái độ kiểm chứng, không chấm tốc độ vâng lời." },
    { q: "Loại AI nào hợp với câu dự báo một link sắp đầy?", choices: ["Dự đoán", "Chỉ là một syslog", "Port security", "NAT"], answer: 0, why: "Dự báo từ xu hướng số liệu là predictive, chưa chắc đã là tác tử." },
    { q: "Vì sao một lệnh IOS hợp lệ vẫn có thể bị bạn từ chối?", choices: ["IOS không có lệnh hợp lệ", "Đúng cú pháp chưa đủ, lệnh còn phải đúng ý và đúng phạm vi ảnh hưởng", "Chỉ lệnh do người viết tay mới chạy", "Vì AI không tạo được dấu nhắc"], answer: 1, why: "Người vận hành chịu trách nhiệm tầm ảnh hưởng, không chỉ chính tả." }
  ]
};
