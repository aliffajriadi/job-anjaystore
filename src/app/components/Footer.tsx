import React from "react";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    belanja: [
      { name: "Semua Produk", href: "#" },
      { name: "Kategori Elektronik", href: "#" },
      { name: "Kategori Akun Premium", href: "#" },
      { name: "RDP & VPS", href: "#" },
      { name: "Promo Flash Sale", href: "#" },
    ],
    bantuan: [
      { name: "Hubungi Kami", href: "#" },
      { name: "Cara Pembayaran", href: "#" },
      { name: "Lacak Pesanan", href: "#" },
      { name: "Syarat & Ketentuan", href: "#" },
      { name: "Kebijakan Pengembalian", href: "#" },
    ],
    perusahaan: [
      { name: "Tentang Anjay Store", href: "#" },
      { name: "Karir", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Partner Program", href: "#" },
      { name: "Kebijakan Privasi", href: "#" },
    ],
  };

  return (
    <footer className="bg-white border-t pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand and Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-zinc-900"
            >
              ANJAY<span className="text-emerald-500">STORE</span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Solusi terbaik untuk kebutuhan digital Anda. Menyediakan produk
              marketplace, layanan premium, dan alat produktivitas dengan harga
              kompetitif dan pelayanan prima.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Section 1 */}
          <div className="space-y-6">
            <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-widest">
              Belanja
            </h4>
            <ul className="space-y-4">
              {footerLinks.belanja.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Section 2 */}
          <div className="space-y-6">
            <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-widest">
              Bantuan
            </h4>
            <ul className="space-y-4">
              {footerLinks.bantuan.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-bold text-zinc-900 uppercase text-xs tracking-widest">
              Kontak
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                <span className="text-sm text-zinc-500">
                  Jakarta Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-zinc-500">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-zinc-500">
                  halo@anjaystore.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-xs">
            © {currentYear}{" "}
            <span className="font-bold text-zinc-900">Anjay Store</span>. Hak
            Cipta Dilindungi.
          </p>
          <div className="flex items-center text-xs text-zinc-400">
            Dibuat dengan{" "}
            <Heart className="w-3.5 h-3.5 mx-1 text-red-500 fill-red-500" />{" "}
            oleh Tim Anjay Store
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
