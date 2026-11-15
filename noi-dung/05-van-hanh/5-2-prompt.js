window.LESSON = {
  id: "5.2",
  title: "Viết prompt cho việc vận hành",
  exam: "5.2 — Select a prompt for network operations",
  keywords: ["persona", "data classification", "output format", "instructions"],
  objectives: [
    "Nhận ra bốn thành phần: vai, chỉ dẫn, phân loại dữ liệu, định dạng đầu ra",
    "Gỡ mật khẩu, bí mật và dữ liệu khách khỏi nội dung trước khi đưa cho một hệ thống AI",
    "Chọn prompt chặt hơn giữa hai prompt cùng hỏi một việc"
  ],
  opener: "Prompt là mệnh lệnh kèm ngữ cảnh. Một câu mạng chậm cho tôi biết đi tạo ra một bài văn. Một prompt đủ thành phần tạo ra một việc bạn làm tiếp được: đúng vai người đọc, đúng dữ liệu được phép rời mạng, đúng dạng bảng hoặc lệnh để dán vào lab.",
  blocks: [
    { type: "h2", text: "Bốn thành phần đề muốn bạn thấy" },
    { type: "table", headers: ["Thành phần", "Câu hỏi nó trả lời", "Ví dụ"], rows: [
      ["Persona", "Người trả lời đang đóng vai gì, người đọc là ai", "Bạn là kỹ sư mạng, người đọc là nhân viên trực ca mới"],
      ["Instructions", "Việc cụ thể phải làm và không được làm", "Chỉ đề xuất lệnh show. Đừng đề xuất lệnh thay đổi"],
      ["Data classification", "Dữ liệu này thuộc mức nào, được phép dán không", "Log đã xóa mật khẩu và địa chỉ khách, mức nội bộ"],
      ["Output format", "Trả về hình dạng gì", "Một bảng ba cột: chứng cứ, giả thuyết, lệnh kiểm chứng"]
    ] },
    { type: "p", text: "Phân loại dữ liệu là phần hay bị bỏ và là phần gây họa. Mật khẩu enable, khóa TACACS, địa chỉ khách hàng, nội dung gói bắt được có thông tin cá nhân: những thứ đó không thuộc một ô chat bên ngoài, dù ô đó hứa giúp bạn sửa mạng. Nếu chính sách công ty cấm đưa cấu hình ra ngoài thì một prompt hay vẫn là một vi phạm." },
    { type: "compare", left: { title: "Prompt yếu", items: ["Sửa giúp file này", "Dán nguyên running-config có secret và key", "Không nói muốn nhận lại cái gì", "Không cấm lệnh phá"] }, right: { title: "Prompt dùng được", items: ["Vai: kỹ sư đang dạy ca trực", "Việc: tìm vì sao VLAN 10 không có DHCP, chỉ dùng đoạn show đã dán", "Dữ liệu: đã xóa secret, chỉ còn lệnh DHCP và interface", "Đầu ra: tối đa ba giả thuyết, mỗi giả thuyết một lệnh show"] } },
    { type: "steps", title: "Ví dụ prompt cho một syslog interface down", items: [
      "Persona: kỹ sư mạng đang hỗ trợ người trực, không thay người trực bấm lệnh.",
      "Instructions: đọc dòng log, nói mức severity, nêu hai nguyên nhân tầng vật lý có thể, và một lệnh show. Không đề xuất reload.",
      "Data: dán mỗi dòng `%LINK-3-UPDOWN` sau khi đã bỏ hostname thật nếu hostname đó là bí mật nội bộ theo chính sách của bạn. Không dán cấu hình xung quanh nếu trong đó có key.",
      "Format: đúng bốn dòng, nhãn Mức, Ý nghĩa, Nguyên nhân, Lệnh."
    ] },
    { type: "lab", title: "Lab 5.2 — Chọn và viết lại", goal: "Một đồng nghiệp định dán cấu hình sau vào công cụ AI công cộng: username admin secret BiMat123, tacacs key KhoaChung, và một ACL có địa chỉ của khách hàng.", tasks: [
      "Khoanh những phần không được dán, và nói chúng thuộc thành phần prompt nào khi bạn quyết định gỡ đi.",
      "Viết một prompt đủ bốn thành phần để hỏi vì sao ACL đó chặn nhầm một máy, sau khi đã thay địa chỉ khách bằng 203.0.113.10 và xóa mọi secret.",
      "Người mẫu trả về một lệnh `no access-list`. Prompt của bạn phải cấm điều đó từ trước bằng instructions. Viết câu cấm."
    ], hint: "203.0.113.0/24 là dải dành cho tài liệu. Dùng nó thay địa chỉ thật. Câu cấm phải nằm trong instructions, không nằm trong phần bạn hy vọng AI tự hiểu.", solution: "Gỡ secret, key TACACS và địa chỉ khách: đó là data classification. Prompt mẫu: Vai là kỹ sư lab, người đọc là học viên. Chỉ dẫn: giải thích ACL bên dưới có thể chặn nhầm chỗ nào, chỉ đưa lệnh show access-lists và một bản ACL viết lại, không đưa lệnh xóa ACL trên thiết bị thật. Dữ liệu: ACL đã thay địa chỉ thật, không có mật khẩu. Định dạng: ba gạch đầu dòng nguyên nhân, rồi một khối lệnh. Câu cấm: Không xuất lệnh xóa hoặc tắt ACL trên hệ thống đang chạy." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nghĩ đặt persona là kỹ sư cao cấp thì được phép dán khóa. Vai diễn không đổi mức mật của dữ liệu. Khóa vẫn là khóa." }
  ],
  terms: [
    { t: "Persona", d: "Vai của người trả lời và bối cảnh người đọc." },
    { t: "Instructions", d: "Việc cần làm và việc bị cấm." },
    { t: "Data classification", d: "Mức mật của dữ liệu, quyết định có được đưa vào prompt không." },
    { t: "Output format", d: "Hình dạng câu trả lời: bảng, danh sách, JSON, các bước." }
  ],
  quiz: [
    { q: "Xóa mật khẩu trước khi dán cấu hình vào công cụ AI thuộc thành phần nào?", choices: ["Persona", "Output format", "Data classification", "Metric OSPF"], answer: 2, why: "Đó là quyết định dữ liệu nào được phép rời khỏi mạng." },
    { q: "Yêu cầu trả về một bảng ba cột thuộc thành phần nào?", choices: ["Định dạng đầu ra", "Phân loại dữ liệu", "Bridge ID", "Native VLAN"], answer: 0, why: "Hình dạng câu trả lời là output format." },
    { q: "Prompt nào an toàn hơn?", choices: ["Dán nguyên config có secret và bảo sửa đi", "Dán phần interface đã gỡ secret, cấm lệnh thay đổi, đòi ba giả thuyết và lệnh show", "Gửi cả tacacs key để AI kiểm tra độ mạnh", "Gửi file bắt gói của khách hàng ra công cụ công cộng"], answer: 1, why: "Đủ vai, việc, dữ liệu đã làm sạch, và định dạng. Các lựa chọn kia phát tán bí mật." },
    { q: "Persona có thay được mức mật của một khóa TACACS không?", choices: ["Có, nếu vai là CCIE", "Không", "Chỉ vào cuối tuần", "Chỉ khi output là JSON"], answer: 1, why: "Vai không hạ mức mật. Khóa không được đưa vào prompt công cộng." }
  ]
};
