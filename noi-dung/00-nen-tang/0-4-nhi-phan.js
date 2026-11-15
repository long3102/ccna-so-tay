window.LESSON = {
  id: "0.4",
  title: "Nhị phân và địa chỉ IPv4 lần đầu",
  exam: "Nền tảng cho mục 1.3",
  keywords: ["octet", "mask", "/24", "gateway"],
  objectives: [
    "Đổi một octet giữa thập phân và nhị phân không cần máy tính",
    "Đọc một địa chỉ IPv4 kèm mask và chỉ ra phần mạng, phần host",
    "Giải thích default gateway là cái cửa chứ không phải cả Internet"
  ],
  opener: "Máy tính không thấy số 192. Nó thấy tám công tắc bật hoặc tắt. Một địa chỉ IPv4 là 32 công tắc, viết thành bốn nhóm cho dễ nhìn. Subnet, ACL và định tuyến sau này chỉ là cách chọn nhóm công tắc nào phải giống nhau.",
  blocks: [
    { type: "h2", text: "Tám bit, một octet" },
    { type: "p", text: "Mỗi bit có một giá trị nếu nó bật: 128, 64, 32, 16, 8, 4, 2, 1. Cộng các giá trị đang bật thì ra số thập phân từ 0 đến 255. Hết 255 là hết một octet, không có octet 256." },
    { type: "steps", title: "Ví dụ: 192 và 168", items: [
      "192 = 128 + 64. Nhị phân `11000000`.",
      "168 = 128 + 32 + 8. Nhị phân `10101000`.",
      "10 = 8 + 2. Nhị phân `00001010`. Viết đủ tám bit, đừng bỏ số 0 bên trái khi đang ở trong một octet."
    ] },
    { type: "h2", text: "Địa chỉ và mask" },
    { type: "p", text: "IPv4 viết bốn octet, ví dụ `192.168.10.25`. Mask nói bao nhiêu bit bên trái là phần mạng. `/24` nghĩa là 24 bit mạng, tức mask `255.255.255.0`. Ba octet đầu giống nhau thì cùng mạng, octet cuối phân biệt từng máy." },
    { type: "table", headers: ["Prefix", "Mask", "Ý nghĩa với người mới"], rows: [
      ["/8", "255.0.0.0", "Octet đầu là mạng, còn lại là host. Rất lớn."],
      ["/16", "255.255.0.0", "Hai octet đầu là mạng."],
      ["/24", "255.255.255.0", "Mạng LAN kinh điển, 254 host dùng được."],
      ["/32", "255.255.255.255", "Đúng một địa chỉ, gọi là host route."]
    ] },
    { type: "steps", title: "Ví dụ: 192.168.10.25/24 có ở cùng mạng với 192.168.10.200 không?", items: [
      "Mask /24 che ba octet đầu.",
      "Hai địa chỉ đều có 192.168.10. Phần mạng giống nhau.",
      "25 và 200 chỉ là hai host trong cùng mạng. Chúng nói chuyện qua switch, chưa cần router.",
      "192.168.11.25 khác octet thứ ba, nên khác mạng. Muốn tới đó phải qua gateway."
    ] },
    { type: "callout", tone: "remember", title: "Gateway là cửa ra", text: "Default gateway là địa chỉ IP của router ngồi cùng mạng với máy bạn. Máy chỉ nhờ gateway khi đích không cùng mạng. Gateway chết thì bạn vẫn ping được người ngồi cùng mạng, và không ra ngoài được." },
    { type: "p", text: "Trong một mạng /24, địa chỉ đầu `192.168.10.0` là địa chỉ mạng, không gán cho máy. Địa chỉ cuối `192.168.10.255` là broadcast của mạng đó. Host dùng được là `.1` đến `.254`. Buổi 1.3 sẽ chia những mạng này thành miếng nhỏ hơn." },
    { type: "lab", title: "Lab 0.4 — Mười octet và ba cặp địa chỉ", goal: "Làm trên giấy. Không mở công cụ subnet ở buổi này.", tasks: [
      "Đổi sang nhị phân: 255, 192, 168, 10, 224, 7.",
      "Với 10.1.1.8/8 và 10.9.9.9/8, nói chúng có cùng mạng không.",
      "Máy 192.168.1.10/24, gateway 192.168.1.1. Máy muốn tới 192.168.1.20 thì gói có cần tới gateway không? Muốn tới 8.8.8.8 thì sao?"
    ], hint: "Cùng mạng khi phần bị mask che giống nhau. /8 chỉ nhìn octet đầu.", solution: "255 = 11111111, 192 = 11000000, 168 = 10101000, 10 = 00001010, 224 = 11100000, 7 = 00000111. Hai địa chỉ 10.x cùng mạng /8. Tới 192.168.1.20 là cùng mạng, không cần gateway. Tới 8.8.8.8 khác mạng, phải gửi tới 192.168.1.1." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nghĩ mask 255.255.255.0 có nghĩa là mạng chỉ được phép đặt địa chỉ kết thúc bằng 0. Không. Đó là phần mạng dài 24 bit. Host vẫn là octet cuối, từ 1 đến 254." }
  ],
  terms: [
    { t: "Octet", d: "Một nhóm 8 bit, viết thành một số từ 0 đến 255." },
    { t: "Prefix", d: "Số bit mạng, viết sau dấu /, ví dụ /24." },
    { t: "Default gateway", d: "Router cùng mạng, nhận các gói có đích ở mạng khác." },
    { t: "Broadcast định hướng", d: "Địa chỉ cuối của một mạng, ví dụ 192.168.10.255/24, mọi host trong mạng đó đều nghe." }
  ],
  quiz: [
    { q: "Số 224 viết bằng tám bit là gì?", choices: ["11100000", "11000000", "11110000", "10101010"], answer: 0, why: "128+64+32 = 224, nên ba bit đầu bật." },
    { q: "192.168.5.4/24 và 192.168.5.250/24 có cùng mạng không?", choices: ["Không, vì octet cuối khác xa", "Có, vì 24 bit đầu giống nhau", "Chỉ khi gateway giống nhau", "Chỉ khi cùng switch vật lý"], answer: 1, why: "/24 so ba octet đầu. Cả hai đều là 192.168.5." },
    { q: "Địa chỉ nào không được gán cho một PC trong mạng 10.0.0.0/8 theo cách dùng thông thường của LAN?", choices: ["10.1.1.1", "10.255.255.254", "10.0.0.0", "10.20.30.40"], answer: 2, why: "10.0.0.0 là địa chỉ mạng. 10.255.255.255 là broadcast của cả /8." },
    { q: "PC ping được máy bên cạnh nhưng không ping được 8.8.8.8, gateway cũng không trả lời. Nghi phạm sát nhất?", choices: ["DNS", "Đường tới gateway hoặc chính gateway", "Sai SSID", "Hết địa chỉ MAC"], answer: 1, why: "Cùng mạng vẫn nói chuyện được nên cáp và IP cục bộ còn sống. Cửa ra mạng khác đang đóng." }
  ]
};
