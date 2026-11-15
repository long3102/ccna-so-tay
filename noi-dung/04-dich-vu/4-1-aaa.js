window.LESSON = {
  id: "4.1",
  title: "Tài khoản local và AAA",
  exam: "4.1 — Local usernames and AAA client",
  keywords: ["AAA", "TACACS+", "RADIUS", "local fallback"],
  objectives: [
    "Tạo tài khoản local và buộc SSH dùng tài khoản đó thay vì mật khẩu dùng chung",
    "Cấu hình router làm client của TACACS+ hoặc RADIUS, còn đường lùi về local khi server im",
    "Chọn TACACS+ cho việc quản trị thiết bị và RADIUS cho việc người dùng vào mạng"
  ],
  opener: "Mật khẩu enable là một chìa khóa để dưới thảm. Ai cũng dùng, và khi một người nghỉ việc bạn phải đổi cho cả đội. AAA tách ba câu hỏi: bạn là ai, bạn được làm gì, và hệ thống đã ghi lại việc đó chưa. Máy chủ AAA trả lời ba câu đó. Router chỉ là khách hàng đi hỏi.",
  blocks: [
    { type: "h2", text: "Trước khi có server trung tâm" },
    { type: "cli", title: "Tài khoản local và SSH", code: "R1(config)# ip domain-name lab.local\nR1(config)# crypto key generate rsa modulus 2048\nR1(config)# username ha secret MotMatKhauDai\nR1(config)# username ha privilege 15\nR1(config)# line vty 0 4\nR1(config-line)# transport input ssh\nR1(config-line)# login local\nR1(config)# ip ssh version 2" },
    { type: "p", text: "privilege 15 vào thẳng privileged EXEC. Không đặt privilege thì người dùng còn phải biết thêm enable secret. `login local` bắt VTY dùng bảng username. `transport input ssh` từ chối Telnet. Telnet gửi mật khẩu dạng đọc được. Đừng bật nó trên thiết bị bạn còn giữ." },
    { type: "h2", text: "TACACS+ và RADIUS không thay nhau" },
    { type: "table", headers: ["", "TACACS+", "RADIUS"], rows: [
      ["Việc hợp", "Quản trị router, switch: ai được gõ lệnh nào", "Người dùng vào mạng: Wi-Fi 802.1X, VPN"],
      ["Cổng", "TCP 49", "UDP 1812 xác thực, 1813 accounting"],
      ["Mã hóa", "Cả nội dung", "Chủ yếu mật khẩu"],
      ["Ba chữ A", "Tách riêng authentication, authorization, accounting", "Gộp authentication và authorization"]
    ] },
    { type: "cli", title: "Hỏi TACACS+ trước, server chết thì dùng local", code: "R1(config)# aaa new-model\nR1(config)# tacacs server MAYCHU\nR1(config-server-tacacs)# address ipv4 10.1.1.50\nR1(config-server-tacacs)# key MotChiaKhoaDaiKhac\nR1(config)# aaa group server tacacs+ NHOM\nR1(config-sg-tacacs)# server name MAYCHU\nR1(config)# aaa authentication login default group NHOM local\nR1(config)# aaa authorization exec default group NHOM local" },
    { type: "p", text: "`aaa new-model` đổi cách đăng nhập của cả thiết bị. Làm việc này qua console trước, và giữ một phiên console đang mở, kẻo tự khóa cửa. Chữ `local` đứng sau group là đường lùi: server không trả lời thì tài khoản trên máy vẫn vào được. Server trả lời từ chối thì local không được dùng để cãi lại. Đó là khác nhau giữa server chết và mật khẩu sai." },
    { type: "callout", tone: "remember", title: "RADIUS viết theo cùng một ý", text: "Đổi `tacacs server` thành `radius server`, nhóm thành `aaa group server radius`, cổng mặc định UDP. Đừng học hai bài khác nhau. Khác ở giao thức và ở việc bạn đang cho kỹ sư vào thiết bị hay cho laptop vào mạng." },
    { type: "lab", title: "Lab 4.1 — Khóa cửa rồi mới nối chuông", goal: "Một router. Chưa cần server AAA thật ở bước đầu.", tasks: [
      "Tạo username của bạn, privilege 15, secret riêng. Bật SSH version 2. Tắt Telnet trên VTY.",
      "Từ PC trong lab, SSH vào được và không Telnet vào được.",
      "Viết cấu hình AAA TACACS+ với fallback local, nhưng đừng kích hoạt nó nếu bạn chưa có server, hoặc kích hoạt khi đã chắc local còn đứng sau chữ group.",
      "Trả lời: kỹ sư vào switch nên dùng TACACS+ hay RADIUS, và người dùng Wi-Fi doanh nghiệp thì sao?"
    ], hint: "Giữ phiên console. transport input ssh nằm dưới line vty. login local hết tác dụng theo kiểu cũ sau khi aaa new-model, nên phương thức AAA phải có local.", solution: "SSH vào bằng username local là đạt bước 1. Telnet bị từ chối vì transport input ssh. AAA: aaa new-model, server TACACS+ 10.1.1.50, aaa authentication login default group NHOM local. Quản trị thiết bị chọn TACACS+ vì tách được quyền từng lệnh và mã hóa cả phiên AAA. Wi-Fi 802.1X chọn RADIUS." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Bật aaa new-model với method-list trỏ vào một server chưa tồn tại và không có chữ local. Phiên VTY mới sẽ không vào được. Luôn để fallback local cho lab, và đừng đóng cửa sổ console cho đến khi thử một phiên SSH mới thành công." }
  ],
  terms: [
    { t: "AAA", d: "Authentication, authorization, accounting: bạn là ai, được làm gì, ghi lại ra sao." },
    { t: "TACACS+", d: "Giao thức Cisco trên TCP 49, hợp quản trị thiết bị." },
    { t: "RADIUS", d: "Giao thức UDP, hợp xác thực người dùng vào mạng." },
    { t: "Local fallback", d: "Dùng tài khoản trên máy khi server AAA không trả lời." }
  ],
  quiz: [
    { q: "Giao thức nào mã hóa toàn bộ nội dung AAA và tách ba chức năng?", choices: ["RADIUS", "TACACS+", "SNMP", "Telnet"], answer: 1, why: "TACACS+ mã hóa cả payload và tách authentication, authorization, accounting." },
    { q: "RADIUS dùng kiểu vận chuyển nào?", choices: ["TCP 49", "UDP", "ICMP", "GRE"], answer: 1, why: "RADIUS dùng UDP 1812/1813. TACACS+ mới là TCP 49." },
    { q: "Chữ local ở cuối `aaa authentication login default group NHOM local` có tác dụng khi nào?", choices: ["Khi người dùng gõ sai mật khẩu trên server", "Khi server trong nhóm không phản hồi", "Mỗi lần đăng nhập, bỏ qua server", "Chỉ với console vật lý"], answer: 1, why: "Fallback dùng khi phương thức trước không trả lời được, không dùng để vượt một lời từ chối." },
    { q: "Vì sao VTY nên `transport input ssh`?", choices: ["SSH nhanh hơn nên được điểm cao hơn", "Telnet để lộ mật khẩu", "SSH tắt được STP", "Telnet không chạy trên VLAN 1"], answer: 1, why: "Telnet không mã hóa. SSH version 2 là cửa quản trị từ xa tối thiểu." }
  ]
};
