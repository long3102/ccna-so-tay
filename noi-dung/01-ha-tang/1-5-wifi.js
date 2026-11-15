window.LESSON = {
  id: "1.5",
  title: "Nguyên tắc Wi-Fi",
  exam: "1.5 — Wireless principles",
  keywords: ["2.4 GHz", "SSID", "WPA3", "RSSI", "interference"],
  objectives: [
    "Chọn kênh 2.4 GHz không chồng lên nhau và giải thích vì sao 5 GHz đỡ chật hơn",
    "Đọc một phàn nàn sóng yếu bằng RSSI và nhiễu, không chỉ bằng số vạch",
    "Chọn WPA3 hoặc WPA2 và loại được WEP, WPA cũ"
  ],
  opener: "Wi-Fi không phải một sợi cáp vô hình vô hạn. Nó là sóng radio trong một căn phòng, và mọi người trong phòng đó đang chia nhau không khí. Hai access point cùng hét trên một kênh thì client không biết nghe ai. Buổi này dạy bạn nhìn sóng trước khi đổ lỗi cho mật khẩu.",
  blocks: [
    { type: "h2", text: "Băng tần và kênh" },
    { type: "p", text: "2.4 GHz đi xuyên tường khá hơn và có ít kênh. Trong cách quy hoạch thông dụng, chỉ kênh 1, 6 và 11 không chồng lên nhau. Kênh 1 và kênh 2 chồng nặng. 5 GHz có nhiều kênh hơn, ít thiết bị gia dụng chen vào, nhưng sóng yếu đi nhanh hơn khi qua tường. 6 GHz, gắn với Wi-Fi 6E và Wi-Fi 7, rộng và sạch hơn nữa, với điều kiện client cũng hỗ trợ." },
    { type: "p", text: "SSID là tên mạng mà người dùng nhìn thấy. Nhiều SSID có thể phát từ một AP, mỗi SSID map vào một VLAN khác nhau khi AP nối trunk về switch. Giấu SSID không phải biện pháp bảo mật. Ai cũng bắt được tên đó khi có client kết nối." },
    { type: "h2", text: "Sóng khỏe hay chỉ đứng gần?" },
    { type: "p", text: "RSSI là độ mạnh tín hiệu thu được, thường viết bằng dBm. Số này âm. −40 dBm là rất mạnh, −70 dBm bắt đầu đáng lo, dưới −80 dBm thì kết nối mong manh. SNR là tín hiệu trừ nhiễu. Sóng mạnh mà nhiễu cũng mạnh thì vẫn chậm. Nhiễu đến từ lò vi sóng, tai nghe Bluetooth, camera không dây rẻ, AP hàng xóm trùng kênh, và tường bê tông hoặc gương." },
    { type: "table", headers: ["Hiện tượng", "Nguyên nhân sóng hay nguyên nhân cấu hình"], rows: [
      ["Chỉ chết khi đứng ở cuối hành lang", "Cự ly và tường, thiếu AP hoặc sai kênh"],
      ["Chết đúng giờ trưa gần pantry", "Nhiễu lò vi sóng trên 2.4 GHz"],
      ["Thanh sóng đầy nhưng không vào được", "Sai mật khẩu, sai chuẩn WPA, VLAN hoặc DHCP"],
      ["Một kênh 2.4 GHz có bốn AP", "Nhiễu đồng kênh, phải quy hoạch lại 1-6-11"]
    ] },
    { type: "h2", text: "Khóa nào còn được dùng" },
    { type: "table", headers: ["Chuẩn", "Tình trạng"], rows: [
      ["WEP", "Gãy từ lâu, không dùng"],
      ["WPA", "Cũ, không còn chỗ trong mạng mới"],
      ["WPA2-PSK với AES", "Vẫn phổ biến cho mạng nhỏ"],
      ["WPA3", "Lựa chọn hiện tại, dùng SAE thay cho cách bắt tay cũ của WPA2"]
    ] },
    { type: "callout", tone: "remember", title: "Khớp cả hai đầu", text: "AP để WPA3-only mà laptop chỉ biết WPA2 thì máy không vào, dù gõ đúng mật khẩu. Đó là lỗi tham số bảo mật, sẽ gặp lại khi buổi 1.6 nhìn từ phía máy người dùng." },
    { type: "lab", title: "Lab 1.5 — Sơ đồ sóng một quán cà phê", goal: "Một mặt bằng tưởng tượng: quầy ở giữa, phòng kho tường dày phía sau, lò vi sóng ở quầy, hai AP đều đang để kênh 6 trên 2.4 GHz.", tasks: [
      "Chọn lại kênh 2.4 GHz cho hai AP.",
      "Khách trong kho bảo có sóng ngoài quầy nhưng vào kho thì rớt. Đề xuất một việc về mặt bằng, không đề xuất đổi mật khẩu.",
      "Chủ quán muốn khóa an toàn nhất mà laptop đời mới còn kết nối được nếu bạn chưa kiểm tra máy cũ. Bạn chọn WPA3-only hay WPA3 chuyển tiếp được về WPA2, và bạn cần hỏi thêm điều gì?"
    ], hint: "Hai AP sát nhau không được cùng kênh 1-6-11. Tường dày không chữa bằng mật khẩu. Máy cũ có thể chưa có WPA3.", solution: "Để một AP kênh 1 và AP kia kênh 11, hoặc 1 và 6 nếu kênh 11 đã bị hàng xóm chiếm nặng. Trong kho cần thêm AP hoặc đưa AP lại gần cửa kho; 5 GHz còn yếu hơn khi xuyên tường. Nếu chưa kiểm kê laptop, chọn chế độ WPA3 chuyển tiếp WPA2 và hỏi chủ có máy nào chỉ chạy WPA2 không. WPA3-only sẽ loại các máy đó." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nghĩ kênh 1, 2, 3 là ba kênh tự do vì số khác nhau. Trên 2.4 GHz chúng chồng phổ. Bộ ba dùng được là 1, 6, 11." }
  ],
  terms: [
    { t: "SSID", d: "Tên mạng không dây người dùng chọn." },
    { t: "RSSI", d: "Độ mạnh tín hiệu thu, đo bằng dBm, càng gần 0 càng mạnh." },
    { t: "SNR", d: "Khoảng cách giữa tín hiệu và nhiễu nền." },
    { t: "WPA3", d: "Chuẩn bảo mật Wi-Fi hiện tại, bắt tay bằng SAE." }
  ],
  quiz: [
    { q: "Bộ kênh 2.4 GHz không chồng nhau theo quy hoạch thông dụng?", choices: ["1, 2, 3", "1, 6, 11", "4, 5, 6", "9, 10, 11"], answer: 1, why: "1, 6 và 11 cách nhau đủ 5 kênh để không chồng phổ." },
    { q: "So với 2.4 GHz, 5 GHz thường thế nào?", choices: ["Đi xuyên tường tốt hơn và ít kênh hơn", "Nhiều kênh hơn, suy hao qua tường nhanh hơn", "Không bị nhiễu bao giờ", "Chỉ chạy WEP"], answer: 1, why: "5 GHz rộng kênh hơn và sạch hơn, đổi lại tầm xuyên vật cản kém hơn." },
    { q: "Chuẩn nào là lựa chọn an toàn hiện tại?", choices: ["WEP", "WPA", "WPA2 là trần cuối, WPA3 không tồn tại", "WPA3"], answer: 3, why: "WPA3 là chuẩn mới nhất trong đề. WEP và WPA không còn được chọn cho mạng mới." },
    { q: "RSSI −82 dBm và người dùng đứng sau hai bức tường bê tông. Việc hợp lý đầu tiên?", choices: ["Đổi toàn bộ ACL", "Xem lại vị trí AP hoặc thêm AP, đo nhiễu", "Rút gateway", "Tắt DNS"], answer: 1, why: "−82 dBm là sóng yếu. Tường là giải thích vật lý, chưa phải lỗi định tuyến." }
  ]
};
