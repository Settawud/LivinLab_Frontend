export const orders = [
  // --- Order 1: คำสั่งซื้อที่กำลังดำเนินการ พร้อมส่วนลดและค่าติดตั้ง ---
  {
    order_id: "ORD-001",
    user_id: "USR-001",
    order_status: "กำลังดำเนินการ",
    order_timestamp: "2025-08-15T09:00:00Z",
    installation_fee: 200,
    discount_code: "WELCOME20",
    discount_amount: 1200,
    order_items: [
      { order_item_id: "OIT-0001", skuId: "EGC-EF-01-B", quantity: 1, unit_price: 5990 },
      { order_item_id: "OIT-0002", skuId: "EGT-AP-01-W-120", quantity: 1, unit_price: 9500 },
      { order_item_id: "OIT-0003", skuId: "EGA-WP-02-B", quantity: 2, unit_price: 350 }
    ],
    total_amount: 15190 // (5990 + 9500 + 700) + 200 - 1200
  },

  // --- Order 2: คำสั่งซื้อที่เสร็จสิ้น ไม่มีส่วนลด มีค่าติดตั้ง ---
  {
    order_id: "ORD-002",
    user_id: "USR-002",
    order_status: "คำสั่งซื้อเสร็จสิ้น",
    order_timestamp: "2025-08-14T14:30:00Z",
    installation_fee: 200,
    discount_code: null,
    discount_amount: null,
    order_items: [
      { order_item_id: "OIT-0004", skuId: "EGC-N-04-R", quantity: 1, unit_price: 8900 },
      { order_item_id: "OIT-0005", skuId: "EGA-GMP-05-B", quantity: 3, unit_price: 299 }
    ],
    total_amount: 10097 // (8900 + 897) + 200
  },

  // --- Order 3: คำสั่งซื้อที่ถูกยกเลิก ไม่มีส่วนลด ไม่มีค่าติดตั้ง ---
  {
    order_id: "ORD-003",
    user_id: "USR-003",
    order_status: "คำสั่งซื้อที่ถูกยกเลิก",
    order_timestamp: "2025-08-13T11:45:00Z",
    installation_fee: 0,
    discount_code: null,
    discount_amount: null,
    order_items: [
      { order_item_id: "OIT-0006", skuId: "EGT-ME-03-N", quantity: 1, unit_price: 4200 },
      { order_item_id: "OIT-0007", skuId: "EGA-MR-03-N", quantity: 1, unit_price: 650 }
    ],
    total_amount: 4850 // (4200 + 650)
  },

  // --- Order 4: คำสั่งซื้อที่รอการชำระเงิน มีส่วนลด ไม่มีค่าติดตั้ง ---
  {
    order_id: "ORD-004",
    user_id: "USR-004",
    order_status: "รอการชำระเงิน",
    order_timestamp: "2025-08-12T18:10:00Z",
    installation_fee: 0,
    discount_code: "SAVE500",
    discount_amount: 500,
    order_items: [
      { order_item_id: "OIT-0008", skuId: "EGC-MA-03-G", quantity: 2, unit_price: 4800 },
      { order_item_id: "OIT-0009", skuId: "EGA-FR-01", quantity: 1, unit_price: 890 }
    ],
    total_amount: 9990 // (9600 + 890) - 500
  },

  // --- Order 5: คำสั่งซื้อที่กำลังดำเนินการ สินค้าหลายชิ้นและค่าติดตั้ง ---
  {
    order_id: "ORD-005",
    user_id: "USR-005",
    order_status: "กำลังดำเนินการ",
    order_timestamp: "2025-08-11T09:20:00Z",
    installation_fee: 200,
    discount_code: null,
    discount_amount: null,
    order_items: [
      { order_item_id: "OIT-0010", skuId: "EGC-LP-02-B", quantity: 1, unit_price: 7500 },
      { order_item_id: "OIT-0011", skuId: "EGA-EC-04-B", quantity: 1, unit_price: 1200 },
      { order_item_id: "OIT-0012", skuId: "EGA-F-06-K", quantity: 1, unit_price: 350 },
      { order_item_id: "OIT-0013", skuId: "EGA-F-06-M", quantity: 1, unit_price: 250 }
    ],
    total_amount: 9500 // (7500 + 1200 + 350 + 250) + 200
    },
   {
  order_id: "ORD-006",
  user_id: "USR-006",
  order_status: "รอการชำระเงิน",
  order_timestamp: "2025-08-15T15:30:00Z",
  installation_fee: 0,
  discount_code: null,
  discount_amount: null,
  order_items: [
    {
      order_item_id: "OIT-0014",
      skuId: "EGC-C-05-BL", // เก้าอี้ Ergonomics รุ่น Compact สีน้ำเงิน
      quantity: 1,
      unit_price: 3200
    }
  ],
  total_amount: 3200 
  },
  {
    order_id: "ORD-007",
    user_id: "USR-007",
    order_status: "กำลังดำเนินการ",
    order_timestamp: "2025-08-16T10:15:00Z",
    installation_fee: 0,
    discount_code: null,
    discount_amount: null,
    order_items: [
      { order_item_id: "OIT-0015", skuId: "EGC-EF-01-W-TRIAL", quantity: 1, unit_price: 619 },
    ],
    total_amount: 619
  }
];

