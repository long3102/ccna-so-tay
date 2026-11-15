window.LESSON = {
  id: "4.5",
  title: "VPN IPsec",
  exam: "4.5 — Describe IPsec remote-access and site-to-site VPNs",
  keywords: ["ESP", "AH", "tunnel mode", "transport mode", "IKE"],
  objectives: [
    "Phân biệt VPN site-to-site với VPN người dùng từ xa",
    "Nói ESP khác AH, và tunnel mode khác transport mode",
    "Nhìn một mô tả gói và chỉ ra gói đó đang che những gì"
  ],
  opener: "Đường Internet không phải một ống riêng giữa hai văn phòng. IPsec biến một phần đường đó thành ống có khóa: người ngoài có thể thấy có ống, nhưng không đọc được bên trong, và không sửa được mà ống vẫn nhận. Đề v2.0 bảo bạn mô tả, không bắt bạn thuộc một dãy lệnh crypto dài. Hiểu ai nói chuyện với ai, và gói bị bọc đến mức nào.",
  blocks: [
    { type: "h2", text: "Hai kiểu đường ống" },
    { type: "compare", left: { title: "Site-to-site", items: ["Hai router hoặc hai firewall làm cửa", "Máy trong văn phòng không tự chạy VPN", "Thường dùng tunnel mode", "Một chính sách cho cả một mạng"] }, right: { title: "Remote access", items: ["Laptop hoặc điện thoại tự chạy phần mềm VPN", "Người dùng ở quán cà phê vẫn vào mạng công ty", "Xác thực từng người, hay đi với AAA", "Mỗi máy một phiên"] } },
    { type: "p", text: "IKE, ngày nay là IKEv2, là cuộc thương lượng trước khi có dữ liệu. Hai đầu chứng minh mình đúng là mình, chọn thuật toán, và tạo khóa. Xong việc đó mới có IPsec SA, đường thật sự chở dữ liệu. Nếu IKE không xong thì chưa có gì để ping bên trong, dù hai cổng public vẫn ping nhau được." },
    { type: "h2", text: "ESP, AH, và hai cách bọc" },
    { type: "table", headers: ["Thành phần", "Việc nó làm"], rows: [
      ["AH", "Chống sửa gói, không mã hóa. Người ngoài vẫn đọc được nội dung."],
      ["ESP", "Mã hóa và chống sửa. Đây là lựa chọn khi bạn cần bí mật."],
      ["Tunnel mode", "Bọc cả gói IP gốc, thêm một header IP mới của hai cửa VPN. Dùng cho site-to-site."],
      ["Transport mode", "Giữ header IP gốc, chỉ bảo vệ phần bên trong. Hợp khi hai đầu chính là hai máy nói chuyện."]
    ] },
    { type: "steps", title: "Ví dụ: PC 192.168.10.10 gửi tới server 192.168.20.10 qua Internet", items: [
      "PC gửi một gói IP bình thường tới gateway của nó. PC không biết VPN.",
      "Router văn phòng A thấy đích thuộc mạng văn phòng B, đưa gói vào IPsec tunnel.",
      "Gói mới có IP nguồn là địa chỉ public của router A và IP đích là public của router B. Bên trong, ESP che gói gốc 192.168.10.10 tới 192.168.20.10.",
      "Người nghe lén trên Internet thấy A nói với B, không thấy địa chỉ private và không đọc được dữ liệu.",
      "Router B mở ESP, lấy gói gốc, chuyển vào LAN."
    ] },
    { type: "callout", tone: "remember", title: "Tunnel che địa chỉ thật, transport thì không", text: "Muốn giấu cả việc 192.168.10.10 đang nói với 192.168.20.10, bạn cần tunnel mode. Transport mode còn để header IP gốc trên đường. Site-to-site qua Internet gần như luôn là tunnel cộng ESP." },
    { type: "p", text: "GRE là một đường ống khác, không mã hóa, nhưng chở được multicast và giao thức định tuyến. Người ta hay để GRE bên trong rồi IPsec bên ngoài khi OSPF phải chạy qua Internet. Với buổi này, chỉ cần biết GRE không thay ESP: không có ESP hoặc một lớp mã hóa khác thì GRE vẫn bị đọc." },
    { type: "lab", title: "Lab 4.5 — Gắn nhãn cho bốn gói tưởng tượng", goal: "Không cần lệnh crypto. Với mỗi mô tả, ghi: site-to-site hay remote access, ESP hay chỉ toàn vẹn, tunnel hay transport.", tasks: [
      "Hai firewall chi nhánh, người ngoài chỉ thấy IP public của hai firewall, dữ liệu không đọc được.",
      "Một laptop ở sân bay tự bắt tay tới firewall công ty rồi nhận địa chỉ nội bộ.",
      "Hai máy chủ trên cùng một LAN mã hóa phần dữ liệu nhưng header IP vẫn là địa chỉ của chính hai máy.",
      "Một đường chỉ chống sửa, nội dung vẫn đọc được. Nói vì sao nó chưa đủ cho dữ liệu kế toán."
    ], hint: "Che cả gói gốc là tunnel. Máy người dùng tự tham gia là remote access. Đọc được nội dung nghĩa là chưa có mã hóa của ESP.", solution: "1: site-to-site, ESP, tunnel. 2: remote access, ESP, thường cũng tunnel. 3: transport mode giữa hai host, ESP nếu dữ liệu không đọc được. 4: AH hoặc một cơ chế chỉ integrity. Kế toán cần bí mật nên cần ESP, không chỉ chống sửa." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Nghĩ VPN là một giao thức định tuyến. VPN chở gói đã được bảo vệ. Việc chọn đường vẫn là routing. Một tunnel up mà không có route đẩy mạng nhánh vào tunnel thì ping vẫn chết." }
  ],
  terms: [
    { t: "IKE", d: "Phiên thương lượng khóa và danh tính trước IPsec." },
    { t: "ESP", d: "Bọc mã hóa và toàn vẹn trong IPsec." },
    { t: "AH", d: "Chỉ toàn vẹn, không mã hóa." },
    { t: "Tunnel mode", d: "Thêm header IP mới và bọc cả gói gốc." }
  ],
  quiz: [
    { q: "Thành phần IPsec nào mã hóa dữ liệu?", choices: ["AH", "ESP", "CDP", "STP"], answer: 1, why: "ESP mã hóa và kiểm tra toàn vẹn. AH chỉ kiểm tra toàn vẹn." },
    { q: "Site-to-site qua Internet thường dùng mode nào để che gói IP gốc?", choices: ["Transport", "Tunnel", "Access", "Native"], answer: 1, why: "Tunnel mode bọc cả gói gốc trong một header IP mới của hai cửa VPN." },
    { q: "Laptop nhân viên tự tạo phiên về công ty. Đó là kiểu VPN nào?", choices: ["Site-to-site", "Remote access", "Chỉ GRE", "Một trunk 802.1Q"], answer: 1, why: "Đầu xa là thiết bị của người dùng, không phải router của cả một mặt bằng." },
    { q: "AH bảo vệ được điều gì?", choices: ["Làm nội dung không đọc được", "Phát hiện gói bị sửa, nhưng không giấu nội dung", "Cấp địa chỉ DHCP", "Thay OSPF"], answer: 1, why: "Không có mã hóa thì vẫn đọc được. AH chỉ cho biết gói có còn nguyên không." }
  ]
};
