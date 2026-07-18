import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Zap, Landmark, Sun, Award, TrendingDown, IndianRupee, Info, Wrench, ArrowLeft, Calculator, Download } from "lucide-react";
import { Link } from "wouter";
import kwikMLogo from "@assets/k_logo_1771871712690.jpg";
import eastmanLogo from "@assets/East_Man_1771878382307.png";
import ushaLogo from "@assets/Usha_1771878382306.png";
import adaniLogo from "@assets/Adani_1771878382305.png";
import havellsLogo from "@assets/Havells_1771878382305.png";
import tataLogo from "@assets/download_(5)_1771878382306.png";
import solarPanelImg from "@assets/solar-energy-farm-with-wind-turbines-and-solar-panels-ai-gener_1771880596838.jpg";

const states = [
  { name: "Andhra Pradesh", subsidy: 0, maxSubsidy: 0 },
  { name: "Bihar", subsidy: 0, maxSubsidy: 0 },
  { name: "Chhattisgarh", subsidy: 10000, maxSubsidy: 30000 },
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

const solarBrands = [
  "Waaree",
  "Adani",
  "Tata Power Solar",
  "Havells",
  "Luminous",
  "Eastman",
  "Vikram Solar",
  "LONGi",
  "Jinko Solar",
  "Canadian Solar",
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
  const [brand, setBrand] = useState("");
  const [plantSizeInput, setPlantSizeInput] = useState<string>("");
  const [loanType, setLoanType] = useState("govt");
  const [monthlyBill, setMonthlyBill] = useState<string>("");
  const [state, setState] = useState("");
  const [tenure, setTenure] = useState("60");
  const [showResult, setShowResult] = useState(false);

  const plantSize = plantSizeInput ? parseFloat(plantSizeInput) : 0;

  const calculation = useMemo(() => {
    const effectiveCapacity = plantSize;
    let ratePerWatt = 60;
    let batteryInfo = "";

    if (category === "residential") {
      if (systemType === "hybrid") {
        if (effectiveCapacity <= 3) {
          ratePerWatt = 82;
          batteryInfo = "4 Battery x 100 AH";
        } else {
          ratePerWatt = 70;
          batteryInfo = "4 Battery x 100 AH";
        }
      } else {
        ratePerWatt = 60;
      }
    } else {
      ratePerWatt = systemType === "hybrid" ? 65 : 50;
    }
    const systemCost = effectiveCapacity * 1000 * ratePerWatt;

    let centralSubsidy = 0;
    let stateSubsidy = 0;

    if (category === "residential") {
      if (effectiveCapacity <= 1) centralSubsidy = 30000;
      else if (effectiveCapacity <= 2) centralSubsidy = 60000;
      else centralSubsidy = 78000;

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
      if (principal <= 0 || months <= 0) return 0;
      const r = (rate || annualInterestRate) / 12;
      return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    };

    const currentEMI = getEMI(netCost, parseInt(tenure));
    const effectiveEMI = currentEMI - monthlySavings;
    const paybackYears = annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : "0";
    const lifetimeSavings = annualSavings * 25;
    const roi = netCost > 0 ? ((annualSavings / netCost) * 100).toFixed(2) : "0";

    const annualUnits = unitsPerMonth * 12;
    const co2Mitigated = Math.round(annualUnits * 0.807);
    const treesPlanted = Math.round(effectiveCapacity * 39.3);
    const distanceKms = Math.round(effectiveCapacity * 10530);

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
  }, [category, plantSize, state, tenure, loanType, systemType]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setShowResult(false);
  };

  const validate = () => {
    if (!customerName.trim()) {
      toast({ title: "Name Required", description: "Please enter customer name.", variant: "destructive" });
      return false;
    }
    if (!customerMobile || customerMobile.length < 10) {
      toast({ title: "Mobile Required", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return false;
    }
    if (!brand) {
      toast({ title: "Brand Required", description: "Please select a solar panel brand.", variant: "destructive" });
      return false;
    }
    if (!plantSize || plantSize <= 0) {
      toast({ title: "Plant Size Required", description: "Please enter solar plant size in kW.", variant: "destructive" });
      return false;
    }
    if (category === "residential" && (plantSize < 1 || plantSize > 10)) {
      toast({ title: "Invalid Size", description: "Residential plant size should be between 1-10 kW.", variant: "destructive" });
      return false;
    }
    if (category === "commercial" && (plantSize < 5 || plantSize > 500)) {
      toast({ title: "Invalid Size", description: "Commercial plant size should be between 5-500 kW.", variant: "destructive" });
      return false;
    }
    if (category === "residential" && !state) {
      toast({ title: "State Required", description: "Please select your state for subsidy calculation.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCalculate = () => {
    if (validate()) {
      setShowResult(true);
    }
  };

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
    const magenta: [number, number, number] = [233, 30, 140];
    const blue: [number, number, number] = [0, 180, 216];
    const lime: [number, number, number] = [168, 224, 99];
    const darkGray: [number, number, number] = [31, 41, 55];
    const gray400: [number, number, number] = [156, 163, 175];
    const gray600: [number, number, number] = [75, 85, 99];
    const gray800: [number, number, number] = [31, 41, 59];

    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const effectiveCapacity = plantSize;

    const addLogo = (x: number, y: number, size: number = 16) => {
      try {
        doc.addImage(kwikMLogo, 'JPEG', x, y, size, size);
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.setFontSize(size > 20 ? 25 : 14);
        doc.setFont("helvetica", "bold");
        doc.text("KwikM Solar", x + size + 3, y + size * 0.7);
      } catch (e) {
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.setFontSize(17);
        doc.setFont("helvetica", "bold");
        doc.text("KwikM Solar", x, y + 8);
      }
    };

    let pageNum = 1;
    const totalPages = 6;
    const pageW = 210;
    const pageH = 297;

    const addPageFooter = (label: string) => {
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, 289);
      doc.text(`${pageNum}/${totalPages}`, 190, 289, { align: "right" });
      pageNum++;
    };

    // ========== PAGE 1: COVER PAGE ==========
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, 'F');

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, pageW, 5, 'F');

    addLogo(60, 12, 28);

    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Kwizar Infotech Pvt. Ltd.  |  Mira Road, Mumbai  |  Near Geeta Vatika, Jangal Matadin, Gorakhpur", 105, 50, { align: "center" });

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(20, 56, 190, 56);

    try {
      doc.addImage(solarPanelImg, "JPEG", 20, 62, 170, 85);
      doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
      doc.setLineWidth(1.5);
      doc.roundedRect(20, 62, 170, 85, 3, 3, "S");
    } catch {
      doc.setFillColor(240, 245, 250);
      doc.roundedRect(20, 62, 170, 85, 3, 3, 'F');
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(14);
      doc.text("Solar Rooftop Installation", 105, 108, { align: "center" });
    }

    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.roundedRect(30, 155, 150, 40, 4, 4, 'F');

    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("SOLAR ROOFTOP", 105, 168, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("System Proposal", 105, 183, { align: "center" });

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(85, 190, 40, 1.5, 'F');

    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(customerName, 105, 212, { align: "center" });

    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(customerAddress || "India", 105, 223, { align: "center" });

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(40, 229, 170, 229);

    const coverItems = [
      { label: "Requirements", value: category === 'residential' ? 'Residential' : 'Commercial' },
      { label: "Date", value: currentDate },
      { label: "System Capacity", value: `${effectiveCapacity} kWp` },
      { label: "System Type", value: systemType === 'hybrid' ? 'Hybrid with Battery' : 'Ongrid' },
      { label: "Solar Panel", value: brand || 'Premium Brand' },
      { label: "Property Type", value: category === 'residential' ? 'Residential' : 'Commercial' },
    ];

    coverItems.forEach((item, i) => {
      const y = 236 + i * 10;
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.label}`, 72, y, { align: "right" });
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(item.value, 78, y);
    });

    addPageFooter("KwikM Solar");

    // ========== PAGE 2: QUOTATION & EMI ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, 'F');

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, pageW, 4, 'F');

    addLogo(148, 8, 16);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", 20, 32);

    doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 65, 38);

    autoTable(doc, {
      startY: 45,
      head: [["From", "Bill To"]],
      body: [
        [
          "KwikM Solar\nKwizar Infotech Pvt. Ltd.\nCorporate: Mira Road, Mumbai\nRegd: Near Geeta Vatika, Jangal Matadin, Gorakhpur",
          `${customerName}\n${customerAddress || "India"}\nMobile: ${customerMobile}`,
        ],
      ],
      styles: { fontSize: 10, cellPadding: 4, lineColor: [230, 230, 230], lineWidth: 0.3 },
      headStyles: { fillColor: [magenta[0], magenta[1], magenta[2]], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 85 }, 1: { cellWidth: 85 } },
      margin: { left: 20, right: 20 },
    });

    const fromEndY4 = (doc as any).lastAutoTable?.finalY || 90;

    autoTable(doc, {
      startY: fromEndY4 + 3,
      head: [["Date", "System Capacity", "System Type", "Brand"]],
      body: [[currentDate, `${effectiveCapacity} kWp`, systemType === 'hybrid' ? 'Hybrid' : 'Ongrid', brand || 'Premium']],
      styles: { fontSize: 10, cellPadding: 4, lineColor: [230, 230, 230], lineWidth: 0.3 },
      headStyles: { fillColor: [248, 250, 252], textColor: [75, 85, 99], fontStyle: "bold" },
      bodyStyles: { fontStyle: "bold" },
      margin: { left: 20, right: 20 },
    });

    const dateEndY4 = (doc as any).lastAutoTable?.finalY || 115;

    autoTable(doc, {
      startY: dateEndY4 + 3,
      head: [["", "Description", "Amount"]],
      body: [
        ["1", `${effectiveCapacity} kWp ${systemType === 'hybrid' ? 'Hybrid' : 'Ongrid'} Solar System\n- ${brand || 'Premium'} High Efficiency Solar Panels\n- ${systemType === 'hybrid' ? 'Hybrid' : 'Ongrid'} Inverter\n- DC/AC Protection Devices\n- Installation & Commissioning\n- 5 Years Free Maintenance`, `Rs ${calculation.systemCost.toLocaleString()}`],
        ["", "Government Subsidy (PM Surya Ghar)", `- Rs ${calculation.totalSubsidy.toLocaleString()}`],
      ],
      foot: [["", "NET INVESTMENT", `Rs ${calculation.netCost.toLocaleString()}`]],
      styles: { fontSize: 10, cellPadding: 4, lineColor: [230, 230, 230], lineWidth: 0.3 },
      headStyles: { fillColor: [magenta[0], magenta[1], magenta[2]], textColor: [255, 255, 255], fontStyle: "bold" },
      footStyles: { fillColor: [gray800[0], gray800[1], gray800[2]], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 12 },
      columnStyles: { 0: { cellWidth: 12, halign: "center" }, 1: { cellWidth: 120 }, 2: { cellWidth: 38, halign: "right" } },
      margin: { left: 20, right: 20 },
    });

    const quoteEndY = (doc as any).lastAutoTable?.finalY || 195;

    const qaY = quoteEndY + 5;
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("QUALITY ASSURANCE", 20, qaY);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const qaText = "All cables, wires & components are BIS-approved brands (Polycab, Havells, RR Cable or equivalent). Earthing, lightning arrestors, GI structures & BOS materials as per MNRE guidelines. KwikM Solar — no compromise on safety, durability, or performance.";
    const qaLines = doc.splitTextToSize(qaText, 170);
    doc.text(qaLines, 20, qaY + 6);

    const returnsY = qaY + 20;
    const rBoxW = 52;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, returnsY, rBoxW, 24, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("ANNUAL SAVINGS", 46, returnsY + 8, { align: "center" });
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${calculation.annualSavings.toLocaleString()}`, 46, returnsY + 18, { align: "center" });

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(79, returnsY, rBoxW, 24, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("25-YEAR SAVINGS", 105, returnsY + 8, { align: "center" });
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${calculation.lifetimeSavings.toLocaleString()}`, 105, returnsY + 18, { align: "center" });

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(138, returnsY, rBoxW, 24, 3, 3, 'F');
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("PAYBACK PERIOD", 164, returnsY + 8, { align: "center" });
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${calculation.paybackYears} Years`, 164, returnsY + 18, { align: "center" });

    const emiY4 = returnsY + 30;

    const emi36 = calculation.getEMI(calculation.netCost, 36);
    const emi60 = calculation.getEMI(calculation.netCost, 60);
    const emi84 = calculation.getEMI(calculation.netCost, 84);

    autoTable(doc, {
      startY: emiY4,
      head: [["Tenure", `EMI (${loanType === 'govt' ? '8% Govt Bank' : '16% NBFC'})`]],
      body: [
        ["36 Months", `Rs ${emi36.toLocaleString()} /month`],
        ["60 Months", `Rs ${emi60.toLocaleString()} /month`],
        ["84 Months", `Rs ${emi84.toLocaleString()} /month`],
      ],
      styles: { fontSize: 9, cellPadding: 3, lineColor: [230, 230, 230], lineWidth: 0.3 },
      headStyles: { fillColor: [blue[0], blue[1], blue[2]], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 50, fontStyle: "bold" }, 1: { cellWidth: 120, halign: "center" } },
      margin: { left: 20, right: 20 },
    });

    addPageFooter("KwikM Solar");

    // ========== PAGE 3: WHY KwikM SOLAR ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, 'F');

    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(0, 0, pageW, 4, 'F');

    addLogo(148, 8, 16);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text("Why KwikM Solar", 20, 32);

    doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 90, 38);

    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.text("Smart Energy. Strong Savings. Secure Future.", 20, 48);

    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.roundedRect(20, 56, 170, 30, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Our Promise", 28, 68);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Installation is just the beginning. We stand by you with lifetime support, expert guidance & complete maintenance care.", 28, 78);

    const whyBenefits = [
      { title: "Transparent Pricing", desc: "No hidden charges. Clear quotation with complete breakdown of all costs, components and services included.", color: magenta },
      { title: "Premium BIS-Approved Components", desc: "Top-tier solar panels, inverters & batteries from trusted brands — Waaree, Adani, Tata Power, Havells, Luminous, Livguard.", color: blue },
      { title: "Government Subsidy Support", desc: "Complete handling of PM Surya Ghar Muft Bijli Yojana — documentation, approvals, subsidy & net-metering, all hassle-free.", color: lime },
      { title: "Financial Returns", desc: "3-4 years payback period. Reduce electricity bills up to 95%. 25+ years of almost free power with 12-18% long-term returns.", color: [255, 165, 0] as [number, number, number] },
      { title: "Lifetime After-Sales Support", desc: "Dedicated local service team for maintenance, monitoring & warranty claims. Fast response, reliable care.", color: [79, 70, 229] as [number, number, number] },
      { title: "Complete System Solutions", desc: "On-Grid for maximum savings or Hybrid with battery backup for 24×7 power independence. Right system for every need.", color: [236, 72, 153] as [number, number, number] },
    ];

    whyBenefits.forEach((b, i) => {
      const y = 96 + i * 28;
      doc.setFillColor(b.color[0], b.color[1], b.color[2]);
      doc.roundedRect(20, y, 3, 22, 1, 1, "F");

      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(b.title, 28, y + 8);

      doc.setTextColor(gray600[0], gray600[1], gray600[2]);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const dLines = doc.splitTextToSize(b.desc, 160);
      doc.text(dLines, 28, y + 16);
    });

    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.roundedRect(20, 268, 170, 16, 3, 3, "F");
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("25-Year Performance Warranty", 30, 279);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("25 YRS", 172, 279, { align: "right" });

    addPageFooter("KwikM Solar");

    // ========== PAGE 4: 25-YEAR GROWTH PLAN ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, 'F');

    const indigo: [number, number, number] = [79, 70, 229];
    const limeGreen: [number, number, number] = [163, 230, 53];

    doc.setFillColor(indigo[0], indigo[1], indigo[2]);
    doc.rect(0, 0, pageW, 4, 'F');

    addLogo(148, 8, 16);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text("25-Year Growth Plan", 20, 32);

    doc.setDrawColor(indigo[0], indigo[1], indigo[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 95, 38);

    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Your electricity savings invested at 12% compounded annual return", 20, 48);

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

    autoTable(doc, {
      startY: 58,
      head: [["Year", "Monthly Invest (Rs)", "Total Invested (Rs)", "Interest Earned (Rs)", "Future Value (Rs)"]],
      body: growthData.map((row) => [
        row.year.toString(),
        row.monthlyInvest.toLocaleString(),
        row.totalInvested.toLocaleString(),
        row.interest.toLocaleString(),
        row.futureValue.toLocaleString()
      ]),
      styles: { fontSize: 7, cellPadding: 1.2 },
      headStyles: { fillColor: [indigo[0], indigo[1], indigo[2]], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
      alternateRowStyles: { fillColor: [238, 242, 255] },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },
        1: { halign: 'right', cellWidth: 32 },
        2: { halign: 'right', cellWidth: 36 },
        3: { halign: 'right', cellWidth: 32 },
        4: { halign: 'right', cellWidth: 36 }
      },
      margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 240;

    doc.setFillColor(limeGreen[0], limeGreen[1], limeGreen[2]);
    doc.roundedRect(20, finalY + 8, 170, 28, 3, 3, 'F');
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Total Value After 25 Years:", 28, finalY + 22);
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(`Rs ${growthData[24].futureValue.toLocaleString()}`, 165, finalY + 23, { align: "right" });

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
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.text(`(${numberToWordsPdf(growthData[24].futureValue)} Rupees Only)`, 165, finalY + 33, { align: "right" });

    addPageFooter("KwikM Solar");

    // ========== PAGE 5: ENVIRONMENTAL IMPACT ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, 'F');

    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.rect(0, 0, pageW, 4, 'F');

    addLogo(148, 8, 16);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text("Environmental Impact", 20, 32);

    doc.setDrawColor(lime[0], lime[1], lime[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 90, 38);

    const envStats = [
      { label: "CO2 Mitigated (Annual)", value: `${calculation.co2Mitigated.toLocaleString()} Kg`, color: blue },
      { label: "Trees Planted Equivalent", value: `${calculation.treesPlanted.toLocaleString()} Trees`, color: lime },
      { label: "Distance Equivalent", value: `${calculation.distanceKms.toLocaleString()} Kms`, color: magenta }
    ];

    envStats.forEach((stat, i) => {
      const y = 52 + i * 50;

      doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      doc.roundedRect(20, y, 4, 40, 2, 2, 'F');

      doc.setTextColor(gray600[0], gray600[1], gray600[2]);
      doc.setFontSize(13);
      doc.setFont("helvetica", "normal");
      doc.text(stat.label, 30, y + 14);

      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(23);
      doc.setFont("helvetica", "bold");
      doc.text(stat.value, 30, y + 32);
    });

    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.roundedRect(20, 210, 170, 35, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Your Solar Saves More Than Money", 105, 225, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Every kW installed reduces your carbon footprint and helps build a greener India.", 105, 237, { align: "center" });

    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.roundedRect(20, 254, 170, 30, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Return on Investment", 28, 270);
    doc.setFontSize(25);
    doc.text(`${calculation.roi}% p.a.`, 165, 270, { align: "right" });

    addPageFooter("KwikM Solar");

    // ========== PAGE 6: TERMS & CONTACT ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, 'F');

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, pageW, 4, 'F');

    addLogo(148, 8, 16);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text("General Terms", 20, 32);

    doc.setDrawColor(magenta[0], magenta[1], magenta[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 75, 38);

    const terms = [
      "This proposal is valid for 7 business days from the date of issuance.",
      "Net-metering and subsidy approvals are subject to DISCOM and MNRE feasibility.",
      "Final project cost may vary based on site-specific structural requirements.",
      "System includes a comprehensive 5-year free maintenance package.",
      "All electrical work follows national safety standards and regulations.",
      "Subsidy will be credited directly to customer bank account as per MNRE norms.",
      "Payment terms: Advance booking amount on confirmation, balance before material delivery.",
      "Any cable going more than 30 meters will be charged extra at actual cost.",
    ];

    terms.forEach((term, i) => {
      const y = 52 + i * 19;
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}.`, 22, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(gray600[0], gray600[1], gray600[2]);
      const lines = doc.splitTextToSize(term, 155);
      doc.text(lines, 30, y);
    });

    const brandY = 195;
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OUR BRAND PARTNERS", 105, brandY, { align: "center" });

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(40, brandY + 3, 170, brandY + 3);

    const brandLogos = [
      { src: eastmanLogo, name: "Eastman" },
      { src: ushaLogo, name: "Usha" },
      { src: adaniLogo, name: "Adani" },
      { src: tataLogo, name: "Tata" },
      { src: havellsLogo, name: "Havells" },
    ];

    const logoW = 28;
    const logoH = 18;
    const totalLogosW = brandLogos.length * logoW + (brandLogos.length - 1) * 6;
    const startX = (pageW - totalLogosW) / 2;

    brandLogos.forEach((brd, i) => {
      const x = startX + i * (logoW + 6);
      const bY = brandY + 8;
      try {
        doc.addImage(brd.src, "PNG", x, bY, logoW, logoH);
      } catch {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, bY, logoW, logoH, 2, 2, "F");
        doc.setTextColor(gray600[0], gray600[1], gray600[2]);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(brd.name, x + logoW / 2, bY + logoH / 2 + 2, { align: "center" });
      }
    });

    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.rect(0, 230, pageW, 67, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "italic");
    doc.text('"For us Customers are not clients - They are Family"', 105, 244, { align: "center" });

    doc.setFontSize(21);
    doc.setFont("helvetica", "bold");
    doc.text("KwikM Solar", 105, 260, { align: "center" });

    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Kwizar Infotech Pvt. Ltd.", 105, 270, { align: "center" });

    doc.setFontSize(11);
    doc.text("Corporate Office: Mira Road, Mumbai", 105, 278, { align: "center" });
    doc.text("Regd. Office: Near Geeta Vatika, Jangal Matadin, Gorakhpur", 105, 286, { align: "center" });
    doc.text("info@kwikm.in  |  www.kwikm.in  |  +91 70808 53434", 105, 294, { align: "center" });

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.circle(95, 299, 1.5, 'F');
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.circle(105, 299, 1.5, 'F');
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.circle(115, 299, 1.5, 'F');

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

    doc.save(`KwikM_Solar_Proposal_${customerName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900 -ml-2" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2" data-testid="text-calculator-title">
              Solar Calculator
            </h1>
            <p className="text-slate-500 text-base">Calculate savings, subsidy & cost</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500" />
                <CardContent className="p-6 md:p-8 space-y-6">
                  <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full p-1 bg-slate-100 rounded-xl h-12">
                      <TabsTrigger value="residential" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-bold text-sm" data-testid="tab-residential">
                        Residential
                      </TabsTrigger>
                      <TabsTrigger value="commercial" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-bold text-sm" data-testid="tab-commercial">
                        Commercial
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {category === "residential" && (
                    <div className="text-center py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                      <p className="text-white text-sm font-semibold">
                        PM Surya Ghar Muft Bijli Yojana - Up to Rs.78,000 Central Subsidy
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-green-500">●</span> Customer Name
                      </Label>
                      <Input
                        placeholder="Enter name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-12 rounded-xl border-slate-200"
                        data-testid="input-customer-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile No</Label>
                      <Input
                        placeholder="10-digit number"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="h-12 rounded-xl border-slate-200"
                        maxLength={10}
                        data-testid="input-customer-mobile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-green-500">●</span> Select Brand
                    </Label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-brand">
                        <SelectValue placeholder="Choose solar panel brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {solarBrands.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-green-500">●</span> Solar Plant Size (kW)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter plant size in kW"
                      value={plantSizeInput}
                      onChange={(e) => setPlantSizeInput(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      min={category === "residential" ? 1 : 5}
                      max={category === "residential" ? 10 : 500}
                      step="0.5"
                      data-testid="input-plant-size"
                    />
                    <p className="text-[11px] text-slate-400">
                      {category === "residential" ? "1-10 kW for residential" : "5-500 kW for commercial"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-green-500">●</span> Inverter Type
                      </Label>
                      <Select value={systemType} onValueChange={(val) => setSystemType(val)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-inverter-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ongrid">Ongrid</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loan Type</Label>
                      <Select value={loanType} onValueChange={setLoanType}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-loan-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="govt">Govt. Loan (8%)</SelectItem>
                          <SelectItem value="nbfc">NBFC Loan (16%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-green-500">●</span> Monthly Electricity Bill (Rs.)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Avg. monthly bill"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      min={0}
                      data-testid="input-monthly-bill"
                    />
                  </div>

                  {category === "residential" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="text-green-500">●</span> Location (State)
                      </Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200" data-testid="select-state">
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address (Optional)</Label>
                    <Input
                      placeholder="Enter full address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      data-testid="input-customer-address"
                    />
                  </div>

                  <Button
                    onClick={handleCalculate}
                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg"
                    data-testid="button-calculate-subsidy"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Subsidy
                  </Button>

                  <Link href="/customized-calculator">
                    <Button variant="outline" className="w-full mt-2 h-10 rounded-xl border-secondary text-secondary hover:bg-secondary/10 font-bold text-xs gap-2" data-testid="link-customized-calculator">
                      <Wrench className="h-4 w-4" />
                      Advanced Customized Calculator
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {showResult && plantSize > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden" data-testid="card-result">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500" />
                    <CardContent className="p-6 md:p-8 space-y-5">
                      <div className="text-center pb-4 border-b border-slate-100">
                        <h3 className="text-xl font-black text-slate-800">
                          Solar Estimate for {customerName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {plantSize} kW {systemType === 'hybrid' ? 'Hybrid' : 'Ongrid'} | {brand}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-slate-50 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">System Cost</p>
                          <p className="text-lg font-black text-slate-900" data-testid="text-system-cost">₹{calculation.systemCost.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-green-600/70 uppercase mb-1">Total Subsidy</p>
                          <p className="text-lg font-black text-green-600" data-testid="text-total-subsidy">- ₹{calculation.totalSubsidy.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Net Investment</p>
                        <p className="text-3xl font-black text-white flex items-center justify-center gap-1" data-testid="text-net-cost">
                          <IndianRupee className="h-7 w-7" />
                          {calculation.netCost.toLocaleString()}
                        </p>
                      </div>

                      {category === "residential" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 rounded-xl text-center">
                            <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Central Subsidy</p>
                            <p className="text-base font-black text-slate-900">₹{calculation.centralSubsidy.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-xl text-center">
                            <p className="text-[10px] font-bold text-orange-500 uppercase mb-1">State Subsidy</p>
                            <p className="text-base font-black text-slate-900">₹{calculation.stateSubsidy.toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl text-center">
                          <p className="text-3xl font-black text-primary">{calculation.paybackYears}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Years Payback</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-center">
                          <p className="text-3xl font-black text-primary">{calculation.unitsPerMonth}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Units/Month</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-center">
                          <p className="text-3xl font-black text-primary">25+</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Years Life</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-white/10">
                        <TrendingDown className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold">Annual Savings</h3>
                    </div>
                    <p className="text-4xl font-black text-green-400 mb-1" data-testid="text-annual-savings">₹{calculation.annualSavings.toLocaleString()}</p>
                    <p className="text-white/50 text-xs">Monthly: ₹{calculation.monthlySavings.toLocaleString()}</p>
                  </Card>

                  <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                      <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-black">Finance Options (EMI)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <Tabs value={tenure} onValueChange={setTenure} className="w-full">
                        <TabsList className="bg-slate-100 p-1 rounded-lg w-full">
                          {["36", "60", "84"].map((t) => (
                            <TabsTrigger key={t} value={t} className="px-4 flex-1" data-testid={`tab-tenure-${t}`}>{t}M</TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Monthly EMI ({loanType === 'govt' ? '8%' : '16%'} p.a. | {tenure} Months)</p>
                        <p className="text-3xl font-black text-slate-900" data-testid="text-emi-amount">₹{calculation.currentEMI.toLocaleString()}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                        <p className="text-xs font-bold text-green-600/60 uppercase mb-2">Effective Monthly Cost</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-black text-green-600">₹{Math.max(0, calculation.effectiveEMI).toLocaleString()}</p>
                          <span className="text-xs font-bold text-green-600/60">/month</span>
                        </div>
                        <p className="text-[10px] text-green-600 font-bold mt-1">After deducting power savings</p>
                      </div>

                      <div className="space-y-2">
                        {["36", "60", "84"].map((t) => {
                          const emi = calculation.getEMI(calculation.netCost, parseInt(t));
                          return (
                            <div key={t} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${tenure === t ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100'}`}>
                              <span className="text-sm font-bold">{t} Months</span>
                              <span className={`font-black ${tenure === t ? 'text-primary' : 'text-slate-600'}`}>₹{emi.toLocaleString()}/mo</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600">
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            25-Year Growth Plan
                          </h3>
                          <p className="text-white/80 text-[10px] md:text-xs mt-1">
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-none shadow-2xl rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f7fa 50%, #f0fdf4 100%)' }}>
                    <CardHeader className="p-6 pb-3">
                      <CardTitle className="text-xl font-black text-center text-slate-800">Environmental Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">CO2 Mitigated</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">{calculation.co2Mitigated.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">Kg/year</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Trees Planted</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">{calculation.treesPlanted.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">Equivalent</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Distance</p>
                          <p className="text-xl md:text-2xl font-black text-slate-900">{calculation.distanceKms.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">Kms</p>
                        </div>
                      </div>

                      <div className="p-5 bg-slate-900 rounded-2xl text-white mb-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Lifetime Savings (25 Years)</p>
                            <p className="text-2xl font-black text-green-400">₹{calculation.lifetimeSavings.toLocaleString()}</p>
                          </div>
                          <div className="w-px h-10 bg-white/20 hidden sm:block" />
                          <div className="text-center sm:text-right">
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Return on Investment</p>
                            <p className="text-2xl font-black text-primary">{calculation.roi}% <span className="text-sm">p.a.</span></p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={downloadProposal}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-bold text-base shadow-lg"
                        data-testid="button-download-proposal"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Proposal PDF
                      </Button>

                      <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-600 mb-1">Disclaimer:</p>
                        <ol className="text-[10px] text-slate-400 space-y-1 list-decimal list-inside">
                          <li>Monthly, yearly and 5-year Savings have been calculated basis total savings calculated over 25 years. Annual degradation of 1% and 3% annual inflation have been assumed.</li>
                          <li>The price/EMI shown is indicative only and considers starting price without after-sales service. Actual cost/EMI may vary based on city, system variant, panel type, inverter type, etc.</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="border-none shadow-lg bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                      <Calculator className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">Enter Details & Calculate</h3>
                    <p className="text-sm text-slate-400">
                      Fill in the form and click "Calculate Subsidy" to see your solar investment analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
