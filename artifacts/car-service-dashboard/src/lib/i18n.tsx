import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "th" | "en";

export const translations = {
  th: {
    // Nav
    dashboard: "แดชบอร์ด",
    customers: "ลูกค้า",
    vehicles: "ยานพาหนะ",
    repairs: "การซ่อม",
    income: "รายได้",
    stock: "คลังสินค้า",
    history: "ประวัติ",
    bookings: "การจอง",
    technicians: "ช่างเทคนิค",

    // Dashboard
    dashboardTitle: "แดชบอร์ด",
    dashboardSub: "ภาพรวมการดำเนินงานของอู่",
    todaysJobs: "งานวันนี้",
    inProgress: "กำลังดำเนินการ",
    completedToday: "เสร็จสิ้นวันนี้",
    monthlyRevenue: "รายได้ประจำเดือน",
    totalCustomers: "ลูกค้าทั้งหมด",
    totalVehicles: "ยานพาหนะทั้งหมด",
    availableTechs: "ช่างที่พร้อมงาน",
    scheduledToday: "นัดหมายวันนี้",
    pendingStart: "รอดำเนินการ",
    revenueChart: "รายได้ — 6 เดือนล่าสุด",
    serviceBreakdown: "สรุปงานซ่อม",
    recentActivity: "กิจกรรมล่าสุด",
    noActivity: "ไม่มีกิจกรรมล่าสุด",
    noData: "ยังไม่มีข้อมูล",
    loading: "กำลังโหลด...",

    // Customers
    customersTitle: "ลูกค้า",
    customersSub: "จัดการข้อมูลลูกค้า",
    addCustomer: "เพิ่มลูกค้า",
    editCustomer: "แก้ไขลูกค้า",
    searchCustomers: "ค้นหาลูกค้า...",
    fullName: "ชื่อ-นามสกุล",
    email: "อีเมล",
    phone: "เบอร์โทร",
    memberSince: "สมาชิกตั้งแต่",
    noCustomers: "ไม่พบลูกค้า",

    // Vehicles
    vehiclesTitle: "ยานพาหนะ",
    vehiclesSub: "ทะเบียนยานพาหนะพร้อมข้อมูลลูกค้า",
    addVehicle: "เพิ่มยานพาหนะ",
    editVehicle: "แก้ไขยานพาหนะ",
    make: "ยี่ห้อ",
    model: "รุ่น",
    year: "ปี",
    plate: "ทะเบียน",
    color: "สี",
    mileage: "ระยะทาง",
    owner: "เจ้าของ",
    customer: "ลูกค้า",
    noVehicles: "ยังไม่มีการลงทะเบียนยานพาหนะ",

    // Repairs / Appointments
    repairsTitle: "การซ่อม",
    repairsSub: "งานซ่อมที่กำลังดำเนินการและรอดำเนินการ",
    newRepair: "งานซ่อมใหม่",
    updateRepair: "อัปเดตการซ่อม",
    vehicle: "ยานพาหนะ",
    service: "บริการ",
    technician: "ช่างเทคนิค",
    dateTime: "วันที่และเวลา",
    notes: "หมายเหตุ",
    status: "สถานะ",
    cost: "ค่าใช้จ่าย",
    noRepairs: "ไม่พบงานซ่อม",
    all: "ทั้งหมด",
    scheduled: "นัดหมาย",
    in_progress: "กำลังซ่อม",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",

    // Bookings
    bookingsTitle: "การจอง",
    bookingsSub: "นัดหมายที่จัดกำหนดการไว้",
    newBooking: "สร้างการจอง",
    noBookings: "ไม่มีการจองที่กำหนดการไว้",

    // Income
    incomeTitle: "รายได้",
    incomeSub: "สรุปรายได้และรายรับ",
    totalRevenue: "รายได้รวม",
    monthRevenue: "รายได้เดือนนี้",
    completedJobs: "งานที่เสร็จสิ้น",
    avgJobValue: "มูลค่างานเฉลี่ย",
    revenueByMonth: "รายได้รายเดือน",
    revenueByService: "รายได้ตามประเภทบริการ",
    jobs: "งาน",

    // Stock / Services
    stockTitle: "คลังสินค้า",
    stockSub: "รายการบริการและราคา",
    addService: "เพิ่มบริการ",
    editService: "แก้ไขบริการ",
    serviceName: "ชื่อบริการ",
    description: "รายละเอียด",
    price: "ราคา",
    duration: "ระยะเวลา",
    noServices: "ยังไม่มีบริการ",

    // History
    historyTitle: "ประวัติ",
    historySub: "ประวัติงานซ่อมที่เสร็จสิ้นแล้ว",
    noHistory: "ยังไม่มีประวัติงานซ่อม",

    // Technicians
    techniciansTitle: "ช่างเทคนิค",
    techniciansSub: "รายชื่อทีมงานและสถานะ",
    addTechnician: "เพิ่มช่าง",
    editTechnician: "แก้ไขช่าง",
    specialty: "ความเชี่ยวชาญ",
    available: "พร้อมงาน",
    unavailable: "ไม่ว่าง",
    toggleAvailability: "คลิกเพื่อเปลี่ยนสถานะ",
    noTechnicians: "ยังไม่มีช่างเทคนิค",

    // Common
    cancel: "ยกเลิก",
    save: "บันทึก",
    add: "เพิ่ม",
    update: "อัปเดต",
    delete: "ลบ",
    edit: "แก้ไข",
    create: "สร้าง",
    creating: "กำลังสร้าง...",
    saving: "กำลังบันทึก...",
    required: "จำเป็น",
    optionalNotes: "หมายเหตุ (ไม่บังคับ)...",
    selectCustomer: "เลือกลูกค้า...",
    selectVehicle: "เลือกยานพาหนะ...",
    selectService: "เลือกบริการ...",
    selectTechnician: "เลือกช่าง...",
    appName: "AutoPro",
    appSub: "ศูนย์บริการรถยนต์",
    miles: "ไมล์",
    baht: "฿",
    minutes: "นาที",
    hours: "ชม.",
    shopName: "AutoPro Service Center",
  },
  en: {
    // Nav
    dashboard: "Dashboard",
    customers: "Customers",
    vehicles: "Vehicles",
    repairs: "Repairs",
    income: "Income",
    stock: "Stock",
    history: "History",
    bookings: "Bookings",
    technicians: "Technicians",

    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardSub: "Live overview of shop operations",
    todaysJobs: "Today's Jobs",
    inProgress: "In Progress",
    completedToday: "Completed Today",
    monthlyRevenue: "Monthly Revenue",
    totalCustomers: "Customers",
    totalVehicles: "Vehicles",
    availableTechs: "Available Techs",
    scheduledToday: "Scheduled Today",
    pendingStart: "pending start",
    revenueChart: "Revenue — Last 6 Months",
    serviceBreakdown: "Service Breakdown",
    recentActivity: "Recent Activity",
    noActivity: "No recent activity",
    noData: "No data yet",
    loading: "Loading...",

    // Customers
    customersTitle: "Customers",
    customersSub: "Manage your customer records",
    addCustomer: "Add Customer",
    editCustomer: "Edit Customer",
    searchCustomers: "Search customers...",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    memberSince: "Member Since",
    noCustomers: "No customers found",

    // Vehicles
    vehiclesTitle: "Vehicles",
    vehiclesSub: "Vehicle registry with customer links",
    addVehicle: "Add Vehicle",
    editVehicle: "Edit Vehicle",
    make: "Make",
    model: "Model",
    year: "Year",
    plate: "Plate",
    color: "Color",
    mileage: "Mileage",
    owner: "Owner",
    customer: "Customer",
    noVehicles: "No vehicles registered",

    // Repairs / Appointments
    repairsTitle: "Repairs",
    repairsSub: "Active and pending repair jobs",
    newRepair: "New Repair",
    updateRepair: "Update Repair",
    vehicle: "Vehicle",
    service: "Service",
    technician: "Technician",
    dateTime: "Date & Time",
    notes: "Notes",
    status: "Status",
    cost: "Cost",
    noRepairs: "No repairs found",
    all: "All",
    scheduled: "Scheduled",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",

    // Bookings
    bookingsTitle: "Bookings",
    bookingsSub: "Scheduled appointments",
    newBooking: "New Booking",
    noBookings: "No scheduled bookings",

    // Income
    incomeTitle: "Income",
    incomeSub: "Revenue summary and earnings",
    totalRevenue: "Total Revenue",
    monthRevenue: "This Month",
    completedJobs: "Completed Jobs",
    avgJobValue: "Avg Job Value",
    revenueByMonth: "Revenue by Month",
    revenueByService: "Revenue by Service",
    jobs: "jobs",

    // Stock / Services
    stockTitle: "Stock",
    stockSub: "Service catalog and pricing",
    addService: "Add Service",
    editService: "Edit Service",
    serviceName: "Service Name",
    description: "Description",
    price: "Price",
    duration: "Duration",
    noServices: "No services defined",

    // History
    historyTitle: "History",
    historySub: "Completed repair job records",
    noHistory: "No completed repairs yet",

    // Technicians
    techniciansTitle: "Technicians",
    techniciansSub: "Shop staff roster and availability",
    addTechnician: "Add Technician",
    editTechnician: "Edit Technician",
    specialty: "Specialty",
    available: "Available",
    unavailable: "Unavailable",
    toggleAvailability: "click to toggle",
    noTechnicians: "No technicians added",

    // Common
    cancel: "Cancel",
    save: "Save",
    add: "Add",
    update: "Update",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    creating: "Creating...",
    saving: "Saving...",
    required: "Required",
    optionalNotes: "Optional notes...",
    selectCustomer: "Select customer...",
    selectVehicle: "Select vehicle...",
    selectService: "Select service...",
    selectTechnician: "Select technician...",
    appName: "AutoPro",
    appSub: "Service Center",
    miles: "mi",
    baht: "$",
    minutes: "min",
    hours: "h",
    shopName: "AutoPro Service Center",
  },
};

export type TranslationKey = keyof typeof translations.en;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}>({
  lang: "th",
  setLang: () => {},
  t: (k) => translations.en[k],
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("autopro_lang");
    return (stored === "en" || stored === "th") ? stored : "th";
  });

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("autopro_lang", l);
  }

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.en[key];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
