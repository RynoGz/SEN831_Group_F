import "./globals.css";
import AppShell from "@/components/app-shell";
export const metadata = {
 title: { default: "CivicConnect", template: "%s | CivicConnect" },
 description: "Community service requests, in one place.",
};
export default function RootLayout({children}) {
 return <html lang="en"><body><AppShell>{children}</AppShell></body></html>;
}
