window.LESSON = {
  id: "1.3",
  title: "Sửa địa chỉ IPv4 và chia subnet",
  exam: "1.3 — Troubleshoot IPv4 addressing and subnetting",
  keywords: ["VLSM", "private", "block size", "broadcast"],
  objectives: [
    "Tính mạng, host đầu, host cuối và broadcast của một địa chỉ kèm prefix",
    "Chia một mạng theo số host hoặc theo số mạng con, kể cả khi các mạng con không bằng nhau",
    "Nhìn một máy không ping được gateway và chỉ ra sai mask, sai mạng, hoặc dùng nhầm dải private"
  ],
  opener: "Subnet là kỹ năng CCNA bị hỏi nhiều nhất, và cũng là chỗ người mới bỏ cuộc vì cố nhớ bảng. Bạn chỉ cần một phép: mask cho biết bước nhảy. Buổi 0.4 đã có nhị phân. Hôm nay dùng nó để chia một văn phòng thành nhiều phòng mà không lãng phí địa chỉ.",
  blocks: [
    { type: "h2", text: "Địa chỉ nào được phép dùng ở đâu" },
    { type: "table", headers: ["Dải", "Tên", "Ghi nhớ"], rows: [
      ["10.0.0.0/8", "Private", "Mạng trong, không đi thẳng ra Internet"],
      ["172.16.0.0/12", "Private", "Từ 172.16.0.0 đến 172.31.255.255, không phải mọi 172"],
      ["192.168.0.0/16", "Private", "Mạng nhà và lab"],
      ["169.254.0.0/16", "APIPA", "Máy tự gán khi không gặp DHCP"],
      ["127.0.0.0/8", "Loopback", "Máy nói chuyện với chính nó"]
    ] },
    { type: "p", text: "172.32.1.1 không còn private. 192.169.1.1 cũng không. Nhầm biên này là một dạng câu hỏi rất hay gặp. Địa chỉ private ra Internet phải nhờ NAT, học ở buổi 4.3." },
    { type: "h2", text: "Phép bước nhảy" },
    { type: "p", text: "Lấy prefix, tìm octet đang bị cắt ngang. Đó là octet đáng chú ý. Block size bằng 256 trừ giá trị mask ở octet đó. Địa chỉ mạng là bội số của block, nằm ngay dưới hoặc đúng địa chỉ bạn đang xét. Broadcast là một đơn vị trước mạng kế tiếp." },
    { type: "steps", title: "Ví dụ: 172.16.20.45/20", items: [
      "/20 che hết hai octet đầu và thêm 4 bit ở octet thứ ba. Mask là 255.255.240.0.",
      "Octet đáng chú ý là octet thứ ba. Block = 256 − 240 = 16.",
      "Các mạng nhảy 0, 16, 32, 48... Số 20 nằm giữa 16 và 32, nên mạng là 172.16.16.0.",
      "Broadcast là địa chỉ ngay trước 172.16.32.0, tức 172.16.31.255.",
      "Host đầu 172.16.16.1. Host cuối 172.16.31.254. Số host = 2 mũ (32−20) − 2 = 4094."
    ] },
    { type: "steps", title: "Ví dụ dễ hơn để kiểm tra tay: 192.168.1.70/26", items: [
      "Mask 255.255.255.192. Block ở octet cuối = 256 − 192 = 64.",
      "Các mạng: .0, .64, .128, .192. Số 70 thuộc mạng 192.168.1.64.",
      "Broadcast 192.168.1.127. Host .65 đến .126. Có 62 host."
    ] },
    { type: "callout", tone: "remember", title: "Wildcard là mask lật ngược", text: "Bit 0 của wildcard nghĩa là phải khớp, bit 1 nghĩa là được phép khác. /24 có wildcard 0.0.0.255. /20 có wildcard 0.0.15.255. ACL và OSPF dùng wildcard, không dùng mask. Đừng đưa 255.255.255.0 vào lệnh access-list." },
    { type: "h2", text: "Chia theo nhu cầu" },
    { type: "p", text: "Cần ít nhất 50 host mỗi phòng thì mượn đủ bit host: 64 địa chỉ (2 mũ 6) trừ 2 còn 62, đủ 50. Vậy mỗi phòng là /26. Một /24 chứa được bốn /26. Cần các phòng không đều nhau thì chia miếng lớn trước: phòng 100 host lấy /25, phòng 50 host lấy /26, đường nối hai router chỉ cần /30 vì chỉ có hai đầu." },
    { type: "table", headers: ["Prefix", "Block octet cuối", "Host dùng được"], rows: [
      ["/25", "128", "126"],
      ["/26", "64", "62"],
      ["/27", "32", "30"],
      ["/28", "16", "14"],
      ["/29", "8", "6"],
      ["/30", "4", "2"]
    ] },
    { type: "h2", text: "Sửa một máy cấu hình sai" },
    { type: "p", text: "Máy 192.168.1.10/24, gateway 192.168.1.1 thì hợp lệ. Máy 192.168.1.10/25 mà gateway là 192.168.1.200 thì gateway nằm ở nửa mạng kia: /25 cắt tại .128, .200 thuộc 192.168.1.128/25. Máy sẽ không gửi gói tới gateway vì nó tưởng gateway ở mạng khác, hoặc gửi sai hướng. Khi xử lý sự cố địa chỉ, hãy tự tính lại mạng của host và mạng của gateway trước khi trách cáp." },
    { type: "link", href: "cong-cu/subnet.html", label: "Mở công cụ luyện subnet" },
    { type: "link", href: "phan-xa.html", label: "Phản xạ subnet: 5 câu trắc nghiệm, có lời giải" },
    { type: "lab", title: "Lab 1.3 — Chia 192.168.10.0/24 cho một văn phòng", goal: "Làm trên giấy. Sau đó mới mở công cụ để đối chiếu.", tasks: [
      "Phòng kế toán cần 60 host, phòng kỹ thuật 25 host, phòng khách 10 host, đường nối router cần 2 host. Chia VLSM, mạng lớn trước.",
      "Ghi với mỗi mạng: prefix, địa chỉ mạng, host đầu, host cuối, broadcast.",
      "Một PC khách được gán 192.168.10.200/27 và gateway 192.168.10.222. Nói PC này có ở cùng mạng với gateway không, dựa trên cách chia của bạn hoặc trên /27 thuần."
    ], hint: "60 host cần /26 (62 host). 25 host cần /27 (30). 10 host cần /28 (14). Hai đầu router là /30. Đừng bắt đầu từ mạng nhỏ vì mạng lớn có thể không còn chỗ thẳng hàng.", solution: "Một phương án: kế toán 192.168.10.0/26, host .1–.62, broadcast .63. Kỹ thuật 192.168.10.64/27, host .65–.94, broadcast .95. Khách 192.168.10.96/28, host .97–.110, broadcast .111. Link 192.168.10.112/30, hai host .113 và .114, broadcast .115. Với /27, block 32, .200 thuộc mạng .192, broadcast .223, gateway .222 cùng mạng .192/27. Chúng cùng mạng với nhau, nhưng .200 không thuộc phòng khách trong phương án VLSM phía trên." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Lấy 2 mũ n rồi quên trừ 2, nên nhận /27 có 32 host dùng được. Chỉ có /31 mới dùng cả hai địa chỉ, và /31 dành cho link điểm-nối-điểm, không dành cho một phòng có gateway theo kiểu broadcast." }
  ],
  terms: [
    { t: "Block size", d: "Bước nhảy của địa chỉ mạng ở octet đang bị cắt." },
    { t: "VLSM", d: "Chia một mạng thành các mạng con không cùng kích thước." },
    { t: "Private address", d: "Địa chỉ chỉ dùng nội bộ: 10/8, 172.16/12, 192.168/16." },
    { t: "Wildcard mask", d: "Mask đảo bit, dùng trong ACL và một số lệnh OSPF." }
  ],
  quiz: [
    { q: "192.168.1.0/27 có bao nhiêu host dùng được?", choices: ["14", "30", "32", "62"], answer: 1, why: "/27 còn 5 bit host, 32 địa chỉ, trừ mạng và broadcast còn 30." },
    { q: "Địa chỉ nào là private?", choices: ["172.32.5.5", "172.31.5.5", "192.169.0.1", "11.1.1.1"], answer: 1, why: "172.16 đến 172.31 là private. 172.32 đã ra khỏi /12." },
    { q: "Mạng của 10.1.5.9/22 là gì?", choices: ["10.1.5.0", "10.1.4.0", "10.1.0.0", "10.1.8.0"], answer: 1, why: "/22 có block 4 ở octet thứ ba. 5 nằm trong bước 4, nên mạng là 10.1.4.0, broadcast 10.1.7.255." },
    { q: "PC 192.168.1.10/25 không tới được gateway 192.168.1.200. Lý do địa chỉ nào đúng?", choices: ["10 và 200 cách nhau quá 50 số", "Chúng thuộc hai mạng /25 khác nhau", "200 là broadcast của /25", "/25 cấm dùng gateway"], answer: 1, why: "/25 cắt tại 128. .10 thuộc 0/25, .200 thuộc 128/25. Gateway phải cùng mạng với PC." }
  ]
};
