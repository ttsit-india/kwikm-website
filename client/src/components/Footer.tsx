import { ExternalLink, Facebook, Instagram, Linkedin, Twitter, Phone, Mail, MapPin, Smartphone } from "lucide-react";
import { Link } from "wouter";
import iconImage from "@assets/k_logo_1771871712690.jpg";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center font-heading font-bold text-2xl tracking-tight mb-6 cursor-pointer" style={{ gap: "1px" }}>
                <img src={iconImage} alt="KwikM Solar" className="h-14 w-14 object-contain rounded-lg" />
                <span className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  KwikM Solar
                </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-4">
              Your gateway to financial freedom and sustainable energy.
              Powering India with smart solutions.
            </p>
            <p className="text-secondary font-bold text-sm mb-6">
              Kwizar Infotech Pvt Ltd
            </p>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-slate-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-slate-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary transition-colors text-slate-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-slate-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            
            <a 
              href="https://play.google.com/store/apps/details?id=com.kwizarinfotech.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-green-600 rounded-xl transition-colors group"
              data-testid="link-playstore"
            >
              <div className="w-8 h-8 bg-green-500 group-hover:bg-white rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white group-hover:text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 group-hover:text-green-100">GET IT ON</p>
                <p className="text-sm font-bold text-white">Google Play</p>
              </div>
            </a>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="hover:text-white transition-colors">+91 70808 53434</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span className="hover:text-white transition-colors">info@kwikm.in</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-slate-200">Corporate Office:</p>
                  <p>Mira road Bhayendra, Mumbai</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-slate-200">Registered Office:</p>
                  <p>Jangal Matadin Near Geeta Vatika, Gorakhpur</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Open Bank Account</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Credit Card</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Demat Account</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Insurance</a></li>
              <li><a href="/subsidy-calculator" className="text-slate-400 hover:text-white transition-colors">Solar Subsidy Portal</a></li>
              <li><Link href="/kwikm-charge" className="text-slate-400 hover:text-white transition-colors">EV Fast Charging</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/join" className="text-slate-400 hover:text-white transition-colors">Join Now Free</Link></li>
              <li><Link href="/subsidy-calculator" className="text-slate-400 hover:text-white transition-colors">Subsidy Calculator</Link></li>
              <li><Link href="/kwikm-charge" className="text-slate-400 hover:text-white transition-colors">KwikM Charge</Link></li>
              <li><a href="https://kwikm.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">Official Site <ExternalLink className="h-3 w-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} KwikM Solar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
