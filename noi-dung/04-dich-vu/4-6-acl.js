window.LESSON = {
  id: "4.6",
  title: "ACL IPv4",
  exam: "4.6 — Configure IPv4 ACLs",
  keywords: ["standard", "extended", "wildcard", "implicit deny"],
  objectives: [
    "Viết standard ACL và extended ACL, dạng đánh số và dạng đặt tên",
    "Đặt standard gần đích, extended gần nguồn, và luôn nhớ dòng deny cuối không viết ra",
    "Sửa một ACL vừa chặn đúng kẻ cần chặn vừa vô tình làm câm cả mạng"
  ],
  opener: "ACL là người gác cửa đọc danh sách từ trên xuống, gặp dòng khớp đầu tiên thì làm ngay, không đọc tiếp. Không dòng nào khớp thì người đó bị từ chối, dù bạn không viết dòng từ chối. Hầu hết sự cố ACL trong lab là một danh sách đúng ý tác giả và chết vì dòng vô hình ở cuối.",
  blocks: [
    { type: "h2", text: "Standard chỉ nhìn địa chỉ nguồn" },
    { type: "p", text: "Dải số cổ điển là 1–99 và 1300–1999. Vì chỉ biết nguồn, standard ACL nên đặt gần đích: để muộn, khi gói sắp tới nơi, kẻo chặn nhầm người đó khi họ còn đang đi tới một chỗ khác hợp pháp." },
    { type: "cli", title: "Cấm một LAN vào một server, cho phần còn lại", code: "R1(config)# access-list 10 deny 192.168.10.0 0.0.0.255\nR1(config)# access-list 10 permit any\nR1(config)# interface GigabitEthernet0/1\nR1(config-if)# ip access-group 10 out" },
    { type: "p", text: "Gi0/1 giả sử hướng về server. `out` xét gói lúc rời router để đi tới server. Quên `permit any` thì implicit deny cấm luôn kế toán, giám đốc và chính bạn." },
    { type: "h2", text: "Extended nhìn được nhiều hơn" },
    { type: "p", text: "Dải 100–199 và 2000–2699. Extended lọc giao thức, nguồn, đích, cổng. Vì biết đích, nó nên đứng gần nguồn để gói xấu chết sớm. Named ACL dễ sửa hơn vì có số thứ tự dòng." },
    { type: "cli", title: "Chỉ cho một LAN vào web của một server, cấm phần còn lại tới server đó", code: "R1(config)# ip access-list extended CHAN_WEB\nR1(config-ext-nacl)# permit tcp 192.168.10.0 0.0.0.255 host 203.0.113.10 eq 80\nR1(config-ext-nacl)# permit tcp 192.168.10.0 0.0.0.255 host 203.0.113.10 eq 443\nR1(config-ext-nacl)# deny ip any host 203.0.113.10\nR1(config-ext-nacl)# permit ip any any\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip access-group CHAN_WEB in" },
    { type: "p", text: "`host` là wildcard 0.0.0.0, một địa chỉ. `any` là 0.0.0.0 255.255.255.255. `eq 80` là cổng đích. Đặt ACL `in` trên cổng nhận traffic từ người dùng. `show access-lists` hiện số lần mỗi dòng khớp. Số không tăng nghĩa là traffic không đi qua cửa đó, hoặc bạn dán nhầm chiều in/out." },
    { type: "steps", title: "Wildcard của một khối, không chỉ /24", items: [
      "Muốn khớp 192.168.4.0 đến 192.168.7.255.",
      "Đó là bốn mạng /24 liền nhau, bắt đầu tại một bội số của 4.",
      "Octet thứ ba được phép khác ở 2 bit cuối. Wildcard 0.0.3.255.",
      "Dòng: permit ip 192.168.4.0 0.0.3.255 any."
    ] },
    { type: "callout", tone: "remember", title: "Thứ tự là một phần của ý nghĩa", text: "Dòng cụ thể viết trước dòng khái quát. `deny host` đứng sau `permit any` thì không bao giờ được đọc. Muốn chèn vào named ACL, gõ số thứ tự nhỏ hơn dòng đang chặn mất." },
    { type: "lab", title: "Lab 4.6 — Mở web, đóng Telnet, đừng giết phần còn lại", goal: "LAN người dùng 192.168.10.0/24 nối R1. Server 10.0.0.10 ở mạng kia, mở web 80 và 443, cũng đang mở Telnet 23. Bạn đứng ở R1.", tasks: [
      "Viết named extended ACL: cấm TCP 23 tới server, cho phép phần còn lại.",
      "Gắn đúng cổng và đúng chiều. Ping từ PC tới server vẫn được. Telnet thì không.",
      "Thêm một standard ACL cấm nguyên LAN 192.168.50.0/24 tới server, đặt gần server.",
      "Xóa permit any trong ACL đầu và ghi lại điều PC không làm được nữa."
    ], hint: "deny tcp any host 10.0.0.10 eq 23 rồi permit ip any any. Chiều in là lúc gói bước vào từ phía nguồn.", solution: "ip access-list extended CHAN_TELNET rồi deny tcp 192.168.10.0 0.0.0.255 host 10.0.0.10 eq 23, permit ip any any. Gắn in trên cổng LAN. Standard: access-list 10 deny 192.168.50.0 0.0.0.255, permit any, gắn out trên cổng phía server. Bỏ permit ip any any thì implicit deny chặn luôn ping và web. show access-lists phải tăng counter ở dòng deny khi bạn thử Telnet." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "ACL không lọc traffic do chính router tạo ra theo cùng một cách như traffic đi ngang. Ping từ router vẫn được trong khi PC chết. Hãy thử từ PC trước khi kết luận ACL hỏng." }
  ],
  terms: [
    { t: "Standard ACL", d: "Chỉ so địa chỉ nguồn. Số 1–99, 1300–1999." },
    { t: "Extended ACL", d: "So giao thức, nguồn, đích và cổng. Số 100–199, 2000–2699." },
    { t: "Implicit deny", d: "Dòng deny mọi thứ không viết ra, đứng ở cuối mỗi ACL." },
    { t: "Wildcard", d: "Bit 0 là phải khớp, bit 1 là được khác. Ngược với subnet mask." }
  ],
  quiz: [
    { q: "Standard ACL lọc dựa trên gì?", choices: ["Chỉ IP nguồn", "Cổng đích", "IP nguồn và IP đích", "Địa chỉ MAC"], answer: 0, why: "Muốn nhìn đích hoặc cổng thì phải dùng extended." },
    { q: "Gói không khớp dòng nào thì sao?", choices: ["Được phép", "Bị chặn bởi implicit deny", "Được phép và bị ghi log", "Bị gửi vào default route"], answer: 1, why: "Cuối ACL luôn có deny tất cả. Muốn phần còn lại đi thì viết permit." },
    { q: "Vì sao extended ACL nên đặt gần nguồn?", choices: ["Vì nó chỉ biết nguồn", "Vì nó biết đích nên có thể loại gói sớm", "Vì gần nguồn thì không cần wildcard", "Vì implicit deny chỉ chạy ở cổng access"], answer: 1, why: "Biết đích rồi thì chặn ngay từ cửa vào, đỡ mang gói xấu đi khắp mạng." },
    { q: "Dòng `permit ip any any` đứng trước `deny tcp any host 10.0.0.10 eq 23`. Telnet có bị cấm?", choices: ["Có", "Không, vì permit any đã khớp trước", "Chỉ bị cấm vào thứ Bảy", "Chỉ với IPv6"], answer: 1, why: "Dòng đầu khớp thì dừng. Deny phía sau không được đọc." }
  ]
};
