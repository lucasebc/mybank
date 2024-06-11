import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (!user) redirect("/sign-in");

  console.log("meu ovo esquerdo demonho cu pinto buceta");
  console.log(user);

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={user} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" height={30} width={30} alt="my bank logo"></Image>
          <div>
            <MobileNav user={user}></MobileNav>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
