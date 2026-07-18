import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Zap, Battery, Wrench, IndianRupee, Download, Calculator, ArrowLeft, Landmark } from "lucide-react";
import { Link } from "wouter";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import kwikMLogo from "@assets/k_logo_1771871712690.jpg";
import eastmanLogo from "@assets/East_Man_1771878382307.png";
import ushaLogo from "@assets/Usha_1771878382306.png";
import adaniLogo from "@assets/Adani_1771878382305.png";
import havellsLogo from "@assets/Havells_1771878382305.png";
import tataLogo from "@assets/download_(5)_1771878382306.png";
import solarPanelImg from "@assets/solar-energy-farm-with-wind-turbines-and-solar-panels-ai-gener_1771880596838.jpg";

const RATES = {
  solarPanel: 21000,
  inverter: {
    hybrid: 23800,
    ongrid: 7000,
    offgrid: 10000,
  },
  battery: {
    leadAcid: {
      100: 12000,
      150: 15000,
      200: 18000,
    } as Record<number, number>,
    lithium: 15000,
  },
  installation: 15000,
};

type InverterType = "hybrid" | "ongrid" | "offgrid";
type BatteryType = "leadAcid" | "lithium";
type SystemMode = "ongrid" | "hybrid";

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export default function CustomizedCalculator() {
  const { toast } = useToast();

  const [systemMode, setSystemMode] = useState<SystemMode>("ongrid");
  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [solarPlantSize, setSolarPlantSize] = useState<number | "">("");
  const [inverterType, setInverterType] = useState<InverterType>("ongrid");
  const [inverterSize, setInverterSize] = useState<number | "">("");
  const [batteryType, setBatteryType] = useState<BatteryType | "none">("none");
  const [leadAcidQty, setLeadAcidQty] = useState<number | "">("");
  const [leadAcidAh, setLeadAcidAh] = useState<string>("");
  const [lithiumKw, setLithiumKw] = useState<number | "">("");
  const [showResult, setShowResult] = useState(false);
  const [loanType, setLoanType] = useState("govt");
  const [tenure, setTenure] = useState("60");

  const needsBattery = batteryType !== "none";

  const handleSystemModeChange = (val: string) => {
    setSystemMode(val as SystemMode);
    if (val === "ongrid") {
      setInverterType("ongrid");
    } else {
      setInverterType("hybrid");
    }
    setShowResult(false);
  };

  const calculation = useMemo(() => {
    const plantSize = typeof solarPlantSize === "number" ? solarPlantSize : 0;
    const invSize = typeof inverterSize === "number" ? inverterSize : 0;
    const laQty = typeof leadAcidQty === "number" ? leadAcidQty : 0;
    const laAh = leadAcidAh ? parseInt(leadAcidAh) : 0;
    const liKw = typeof lithiumKw === "number" ? lithiumKw : 0;

    const solarPanelCost = plantSize * RATES.solarPanel;
    const inverterCost = invSize * RATES.inverter[inverterType];
    let batteryCost = 0;
    if (batteryType === "leadAcid") {
      const perUnitRate = RATES.battery.leadAcid[laAh] || 0;
      batteryCost = laQty * perUnitRate;
    } else if (batteryType === "lithium") {
      batteryCost = liKw * RATES.battery.lithium;
    }
    const installationCost = plantSize * RATES.installation;
    const totalCost = solarPanelCost + inverterCost + batteryCost + installationCost;

    const annualInterestRate = loanType === "govt" ? 0.08 : 0.16;
    const getEMI = (principal: number, months: number) => {
      if (principal <= 0 || months <= 0) return 0;
      const r = annualInterestRate / 12;
      return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
    };

    const currentEMI = getEMI(totalCost, parseInt(tenure));
    const totalAh = batteryType === "leadAcid" ? laQty * laAh : 0;

    return {
      solarPanelCost,
      inverterCost,
      batteryCost,
      installationCost,
      totalCost,
      currentEMI,
      getEMI,
      annualInterestRate,
      totalAh,
    };
  }, [solarPlantSize, inverterType, inverterSize, batteryType, leadAcidQty, leadAcidAh, lithiumKw, loanType, tenure]);

  const validate = () => {
    if (!customerName.trim()) {
      toast({ title: "Name Required", description: "Please enter customer name.", variant: "destructive" });
      return false;
    }
    if (!mobileNo || mobileNo.length < 10) {
      toast({ title: "Mobile Required", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return false;
    }
    if (!solarPlantSize || solarPlantSize <= 0) {
      toast({ title: "Plant Size Required", description: "Please enter solar plant size in kW.", variant: "destructive" });
      return false;
    }
    if (!inverterSize || inverterSize <= 0) {
      toast({ title: "Inverter Size Required", description: "Please enter inverter size in kW.", variant: "destructive" });
      return false;
    }
    if (batteryType === "leadAcid" && (!leadAcidQty || leadAcidQty <= 0)) {
      toast({ title: "Battery Quantity Required", description: "Please enter lead acid battery quantity.", variant: "destructive" });
      return false;
    }
    if (batteryType === "leadAcid" && !leadAcidAh) {
      toast({ title: "Battery AH Required", description: "Please select battery AH rating.", variant: "destructive" });
      return false;
    }
    if (batteryType === "lithium" && (!lithiumKw || lithiumKw <= 0)) {
      toast({ title: "Battery kW Required", description: "Please enter lithium battery kW.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCalculate = () => {
    if (validate()) {
      setShowResult(true);
    }
  };

  const handleNumberInput = (
    value: string,
    setter: (val: number | "") => void
  ) => {
    if (value === "") {
      setter("");
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setter(num);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const magenta: [number, number, number] = [233, 30, 140];
    const blue: [number, number, number] = [0, 180, 216];
    const lime: [number, number, number] = [168, 224, 99];
    const gray400: [number, number, number] = [156, 163, 175];
    const gray600: [number, number, number] = [75, 85, 99];
    const gray800: [number, number, number] = [31, 41, 59];
    const indigo: [number, number, number] = [79, 70, 229];
    const limeGreen: [number, number, number] = [163, 230, 53];
    const pageW = 210;
    const pageH = 297;
    let pageNum = 1;
    const totalPages = 6;

    const addLogo = (x: number, y: number, size: number = 16) => {
      try {
        doc.addImage(kwikMLogo, "JPEG", x, y, size, size);
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.setFontSize(size > 20 ? 25 : 14);
        doc.setFont("helvetica", "bold");
        doc.text("KwikM Solar", x + size + 3, y + size * 0.7);
      } catch {
        doc.setTextColor(magenta[0], magenta[1], magenta[2]);
        doc.setFontSize(17);
        doc.setFont("helvetica", "bold");
        doc.text("KwikM Solar", x, y + 8);
      }
    };

    const addPageFooter = (label: string) => {
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, 289);
      doc.text(`${pageNum}/${totalPages}`, 190, 289, { align: "right" });
      pageNum++;
    };

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const inverterLabel =
      inverterType === "hybrid" ? "Hybrid" : inverterType === "ongrid" ? "Ongrid" : "Offgrid";

    const plantSize = typeof solarPlantSize === "number" ? solarPlantSize : 0;
    const annualGeneration = plantSize * 1500;
    const electricityRate = 8;
    const annualSavings = annualGeneration * electricityRate;
    const lifetimeSavings = annualSavings * 25;
    const paybackYears = calculation.totalCost > 0 ? Math.ceil(calculation.totalCost / annualSavings) : 0;
    const co2Mitigated = Math.round(annualGeneration * 0.82);
    const treesPlanted = Math.round(co2Mitigated / 22);
    const distanceKms = Math.round(co2Mitigated * 4);
    const roi = calculation.totalCost > 0 ? Math.round((annualSavings / calculation.totalCost) * 100) : 0;

    // ========== PAGE 1: COVER PAGE ==========
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, pageW, 5, "F");

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
      doc.roundedRect(20, 62, 170, 85, 3, 3, "F");
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(14);
      doc.text("Solar Rooftop Installation", 105, 108, { align: "center" });
    }

    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.roundedRect(30, 155, 150, 40, 4, 4, "F");

    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("SOLAR ROOFTOP", 105, 168, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("System Proposal", 105, 183, { align: "center" });

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(85, 190, 40, 1.5, "F");

    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(customerName, 105, 212, { align: "center" });

    doc.setTextColor(gray600[0], gray600[1], gray600[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(`Mobile: ${mobileNo}`, 105, 223, { align: "center" });

    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(40, 229, 170, 229);

    const coverItems = [
      { label: "Requirements", value: "Commercial Solar" },
      { label: "Date", value: currentDate },
      { label: "Plant Capacity", value: `${solarPlantSize} kW` },
      { label: "Inverter", value: `${inverterLabel} - ${inverterSize} kW` },
      { label: "System Type", value: systemMode === "hybrid" ? "Hybrid with Battery" : "Ongrid" },
    ];

    if (needsBattery) {
      if (batteryType === "leadAcid") {
        coverItems.push({ label: "Battery", value: `${leadAcidQty} x ${leadAcidAh} AH Lead Acid` });
      } else {
        coverItems.push({ label: "Battery", value: `${lithiumKw} kW Lithium Ion` });
      }
    }

    coverItems.forEach((item, i) => {
      const y = 238 + i * 12;
      doc.setTextColor(gray400[0], gray400[1], gray400[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.label}`, 72, y, { align: "right" });
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(item.value, 78, y);
    });

    addPageFooter("KwikM Solar");

    // ========== PAGE 2: QUOTATION & EMI ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, pageW, 4, "F");

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
          `${customerName}\nMobile: ${mobileNo}`,
        ],
      ],
      styles: { fontSize: 10, cellPadding: 4, lineColor: [230, 230, 230], lineWidth: 0.3 },
      headStyles: { fillColor: [magenta[0], magenta[1], magenta[2]], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 85 }, 1: { cellWidth: 85 } },
      margin: { left: 20, right: 20 },
    });

    const fromEndY = (doc as any).lastAutoTable?.finalY || 90;

    autoTable(doc, {
      startY: fromEndY + 3,
      head: [["Date", "Plant Capacity", "System Type"]],
      body: [[currentDate, `${solarPlantSize} kW`, systemMode === "hybrid" ? "Hybrid" : "Ongrid"]],
      styles: { fontSize: 10, cellPadding: 4, lineColor: [230, 230, 230], lineWidth: 0.3 },
      headStyles: { fillColor: [248, 250, 252], textColor: [75, 85, 99], fontStyle: "bold" },
      bodyStyles: { fontStyle: "bold" },
      margin: { left: 20, right: 20 },
    });

    const dateEndY = (doc as any).lastAutoTable?.finalY || 115;

    const batteryDesc = needsBattery
      ? batteryType === "leadAcid"
        ? `\n- Battery: ${leadAcidQty} Nos x ${leadAcidAh} AH Lead Acid`
        : `\n- Battery: ${lithiumKw} kW Lithium Ion`
      : "";

    const systemDesc = `${solarPlantSize} kW ${inverterLabel} Solar System\n- High Efficiency Solar Panels\n- ${inverterLabel} Inverter (${inverterSize} kW)\n- DC/AC Protection Devices\n- Heavy Insulated DC/AC Copper Cable\n- Maintenance Free Earthing${batteryDesc}\n- Installation & Commissioning\n- 5 Years Free Maintenance`;

    autoTable(doc, {
      startY: dateEndY + 3,
      head: [["", "Description", "Amount"]],
      body: [
        ["1", systemDesc, `Rs ${calculation.totalCost.toLocaleString()}`],
      ],
      foot: [["", "TOTAL PROJECT COST", `Rs ${calculation.totalCost.toLocaleString()}`]],
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
    doc.roundedRect(20, returnsY, rBoxW, 24, 3, 3, "F");
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("ANNUAL SAVINGS", 46, returnsY + 8, { align: "center" });
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${annualSavings.toLocaleString()}`, 46, returnsY + 18, { align: "center" });

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(79, returnsY, rBoxW, 24, 3, 3, "F");
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("25-YEAR SAVINGS", 105, returnsY + 8, { align: "center" });
    doc.setTextColor(lime[0], lime[1], lime[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs ${lifetimeSavings.toLocaleString()}`, 105, returnsY + 18, { align: "center" });

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(138, returnsY, rBoxW, 24, 3, 3, "F");
    doc.setTextColor(gray400[0], gray400[1], gray400[2]);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("PAYBACK PERIOD", 164, returnsY + 8, { align: "center" });
    doc.setTextColor(magenta[0], magenta[1], magenta[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${paybackYears} Years`, 164, returnsY + 18, { align: "center" });

    const emiY = returnsY + 30;

    const emi36 = calculation.getEMI(calculation.totalCost, 36);
    const emi60 = calculation.getEMI(calculation.totalCost, 60);
    const emi84 = calculation.getEMI(calculation.totalCost, 84);

    autoTable(doc, {
      startY: emiY,
      head: [["Tenure", `EMI (${loanType === "govt" ? "8% Govt Bank" : "16% NBFC"})`]],
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
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(0, 0, pageW, 4, "F");

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
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFillColor(indigo[0], indigo[1], indigo[2]);
    doc.rect(0, 0, pageW, 4, "F");

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
    const pdfMonthlyInvestment = annualSavings / 12;
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
      headStyles: { fillColor: [indigo[0], indigo[1], indigo[2]], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7 },
      alternateRowStyles: { fillColor: [238, 242, 255] },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        1: { halign: "right", cellWidth: 32 },
        2: { halign: "right", cellWidth: 36 },
        3: { halign: "right", cellWidth: 32 },
        4: { halign: "right", cellWidth: 36 }
      },
      margin: { left: 20, right: 20 }
    });

    const growthFinalY = (doc as any).lastAutoTable?.finalY || 240;

    doc.setFillColor(limeGreen[0], limeGreen[1], limeGreen[2]);
    doc.roundedRect(20, growthFinalY + 8, 170, 28, 3, 3, "F");
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Total Value After 25 Years:", 28, growthFinalY + 22);
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(`Rs ${growthData[24].futureValue.toLocaleString()}`, 165, growthFinalY + 23, { align: "right" });

    const numberToWordsPdf = (num: number): string => {
      const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
      const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
      if (num === 0) return "Zero";
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
      if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWordsPdf(num % 100) : "");
      if (num < 100000) return numberToWordsPdf(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWordsPdf(num % 1000) : "");
      if (num < 10000000) return numberToWordsPdf(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWordsPdf(num % 100000) : "");
      return numberToWordsPdf(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWordsPdf(num % 10000000) : "");
    };
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.text(`(${numberToWordsPdf(growthData[24].futureValue)} Rupees Only)`, 165, growthFinalY + 33, { align: "right" });

    addPageFooter("KwikM Solar");

    // ========== PAGE 5: ENVIRONMENTAL IMPACT ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.rect(0, 0, pageW, 4, "F");

    addLogo(148, 8, 16);

    doc.setTextColor(gray800[0], gray800[1], gray800[2]);
    doc.setFontSize(23);
    doc.setFont("helvetica", "bold");
    doc.text("Environmental Impact", 20, 32);

    doc.setDrawColor(lime[0], lime[1], lime[2]);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 90, 38);

    const envStats = [
      { label: "CO2 Mitigated (Annual)", value: `${co2Mitigated.toLocaleString()} Kg`, color: blue },
      { label: "Trees Planted Equivalent", value: `${treesPlanted.toLocaleString()} Trees`, color: lime },
      { label: "Distance Equivalent", value: `${distanceKms.toLocaleString()} Kms`, color: magenta }
    ];

    envStats.forEach((stat, i) => {
      const y = 52 + i * 50;

      doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      doc.roundedRect(20, y, 4, 40, 2, 2, "F");

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
    doc.roundedRect(20, 210, 170, 35, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Return on Investment", 28, 230);
    doc.setFontSize(25);
    doc.text(`${roi}% p.a.`, 165, 230, { align: "right" });

    addPageFooter("KwikM Solar");

    // ========== PAGE 6: TERMS & CONTACT + BRAND LOGOS ==========
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFillColor(magenta[0], magenta[1], magenta[2]);
    doc.rect(0, 0, pageW, 4, "F");

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
      "Net-metering approvals are subject to DISCOM feasibility and local regulations.",
      "Final project cost may vary based on site-specific structural requirements.",
      "System includes a comprehensive 5-year free maintenance package.",
      "All electrical work follows national safety standards and regulations.",
      "Payment terms: Advance booking amount on confirmation, balance before material delivery.",
      "Any cable going more than 30 meters will be charged extra at actual cost.",
      "Structure cost for elevated/special mounting is under customer scope at actual.",
    ];

    terms.forEach((term, i) => {
      const y = 52 + i * 17;
      doc.setTextColor(gray800[0], gray800[1], gray800[2]);
      doc.setFontSize(11);
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

    brandLogos.forEach((brand, i) => {
      const x = startX + i * (logoW + 6);
      const bY = brandY + 8;
      try {
        doc.addImage(brand.src, "PNG", x, bY, logoW, logoH);
      } catch {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, bY, logoW, logoH, 2, 2, "F");
        doc.setTextColor(gray600[0], gray600[1], gray600[2]);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(brand.name, x + logoW / 2, bY + logoH / 2 + 2, { align: "center" });
      }
    });

    doc.setFillColor(gray800[0], gray800[1], gray800[2]);
    doc.rect(0, 230, pageW, 67, "F");

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
    doc.circle(95, 299, 1.5, "F");
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.circle(105, 299, 1.5, "F");
    doc.setFillColor(lime[0], lime[1], lime[2]);
    doc.circle(115, 299, 1.5, "F");

    doc.save(`KwikM_Solar_Quote_${customerName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-28 pb-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link href="/subsidy-calculator">
              <Button variant="ghost" className="text-slate-500 hover:text-primary gap-2" data-testid="link-back-subsidy">
                <ArrowLeft className="h-4 w-4" />
                Back to Subsidy Calculator
              </Button>
            </Link>
          </div>

          <header className="text-center mb-12 relative py-10 px-6 rounded-[2rem] overflow-hidden ring-4 ring-secondary ring-offset-4 ring-offset-slate-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-6 py-2 rounded-full bg-secondary/20 text-secondary font-bold text-sm mb-4 border border-secondary/30"
              >
                CUSTOMIZED SOLAR CALCULATOR
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3 text-white leading-tight">
                Commercial Solar <span className="text-secondary">Quote Builder</span>
              </h1>
              <p className="text-slate-400 text-base max-w-2xl mx-auto">
                Build your custom solar system quotation with exact component pricing
              </p>
            </div>
          </header>

          <div className="mb-8">
            <Label className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 block">System Type</Label>
            <Tabs value={systemMode} onValueChange={handleSystemModeChange} className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-lg p-1 bg-slate-100 rounded-xl" data-testid="tabs-system-mode">
                <TabsTrigger value="ongrid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold" data-testid="tab-ongrid">
                  Ongrid
                </TabsTrigger>
                <TabsTrigger value="hybrid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold" data-testid="tab-hybrid">
                  Hybrid with Battery
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              {systemMode === "ongrid"
                ? "Grid-connected system - No battery backup, lower cost"
                : "Hybrid system with battery backup for power cuts"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer Name</Label>
                      <Input
                        placeholder="Enter name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="h-11 rounded-xl"
                        data-testid="input-custom-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile No</Label>
                      <Input
                        placeholder="10-digit number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="h-11 rounded-xl"
                        maxLength={10}
                        data-testid="input-custom-mobile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      Solar Plant Size (kW)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter plant size in kW"
                      value={solarPlantSize}
                      onChange={(e) => handleNumberInput(e.target.value, setSolarPlantSize)}
                      className="h-11 rounded-xl"
                      min={0}
                      data-testid="input-plant-size"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        Inverter Type
                      </Label>
                      <Select
                        value={inverterType}
                        onValueChange={(val) => {
                          setInverterType(val as InverterType);
                          setShowResult(false);
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-xl" data-testid="select-inverter-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="ongrid">Ongrid</SelectItem>
                          <SelectItem value="offgrid">Offgrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Inverter Size (kW)</Label>
                      <Input
                        type="number"
                        placeholder="Enter kW"
                        value={inverterSize}
                        onChange={(e) => handleNumberInput(e.target.value, setInverterSize)}
                        className="h-11 rounded-xl"
                        min={0}
                        data-testid="input-inverter-size"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-green-600" />
                      <Label className="text-xs font-black text-green-700 uppercase tracking-widest">Battery Option</Label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Battery Type</Label>
                      <Select
                        value={batteryType}
                        onValueChange={(val) => {
                          setBatteryType(val as BatteryType | "none");
                          setLeadAcidQty("");
                          setLeadAcidAh("");
                          setLithiumKw("");
                          setShowResult(false);
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-white" data-testid="select-battery-type">
                          <SelectValue placeholder="Select battery type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Battery</SelectItem>
                          <SelectItem value="leadAcid">Lead Acid Battery</SelectItem>
                          <SelectItem value="lithium">Lithium Ion Battery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {batteryType === "leadAcid" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Quantity (Nos)</Label>
                                <Input
                                  type="number"
                                  placeholder="No. of batteries"
                                  value={leadAcidQty}
                                  onChange={(e) => handleNumberInput(e.target.value, setLeadAcidQty)}
                                  className="h-11 rounded-xl bg-white"
                                  min={0}
                                  data-testid="input-lead-acid-qty"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Battery AH</Label>
                                <Select
                                  value={leadAcidAh}
                                  onValueChange={(val) => {
                                    setLeadAcidAh(val);
                                    setShowResult(false);
                                  }}
                                >
                                  <SelectTrigger className="h-11 rounded-xl bg-white" data-testid="select-lead-acid-ah">
                                    <SelectValue placeholder="Select AH" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="100">100 AH</SelectItem>
                                    <SelectItem value="150">150 AH</SelectItem>
                                    <SelectItem value="200">200 AH</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {typeof leadAcidQty === "number" && leadAcidAh && leadAcidQty > 0 && (
                              <p className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg">
                                Total Battery Backup: {leadAcidQty} Nos x {leadAcidAh} AH = {leadAcidQty * parseInt(leadAcidAh)} AH
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                      {batteryType === "lithium" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500">Lithium Ion Battery (kW)</Label>
                            <Input
                              type="number"
                              placeholder="Enter kW"
                              value={lithiumKw}
                              onChange={(e) => handleNumberInput(e.target.value, setLithiumKw)}
                              className="h-11 rounded-xl bg-white"
                              min={0}
                              data-testid="input-lithium-kw"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={handleCalculate}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-base shadow-lg"
                    data-testid="button-calculate"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Total Cost
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden" data-testid="card-result">
                      <div className="h-2 bg-gradient-to-r from-secondary to-primary" />
                      <CardContent className="p-8 space-y-6">
                        <div className="text-center pb-4 border-b border-slate-100">
                          <h3 className="text-xl font-black text-slate-800" data-testid="text-result-title">
                            Quotation for {customerName}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {typeof solarPlantSize === "number" ? solarPlantSize : 0} kW Solar Plant | {inverterType === "hybrid" ? "Hybrid" : inverterType === "ongrid" ? "Ongrid" : "Offgrid"} Inverter ({typeof inverterSize === "number" ? inverterSize : 0} kW)
                          </p>
                          {needsBattery && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                              {batteryType === "leadAcid"
                                ? `${leadAcidQty} Nos x ${leadAcidAh} AH = ${calculation.totalAh} AH (Lead Acid)`
                                : `${lithiumKw} kW Lithium Ion Battery`}
                            </p>
                          )}
                        </div>

                        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full & Final Plant Cost</p>
                          <p className="text-4xl font-black text-white flex items-center justify-center gap-1" data-testid="text-total-cost">
                            <IndianRupee className="h-8 w-8" />
                            {calculation.totalCost.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-slate-500 mt-3">Inclusive of Solar Panels, Inverter, {needsBattery ? "Battery, " : ""}Installation & Commissioning</p>
                        </div>

                        <Button
                          onClick={downloadPDF}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-bold text-base shadow-lg"
                          data-testid="button-download-pdf"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download as PDF
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                      <CardHeader className="p-6 pb-0">
                        <div className="flex items-center gap-3">
                          <Landmark className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg font-black">Finance Options (EMI)</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <Tabs value={loanType} onValueChange={setLoanType} className="w-full sm:w-auto">
                            <TabsList className="bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                              <TabsTrigger value="govt" className="px-4 text-xs font-bold" data-testid="tab-govt-bank">Govt Bank (8%)</TabsTrigger>
                              <TabsTrigger value="nbfc" className="px-4 text-xs font-bold" data-testid="tab-nbfc">NBFC (16%)</TabsTrigger>
                            </TabsList>
                          </Tabs>
                          <Tabs value={tenure} onValueChange={setTenure} className="w-full sm:w-auto">
                            <TabsList className="bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                              {["36", "60", "84"].map((t) => (
                                <TabsTrigger key={t} value={t} className="px-4" data-testid={`tab-tenure-${t}`}>{t}M</TabsTrigger>
                              ))}
                            </TabsList>
                          </Tabs>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Monthly EMI ({loanType === "govt" ? "8%" : "16%"} p.a. | {tenure} Months)</p>
                          <p className="text-3xl font-black text-slate-900" data-testid="text-emi-amount">{formatCurrency(calculation.currentEMI)}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase">EMI Schedule ({loanType === "govt" ? "8%" : "16%"} p.a.)</h4>
                          {["36", "60", "84"].map((t) => {
                            const emi = calculation.getEMI(calculation.totalCost, parseInt(t));
                            return (
                              <div key={t} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${tenure === t ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100"}`}>
                                <span className="text-sm font-bold">{t} Months</span>
                                <span className={`font-black ${tenure === t ? "text-primary" : "text-slate-600"}`}>{formatCurrency(emi)}/mo</span>
                              </div>
                            );
                          })}
                        </div>

                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          * EMI calculated on total project cost. Actual EMI may vary based on bank terms, processing fees & applicant profile.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showResult && (
                <Card className="border-none shadow-lg bg-white rounded-3xl overflow-hidden">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                      <Calculator className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">Enter Details & Calculate</h3>
                    <p className="text-sm text-slate-400">
                      Fill in the form and click "Calculate" to see your customized quotation
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