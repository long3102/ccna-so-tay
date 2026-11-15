window.LESSON = {
  id: "4.2",
  title: "Sao lưu bằng SCP và SFTP",
  exam: "4.2 — Secure file transfer with SFTP/SCP",
  keywords: ["SCP", "SFTP", "SSH", "IOS image"],
  objectives: [
    "Giải thích SCP và SFTP hơn TFTP ở chỗ xác thực và mã hóa",
    "Chép running-config ra một máy chủ SCP và chép một file trở lại flash",
    "Chuẩn bị SSH trên router trước khi chép, vì không có SSH thì không có SCP"
  ],
  opener: "TFTP là phong bì không dán, không ghi tên người gửi. Ai ngồi cùng mạng cũng có thể đọc file cấu hình đang bay qua, và file đó chứa bí mật của mạng. Đề v2.0 bỏ thói quen TFTP cho việc quản trị và chuyển sang SCP, SFTP. Cả hai đều ngồi trên SSH.",
  blocks: [
    { type: "h2", text: "Chọn giao thức" },
    { type: "table", headers: ["Giao thức", "Nền", "Dùng để"], rows: [
      ["TFTP", "UDP 69, không đăng nhập", "Lab cũ, thiết bị chưa có SSH. Tránh trên mạng thật."],
      ["FTP", "TCP, mật khẩu không được che tốt", "Di sản. Không phải lựa chọn của đề v2.0."],
      ["SCP", "SSH", "Chép một file, cú pháp gần với copy của IOS"],
      ["SFTP", "SSH", "Chép file có phiên làm việc rõ hơn, cũng được IOS hỗ trợ"]
    ] },
    { type: "p", text: "SCP và SFTP không làm cho file mạnh hơn. Chúng làm cho đường đi mạnh hơn: có tài khoản, có mã hóa. Máy chủ phía kia vẫn phải được phép nhận file và đĩa vẫn phải còn chỗ. Một bản backup mã hóa trên đường đi rồi nằm trần trên một máy chủ bỏ quên thì mới xong một nửa việc." },
    { type: "cli", title: "Bật SCP trên router và đẩy cấu hình đi", code: "R1(config)# ip ssh version 2\nR1(config)# ip scp server enable\nR1(config)# username backup privilege 15 secret MatKhauBackup\nR1# copy running-config scp://backup@10.1.1.40/r1-running.cfg" },
    { type: "p", text: "IOS sẽ hỏi mật khẩu nếu bạn không viết vào URL. Đừng viết mật khẩu vào URL rồi lưu lệnh đó vào một ghi chú công khai. Chiều ngược lại, lấy IOS mới về flash:" },
    { type: "cli", title: "Kéo một image về", code: "R1# copy scp://backup@10.1.1.40/isr4300-image.bin flash:" },
    { type: "p", text: "Sau khi file nằm trong flash, việc kích hoạt image mới là `boot system flash:` đúng tên file, rồi lưu cấu hình và khởi động lại trong giờ bảo trì. Đề này hỏi bạn chuyển file an toàn, không biến bạn thành người nâng cấp liều giữa giờ làm việc. SFTP dùng scheme `sftp://` theo cùng một tinh thần." },
    { type: "callout", tone: "remember", title: "Backup cái đang chạy và cái sẽ sống sau reboot", text: "copy running-config ra ngoài lưu bản đang đúng hôm nay. startup-config mới là bản sẽ về khi mất điện. Hai bản khác nhau nghĩa là ai đó chưa lưu. Hãy chép cả hai nếu bạn không chắc." },
    { type: "lab", title: "Lab 4.2 — Một file rời khỏi router mà không đi TFTP", goal: "Packet Tracer có server hỗ trợ SCP hoặc một máy chủ SSH thật trong lab của bạn. Nếu công cụ không có SCP, vẫn viết đúng lệnh và nói vì sao không dùng TFTP.", tasks: [
      "Bật SSH version 2 và ip scp server enable. Tạo user backup privilege 15.",
      "copy running-config lên server bằng scp://. Kiểm tra file xuất hiện trên server.",
      "Đổi hostname, chưa copy startup. Chép lại running-config thành một tên file thứ hai. Hai file phải khác nhau.",
      "Viết một câu: kẻ nghe lén trên đường truyền SCP nhìn thấy nội dung file không?"
    ], hint: "URL có dạng scp://user@host/ten-file. Router phải ping được server trước khi đổ lỗi cho SCP.", solution: "Lệnh đạt: copy running-config scp://backup@địa-chỉ-server/r1.cfg. Hai lần chép trước và sau khi đổi hostname cho hai file khác dòng hostname. Người nghe lén không đọc được nội dung vì SCP chạy trong SSH. Họ vẫn thấy có một phiên SSH, nhưng không thấy cấu hình." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Tưởng `ip scp server enable` là đủ để tự động backup mỗi đêm. Lệnh đó chỉ cho phép router phục vụ SCP. Việc đẩy file đi vẫn là một lệnh copy hoặc một playbook Ansible ở buổi 5.5." }
  ],
  terms: [
    { t: "SCP", d: "Secure Copy, chép file qua SSH." },
    { t: "SFTP", d: "SSH File Transfer Protocol, cũng đi trên SSH, không phải FTP có khóa." },
    { t: "Flash", d: "Bộ nhớ chứa IOS image và các file khác, còn sau khi reboot." },
    { t: "ip scp server enable", d: "Cho phép router nhận phiên SCP." }
  ],
  quiz: [
    { q: "Vì sao chọn SCP thay cho TFTP khi backup cấu hình?", choices: ["SCP không cần địa chỉ IP", "SCP xác thực và mã hóa phiên", "SCP dùng UDP nên nhẹ hơn", "TFTP bị cấm trong VLAN 1"], answer: 1, why: "Giá trị của SCP là SSH bên dưới: biết ai chép và kẻ nghe lén không đọc được file." },
    { q: "SCP và SFTP chạy trên giao thức nào?", choices: ["Telnet", "SSH", "SNMP", "HTTP"], answer: 1, why: "Cả hai dùng SSH làm đường vận chuyển." },
    { q: "Lệnh nào đẩy running-config lên server?", choices: ["copy tftp running-config", "copy running-config scp://user@host/r1.cfg", "write scp", "archive scp force"], answer: 1, why: "copy nguồn đích. Nguồn là running-config, đích là URL scp." },
    { q: "File vừa copy vào flash đã thành IOS đang chạy chưa?", choices: ["Rồi, ngay lập tức", "Chưa. Còn phải trỏ boot system và khởi động lại trong giờ phù hợp", "Chỉ cần no shutdown", "Chỉ trên switch, không trên router"], answer: 1, why: "Có file trong flash chưa có nghĩa là thiết bị đã boot bằng file đó." }
  ]
};
