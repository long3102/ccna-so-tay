window.LESSON = {
  id: "1.2",
  title: "Hypervisor, máy ảo và container",
  exam: "1.2 — Hypervisors, virtual machines, and containers",
  keywords: ["type 1", "type 2", "VM", "container", "vNIC"],
  objectives: [
    "Giải thích hypervisor loại 1 khác loại 2 ở chỗ nó ngồi trên cái gì",
    "So sánh máy ảo và container bằng kernel và độ nặng",
    "Nói được một máy ảo nối vào mạng công ty bằng cách nào"
  ],
  opener: "Ngày trước một ứng dụng chiếm nguyên một thùng sắt. Bây giờ một thùng sắt chạy nhiều máy ảo, và trong một máy ảo lại có nhiều container. Bạn vẫn phải cấp cho chúng VLAN, địa chỉ và cổng switch. Ảo hóa không xóa mạng. Nó chỉ nhân số host lên.",
  blocks: [
    { type: "h2", text: "Hypervisor là người chia phần cứng" },
    { type: "p", text: "Hypervisor tạo máy ảo. Mỗi máy ảo tưởng mình có CPU, RAM, đĩa và một hoặc nhiều card mạng riêng. Hệ điều hành bên trong máy ảo gọi là guest. Loại 1 cài thẳng lên phần cứng, không cần một hệ điều hành chủ bên dưới để mà chạy. VMware ESXi, KVM trên máy chủ, và Hyper-V khi nó chiếm quyền điều khiển phần cứng, thuộc nhóm này. Loại 2 là một phần mềm trong Windows hoặc macOS của bạn. VirtualBox và VMware Workstation thuộc nhóm này, hợp lab, không phải cách chạy trung tâm dữ liệu." },
    { type: "compare", left: { title: "Máy ảo", items: ["Có hệ điều hành riêng, khởi động vài chục giây trở lên", "Cách ly mạnh vì kernel khác nhau", "Tốn RAM hơn", "Card mạng ảo gọi là vNIC"] }, right: { title: "Container", items: ["Dùng chung kernel với máy chủ", "Khởi động tính bằng giây", "Nhẹ, đóng gói ứng dụng và thư viện", "Cách ly yếu hơn máy ảo"] } },
    { type: "h2", text: "Chúng cắm vào mạng thật bằng gì" },
    { type: "p", text: "vNIC của máy ảo nối vào một switch ảo trong hypervisor. Switch ảo đó đi ra ngoài qua một cổng vật lý của máy chủ, thường là một trunk vì nhiều VLAN. Máy ảo nào thuộc VLAN 10 thì vNIC của nó được gán VLAN 10. Với switch bên ngoài, máy chủ ảo hóa trông như một host cần trunk, không phải một PC chỉ cần access. Buổi 2.2 sẽ cấu hình cổng đó." },
    { type: "topo", title: "Một máy chủ, hai máy ảo, một trunk", code: "VM web VLAN 10 --+\n                    +-- switch ao -- NIC may chu == trunk == SW1\nVM db  VLAN 20 --+" },
    { type: "callout", tone: "remember", title: "Container không phải máy ảo nhỏ xíu", text: "Container không mang một bản Windows hay Linux thứ hai. Nó mượn kernel của host. Vì vậy bạn không chạy container Windows trên một host chỉ có kernel Linux. Cũng vì chung kernel nên một lỗ hổng kernel ảnh hưởng cả đám." },
    { type: "p", text: "Trong lab CCNA, mỗi PC của Packet Tracer cũng là một host giả. Cách nghĩ giống máy ảo: nó có MAC, có IP, và cắm vào một cổng switch. Khi đề nói virtualized host, hãy hỏi VLAN nào được phép đi qua cổng nối lên máy chủ." },
    { type: "lab", title: "Lab 1.2 — Chọn nền cho ba việc", goal: "Không cần cài hypervisor. Viết quyết định và một câu lý do cho mỗi việc.", tasks: [
      "Bạn học CCNA trên laptop Windows và muốn vài máy Linux để thử lệnh. Chọn loại hypervisor.",
      "Công ty chạy 40 máy chủ ứng dụng trên cụm máy vật lý trong tủ. Chọn loại hypervisor.",
      "Nhóm dev cần 15 bản cùng một ứng dụng web, khởi động nhanh, chung một OS. Chọn VM hay container, và nói cổng switch phía dưới cần access hay trunk nếu các bản thuộc hai VLAN khác nhau."
    ], hint: "Lab cá nhân là loại 2. Trung tâm dữ liệu là loại 1. Hai VLAN trên một máy chủ nghĩa là đường xuống switch phải chở được nhiều VLAN.", solution: "Laptop học bài: hypervisor loại 2. Cụm máy chủ: loại 1. Mười lăm bản ứng dụng cùng OS: container. Hai VLAN thì cổng switch nối máy chủ là trunk, hoặc có nhiều cổng access tách biệt. Một access VLAN đơn sẽ làm một trong hai nhóm mất mạng." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Tưởng máy ảo không cần default gateway. vNIC vẫn là một host. Khác mạng thì vẫn cần gateway, vẫn chịu ACL, vẫn hiện trong bảng MAC của switch." }
  ],
  terms: [
    { t: "Hypervisor loại 1", d: "Chạy trực tiếp trên phần cứng máy chủ." },
    { t: "Hypervisor loại 2", d: "Chạy như một ứng dụng trên hệ điều hành có sẵn." },
    { t: "Guest", d: "Hệ điều hành bên trong máy ảo." },
    { t: "vNIC", d: "Card mạng ảo của máy ảo, có MAC riêng và cắm vào switch ảo." }
  ],
  quiz: [
    { q: "Hypervisor nào chạy thẳng trên phần cứng?", choices: ["Loại 1", "Loại 2", "Container engine", "Chỉ có VirtualBox"], answer: 0, why: "Loại 1 là bare metal. Loại 2 phải nhờ hệ điều hành chủ." },
    { q: "Điểm khác cốt lõi của container so với máy ảo?", choices: ["Container không dùng mạng", "Container dùng chung kernel với host", "Container luôn nặng hơn", "Container thay thế router"], answer: 1, why: "Chung kernel nên container nhẹ và nhanh, đồng thời phụ thuộc vào kernel đó." },
    { q: "Máy chủ có máy ảo ở VLAN 10 và VLAN 20. Cổng switch nối lên máy chủ thường là gì?", choices: ["Access VLAN 1", "Trunk mang được cả hai VLAN", "Cổng routed không VLAN", "Cổng PortFast không bao giờ trunk"], answer: 1, why: "Switch ảo cần đưa nhiều VLAN xuống switch vật lý bằng trunk 802.1Q." },
    { q: "VirtualBox trên laptop cá nhân thuộc loại nào?", choices: ["Loại 1", "Loại 2", "Một container", "Một firewall thế hệ mới"], answer: 1, why: "Nó cài trong hệ điều hành sẵn có, đúng định nghĩa loại 2." }
  ]
};
