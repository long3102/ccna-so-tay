window.LESSON = {
  id: "5.6",
  title: "Đọc syslog",
  exam: "5.6 — Interpret syslog severity and facilities",
  keywords: ["severity", "facility", "logging host", "LINK-3-UPDOWN"],
  objectives: [
    "Đọc một dòng syslog Cisco thành mức, tên sự kiện và việc vừa xảy ra",
    "Thuộc tám mức từ 0 Emergency tới 7 Debugging và biết mức nào ồn hơn",
    "Gửi log về một máy chủ và chọn mức sao cho ca trực không bị nhấn chìm"
  ],
  opener: "Bảng định tuyến nói hiện tại. Syslog nói vừa xảy ra chuyện gì, lúc mấy giờ, nặng đến đâu. Một cổng down lúc 02:14 và một cấu hình đổi lúc 02:13 là một câu chuyện. Hai dòng đó nằm ở hai thiết bị khác nhau thì bạn cần một máy chủ log, không phải mười cái buffer nhỏ tự xóa khi reboot.",
  blocks: [
    { type: "h2", text: "Giải phẫu một dòng" },
    { type: "cli", title: "Một cổng vừa chết", code: "*Nov 15 02:14:07.221: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down" },
    { type: "steps", title: "Bóc dòng này", items: [
      "Phần giờ là lúc router ghi, nếu đã có NTP và service timestamps. Không có giờ đáng tin thì đừng ghép sự kiện giữa các máy.",
      "%LINK là facility, nhóm sự kiện về trạng thái đường truyền.",
      "Số 3 là severity: Error.",
      "UPDOWN là mnemonic, tên ngắn của sự kiện.",
      "Phần sau dấu hai chấm là nội dung: Gi0/1 xuống down."
    ] },
    { type: "p", text: "Một dòng khác, `%SYS-5-CONFIG_I: Configured from console by ha`, là Notice, mức 5: ai đó vừa vào cấu hình từ console. Nó không có nghĩa là sự cố. Nó có nghĩa là có người đang sửa, và nếu sự cố bắt đầu ngay sau đó thì bạn đã có nghi phạm là chính thay đổi đó." },
    { type: "h2", text: "Tám mức, số nhỏ thì nặng" },
    { type: "table", headers: ["Số", "Tên", "Cảm giác khi trực"], rows: [
      ["0", "Emergency", "Hệ không dùng được"],
      ["1", "Alert", "Phải xử lý ngay"],
      ["2", "Critical", "Nguy kịch"],
      ["3", "Error", "Lỗi, như một cổng quan trọng down"],
      ["4", "Warning", "Cảnh báo, có thể thành lỗi"],
      ["5", "Notice", "Việc bình thường nhưng đáng biết, như vừa sửa cấu hình"],
      ["6", "Informational", "Thông tin"],
      ["7", "Debugging", "Chi tiết để điều tra, rất ồn"]
    ] },
    { type: "p", text: "Khi bạn đặt `logging trap 4`, máy chủ nhận các mức 0 đến 4. Số bạn ghi là mức ồn nhất còn được gửi, và mọi mức nặng hơn đi cùng. Để trap debugging trên một mạng đang chạy là cách làm đầy đĩa log và làm chậm thiết bị. Debug trên console chỉ bật trong lúc điều tra, rồi `undebug all`." },
    { type: "p", text: "Facility là ngăn kéo phân loại. Ngoài LINK và SYS, bạn sẽ gặp LINEPROTO khi giao thức đường truyền lên xuống, và các facility local0 đến local7 khi một thiết bị được cấu hình gửi vào một ngăn tự chọn. Máy chủ syslog dùng facility để bỏ log của từng loại vào từng file. Đề có thể đưa một dòng và hỏi facility, hỏi severity, hoặc hỏi sự kiện có nặng hơn một ngưỡng đã cấu hình hay không." },
    { type: "cli", title: "Gửi log đi, và ghi giờ", code: "R1(config)# service timestamps log datetime msec\nR1(config)# logging host 10.1.1.90\nR1(config)# logging trap warning\nR1(config)# logging source-interface Loopback0\nR1# show logging" },
    { type: "p", text: "`logging trap warning` là mức 4. Buffer trên router vẫn hữu ích khi máy chủ log chết, nhưng buffer mất khi reboot và rất ngắn. `show logging` hiện mức đang mở và các dòng gần nhất. Đối chiếu với NTP: hai router lệch giờ thì một cuộc tấn công hoặc một lần đứt cáp sẽ không sắp được thành truyện." },
    { type: "lab", title: "Lab 5.6 — Ba dòng, ba quyết định", goal: "Đọc, đừng vội sửa thiết bị. Viết facility, severity, và việc ca trực nên làm.", tasks: [
      "`%LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down`",
      "`%SYS-5-CONFIG_I: Configured from console by ha`",
      "`%SYS-7-DEBUG` giả định một dòng debug đang tràn console trong giờ cao điểm. Nói mức này có nên gửi về máy chủ mọi ngày không.",
      "Cấu hình router gửi warning trở lên tới 10.1.1.90 và gắn timestamp. Viết các lệnh."
    ], hint: "Số càng nhỏ càng nặng. Warning là 4, nên trap warning gồm cả 0, 1, 2, 3 và 4. Mức 5 không đi.", solution: "Dòng 1: facility LINK, severity 3 Error, kiểm tra cáp và show interface của Gi0/1. Dòng 2: SYS, severity 5 Notice, hỏi người ha vừa sửa gì, chưa phải sự cố lớp 1. Dòng 3: mức 7 không nên thường trực trên server log của giờ cao điểm. Lệnh: service timestamps log datetime msec, logging host 10.1.1.90, logging trap warning. Dòng CONFIG_I mức 5 sẽ không tới server với ngưỡng warning; nếu ca trực cần cả notice thì hạ ngưỡng một cách có chủ đích." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nghĩ mức 7 là nặng nhất vì số lớn. Trong syslog, 7 là debugging, nhẹ nhất và ồn nhất. 0 mới là emergency." }
  ],
  terms: [
    { t: "Severity", d: "Mức nặng từ 0 đến 7. Số nhỏ nặng hơn." },
    { t: "Facility", d: "Nhóm sự kiện, ví dụ LINK hoặc SYS, dùng để phân loại." },
    { t: "Mnemonic", d: "Tên ngắn của sự kiện, ví dụ UPDOWN hoặc CONFIG_I." },
    { t: "Logging trap", d: "Ngưỡng mức sẽ được gửi tới máy chủ syslog." }
  ],
  quiz: [
    { q: "Số severity 3 là mức nào?", choices: ["Debugging", "Warning", "Error", "Emergency"], answer: 2, why: "0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning." },
    { q: "Trong dòng `%LINK-3-UPDOWN`, facility là gì?", choices: ["3", "LINK", "UPDOWN", "GigabitEthernet"], answer: 1, why: "LINK là facility, 3 là severity, UPDOWN là mnemonic." },
    { q: "`logging trap warning` gửi những mức nào?", choices: ["Chỉ đúng mức 4", "Mức 0 đến 4", "Chỉ mức 7", "Mọi mức trừ 0"], answer: 1, why: "Ngưỡng là mức nhẹ nhất còn được gửi. Mọi mức nặng hơn đi cùng." },
    { q: "Vì sao cần timestamp và NTP khi đọc log của nhiều thiết bị?", choices: ["Để OSPF bầu DR", "Để sắp các sự kiện đúng thứ tự thời gian", "Để NAT có cổng", "Để tắt Telnet"], answer: 1, why: "Không cùng giờ thì không biết shutdown xảy ra trước hay sau lần sửa cấu hình." }
  ]
};
