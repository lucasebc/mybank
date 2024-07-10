import HeaderComponent from "@/components/HeaderComponent";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceComponent from "@/components/TotalBalanceComponent";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getCurrentScope } from "@sentry/nextjs";
import React from "react";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  const user = await getLoggedInUser();

  if (!user) return <>no user</>;

  const accounts = await getAccounts({ userId: user?.$id });

  if (!accounts) return <>no acc</>;

  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderComponent
            type="greeting"
            title="Welcome"
            user={`${user?.firstName} ${user?.lastName}` || "guest"}
            subtext="Access and manage your accounts"
          />
          <TotalBalanceComponent
            accounts={accounts?.data}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          ></TotalBalanceComponent>
        </header>

        <RecentTransactions
          accounts={accounts?.data}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar user={user} transactions={account?.transactions} banks={accounts?.data.slice(0, 2)}></RightSidebar>
    </section>
  );
};

export default Home;
