const EXAM = {
  code: "200-301",
  version: "v2.0",
  minutes: 120,
  firstDate: "3/2/2027"
};

const MODULES = [
  {
    id: "m0",
    title: "Nền tảng cho người mới",
    weight: "Học trước",
    weeks: "Tuần 1–2",
    blurb: "Đề v2.0 giả định bạn đã biết máy nói chuyện với nhau thế nào. Năm buổi này dạy phần đó, bằng ví dụ đời thường, trước khi đụng lệnh xử lý sự cố."
  },
  {
    id: "m1",
    title: "Hạ tầng và kết nối",
    weight: "25% đề",
    weeks: "Tuần 3–5",
    blurb: "Miền 1.0: cáp, cổng, ảo hóa, IPv4, IPv6, Wi-Fi, máy người dùng và DHCP. Đề thi chủ yếu đưa tình huống hỏng và hỏi bạn sửa chỗ nào."
  },
  {
    id: "m2",
    title: "Chuyển mạch và truy cập mạng",
    weight: "25% đề",
    weeks: "Tuần 6–8",
    blurb: "Miền 2.0: VLAN, trunk, EtherChannel, cổng cho máy đầu cuối, CDP/LLDP, cách đọc show command, và Rapid PVST+."
  },
  {
    id: "m3",
    title: "Định tuyến IP",
    weight: "20% đề",
    weeks: "Tuần 9–10",
    blurb: "Miền 3.0: đọc bảng định tuyến, sửa route tĩnh IPv4/IPv6, cấu hình OSPF một vùng, và đọc trạng thái HSRP/VRRP."
  },
  {
    id: "m4",
    title: "Dịch vụ và bảo mật",
    weight: "20% đề",
    weeks: "Tuần 11",
    blurb: "Miền 4.0: đăng nhập thiết bị, AAA, SCP/SFTP, NAT, DNS, VPN, ACL và bảo mật cổng switch."
  },
  {
    id: "m5",
    title: "AI, vận hành và quản trị",
    weight: "10% đề",
    weeks: "Tuần 12",
    blurb: "Miền 5.0: AI có thể tự làm việc, cách viết prompt an toàn, các kiểu quản trị mạng, SNMP, Ansible và syslog."
  }
];

const PLAN = [
  { week: "1", text: "Buổi 0.1 đến 0.3. Vẽ mạng nhà bạn ra giấy. Đăng ký Cisco Networking Academy và cài Packet Tracer." },
  { week: "2", text: "Nhị phân và Cisco IOS. Tự đặt hostname, mật khẩu, địa chỉ IP, rồi lưu cấu hình. Quên lưu một lần cho nhớ." },
  { week: "3", text: "Cáp, đèn cổng, lỗi duplex, và ảo hóa. Tập đọc `show interfaces` trước khi học địa chỉ." },
  { week: "4", text: "IPv4 và subnet. Mỗi ngày 15 phút với công cụ Subnet, tính tay rồi mới bấm kiểm." },
  { week: "5", text: "IPv6, Wi-Fi, máy trạm Windows/macOS/Linux, và DHCP. Chủ đích làm một máy ra địa chỉ 169.254." },
  { week: "6", text: "VLAN, trunk 802.1Q, SVI và LACP. Lab hai switch, hai VLAN, hai máy ping được nhau." },
  { week: "7", text: "Cổng điện thoại, PoE, AP, CDP/LLDP. Sửa một sơ đồ mạng sai bằng lệnh hàng xóm." },
  { week: "8", text: "Quy trình xử lý sự cố và Rapid PVST+. Tạo một vòng lặp trong lab rồi nhìn root bridge." },
  { week: "9", text: "Bảng định tuyến và static route, kể cả route dự phòng. Mỗi bài ping phải có đường đi và đường về." },
  { week: "10", text: "OSPFv2, OSPFv3, HSRP và VRRP. Rút điện một router và xem gateway ảo còn sống." },
  { week: "11", text: "AAA, SCP, NAT, DNS, VPN, ACL, DHCP snooping, DAI, port security. Lab ACL nào cũng kiểm tra cả chiều bị chặn lẫn chiều vẫn cần đi." },
  { week: "12", text: "AI, SNMP, Ansible, syslog. Làm bài ôn tập trộn. Những buổi dưới 80% thì học lại, đừng chỉ đọc đáp án." }
];

const LESSONS = [
  { id: "0.1", module: "m0", minutes: 30, title: "Mạng là gì, và cách học bộ này", file: "noi-dung/00-nen-tang/0-1-mang-la-gi.js" },
  { id: "0.2", module: "m0", minutes: 40, title: "OSI, TCP/IP và đường đi của dữ liệu", file: "noi-dung/00-nen-tang/0-2-osi.js" },
  { id: "0.3", module: "m0", minutes: 40, title: "Ethernet, địa chỉ MAC và switch", file: "noi-dung/00-nen-tang/0-3-ethernet.js" },
  { id: "0.4", module: "m0", minutes: 45, title: "Nhị phân và địa chỉ IPv4 lần đầu", file: "noi-dung/00-nen-tang/0-4-nhi-phan.js" },
  { id: "0.5", module: "m0", minutes: 45, title: "Buổi đầu với Cisco IOS", file: "noi-dung/00-nen-tang/0-5-ios.js" },
  { id: "1.1", module: "m1", minutes: 45, title: "Chẩn đoán cáp và cổng", file: "noi-dung/01-ha-tang/1-1-cap.js" },
  { id: "1.2", module: "m1", minutes: 30, title: "Hypervisor, máy ảo và container", file: "noi-dung/01-ha-tang/1-2-ao-hoa.js" },
  { id: "1.3", module: "m1", minutes: 70, title: "Sửa địa chỉ IPv4 và chia subnet", file: "noi-dung/01-ha-tang/1-3-ipv4.js" },
  { id: "1.4", module: "m1", minutes: 50, title: "Sửa địa chỉ IPv6 và prefix", file: "noi-dung/01-ha-tang/1-4-ipv6.js" },
  { id: "1.5", module: "m1", minutes: 35, title: "Nguyên tắc Wi-Fi", file: "noi-dung/01-ha-tang/1-5-wifi.js" },
  { id: "1.6", module: "m1", minutes: 40, title: "Sửa kết nối trên máy người dùng", file: "noi-dung/01-ha-tang/1-6-may-tram.js" },
  { id: "1.7", module: "m1", minutes: 45, title: "Sửa DHCP client, server và relay", file: "noi-dung/01-ha-tang/1-7-dhcp.js" },
  { id: "2.1", module: "m2", minutes: 65, title: "Nối switch với switch và router", file: "noi-dung/02-switching/2-1-vlan-trunk.js" },
  { id: "2.2", module: "m2", minutes: 40, title: "Cấu hình cổng cho máy đầu cuối", file: "noi-dung/02-switching/2-2-cong-bien.js" },
  { id: "2.3", module: "m2", minutes: 30, title: "Đối chiếu sơ đồ bằng CDP và LLDP", file: "noi-dung/02-switching/2-3-cdp-lldp.js" },
  { id: "2.4", module: "m2", minutes: 50, title: "Xử lý sự cố lớp 2 và lớp 3", file: "noi-dung/02-switching/2-4-xu-ly-su-co.js" },
  { id: "2.5", module: "m2", minutes: 55, title: "Rapid PVST+", file: "noi-dung/02-switching/2-5-stp.js" },
  { id: "3.1", module: "m3", minutes: 45, title: "Đọc bảng định tuyến", file: "noi-dung/03-dinh-tuyen/3-1-bang-route.js" },
  { id: "3.2", module: "m3", minutes: 50, title: "Sửa route tĩnh IPv4 và IPv6", file: "noi-dung/03-dinh-tuyen/3-2-static.js" },
  { id: "3.3", module: "m3", minutes: 65, title: "OSPF một vùng cho IPv4 và IPv6", file: "noi-dung/03-dinh-tuyen/3-3-ospf.js" },
  { id: "3.4", module: "m3", minutes: 40, title: "Đọc trạng thái HSRP và VRRP", file: "noi-dung/03-dinh-tuyen/3-4-fhrp.js" },
  { id: "4.1", module: "m4", minutes: 40, title: "Tài khoản local và AAA", file: "noi-dung/04-dich-vu/4-1-aaa.js" },
  { id: "4.2", module: "m4", minutes: 30, title: "Sao lưu bằng SCP và SFTP", file: "noi-dung/04-dich-vu/4-2-scp.js" },
  { id: "4.3", module: "m4", minutes: 50, title: "NAT và PAT", file: "noi-dung/04-dich-vu/4-3-nat.js" },
  { id: "4.4", module: "m4", minutes: 35, title: "Chẩn đoán bản ghi DNS", file: "noi-dung/04-dich-vu/4-4-dns.js" },
  { id: "4.5", module: "m4", minutes: 30, title: "VPN IPsec", file: "noi-dung/04-dich-vu/4-5-vpn.js" },
  { id: "4.6", module: "m4", minutes: 55, title: "ACL IPv4", file: "noi-dung/04-dich-vu/4-6-acl.js" },
  { id: "4.7", module: "m4", minutes: 50, title: "Bảo mật lớp 2", file: "noi-dung/04-dich-vu/4-7-bao-mat-l2.js" },
  { id: "5.1", module: "m5", minutes: 25, title: "AI tác tử trong vận hành mạng", file: "noi-dung/05-van-hanh/5-1-ai.js" },
  { id: "5.2", module: "m5", minutes: 30, title: "Viết prompt cho việc vận hành", file: "noi-dung/05-van-hanh/5-2-prompt.js" },
  { id: "5.3", module: "m5", minutes: 30, title: "Các cách quản trị mạng", file: "noi-dung/05-van-hanh/5-3-quan-tri.js" },
  { id: "5.4", module: "m5", minutes: 30, title: "SNMP", file: "noi-dung/05-van-hanh/5-4-snmp.js" },
  { id: "5.5", module: "m5", minutes: 40, title: "Chạy lệnh bằng Ansible", file: "noi-dung/05-van-hanh/5-5-ansible.js" },
  { id: "5.6", module: "m5", minutes: 30, title: "Đọc syslog", file: "noi-dung/05-van-hanh/5-6-syslog.js" }
];

function lessonIndex(id) {
  return LESSONS.findIndex((lesson) => lesson.id === id);
}

function lessonById(id) {
  return LESSONS.find((lesson) => lesson.id === id);
}

function moduleById(id) {
  return MODULES.find((item) => item.id === id);
}
