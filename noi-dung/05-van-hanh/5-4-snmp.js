window.LESSON = {
  id: "5.4",
  title: "SNMP",
  exam: "5.4 — SNMP in network operations",
  keywords: ["manager", "agent", "MIB", "trap", "SNMPv3"],
  objectives: [
    "Chỉ đúng manager, agent, MIB và OID trong một hệ giám sát",
    "Phân biệt hỏi định kỳ với trap, và nhớ hai cổng UDP",
    "Chọn SNMPv3 thay cho community string dùng chung của v2c"
  ],
  opener: "Bạn không thể mở mười cửa sổ ping để canh một tòa nhà. SNMP là cách một máy giám sát hỏi từng thiết bị: cổng này đang bao nhiêu lỗi, CPU bao nhiêu, interface nào vừa down. Thiết bị cũng có thể chủ động kêu khi có chuyện, khỏi đợi tới lượt bị hỏi.",
  blocks: [
    { type: "h2", text: "Bốn danh từ" },
    { type: "table", headers: ["Tên", "Là ai"], rows: [
      ["Manager", "Máy giám sát, còn gọi là NMS. Nó hỏi và nhận báo."],
      ["Agent", "Tiến trình SNMP trên router, switch, AP, máy chủ."],
      ["MIB", "Cây tên các thứ agent chịu tiết lộ: interface, CPU, bộ nhớ."],
      ["OID", "Một lá trên cây đó, ví dụ bộ đếm ifInErrors của một cổng."]
    ] },
    { type: "p", text: "Manager hỏi bằng get. Hỏi một dải bằng get-bulk hoặc walk. Agent trả lời. Đó là thăm khám định kỳ, cổng UDP 161 trên agent. Khi một cổng down, agent có thể gửi trap hoặc inform tới UDP 162 trên manager, không đợi ai hỏi. Inform khác trap ở chỗ manager phải xác nhận đã nhận. Trap gửi một lần là đi, có thể mất." },
    { type: "h2", text: "Phiên bản và cái bẫy community" },
    { type: "p", text: "SNMPv2c vẫn còn rất nhiều. Nó dùng một community string như mật khẩu dùng chung, và string đó đi mà không được mã hóa đúng nghĩa. Community `public` quyền đọc là một mặc định phải diệt. Community quyền ghi, RW, cho phép sửa cấu hình từ xa qua SNMP. Đừng bật RW cho một hệ chỉ cần vẽ biểu đồ." },
    { type: "p", text: "SNMPv3 mới là bản dùng cho mạng mới: có username, xác thực, và có thể mã hóa phần dữ liệu. Ba mức hay gặp là noAuthNoPriv, authNoPriv và authPriv. Mức cuối vừa biết đúng người vừa che nội dung. Đề không bắt bạn thuộc từng thuật toán, nhưng bắt bạn biết vì sao v3 thay v2c." },
    { type: "cli", title: "Một agent chỉ đọc, gửi trap về máy giám sát", code: "R1(config)# snmp-server group GIAMSAT v3 priv\nR1(config)# snmp-server user giamsat GIAMSAT v3 auth sha MatKhauDai priv aes 128 KhoaMaHoaDai\nR1(config)# snmp-server host 10.1.1.80 version 3 priv giamsat\nR1(config)# snmp-server enable traps" },
    { type: "callout", tone: "remember", title: "Giám sát không phải quản trị", text: "SNMP đọc trạng thái rất giỏi. Dùng nó để đẩy cấu hình là một cánh cửa nữa phải canh. Nhiều mạng chỉ cho SNMP đọc, còn thay đổi thì đi SSH, AAA và Ansible, nơi có nhật ký rõ người đã gõ." },
    { type: "lab", title: "Lab 5.4 — Vẽ một hệ giám sát trên giấy", goal: "Một NMS 10.1.1.80, mười switch, bạn muốn biết cổng nào tăng CRC và muốn nhận tin khi uplink down.", tasks: [
      "Ghi ai là manager, ai là agent.",
      "Ghi cổng và chiều của lần hỏi định kỳ, rồi cổng và chiều của trap.",
      "Chọn v2c hay v3 cho một mạng mới, với một câu lý do. Nếu ai đó đề nghị community public quyền RW, viết câu từ chối.",
      "NMS không vẽ được switch nào dù ping tới switch được. Nêu hai nguyên nhân SNMP, không phải nguyên nhân cáp."
    ], hint: "Ping được chỉ chứng minh IP. SNMP còn cần đúng version, đúng user hoặc community, và ACL có thể cho ping mà chặn UDP 161.", solution: "NMS là manager, switch chạy agent. Get đi tới UDP 161 của switch. Trap đi tới UDP 162 của NMS. Mạng mới dùng v3 authPriv. Từ chối public RW vì đó là mật khẩu ai cũng biết và lại có quyền ghi. Hai nguyên nhân: sai user hoặc community, và một ACL chặn UDP 161. Cũng có thể NMS hỏi nhầm IP quản trị." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nhớ ngược cổng. 161 là cửa agent đang ngồi chờ câu hỏi. 162 là cửa manager đang ngồi chờ tin xấu. Trap gửi nhầm 161 thì không ai ghi nhận sự cố." }
  ],
  terms: [
    { t: "NMS", d: "Network management station, máy đóng vai manager." },
    { t: "MIB", d: "Cây đối tượng mà agent có thể báo cáo." },
    { t: "Trap", d: "Thông báo chủ động từ agent tới UDP 162 của manager." },
    { t: "Community string", d: "Mật khẩu dùng chung của SNMPv2c, không phải cách làm của mạng mới." }
  ],
  quiz: [
    { q: "Trap SNMP tới cổng nào?", choices: ["UDP 161", "UDP 162", "TCP 22", "TCP 49"], answer: 1, why: "162 là cửa manager nhận trap. 161 là cửa agent nhận câu hỏi." },
    { q: "OID là gì?", choices: ["Một loại cáp", "Định danh một đối tượng trong MIB", "Mật khẩu v3", "Một VLAN voice"], answer: 1, why: "Manager hỏi theo OID để lấy đúng lá trên cây MIB." },
    { q: "Vì sao mạng mới nên SNMPv3 authPriv thay cho v2c?", choices: ["v3 nhanh hơn nên bỏ được routing", "v3 xác thực người dùng và có thể mã hóa, v2c chỉ có community", "v3 không dùng UDP", "v2c không xem được interface"], answer: 1, why: "Community của v2c là bí mật dùng chung và không che nội dung cho đúng nghĩa." },
    { q: "Community RW nguy hiểm vì điều gì?", choices: ["Nó tắt PoE", "Nó cho ghi, tức là thay đổi thiết bị từ xa", "Nó chỉ đọc được hostname", "Nó bắt buộc dùng Telnet"], answer: 1, why: "Quyền ghi qua SNMP là một cửa quản trị nữa. Giám sát thông thường chỉ cần đọc." }
  ]
};
