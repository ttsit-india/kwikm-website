import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import JoinPage from "@/pages/Join";
import SubsidyCalculator from "@/pages/SubsidyCalculator";
import CareerPage from "@/pages/Career";
import WhyKwikm from "@/pages/WhyKwikm";
import BookConsultation from "@/pages/BookConsultation";
import ChatWidget from "@/components/ChatWidget";
import FloatingContacts from "@/components/FloatingContacts";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/join" component={JoinPage} />
      <Route path="/subsidy-calculator" component={SubsidyCalculator} />
      <Route path="/career" component={CareerPage} />
      <Route path="/why-kwikm" component={WhyKwikm} />
      <Route path="/book-consultation" component={BookConsultation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Router />
        <FloatingContacts />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
