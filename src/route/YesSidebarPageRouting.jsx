import Layout from "@components/Layout.jsx";
import HomePage from "@pages/HomePage.jsx";
import DiaryPage from "@pages/DiaryPage.jsx";
import ChallengePage from "@pages/ChallengePage.jsx";
import AccountBookPage from "@pages/AccountBookPage.jsx";
import SubscriptionPage from "@pages/SubscriptionPage.jsx";
import { ROUTES } from "@route/routes.js";
import { Route } from "react-router-dom";

export default function YesSidebarPageRouting() {
  return (
    <>
      <Route
        path={ROUTES.ROOT}
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />

      <Route
        path={ROUTES.DIARY}
        element={
          <Layout>
            <DiaryPage />
          </Layout>
        }
      />

      <Route
        path={ROUTES.CHALLENGE}
        element={
          <Layout>
            <ChallengePage />
          </Layout>
        }
      />

      <Route
        path={ROUTES.ACCOUNT_BOOK}
        element={
          <Layout>
            <AccountBookPage />
          </Layout>
        }
      />

      <Route
        path={ROUTES.SUBSCRIPTION}
        element={
          <Layout>
            <SubscriptionPage />
          </Layout>
        }
      />
    </>
  );
}
