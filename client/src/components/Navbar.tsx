import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import iconImage from "@assets/Logo_KWIK_M_1766684597258.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", isRoute: true },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
    { href: "/career", label: "Career", isRoute: true },
    { href: "/why-kwikm", label: "Why KwikM Solar", isRoute: true },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl lg:text-2xl tracking-tight cursor-pointer flex-shrink-0">
            <img src={iconImage} alt="KwikM Icon" className="h-7 lg:h-8 w-auto rounded-md" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KwikM
            </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-3">
          {links.map((link) => (
            link.isRoute ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap px-2"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap px-2"
              >
                {link.label}
              </a>
            )
          ))}
          <Link href="/join">
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-[13px] px-3 ml-1">
              Join Now Free
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-8">
                {links.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  )
                ))}
                <Link href="/join" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Join Now Free
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
