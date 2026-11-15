window.LESSON = {
  id: "5.5",
  title: "Chạy lệnh bằng Ansible",
  exam: "5.5 — Use Ansible to execute commands",
  keywords: ["playbook", "inventory", "ios_command", "idempotent"],
  objectives: [
    "Đọc một inventory và một playbook đủ để nói nó sẽ chạm máy nào",
    "Chạy một lệnh show trên nhóm router mà không cài agent trên router",
    "Thêm một dòng mô tả cổng bằng ios_config và giải thích vì sao chạy lại lần hai không gây hại"
  ],
  opener: "Bạn đã biết lệnh. Ansible là cách không phải gõ lệnh đó mười lần. Nó đăng nhập SSH từ một máy điều khiển, đọc một file YAML nói việc cần làm, và làm trên đúng nhóm thiết bị trong inventory. Router không cài thêm phần mềm. Hết SSH là hết cửa Ansible vào.",
  blocks: [
    { type: "h2", text: "Hai file, một ý" },
    { type: "p", text: "Inventory liệt kê máy. Playbook liệt kê việc. YAML nhìn bằng thụt vào đầu dòng: thụt lệch là file hỏng, không phải là mạng hỏng. Một play có hosts, cách nối, và các task. Module `cisco.ios.ios_command` để chạy show. Module `cisco.ios.ios_config` để đưa dòng cấu hình. Idempotent nghĩa là chạy lần hai vẫn ra cùng trạng thái, không nhân đôi một dòng mô tả thành hai dòng." },
    { type: "cli", title: "inventory.ini", code: "[routers]\nr1 ansible_host=192.168.1.1\n\n[routers:vars]\nansible_user=admin\nansible_connection=ansible.netcommon.network_cli\nansible_network_os=cisco.ios.ios\nansible_password=DungVaultKhongGhiThat" },
    { type: "cli", title: "show.yml", code: "---\n- name: Xem dia chi tren router\n  hosts: routers\n  gather_facts: false\n  tasks:\n    - name: Chay show ip interface brief\n      cisco.ios.ios_command:\n        commands:\n          - show ip interface brief\n      register: ket_qua\n\n    - name: In ra man hinh\n      ansible.builtin.debug:\n        var: ket_qua.stdout_lines" },
    { type: "p", text: "Chạy bằng `ansible-playbook -i inventory.ini show.yml` trên máy điều khiển, không gõ lệnh này trên router. `register` giữ kết quả để task sau in. Mật khẩu trong file chỉ để bạn thấy chỗ nó đứng. Cách làm đúng là ansible-vault hoặc một kho bí mật. Đưa file này vào Git công khai là cùng một lỗi data classification của buổi 5.2." },
    { type: "cli", title: "dat-mo-ta.yml", code: "---\n- name: Gan mo ta cong toi may chu\n  hosts: routers\n  gather_facts: false\n  tasks:\n    - name: Mo ta Gi0/1\n      cisco.ios.ios_config:\n        lines:\n          - description Len may chu web\n        parents: interface GigabitEthernet0/1" },
    { type: "p", text: "`parents` là chỗ dòng lệnh sẽ sống, giống như bạn đã gõ `interface GigabitEthernet0/1` trước. Chạy lại playbook không thêm một description thứ hai. Nếu ai đó sửa description bằng tay, lần chạy sau đưa nó về đúng câu trong file. Đó là lý do file YAML nên được xem là nguồn sự thật, và được lưu trong Git như buổi 5.3 đã nói." },
    { type: "callout", tone: "remember", title: "Show trước, sửa sau", text: "Playbook đầu tiên của bạn chỉ nên có ios_command. Khi output đúng máy, đúng nhóm, mới viết ios_config. Một inventory nhầm tên nhóm sẽ đẩy lệnh sang router của chi nhánh khác nhanh hơn bất kỳ cú gõ sai nào." },
    { type: "lab", title: "Lab 5.5 — Một lệnh show, rồi một dòng mô tả", goal: "Nếu máy bạn cài được Ansible và có một router lab thì chạy thật. Nếu chưa, viết hai file và một đoạn nhật ký giả lập những gì bạn kỳ vọng thấy.", tasks: [
      "Viết inventory cho đúng một router lab. Mật khẩu không ghi thẳng: ghi chú chỗ sẽ dùng vault.",
      "Viết playbook chỉ chạy show ip interface brief. Khoanh task nào sẽ in kết quả.",
      "Viết task ios_config đặt description cho một cổng. Nói chuyện gì xảy ra nếu chạy playbook đó hai lần.",
      "Giải thích vì sao router không cần cài agent."
    ], hint: "connection network_cli và ansible_network_os cisco.ios.ios là cặp cho IOS. gather_facts false để Ansible khỏi cố thu thập kiểu máy chủ Linux.", solution: "Task debug in ket_qua.stdout_lines. ios_config với parents interface đặt một description. Lần hai vẫn một dòng, vì module kiểm tra trạng thái mong muốn. Router chỉ cần SSH và tài khoản. Máy điều khiển là nơi Ansible chạy. Không có tiến trình Ansible trên IOS." },
    { type: "callout", tone: "warn", title: "Bẫy", text: "Thụt dòng YAML bằng tab trộn với dấu cách. Ansible báo lỗi ngay từ file, trước khi đụng router. Hãy sửa file, đừng sửa router để chữa một lỗi YAML." }
  ],
  terms: [
    { t: "Inventory", d: "Danh sách thiết bị và cách đăng nhập." },
    { t: "Playbook", d: "File YAML mô tả các việc sẽ làm." },
    { t: "ios_command", d: "Module chạy lệnh show, không nhằm thay đổi cấu hình." },
    { t: "Idempotent", d: "Chạy lại vẫn ra một trạng thái, không nhân đôi thay đổi." }
  ],
  quiz: [
    { q: "Ansible vào router Cisco bằng cách nào?", choices: ["Cài agent trên IOS", "SSH, không cần agent", "Chỉ bằng SNMP RW", "Chỉ bằng TFTP"], answer: 1, why: "network_cli đi trên SSH. Router không chạy phần mềm Ansible." },
    { q: "Module nào phù hợp để lấy show ip interface brief?", choices: ["cisco.ios.ios_command", "cisco.ios.ios_config", "storm-control", "ip helper-address"], answer: 0, why: "ios_command dành cho lệnh thực thi như show. ios_config dành cho dòng cấu hình." },
    { q: "Chạy lại một task description đúng chuẩn sẽ ra sao?", choices: ["Thêm description thứ hai", "Giữ một description như file đã viết", "Xóa cổng", "Đổi router ID"], answer: 1, why: "Module cấu hình hướng tới trạng thái mong muốn, nên lần sau không nhân đôi." },
    { q: "Mật khẩu trong inventory đem đẩy lên Git công khai thì vi phạm ý nào đã học?", choices: ["Longest prefix match", "Phân loại dữ liệu", "Native VLAN", "Modified EUI-64"], answer: 1, why: "Bí mật đăng nhập không thuộc một kho công khai. Dùng vault và giữ file ra khỏi Git mở." }
  ]
};
