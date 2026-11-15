window.LESSON = {
  id: "0.5",
  title: "Buổi đầu với Cisco IOS",
  exam: "Nền tảng cho mọi mục cấu hình",
  keywords: ["EXEC", "running-config", "startup-config", "enable secret"],
  objectives: [
    "Đi đúng bốn dấu nhắc: user EXEC, privileged EXEC, global config, interface",
    "Đặt hostname, mật khẩu enable, địa chỉ IP cho một cổng và bật cổng",
    "Giải thích khác nhau giữa running-config và startup-config, rồi lưu mà không quên"
  ],
  opener: "IOS là hệ điều hành trên router và switch Cisco bạn sẽ gặp trong lab. Nó không có cửa sổ để bấm. Bạn gõ lệnh tại một dấu nhắc, và dấu nhắc đó nói cho bạn biết lệnh này có được nhận hay không. Quen dấu nhắc sớm thì các buổi sau đỡ đau.",
  blocks: [
    { type: "h2", text: "Bốn căn phòng" },
    { type: "table", headers: ["Dấu nhắc", "Làm được gì", "Lùi ra bằng"], rows: [
      ["Router>", "Xem ít lệnh, ping đơn giản", "enable"],
      ["Router#", "Xem mọi show, lưu, debug", "disable hoặc configure terminal"],
      ["Router(config)#", "Lệnh có hiệu lực cả thiết bị", "exit hoặc Ctrl+Z"],
      ["Router(config-if)#", "Lệnh của đúng một cổng", "exit về global, Ctrl+Z về EXEC"]
    ] },
    { type: "p", text: "Gõ `?` để xem lệnh dùng được tại phòng hiện tại. Gõ vài chữ rồi `Tab` để IOS viết nốt. Mũi tên lên lấy lại lệnh cũ. `show running-config` là bản đang chạy trong RAM. `show startup-config` là bản trong NVRAM, bản được nạp khi thiết bị khởi động lại." },
    { type: "cli", title: "Buổi đầu trên một router lab", code: "Router> enable\nRouter# configure terminal\nRouter(config)# hostname R1\nR1(config)# enable secret MeoLab2026\nR1(config)# no ip domain-lookup\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# description Len mang may tram\nR1(config-if)# ip address 192.168.1.1 255.255.255.0\nR1(config-if)# no shutdown\nR1(config-if)# exit\nR1(config)# line console 0\nR1(config-line)# password CongConsole\nR1(config-line)# login\nR1(config-line)# exit\nR1(config)# service password-encryption\nR1(config)# end\nR1# copy running-config startup-config" },
    { type: "h2", text: "Vì sao từng lệnh đó có mặt" },
    { type: "ul", items: [
      "`enable secret` băm mật khẩu vào privileged EXEC. Đừng dùng `enable password` trên lab mới; bản đó yếu.",
      "`no ip domain-lookup` ngăn IOS cố biến một lệnh gõ sai thành tên miền, kẻo bạn ngồi chờ vô ích.",
      "`no shutdown` bật cổng. Cổng router Cisco mặc định tắt. Đây là lý do ping hỏng dù địa chỉ đã đúng.",
      "`service password-encryption` chỉ che mật khẩu kiểu cũ cho khỏi hiện rõ trong config. Nó không thay `secret`.",
      "`copy running-config startup-config` viết tắt là `wr` trên nhiều IOS. Không có bước này, reboot là mất bài."
    ] },
    { type: "callout", tone: "remember", title: "Xem cổng còn sống", text: "`show ip interface brief` là lệnh đầu tiên khi một router im. Cột Status là tầng 1, cột Protocol là tầng 2. Muốn dùng được cần up/up. administratively down nghĩa là còn `shutdown`." },
    { type: "cli", title: "Kết quả đáng mong", code: "R1# show ip interface brief\nInterface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0     192.168.1.1     YES manual up                    up" },
    { type: "lab", title: "Lab 0.5 — Router biết tên và còn cấu hình sau khi reboot", goal: "Làm trên Packet Tracer. Một router, một PC, một dây chéo thẳng vào Gi0/0 hoặc cổng mà topology của bạn cho nối.", tasks: [
      "Đặt hostname R1, enable secret riêng của bạn, tắt domain-lookup.",
      "Gán 192.168.1.1/24 cho cổng nối PC, mô tả cổng, no shutdown.",
      "PC đặt 192.168.1.10/24, gateway 192.168.1.1. Ping từ PC tới router.",
      "Lưu cấu hình. Reboot router. Ping lại. Nếu chết, bạn quên bước nào?"
    ], hint: "PC và router phải cùng mạng /24. Cổng router phải up/up. Sau reboot, chỉ startup-config còn.", solution: "Ping được trước reboot chứng minh IP, mask và no shutdown đúng. Sau reboot mà mất, bạn chưa copy running-config startup-config. Mật khẩu console trong bài là ví dụ; trên thiết bị thật hãy dùng tài khoản local như buổi 4.1, đừng để mật khẩu kiểu password nằm lâu." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Gõ địa chỉ IP xong, quên no shutdown, rồi đi sửa mask cả buổi. Hãy nhìn show ip interface brief trước khi nghi ngờ toán." }
  ],
  terms: [
    { t: "Running-config", d: "Cấu hình đang chạy, nằm trong RAM, mất khi mất điện nếu chưa lưu." },
    { t: "Startup-config", d: "Cấu hình trong NVRAM, được nạp lúc khởi động." },
    { t: "no shutdown", d: "Bật một cổng đang bị administratively down." },
    { t: "enable secret", d: "Mật khẩu vào privileged EXEC, được lưu dưới dạng băm." }
  ],
  quiz: [
    { q: "Muốn gõ `ip address` cho một cổng, bạn phải đứng ở dấu nhắc nào?", choices: ["Router>", "Router#", "Router(config-if)#", "Router(config-line)#"], answer: 2, why: "Lệnh địa chỉ thuộc interface configuration. Từ global config bạn vào bằng lệnh interface." },
    { q: "`show ip interface brief` báo administratively down. Việc cần làm?", choices: ["Đổi cáp quang", "Gõ no shutdown trong cổng đó", "Thêm default route", "Bật STP"], answer: 1, why: "administratively down là cổng đang shutdown trong cấu hình." },
    { q: "Bạn vừa cấu hình xong và gõ `reload`, chưa copy. Chuyện gì xảy ra?", choices: ["IOS tự lưu", "Thiết bị lên lại bằng startup-config cũ", "Chỉ mất mật khẩu", "Chỉ mất địa chỉ IPv6"], answer: 1, why: "Running-config không được ghi vào NVRAM thì reboot bỏ hết phần vừa gõ." },
    { q: "`enable secret` hơn `enable password` ở điểm nào?", choices: ["Nó tự bật SSH", "Mật khẩu được băm, không hiện dạng dễ đảo", "Nó thay luôn mật khẩu console", "Nó mã hóa traffic người dùng"], answer: 1, why: "secret dùng hàm băm. password là cách cũ, yếu, dù có service password-encryption cũng chỉ che kiểu mã hóa thuận nghịch." }
  ]
};
