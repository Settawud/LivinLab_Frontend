import Container from "../layout/Container";
import { Facebook, Instagram, MessageSquare } from "lucide-react";


export default function Footer({ className = "" }) {
  return (
    // <footer className="mt-16 border-t border-stone-200 bg-stone-800 text-stone-100">
    //   <Container className="grid gap-8 py-10 md:grid-cols-4">
    //     <div><h4 className="font-semibold mb-3">Livin’ Lab</h4><ul className="space-y-2 text-stone-300"><li>เกี่ยวกับเรา</li><li>โชว์รูม</li><li>ร่วมงานกับเรา</li></ul></div>
    //     <div><h4 className="font-semibold mb-3">ช่วยเหลือ</h4><ul className="space-y-2 text-stone-300"><li>คำถามที่พบบ่อย</li><li>การจัดส่งและชำระเงิน</li><li>นโยบายการคืนสินค้า</li></ul></div>
    //     <div><h4 className="font-semibold mb-3">ติดต่อเรา</h4><p className="text-stone-300">123 ถ.พหลฯ กรุงเทพฯ 10110<br/>support@livinlab.th<br/>02-123-4567</p></div>
    //     <div><h4 className="font-semibold mb-3">ติดตามเรา</h4><div className="space-x-3">📘 📸 🐦</div></div>
    //   </Container>
    //   <div className="py-4 text-center text-sm text-stone-400">© 2025 Livin’ Lab. All rights reserved.</div>
    // </footer>
    
    <footer className={`bg-[#9f8668] text-[--color-footer-link] ring-1 ring-white/20 ${className}`} >
      {/* ชั้นบน: เนื้อหาหลัก */ }
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* คอลัมน์ที่ 1: Brand */ }
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Livin' Lab</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
          </ul>
        </div>
        {/* คอลัมน์ที่ 2: Support */ }
         <div>
          <h3 className="text-white font-bold text-lg mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>
          {/* คอลัมน์ที่ 3: Contact */ }
         <div>
          <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <div className="hover:text-white">
              <li><a href="#">123 Sukhumvit Road,</a></li>
              <li><a href="#">Bangkok 10110, Thailand</a></li>
            </div>
            <li><a href="#" className="hover:text-white">Email: support@livinlab.th</a></li>
            <li><a href="#" className="hover:text-white">Tel: +66 2-123-4567</a></li>
          </ul>
        </div>

          {/* คอลัมน์ที่ 4: Follow */ }
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
                <a href="#" aria-label="Facebook" className="p-2 border border-[--color-footer-link] rounded hover:text-white hover:border-white">
                  <Facebook className="size-5" />
                </a>
                <a href="#" aria-label="Instagram" className="p-2 border border-[--color-footer-link] rounded hover:text-white hover:border-white">
                  <Instagram className="size-5" />
                </a>
                <a href="#" aria-label="Chat/Line" className="p-2 border border-[--color-footer-link] rounded hover:text-white hover:border-white">
                  <MessageSquare className="size-5" />
                </a>
            </div>
        </div>
      </div>

        {/* เส้นคั่น + ลิขสิทธิ์ */}
        <div className="border-amber-50 border-t" />
          <div className="py-4">
            <p className="text-center text-sm text-white">© 2025 Livin’Lab. All Rights Reserved.</p>
          </div>

    </footer>
  );
}
