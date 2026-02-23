import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Zap, Landmark, Sun, Award, TrendingDown, IndianRupee, Info } from "lucide-react";
import kwikMLogo from "@assets/New__1766685350698.png";

// Updated state subsidies based on user instructions
const states = [
  { name: "Andhra Pradesh", subsidy: 0, maxSubsidy: 0 },
  { name: "Bihar", subsidy: 0, maxSubsidy: 0 },
  { name: "Delhi", subsidy: 10000, maxSubsidy: 30000 }, 
  { name: "Gujarat", subsidy: 0, maxSubsidy: 0 },
  { name: "Karnataka", subsidy: 0, maxSubsidy: 0 },
  { name: "Kerala", subsidy: 0, maxSubsidy: 0 },
  { name: "Madhya Pradesh", subsidy: 0, maxSubsidy: 0 },
  { name: "Maharashtra", subsidy: 0, maxSubsidy: 0 },
  { name: "Odisha", subsidy: 20000, maxSubsidy: 60000 },
  { name: "Rajasthan", subsidy: 0, maxSubsidy: 0 },
  { name: "Tamil Nadu", subsidy: 0, maxSubsidy: 0 },
  { name: "Uttar Pradesh", subsidy: 10000, maxSubsidy: 30000 },
  { name: "Uttarakhand", subsidy: 10000, maxSubsidy: 30000 },
  { name: "West Bengal", subsidy: 0, maxSubsidy: 0 },
];

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";

export default function SubsidyCalculator() {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [category, setCategory] = useState("residential");
  const [systemType, setSystemType] = useState("ongrid");

  const downloadProposal = () => {
    if (!customerName) {
      toast({
        title: "Name Required",
        description: "Please enter customer name to generate proposal.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF();
    const magenta: [number, number, number] = [233, 30, 140]; // #E91E8C
    const blue: [number, number, number] = [0, 180, 216]; // #00B4D8
    const lime: [number, number, number] = [168, 224, 99]; // #A8E063
    const darkGray: [number, number, number] = [31, 41, 55]; // #1F2937
    const gray400: [number, number, number] = [156, 163, 175];
    const gray600: [number, number, number] = [75, 85, 99];
    const gray800: [number, number, number] = [31, 41, 59];
    
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const effectiveCapacity = useAutoCapacity ? recommendedCapacity : capacity;
    
    // Helper to add KwikM logo to pages
    const addLogo = (x: number, y: number, width: number = 35) => {
      try {
        doc.addImage(kwikMLogo, 'PNG', x, y, width, width * 0.35);
      } catch (e) {
        // Fallback to text logo if image fails
        doc.setTextColor(gray800[0], gray800[1], gray800[2]);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("KwikM", x, y + 8);
      }
    };
    
    // Notes based on property type and system type
    const propertyNote = category === 'residential' 
      ? 'Under PM Suryoday Yojna, 1-5kW for Residential (Subsidy Eligible)' 
      : 'Shops, offices, schools (6-100 kW) - No Subsidy';
    
    const systemNote = systemType === 'ongrid' 
      ? 'Grid-connected system - No battery backup, lower cost' 
      : category === 'residential' && calculation.batteryInfo 
        ? `Battery backup for power cuts - Includes ${calculation.batteryInfo}`
        : 'Battery quantity depends on the selected hybrid inverter and required backup duration. Cost includes lead-acid batteries.';

    // ========== PAGE 1: COVER PAGE ==========
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Decorative blob shapes - top right magenta
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.circle(220, -20, 80, 'F');
    // Bottom right lime accent
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.circle(200, 200, 40, 'F');
    
    // KWIK M Logo - Centered and Large at top
    addLogo(55, 25, 100);
    
    // Slogan Banner - Magenta background with white text
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.roundedRect(15, 85, 180, 28, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bolditalic");
    doc.text('"For us Customers are not clients - They are Family"', 105, 103, { align: "center" });
    
    // Main Title Section
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("SOLAR PROPOSAL", 105, 130, { align: "center" });
    
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("SOLAR ROOFTOP", 105, 148, { align: "center" });
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.text("SYSTEM PROPOSAL", 105, 162, { align: "center" });
    
    // Client Info Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(30, 175, 150, 65, 4, 4, 'F');
    
    // Row 1: Client Name & Location
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("PREPARED FOR", 40, 188);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(13);
    doc.text(customerName, 40, 197);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("LOCATION", 110, 188);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(13);
    doc.text(customerAddress || "India", 110, 197);
    
    // Row 2: Capacity & Date
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("SYSTEM CAPACITY", 40, 210);
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(11);
    doc.text(`${effectiveCapacity} kWp Rooftop Solar`, 40, 218);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("DATE", 110, 210);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(11);
    doc.text(currentDate, 110, 218);
    
    // Row 3: Property Type & System Type
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("PROPERTY TYPE", 40, 230);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.setFontSize(11);
    doc.text(category === 'residential' ? 'Residential' : 'Commercial', 40, 238);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("SYSTEM TYPE", 110, 230);
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.setFontSize(11);
    doc.text(systemType === 'hybrid' ? 'Hybrid with Battery' : 'Ongrid', 110, 238);
    
    // Notes Section
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(30, 248, 150, 20, 3, 3, 'F');
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`Property: ${propertyNote}`, 35, 256);
    doc.text(`System: ${systemNote}`, 35, 263);
    
    // Footer
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("A Division of", 20, 275);
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(10);
    doc.text("Kwizar Infotech Pvt. Ltd.", 20, 282);
    
    // Color dots
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.circle(175, 280, 2, 'F');
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.circle(182, 280, 2, 'F');
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.circle(189, 280, 2, 'F');

    // ========== PAGE 2: ABOUT KWIK M ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Top gradient bar (magenta)
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, 210, 3, 'F');
    
    // Logo at top right
    addLogo(150, 8, 30);
    
    // Page Header
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("WHO WE ARE", 20, 25);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("About KWIK M", 20, 40);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(48);
    doc.text("02", 175, 55);
    
    // Main description box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 55, 170, 40, 4, 4, 'F');
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(10);
    const aboutText = "KWIK M delivers premium renewable energy solutions focused on long-term value, substantial savings, and lifetime customer support. We are committed to transforming how India consumes energy through innovative solar technology.";
    const aboutLines = doc.splitTextToSize(aboutText, 160);
    doc.text(aboutLines, 28, 70);
    
    // Vision, Mission, Values boxes
    const boxY = 105;
    const boxWidth = 52;
    const boxHeight = 65;
    
    // Vision
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
    doc.setLineWidth(1);
    doc.roundedRect(20, boxY, boxWidth, boxHeight, 3, 3, 'FD');
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.roundedRect(28, boxY + 8, 14, 14, 2, 2, 'F');
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Our Vision", 28, boxY + 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    const visionText = doc.splitTextToSize("Empower a billion lives through sustainable, clean energy solutions.", 44);
    doc.text(visionText, 28, boxY + 45);
    
    // Mission
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(blue[0], blue[1], blue[2]);
    doc.roundedRect(79, boxY, boxWidth, boxHeight, 3, 3, 'FD');
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.roundedRect(87, boxY + 8, 14, 14, 2, 2, 'F');
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Our Mission", 87, boxY + 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    const missionText = doc.splitTextToSize("Deliver innovative, reliable, and affordable solar solutions to every Indian.", 44);
    doc.text(missionText, 87, boxY + 45);
    
    // Values
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(lime[0], lime[1], lime[2]);
    doc.roundedRect(138, boxY, boxWidth, boxHeight, 3, 3, 'FD');
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.roundedRect(146, boxY + 8, 14, 14, 2, 2, 'F');
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Our Values", 146, boxY + 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    const valuesText = doc.splitTextToSize("Trust, Integrity, and Service Excellence in every relationship.", 44);
    doc.text(valuesText, 146, boxY + 45);
    
    // Footer
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("KWIK M - Smart Energy Solutions", 20, 285);

    // ========== PAGE 3: WHY CHOOSE KWIK M ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(0, 0, 210, 3, 'F');
    
    // Logo at top right
    addLogo(150, 8, 30);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("BENEFITS", 20, 25);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Why Choose KWIK M Solar", 20, 40);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(48);
    doc.text("03", 175, 55);
    
    // Benefits Grid
    const benefits = [
      { title: "Financial Savings", desc: "Dramatically reduce your monthly electricity bills and build lifetime savings with solar power.", color: magenta },
      { title: "Government Support", desc: "PM Surya Ghar Yojana subsidy credited directly to your account - up to Rs 78,000 benefits.", color: blue },
      { title: "Sustainability", desc: "Zero emission clean energy that protects our environment for future generations.", color: lime },
      { title: "Property Value", desc: "Solar installations significantly increase your property's market value and appeal.", color: [255, 217, 61] as [number, number, number] }
    ];
    
    let benefitY = 55;
    benefits.forEach((benefit, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 20 + col * 88;
      const y = benefitY + row * 50;
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(x, y, 82, 45, 3, 3, 'FD');
      
      doc.setFillColor(benefit.color[0], benefit.color[1], benefit.color[2]);
      doc.roundedRect(x + 6, y + 6, 14, 14, 2, 2, 'F');
      
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(benefit.title, x + 26, y + 15);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(gray600[0], gray600[1], gray600[2]);
      const descLines = doc.splitTextToSize(benefit.desc, 50);
      doc.text(descLines, x + 26, y + 24);
    });
    
    // 25 Year Warranty Banner
    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.roundedRect(20, 165, 170, 35, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("25-Year Performance Warranty", 35, 182);
    doc.setFontSize(8);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.text("Complete peace of mind with our industry-leading warranty coverage.", 35, 192);
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(32);
    doc.text("25", 165, 188);
    doc.setFontSize(8);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.text("YEARS", 163, 195);
    
    // Footer
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("KWIK M - Smart Energy Solutions", 20, 285);

    // ========== PAGE 4: SYSTEM QUOTATION & FINANCIALS ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.rect(0, 0, 210, 3, 'F');
    
    // Logo at top right
    addLogo(150, 8, 30);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("INVESTMENT", 20, 25);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("System Quotation & Financials", 20, 40);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(48);
    doc.text("04", 175, 55);
    
    // Investment Summary Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(20, 55, 170, 85, 4, 4, 'FD');
    
    // Header bar
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.roundedRect(20, 55, 170, 20, 4, 4, 'F');
    doc.rect(20, 65, 170, 10, 'F'); // Square off bottom corners
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Investment Summary", 28, 68);
    doc.setFontSize(9);
    doc.text(`${effectiveCapacity} kWp ${systemType === 'hybrid' ? 'Hybrid' : 'Ongrid'} Solar Rooftop System`, 28, 73);
    
    // Investment details
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Project Cost", 28, 90);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${calculation.systemCost.toLocaleString()}`, 160, 90, { align: "right" });
    
    doc.setDrawColor(240, 240, 240);
    doc.line(28, 95, 182, 95);
    
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Government Subsidy", 28, 108);
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.roundedRect(90, 102, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text("PM Surya Ghar", 92, 108);
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`- Rs ${calculation.totalSubsidy.toLocaleString()}`, 160, 108, { align: "right" });
    
    doc.setDrawColor(240, 240, 240);
    doc.line(28, 115, 182, 115);
    
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 120, 170, 20, 'F');
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Net Investment", 28, 133);
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(18);
    doc.text(`Rs ${calculation.netCost.toLocaleString()}`, 160, 133, { align: "right" });
    
    // Returns Grid
    const returnsY = 150;
    const returnBoxWidth = 52;
    
    // Annual Savings
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(20, returnsY, returnBoxWidth, 50, 3, 3, 'FD');
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.roundedRect(38, returnsY + 8, 16, 16, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("ANNUAL SAVINGS", 46, returnsY + 35, { align: "center" });
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${calculation.annualSavings.toLocaleString()}`, 46, returnsY + 45, { align: "center" });
    
    // 25-Year Savings
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(79, returnsY, returnBoxWidth, 50, 3, 3, 'FD');
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.roundedRect(97, returnsY + 8, 16, 16, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("25-YEAR SAVINGS", 105, returnsY + 35, { align: "center" });
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${calculation.lifetimeSavings.toLocaleString()}`, 105, returnsY + 45, { align: "center" });
    
    // Payback Period
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(138, returnsY, returnBoxWidth, 50, 3, 3, 'FD');
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.roundedRect(156, returnsY + 8, 16, 16, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("PAYBACK PERIOD", 164, returnsY + 35, { align: "center" });
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${calculation.paybackYears} Years`, 164, returnsY + 45, { align: "center" });
    
    // EMI Financing Section
    const emi36 = calculation.getEMI(calculation.netCost, 36);
    const emi60 = calculation.getEMI(calculation.netCost, 60);
    const emi84 = calculation.getEMI(calculation.netCost, 84);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(20, 210, 170, 70, 4, 4, 'FD');
    
    // EMI Header
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.roundedRect(20, 210, 170, 18, 4, 4, 'F');
    doc.rect(20, 220, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Financing Options (EMI)", 28, 222);
    doc.setFontSize(8);
    doc.text(`Interest Rate: ${loanType === 'govt' ? '8% (Govt Bank)' : '16% (NBFC)'}`, 140, 222);
    
    // EMI Grid
    const emiY = 235;
    const emiBoxWidth = 52;
    
    // 36 Months
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(25, emiY, emiBoxWidth, 38, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("36 MONTHS EMI", 51, emiY + 12, { align: "center" });
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${emi36.toLocaleString()}`, 51, emiY + 28, { align: "center" });
    
    // 60 Months
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(84, emiY, emiBoxWidth, 38, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("60 MONTHS EMI", 110, emiY + 12, { align: "center" });
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${emi60.toLocaleString()}`, 110, emiY + 28, { align: "center" });
    
    // 84 Months
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(143, emiY, emiBoxWidth, 38, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("84 MONTHS EMI", 169, emiY + 12, { align: "center" });
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${emi84.toLocaleString()}`, 169, emiY + 28, { align: "center" });
    
    // Footer
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("KWIK M - Smart Energy Solutions", 20, 285);

    // ========== PAGE 5: ENVIRONMENTAL IMPACT ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Light green background top
    doc.setFillColor(240, 253, 244);
    doc.rect(0, 0, 210, 100, 'F');
    
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.rect(0, 0, 210, 3, 'F');
    
    // Logo at top right
    addLogo(150, 8, 30);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("SUSTAINABILITY", 20, 25);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Environmental Impact", 20, 40);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(48);
    doc.text("05", 175, 55);
    
    // Environmental stats
    const envStats = [
      { label: "CO2 Mitigated (Annual)", value: `${calculation.co2Mitigated.toLocaleString()} Kg`, color: blue },
      { label: "Trees Planted Equivalent", value: `${calculation.treesPlanted.toLocaleString()} Trees`, color: lime },
      { label: "Distance Equivalent", value: `${calculation.distanceKms.toLocaleString()} Kms`, color: magenta }
    ];
    
    envStats.forEach((stat, i) => {
      const y = 65 + i * 55;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(20, y, 170, 45, 4, 4, 'FD');
      
      doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      doc.circle(45, y + 22, 12, 'F');
      
      doc.setTextColor(gray600[0], gray600[1], gray600[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(stat.label, 65, y + 18);
      
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(stat.value, 65, y + 35);
    });
    
    // ROI percentage
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.roundedRect(20, 235, 170, 35, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Return on Investment", 28, 255);
    doc.setFontSize(28);
    doc.text(`${calculation.roi}% p.a.`, 160, 258, { align: "right" });
    
    // Footer
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("KWIK M - Smart Energy Solutions", 20, 285);

    // ========== PAGE 6: 25-YEAR GROWTH PLAN ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Professional indigo/violet gradient header
    const indigo: [number, number, number] = [79, 70, 229];
    const violet: [number, number, number] = [139, 92, 246];
    
    // Header bar
    doc.setFillColor(indigo[0], indigo[1], indigo[2]);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo at top right
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(155, 8, 40, 16, 2, 2, 'F');
    addLogo(158, 9, 32);
    
    // Title and subtitle
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("25-Year Growth Plan - Power of Solar", 20, 25);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Your electricity savings invested at 12% compounded annual return", 20, 35);
    
    // Page number
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(48);
    doc.text("06", 175, 75);
    
    // Calculate 25-year growth data using monthly compounding
    const growthData: { year: number; monthlyInvest: number; totalInvested: number; interest: number; futureValue: number }[] = [];
    const pdfMonthlyInvestment = calculation.annualSavings / 12;
    const pdfMonthlyRate = 0.12 / 12;
    
    for (let y = 1; y <= 25; y++) {
      const months = y * 12;
      const futureValue = pdfMonthlyInvestment * ((Math.pow(1 + pdfMonthlyRate, months) - 1) / pdfMonthlyRate) * (1 + pdfMonthlyRate);
      const totalInvested = pdfMonthlyInvestment * months;
      const interest = futureValue - totalInvested;
      growthData.push({
        year: y,
        monthlyInvest: Math.round(pdfMonthlyInvestment),
        totalInvested: Math.round(totalInvested),
        interest: Math.round(interest),
        futureValue: Math.round(futureValue)
      });
    }
    
    // Show only 5, 10, 15, 20, 25 years in visual cards
    const keyYears = [5, 10, 15, 20, 25];
    const cardWidth = 32;
    const cardGap = 4;
    const startX = 20;
    const yellow: [number, number, number] = [250, 204, 21];
    const orange: [number, number, number] = [249, 115, 22];
    
    // Lime green color for accents
    const limeGreen: [number, number, number] = [163, 230, 53];
    const green: [number, number, number] = [34, 197, 94];
    
    keyYears.forEach((year, i) => {
      const x = startX + i * (cardWidth + cardGap);
      const data = growthData[year - 1];
      
      // Card background
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(indigo[0], indigo[1], indigo[2]);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, 60, cardWidth, 50, 3, 3, 'FD');
      
      // Year circle - lime green
      doc.setFillColor(limeGreen[0], limeGreen[1], limeGreen[2]);
      doc.circle(x + cardWidth / 2, 72, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${year}`, x + cardWidth / 2, 75, { align: "center" });
      
      // "Year" label
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(6);
      doc.text("YEAR", x + cardWidth / 2, 86, { align: "center" });
      
      // Value
      doc.setTextColor(indigo[0], indigo[1], indigo[2]);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      const valueText = `Rs ${data.futureValue.toLocaleString()}`;
      doc.text(valueText, x + cardWidth / 2, 102, { align: "center" });
    });
    
    // Full 25-year table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.text("Complete 25-Year Investment Growth Table (Monthly Compounding)", 20, 125);
    
    autoTable(doc, {
      startY: 130,
      head: [["Year", "Monthly Invest (Rs)", "Total Invested (Rs)", "Interest Earned (Rs)", "Future Value (Rs)"]],
      body: growthData.map((row) => [
        row.year.toString(),
        row.monthlyInvest.toLocaleString(),
        row.totalInvested.toLocaleString(),
        row.interest.toLocaleString(),
        row.futureValue.toLocaleString()
      ]),
      styles: { fontSize: 5.5, cellPadding: 0.8 },
      headStyles: { fillColor: [indigo[0], indigo[1], indigo[2]], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 5.5 },
      alternateRowStyles: { fillColor: [238, 242, 255] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'right', cellWidth: 30 },
        2: { halign: 'right', cellWidth: 36 },
        3: { halign: 'right', cellWidth: 30 },
        4: { halign: 'right', cellWidth: 36 }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Total Value Box - Lime Green
    const finalY = (doc as any).lastAutoTable?.finalY || 240;
    doc.setFillColor(limeGreen[0], limeGreen[1], limeGreen[2]);
    doc.roundedRect(20, finalY + 5, 170, 30, 3, 3, 'F');
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Total Value After 25 Years:", 28, finalY + 16);
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(`Rs ${growthData[24].futureValue.toLocaleString()}`, 165, finalY + 17, { align: "right" });
    
    // Amount in words
    const numberToWordsPdf = (num: number): string => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      if (num === 0) return 'Zero';
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWordsPdf(num % 100) : '');
      if (num < 100000) return numberToWordsPdf(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWordsPdf(num % 1000) : '');
      if (num < 10000000) return numberToWordsPdf(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWordsPdf(num % 100000) : '');
      return numberToWordsPdf(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWordsPdf(num % 10000000) : '');
    };
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.text(`(${numberToWordsPdf(growthData[24].futureValue)} Rupees Only)`, 165, finalY + 28, { align: "right" });
    
    // Footer
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("KWIK M - Smart Energy Solutions", 20, 285);

    // ========== PAGE 7: TERMS & CONTACT ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, 210, 3, 'F');
    
    // Logo at top right
    addLogo(150, 8, 30);
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(8);
    doc.text("TERMS", 20, 25);
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 20, 40);
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(48);
    doc.text("07", 175, 55);
    
    const terms = [
      "This proposal is valid for 7 business days from the date of issuance.",
      "Net-metering and subsidy approvals are subject to DISCOM and MNRE feasibility.",
      "Final project cost may vary based on site-specific structural requirements.",
      "System includes a comprehensive 5-year maintenance package.",
      "All electrical work follows national safety standards.",
      "Subsidy will be credited directly to customer bank account as per MNRE norms."
    ];
    
    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    terms.forEach((term, i) => {
      doc.setFillColor(magenta[0], magenta[1], magenta[2]);
      doc.circle(27, 62 + i * 18, 2, 'F');
      doc.text(term, 35, 64 + i * 18);
    });
    
    // Professional Footer
    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.rect(0, 220, 210, 77, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text('"For us Customers are not clients - They are Family"', 105, 238, { align: "center" });
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Kwizar Infotech Private Limited", 105, 255, { align: "center" });
    
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Corporate Office: Mumbai | Registered Office: Gorakhpur", 105, 268, { align: "center" });
    doc.text("info@kwikm.in | www.kwikm.in | +91 70808 53434", 105, 278, { align: "center" });
    
    // Color dots in footer
    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.circle(95, 288, 2, 'F');
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.circle(105, 288, 2, 'F');
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.circle(115, 288, 2, 'F');

    // Save proposal to database
    const proposalData = {
      customerName,
      capacity: effectiveCapacity.toString(),
      systemCost: calculation.systemCost,
      totalSubsidy: calculation.totalSubsidy,
      netCost: calculation.netCost,
      loanType,
      state,
    };

    fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proposalData),
    });

    doc.save(`KwikM_Proposal_${customerName.replace(/\s+/g, '_')}.pdf`);
  };
  const [panelType, setPanelType] = useState("dcr");
  const [capacity, setCapacity] = useState(3);
  const [state, setState] = useState("");
  const [tenure, setTenure] = useState("60");
  const [loanType, setLoanType] = useState("govt");
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [useAutoCapacity, setUseAutoCapacity] = useState(false);

  const recommendedCapacity = useMemo(() => {
    const unitRate = category === "residential" ? 7 : 9;
    const monthlyUnits = Math.round(monthlyBill / unitRate);
    const dailyUnits = Math.round(monthlyUnits / 30);
    const unitsPerKwDay = 4;
    if (category === "residential") {
      return Math.max(1, Math.min(5, Math.ceil(dailyUnits / unitsPerKwDay)));
    } else {
      return Math.max(6, Math.min(100, Math.ceil(dailyUnits / unitsPerKwDay)));
    }
  }, [monthlyBill, category]);

  const calculation = useMemo(() => {
    const effectiveCapacity = useAutoCapacity ? recommendedCapacity : capacity;
    // Cost per kW logic
    let ratePerWatt = 60; // Residential Ongrid default
    let batteryInfo = "";
    
    if (category === "residential") {
      if (systemType === "hybrid") {
        // Residential Hybrid pricing based on capacity (3kW and 5kW only)
        if (effectiveCapacity <= 3) {
          ratePerWatt = 82; // Rs 82,000 per kW
          batteryInfo = "4 Battery x 100 AH";
        } else {
          ratePerWatt = 70; // Rs 70,000 per kW for 5 kW
          batteryInfo = "4 Battery x 100 AH";
        }
      } else {
        ratePerWatt = 60; // Residential Ongrid = 60k/kW
      }
    } else {
      // Commercial pricing
      ratePerWatt = systemType === "hybrid" ? 65 : 50; // Hybrid = 65k/kW, Ongrid = 50k/kW
    }
    const systemCost = effectiveCapacity * 1000 * ratePerWatt;

    let centralSubsidy = 0;
    let stateSubsidy = 0;

    if (category === "residential" && panelType === "dcr") {
      // Central Subsidy Logic
      if (effectiveCapacity <= 1) centralSubsidy = 30000;
      else if (effectiveCapacity <= 2) centralSubsidy = 60000;
      else centralSubsidy = 78000;

      // State Subsidy Logic
      const selectedState = states.find(s => s.name === state);
      if (selectedState) {
        stateSubsidy = Math.min(selectedState.subsidy * effectiveCapacity, selectedState.maxSubsidy);
      }
    }

    const totalSubsidy = centralSubsidy + stateSubsidy;
    const netCost = systemCost - totalSubsidy;

    const unitsPerKwDay = 4;
    const unitsPerDay = effectiveCapacity * unitsPerKwDay;
    const unitsPerMonth = unitsPerDay * 30;
    const unitRate = category === "residential" ? 7 : 9;
    const monthlySavings = unitsPerMonth * unitRate;
    const annualSavings = monthlySavings * 12;

    const annualInterestRate = loanType === "govt" ? 0.08 : 0.16;
    const getEMI = (principal: number, months: number, rate?: number) => {
      const r = (rate || annualInterestRate) / 12;
      return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    };

    const currentEMI = getEMI(netCost, parseInt(tenure));
    const effectiveEMI = currentEMI - monthlySavings;
    const paybackYears = (netCost / annualSavings).toFixed(1);
    const lifetimeSavings = annualSavings * 25;
    const roi = ((annualSavings / netCost) * 100).toFixed(2); // Return on Investment % p.a.

    // Environmental Impact Calculations (annual - based on 7 kW reference: 8,256 Kg CO2, 275 Trees, 73,710 Kms)
    const annualUnits = unitsPerMonth * 12;
    const co2Mitigated = Math.round(annualUnits * 0.807); // ~0.807 kg CO2 per unit (8,256 / 10,220 for 7kW)
    const treesPlanted = Math.round(effectiveCapacity * 39.3); // ~39.3 trees per kW (275 / 7)
    const distanceKms = Math.round(effectiveCapacity * 10530); // ~10,530 km per kW (73,710 / 7)

    return {
      systemCost,
      centralSubsidy,
      stateSubsidy,
      totalSubsidy,
      netCost,
      unitsPerDay,
      unitsPerMonth,
      monthlySavings,
      annualSavings,
      currentEMI,
      effectiveEMI,
      paybackYears,
      lifetimeSavings,
      roi,
      co2Mitigated,
      treesPlanted,
      distanceKms,
      batteryInfo,
      getEMI,
      annualInterestRate
    };
  }, [category, panelType, capacity, state, tenure, loanType, useAutoCapacity, recommendedCapacity, systemType]);

  // Adjust capacity and bill when category changes
  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setUseAutoCapacity(false);
    if (val === "commercial") {
      if (capacity < 6) setCapacity(6);
      if (monthlyBill < 5000) setMonthlyBill(10000);
    } else {
      if (capacity > 5) setCapacity(3);
      if (monthlyBill > 5000) setMonthlyBill(3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-28 pb-24 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16 relative py-12 px-6 rounded-[3rem] overflow-hidden ring-4 ring-primary ring-offset-4 ring-offset-slate-50" style={{ background: 'linear-gradient(135deg, #d9f99d 0%, #a7f3d0 50%, #bbf7d0 100%)' }}>
            {/* PM Modi Background Image */}
            <div 
              className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: 'url("https://www.narendramodi.in/static/images/pmsuryaghar/banner.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center top'
              }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-6 py-3 rounded-full bg-primary text-white font-black text-lg md:text-xl mb-6 border-2 border-primary/40 backdrop-blur-sm shadow-xl animate-pulse"
              >
                CALCULATE YOUR SOLAR SAVING & SUBSIDY - PM SURYA GHAR 2025
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-slate-800 leading-tight">
                Investment & <span className="text-primary">Return</span> Analysis
              </h1>
              <p className="text-slate-700 text-lg max-w-2xl mx-auto font-medium italic mb-2">
                "KwikM focuses on building your savings, not your expenses."
              </p>
              <p className="text-slate-600 text-base max-w-2xl mx-auto">
                Unlock maximum government benefits. Calculate your rooftop solar ROI with state-specific subsidies instantly.
              </p>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Input Dashboard */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Property Type</Label>
                    <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
                      <TabsList className="grid grid-cols-2 w-full p-1 bg-slate-100 rounded-xl">
                        <TabsTrigger value="residential" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Residential</TabsTrigger>
                        <TabsTrigger value="commercial" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Commercial</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {category === 'residential' 
                        ? 'Under PM Suryoday Yojna, 1-5kW for Residential (Subsidy Eligible)' 
                        : 'Shops, offices, schools (6-100 kW) - No Subsidy'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">System Type</Label>
                    <Tabs value={systemType} onValueChange={(val) => {
                      setSystemType(val);
                      // Reset to valid capacity for residential hybrid (3kW or 5kW only)
                      if (category === 'residential' && val === 'hybrid') {
                        if (![3, 5].includes(capacity)) {
                          setCapacity(3);
                          setUseAutoCapacity(false);
                        }
                      }
                    }} className="w-full">
                      <TabsList className="grid grid-cols-2 w-full p-1 bg-slate-100 rounded-xl">
                        <TabsTrigger value="ongrid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Ongrid</TabsTrigger>
                        <TabsTrigger value="hybrid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Hybrid with Battery</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {systemType === 'ongrid' 
                        ? 'Grid-connected system - No battery backup, lower cost' 
                        : category === 'residential' && calculation.batteryInfo 
                          ? `Battery backup for power cuts - Includes ${calculation.batteryInfo}`
                          : 'Battery quantity depends on the selected hybrid inverter and required backup duration. Cost includes lead-acid batteries.'}
                    </p>
                  </div>

                  <div className="space-y-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                        Avg Electricity Bill
                        <span className="text-xs font-normal text-slate-400 bg-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Info className="h-3 w-3" /> monthly
                        </span>
                      </Label>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Min. ₹{category === 'residential' ? '500' : '5,000'}</span>
                        <span>Max ₹{category === 'residential' ? '5,000' : '1,00,000'}</span>
                      </div>
                      <Slider
                        value={[monthlyBill]}
                        onValueChange={(v) => {
                          setMonthlyBill(v[0]);
                          setUseAutoCapacity(true);
                        }}
                        min={category === 'residential' ? 500 : 5000}
                        max={category === 'residential' ? 5000 : 100000}
                        step={category === 'residential' ? 100 : 1000}
                        className="py-2"
                        data-testid="slider-bill"
                      />
                      <div className="flex justify-center">
                        <div className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-xl shadow-lg shadow-primary/30 flex items-center">
                          <IndianRupee className="h-5 w-5 -mt-0.5" />{monthlyBill.toLocaleString()}
                        </div>
                      </div>
                      {useAutoCapacity && (
                        <p className="text-xs text-center text-primary font-medium mt-2">
                          Based on your bill, we recommend <span className="font-black">{recommendedCapacity} kW</span> system
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Plant Capacity</Label>
                      <span className="text-2xl font-black text-primary">{useAutoCapacity ? recommendedCapacity : capacity}kW</span>
                    </div>
                    {category === 'residential' ? (
                      <>
                        <div className={`grid ${systemType === 'hybrid' ? 'grid-cols-2' : 'grid-cols-5'} gap-2`}>
                          {(systemType === 'hybrid' ? [3, 5] : [1, 2, 3, 4, 5]).map((val) => (
                            <Button 
                              key={val} 
                              variant={(useAutoCapacity ? recommendedCapacity : capacity) === val ? "default" : "outline"}
                              className={`h-11 rounded-xl font-bold ${(useAutoCapacity ? recommendedCapacity : capacity) === val ? 'bg-primary shadow-lg shadow-primary/30' : 'hover:bg-slate-50'}`}
                              onClick={() => {
                                setCapacity(val);
                                setUseAutoCapacity(false);
                              }}
                            >
                              {val}kW
                            </Button>
                          ))}
                        </div>
                        {systemType === 'hybrid' && calculation.batteryInfo && (
                          <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                            <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Battery Backup: {calculation.batteryInfo}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <Input 
                            type="range" 
                            min="6" 
                            max="100" 
                            step="0.5"
                            value={useAutoCapacity ? recommendedCapacity : capacity} 
                            onChange={(e) => {
                              setCapacity(Number(e.target.value));
                              setUseAutoCapacity(false);
                            }}
                            className="accent-primary"
                          />
                        </div>
                        <Input 
                          type="number" 
                          min="6"
                          max="100"
                          step="0.5"
                          placeholder="Capacity (6-100 kW)"
                          value={useAutoCapacity ? recommendedCapacity : capacity} 
                          onChange={(e) => {
                            setCapacity(Math.max(6, Math.min(100, Number(e.target.value))));
                            setUseAutoCapacity(false);
                          }}
                          className="h-11 rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Location (State)</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Customer Name</Label>
                      <Input 
                        placeholder="Enter Customer Name" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-11 rounded-xl"
                        data-testid="input-customer-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Mobile Number</Label>
                      <Input 
                        placeholder="Enter 10-digit Mobile Number" 
                        value={customerMobile} 
                        onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="h-11 rounded-xl"
                        maxLength={10}
                        data-testid="input-customer-mobile"
                      />
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest">Address</Label>
                      <Input 
                        placeholder="Enter Full Address" 
                        value={customerAddress} 
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="h-11 rounded-xl"
                        data-testid="input-customer-address"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Estimated Cost</span>
                      <span className="font-bold">₹{calculation.systemCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-primary">
                      <span className="font-medium">Total Subsidy</span>
                      <span className="font-bold">- ₹{calculation.totalSubsidy.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black pt-2">
                      <span>Net Cost</span>
                      <span className="text-slate-900">₹{calculation.netCost.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-white/10">
                    <TrendingDown className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Annual Savings</h3>
                </div>
                <p className="text-5xl font-black text-green-400 mb-2">₹{calculation.annualSavings.toLocaleString()}</p>
                <p className="text-white/60 text-sm">Estimated return based on local utility rates</p>
              </Card>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-8 space-y-8">
              {/* Subsidy Breakdown */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-none shadow-lg bg-white rounded-3xl p-5 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Award className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Central Govt. Subsidy</p>
                    <p className="text-xl font-black text-slate-900">₹{calculation.centralSubsidy.toLocaleString()}</p>
                  </div>
                </Card>
                <Card className="border-none shadow-lg bg-white rounded-3xl p-5 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Sun className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">State Subsidy ({state})</p>
                    <p className="text-xl font-black text-slate-900">₹{calculation.stateSubsidy.toLocaleString()}</p>
                  </div>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-5 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    <IndianRupee className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Total Subsidy Benefit</p>
                    <p className="text-xl font-black text-white">₹{calculation.totalSubsidy.toLocaleString()}</p>
                  </div>
                </Card>
              </div>

              {/* Performance Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg bg-white rounded-3xl p-8 text-center">
                  <p className="text-4xl font-black text-primary mb-1">{calculation.paybackYears}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">Years Payback</p>
                </Card>
                <Card className="border-none shadow-lg bg-white rounded-3xl p-8 text-center">
                  <p className="text-4xl font-black text-primary mb-1">{calculation.unitsPerMonth}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">Units / Month</p>
                </Card>
                <Card className="border-none shadow-lg bg-white rounded-3xl p-8 text-center">
                  <p className="text-4xl font-black text-primary mb-1">25+</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">Years Lifespan</p>
                </Card>
              </div>

              {/* Finance Dashboard */}
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <CardHeader className="p-8 pb-0 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Landmark className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-black">Finance Options</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    <Tabs value={loanType} onValueChange={setLoanType} className="w-full md:w-auto">
                      <TabsList className="bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                        <TabsTrigger value="govt" className="px-4 text-xs font-bold">Govt Bank (8%)</TabsTrigger>
                        <TabsTrigger value="nbfc" className="px-4 text-xs font-bold">NBFC's (16%)</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Tabs value={tenure} onValueChange={setTenure} className="w-full md:w-auto">
                      <TabsList className="bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                        {["36", "60", "84"].map((t) => (
                          <TabsTrigger key={t} value={t} className="px-4">{t}M</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-12 items-center mb-10">
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <p className="text-sm font-bold text-slate-400 uppercase mb-2">Monthly EMI ({loanType === 'govt' ? '8%' : '16%'} ROI)</p>
                        <p className="text-4xl font-black text-slate-900">₹{calculation.currentEMI.toLocaleString()}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-green-50 border border-green-100">
                        <p className="text-sm font-bold text-green-600/60 uppercase mb-2">Effective Monthly Cost</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-black text-green-600">₹{Math.max(0, calculation.effectiveEMI).toLocaleString()}</p>
                          <span className="text-xs font-bold text-green-600/60">/month</span>
                        </div>
                        <p className="text-[10px] text-green-600 font-bold mt-2">After deducting power savings</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-bold text-slate-900">EMI Schedule (at {loanType === 'govt' ? '8%' : '16%'})</h4>
                      <div className="space-y-3">
                        {["36", "60", "84"].map((t) => {
                          const emi = calculation.getEMI(calculation.netCost, parseInt(t));
                          return (
                            <div key={t} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${tenure === t ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100'}`}>
                              <span className="text-sm font-bold">{t} Months</span>
                              <span className={`font-black ${tenure === t ? 'text-primary' : 'text-slate-600'}`}>₹{emi.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900 text-white">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-4">
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Lifetime Savings (25 Years)</p>
                        <p className="text-3xl font-black text-green-400">₹{calculation.lifetimeSavings.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-12 bg-white/20 hidden md:block" />
                      <div className="flex-1 text-center md:text-right">
                        <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Return on Investment</p>
                        <p className="text-3xl font-black text-primary">{calculation.roi}% <span className="text-lg">p.a.</span></p>
                      </div>
                    </div>
                    <Button 
                      onClick={downloadProposal}
                      className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-8 font-bold w-full"
                    >
                      Download Proposal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 25-Year Growth Plan - Power of Solar */}
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        25-Year Growth Plan – Power of Solar
                      </h3>
                      <p className="text-white/80 text-[10px] md:text-xs mt-1 leading-relaxed">
                        Your electricity savings invested at 12% compounded annual return
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {[5, 10, 15, 20, 25].map((year) => {
                      const monthlyInvestment = calculation.annualSavings / 12;
                      const monthlyRate = 0.12 / 12;
                      const months = year * 12;
                      const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
                      return (
                        <div key={year} className="text-center p-2 md:p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                          <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1.5 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white font-bold text-xs md:text-sm">
                            {year}
                          </div>
                          <p className="text-[8px] md:text-[10px] text-white/50 uppercase">Year</p>
                          <p className="text-xs md:text-sm font-bold text-white">₹{Math.round(futureValue).toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-lime-400 to-green-500 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm font-semibold text-black/70">Total Value (25 Years)</span>
                      <div className="text-right">
                        <span className="text-lg md:text-2xl font-black text-white block">
                          ₹{(() => {
                            const monthlyInvestment = calculation.annualSavings / 12;
                            const monthlyRate = 0.12 / 12;
                            const months = 300;
                            const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
                            return Math.round(futureValue).toLocaleString('en-IN');
                          })()}
                        </span>
                        <span className="text-[9px] md:text-[11px] text-black/70 font-medium">
                          {(() => {
                            const monthlyInvestment = calculation.annualSavings / 12;
                            const monthlyRate = 0.12 / 12;
                            const months = 300;
                            const futureValue = Math.round(monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
                            
                            const numberToWords = (num: number): string => {
                              const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
                              const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
                              
                              if (num === 0) return 'Zero';
                              if (num < 20) return ones[num];
                              if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
                              if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
                              if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
                              if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
                              return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
                            };
                            
                            return `(${numberToWords(futureValue)} Rupees Only)`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Environmental Impact Section */}
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f7fa 50%, #f0fdf4 100%)' }}>
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-black text-center text-slate-800">Your Solar Saves More Than Money</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">CO2 Mitigated</p>
                      <p className="text-2xl md:text-3xl font-black text-slate-900">{calculation.co2Mitigated.toLocaleString()} Kg</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Trees Planted</p>
                      <p className="text-2xl md:text-3xl font-black text-slate-900">{calculation.treesPlanted.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-100">
                      <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Distance</p>
                      <p className="text-2xl md:text-3xl font-black text-slate-900">{calculation.distanceKms.toLocaleString()} Kms</p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-600 mb-2">Disclaimer:</p>
                    <ol className="text-[11px] text-slate-500 space-y-1.5 list-decimal list-inside">
                      <li>Monthly, yearly and 5-year Savings have been calculated basis total savings calculated over 25 years. Annual degradation of 1% and 3% annual inflation have been assumed for this calculation.</li>
                      <li>The price/EMI shown is indicative only and considers starting price without after-sales service. The actual cost/EMI of your solar project may vary based on factors such as your city, system variant, panel type, inverter type, available roof space, roof height, discom charges, mounting structure, lender, type of after sales service, savings guarantee, etc.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
