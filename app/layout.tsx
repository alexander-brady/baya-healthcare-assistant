import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import Link from "next/link"

import { House, History, Hospital, Pill, User, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Baya Healthcare",
  description: "A healthcare assistant chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menu_items: [React.ElementType, string, string][] = [
    [House, 'Home', '/'],
    [History, 'Chat History', '/#'],
    [Hospital, 'Appointments', '/#'],
    [Pill, 'Medications', '/#'],
  ];
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className='sticky top-0 flex pt-4 w-full z-50 pl-20 pr-14'>
            <div className="flex items-end text-l text-muted-foreground font-thin"><b className="font-semibold text-xl text-green-400 mr-2">baya.ai </b> Patient support, reinvented</div>
            <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href='/settings'
                      className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Settings className="h-6 w-6" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Settings</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href='/profile'
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <User className="h-6 w-6" />
                      <span className="sr-only">Profile</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <TooltipProvider>
                {menu_items.map(([Icon, label, url], index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Link
                        href={url}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </aside>
          <main className="flex items-center ml-14 mr-14 flex-1 flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
