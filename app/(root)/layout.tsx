import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = { firstName: "Lucas", lastName: "Emanuel" };

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
