window.LESSON = {
  id: "5.3",
  title: "Các cách quản trị mạng",
  exam: "5.3 — Network management approaches",
  keywords: ["controller", "cloud-managed", "IaC", "underlay", "overlay"],
  objectives: [
    "So sánh quản trị trên từng thiết bị, trên đám mây, bằng controller, bằng tự động hóa và bằng hạ tầng dạng mã",
    "Giải thích control plane khác data plane, và controller nói chuyện theo chiều nào",
    "Chọn một cách quản trị cho một quán cà phê, một công ty nhiều chi nhánh, và một phòng lab hay đổi"
  ],
  opener: "SSH vào từng switch là cách trung thực và chậm. Một người làm được mười cái, mười người làm được một trăm cái theo mười kiểu khác nhau. Các cách quản trị còn lại tồn tại để cùng một ý định được áp lên nhiều thiết bị, và để ý định đó nằm ở chỗ sửa được, xem lại được.",
  blocks: [
    { type: "h2", text: "Năm cách" },
    { type: "table", headers: ["Cách", "Ý định nằm ở đâu", "Hợp khi"], rows: [
      ["Trên thiết bị", "Running-config từng hộp, bạn SSH tới", "Lab, sự cố một máy, mạng rất nhỏ"],
      ["Trên đám mây", "Một trang quản trị nhà cung cấp, thiết bị gọi ra ngoài", "Nhiều chi nhánh nhỏ, ít người trực tại chỗ"],
      ["Controller", "Một bộ điều khiển nội bộ đẩy chính sách xuống", "Khuôn viên lớn, Wi-Fi có WLC, mạng SDN"],
      ["Tự động hóa", "Script hoặc Ansible chạy một việc", "Lặp một thay đổi trên nhiều hộp"],
      ["Hạ tầng dạng mã", "File trong Git mô tả trạng thái muốn có", "Môi trường hay dựng lại, cần xem ai đổi gì"]
    ] },
    { type: "p", text: "Chúng không loại trừ nhau. Một mạng có controller vẫn cần console khi controller chết. Ansible có thể đẩy cấu hình mà Git đang giữ. Đám mây vẫn là một dạng controller, chỉ là controller của người khác và bạn tới đó bằng trình duyệt." },
    { type: "h2", text: "Control plane và data plane" },
    { type: "p", text: "Data plane chuyển frame và packet của người dùng. Control plane quyết định bảng mà data plane dùng: MAC, route, chính sách. Trên router cổ điển, hai phần ngồi trong cùng một hộp. Trong kiến trúc controller, control plane được kéo lên controller. Hộp ở dưới còn data plane và làm theo." },
    { type: "p", text: "Underlay là mạng IP có thật, làm nhiệm vụ chở. Overlay là mạng logic xây bên trên, ví dụ các đường ống giữa switch và controller hoặc giữa các VTEP. Fabric là cả mảnh đó hoạt động như một hệ. Southbound là chiều controller nói với thiết bị. Northbound là chiều một ứng dụng hoặc một script nói với controller, thường bằng API. Bạn không cần thuộc tên sản phẩm. Bạn cần biết ai đang ra lệnh cho ai." },
    { type: "steps", title: "Ba nơi, ba cách", items: [
      "Quán một AP: vào trang đám mây của hãng, đổi SSID. Đừng viết Ansible cho một cái AP.",
      "Công ty 40 chi nhánh cùng một SSID nhân viên: controller hoặc trang đám mây, một chính sách, nhiều AP nhận.",
      "Phòng lab CCNA của bạn đổi bài mỗi tuần: file cấu hình trong một thư mục, Ansible đẩy lại từ đầu. Đó là tự động hóa. Nếu file được Git nhớ từng lần sửa, bạn đang chạm hạ tầng dạng mã."
    ] },
    { type: "lab", title: "Lab 5.3 — Chọn cách, đừng chọn đồ chơi", goal: "Viết một đoạn ngắn cho mỗi tình huống: cách quản trị chính, và một cách dự phòng khi cách chính chết.", tasks: [
      "Một switch học tập trên bàn, chỉ có bạn.",
      "Mười quán cà phê, mỗi quán một router, không có kỹ sư tại quán.",
      "Khuôn viên có hàng trăm AP và một đội mạng muốn một chỗ đổi VLAN cho SSID.",
      "Một phòng thí nghiệm cần dựng lại đúng bài 2.1 sau mỗi khóa học."
    ], hint: "Dự phòng của đám mây và controller gần như luôn là cổng console hoặc một đường quản trị ngoài băng, vì khi data plane còn mà control plane từ xa chết thì SSH cũng có thể chết theo.", solution: "1: trên thiết bị, dự phòng là console. 2: đám mây, dự phòng là một người mang laptop tới quán cắm console khi thiết bị mất kết nối ra đám mây. 3: controller, dự phòng là quản trị local trên WLC hoặc AP. 4: tự động hóa từ file mẫu, và nếu file nằm trong Git thì gọi được là hạ tầng dạng mã. Dự phòng vẫn là gõ tay từ console khi script làm hỏng một hộp." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Gọi mọi trang web là cloud-managed. Trang chỉ để xem biểu đồ mà không đẩy được cấu hình thì đó là giám sát. Quản trị là chỗ ý định thay đổi được thiết bị." }
  ],
  terms: [
    { t: "Control plane", d: "Phần ra quyết định: route, chính sách, ai được nói chuyện." },
    { t: "Data plane", d: "Phần chuyển dữ liệu của người dùng theo quyết định đã có." },
    { t: "Southbound", d: "Chiều từ controller xuống thiết bị." },
    { t: "Infrastructure as code", d: "Trạng thái hạ tầng viết thành file được quản lý như mã nguồn." }
  ],
  quiz: [
    { q: "SSH lần lượt vào từng router để sửa thuộc cách nào?", choices: ["Trên thiết bị", "Hạ tầng dạng mã", "Chỉ southbound API", "RA guard"], answer: 0, why: "Ý định nằm trong từng running-config và bạn tới tận nơi bằng SSH." },
    { q: "Controller đẩy chính sách xuống switch theo chiều nào?", choices: ["Northbound", "Southbound", "Eastbound bắt buộc", "Chỉ bằng TFTP"], answer: 1, why: "Southbound là controller tới thiết bị. Northbound là ứng dụng tới controller." },
    { q: "File trong Git mô tả VLAN của mọi switch, công cụ áp file đó. Đây là hướng nào?", choices: ["Chỉ là một banner motd", "Hạ tầng dạng mã", "Một native VLAN", "PAT"], answer: 1, why: "Trạng thái muốn có nằm trong file được kiểm soát phiên bản." },
    { q: "Data plane khác control plane ở điểm nào?", choices: ["Data plane chuyển traffic người dùng, control plane xây bảng và chính sách", "Hai cái là một, chỉ khác tên Cisco", "Data plane chỉ là Wi-Fi", "Control plane chỉ là cáp"], answer: 0, why: "Tách hai mặt này để hiểu vì sao controller có thể ra lệnh trong khi hộp vẫn chuyển gói." }
  ]
};
