import { Switch, Route, useLocation } from "wouter";
import { useUser } from "./hooks/use-user";
import { Loader2 } from "lucide-react";
import AuthPage from "./pages/AuthPage";
import MenuPage from "./pages/MenuPage";
import DashboardPage from "./pages/DashboardPage";
import ExaminationPage from "./pages/ExaminationPage";
import EditExaminationPage from "./pages/EditExaminationPage";
import InvoicePage from "./pages/InvoicePage";
import MasterDataPage from "./pages/MasterDataPage";
import Navigation from "./components/Navigation";

function App() {
  const { user, isLoading } = useUser();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const showNavigation = location !== "/";

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? "container mx-auto py-6 px-4" : ""}>
        <Switch>
          <Route path="/" component={MenuPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/examinations" component={ExaminationPage} />
          <Route path="/examinations/edit/:id" component={EditExaminationPage} />
          <Route path="/invoices" component={InvoicePage} />
          <Route path="/master-data" component={MasterDataPage} />
          <Route>404 - Not Found</Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
