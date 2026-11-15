window.LESSON = {
  id: "1.1",
  title: "Chẩn đoán cáp và cổng",
  exam: "1.1 — Diagnose interface and cable issues",
  keywords: ["duplex", "CRC", "single-mode", "UTP", "Auto-MDIX"],
  objectives: [
    "Chọn đúng cáp đồng hoặc cáp quang cho một khoảng cách cho trước",
    "Đọc `show interfaces` và chỉ ra dấu hiệu duplex mismatch, lỗi CRC, nhầm tốc độ",
    "Phân biệt link down vì tầng 1 với link up nhưng chạy kém"
  ],
  opener: "Hơn nửa phiếu sự cố đầu giờ bắt đầu bằng một sợi cáp. Đèn cổng không sáng thì đừng mở bảng định tuyến. Đèn sáng mà người dùng vẫn bảo mạng chậm thì hãy nhìn bộ đếm lỗi trên cổng trước khi đổ cho nhà mạng.",
  blocks: [
    { type: "h2", text: "Đồng và quang" },
    { type: "table", headers: ["Loại", "Cự ly thường gặp", "Dùng khi"], rows: [
      ["Đồng UTP Cat5e/Cat6", "Tối đa khoảng 100 m", "Máy người dùng, AP, điện thoại, uplink ngắn"],
      ["Quang multimode", "Hàng trăm mét, tùy loại OM", "Trong tòa nhà, giữa các tủ"],
      ["Quang single-mode", "Hàng kilomet", "Giữa các tòa, lên nhà mạng"]
    ] },
    { type: "p", text: "Single-mode có lõi nhỏ, một đường ánh sáng, đi xa. Multimode lõi lớn hơn, nhiều tia, đi gần và rẻ hơn trong nhà. Cắm nhầm hai loại, hoặc dùng đầu nối bẩn, thì công suất thu xuống thấp và cổng quang không lên, hoặc lên rồi rớt. Đồng thì chết ở khoảng cách: cuộn một sợi 120 mét cho chắc là sai chuẩn 100 mét." },
    { type: "p", text: "Cáp thẳng hai đầu cùng kiểu bấm T568B nối máy khác loại, ví dụ PC vào switch. Cáp chéo đảo cặp phát và nhận, ngày xưa dùng cho cùng loại thiết bị. Switch và router đời mới có Auto-MDIX, tự đảo khi cần. Gặp thiết bị cũ hoặc một cổng tắt tính năng này, cáp sai kiểu vẫn làm link không lên. Nhầm chân bấm, đứt một cặp, lỗi cũng y vậy." },
    { type: "h2", text: "Tốc độ và duplex" },
    { type: "p", text: "Hai đầu phải thuận tốc độ và cách nói chuyện. Full duplex: nói và nghe cùng lúc, không có collision. Half duplex: một chiều một lúc, có collision khi đụng độ. Cả hai đầu để auto là đường đúng. Một đầu ghim cứng 100 full, đầu kia để auto, đầu auto thường rơi xuống 100 half. Link vẫn up/up. Người dùng bảo mạng lúc được lúc không." },
    { type: "cli", title: "Cổng đang bị duplex mismatch", code: "SW1# show interfaces status\nPort    Name  Status   Vlan  Duplex  Speed Type\nGi1/0/1 PC-A  connected 10    half    100   10/100/1000\n\nSW1# show interfaces gi1/0/1\n  ...\n  1842 input errors, 1604 CRC, 0 frame, 0 overrun, 0 ignored\n  0 output errors, 96 collisions, 87 late collision" },
    { type: "steps", title: "Đọc bản show này", items: [
      "Status connected nên cáp có tín hiệu, chưa phải đứt hẳn.",
      "Duplex half trong khi máy đối diện rất có thể đang full. Đó là cặp lệch.",
      "Late collision là chữ của half duplex khi frame đâm nhau quá muộn. Trên cổng full duplex đúng nghĩa, late collision không nên có.",
      "CRC tăng là frame hỏng. Nguyên nhân tầng 1: cáp kém, nhiễu, duplex lệch, quang yếu."
    ] },
    { type: "callout", tone: "remember", title: "Cách xử lý trong lab", text: "Đưa cả hai đầu về auto. Chỉ ghim cứng khi thiết bị kia không biết auto, và khi đã ghim thì ghim cả speed lẫn duplex cho khớp nhau. Lệnh trên cổng: `speed auto` và `duplex auto`, hoặc `speed 1000` cùng `duplex full`." },
    { type: "table", headers: ["Triệu chứng", "Nghĩ tới"], rows: [
      ["notconnect, đèn tắt", "Cáp rút, đứt, sai loại, cổng shutdown, quang mất tín hiệu, quá cự ly"],
      ["up/up, CRC và late collision", "Duplex mismatch hoặc cáp nhiễu"],
      ["err-disabled", "Bảo mật hoặc loop đã tắt cổng, không phải chỉ mỗi cáp"],
      ["Tốc độ 100 trên cổng 1 Gbps", "Cáp chỉ thông được hai cặp, hoặc một đầu ghim 100"]
    ] },
    { type: "lab", title: "Lab 1.1 — Một cổng chậm, một cổng chết", goal: "Tập chẩn đoán trên giấy bằng hai phiếu. Nếu có thiết bị, hãy cố ý ghim duplex lệch rồi xem bộ đếm.", tasks: [
      "Phiếu A: Gi1/0/7 notconnect, không input, không CRC. Viết ba việc kiểm tra theo thứ tự.",
      "Phiếu B: Gi1/0/8 connected, a-half, a-100, late collision tăng sau mỗi lần copy file. Viết nguyên nhân và lệnh đưa cổng về auto.",
      "Một uplink quang 2 km đang dùng multimode. Nói vì sao link không nên tin được."
    ], hint: "notconnect là chưa có liên kết. Late collision cộng half duplex là bài duplex. Single-mode mới là chuyện đi xa hàng kilomet.", solution: "Phiếu A: kiểm tra cáp đã cắm chưa, `show interfaces status`, có shutdown không, đúng loại cáp và đúng cự ly không. Phiếu B: duplex mismatch. Vào cổng gõ `duplex auto` và `speed auto`, làm tương tự đầu kia, rồi xóa bộ đếm bằng `clear counters` để theo dõi tiếp. Uplink 2 km cần single-mode; multimode không dành cho cự ly đó." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Thấy collision là kết luận mạng có vòng lặp. Collision và late collision là chuyện half duplex. Bão broadcast do vòng lặp là chuyện khác, CPU switch tăng và MAC nhảy cổng." }
  ],
  terms: [
    { t: "Duplex mismatch", d: "Một đầu full, một đầu half. Link vẫn lên nhưng lỗi và chậm." },
    { t: "CRC", d: "Khung bị hỏng phần kiểm tra, thường do tầng vật lý." },
    { t: "Single-mode", d: "Cáp quang một mode, đi xa." },
    { t: "Auto-MDIX", d: "Cổng tự chọn thẳng hoặc chéo để phát gặp nhận." }
  ],
  quiz: [
    { q: "Cáp đồng Ethernet chuẩn dài tối đa khoảng bao nhiêu?", choices: ["15 m", "100 m", "500 m", "10 km"], answer: 1, why: "Chuẩn đi cáp ngang UTP cho Ethernet là khoảng 100 mét." },
    { q: "Quang nào phù hợp một tuyến 15 km giữa hai tòa?", choices: ["Cat6", "Multimode OM3", "Single-mode", "Cáp đồng trục dày"], answer: 2, why: "Cự ly nhiều kilomet là việc của single-mode." },
    { q: "Cổng connected, duplex half, late collision tăng. Hướng xử lý đúng?", choices: ["Thêm default route", "Khớp duplex và speed hai đầu, ưu tiên auto", "Tắt spanning tree", "Đổi native VLAN"], answer: 1, why: "Đây là dấu tầng 1/2 của duplex lệch, không phải dấu thiếu route." },
    { q: "Input errors và CRC tăng mạnh, không có late collision, cáp đi ngang máng điện. Nghi gì?", choices: ["ACL chặn ICMP", "Nhiễu hoặc cáp hỏng làm hỏng frame", "Router ID trùng", "Hết pool DHCP"], answer: 1, why: "CRC là frame hỏng trên đường truyền. Nguồn nhiễu và cáp kém là nghi phạm tầng vật lý." }
  ]
};
