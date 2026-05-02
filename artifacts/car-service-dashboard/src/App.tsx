import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider } from "@/lib/i18n";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import Repairs from "@/pages/Repairs";
import Customers from "@/pages/Customers";
import Vehicles from "@/pages/Vehicles";
import Stock from "@/pages/Services";
import Income from "@/pages/Income";
import History from "@/pages/History";
import Technicians from "@/pages/Technicians";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/repairs" component={Repairs} />
        <Route path="/customers" component={Customers} />
        <Route path="/vehicles" component={Vehicles} />
        <Route path="/income" component={Income} />
        <Route path="/stock" component={Stock} />
        <Route path="/history" component={History} />
        <Route path="/technicians" component={Technicians} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <LangProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LangProvider>
  );
}

export default App;
