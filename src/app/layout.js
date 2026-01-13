import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#120611] text-white antialiased`}>
        <AppWalletProvider>
          {children}
          <ToastContainer 
            position="bottom-right"
            theme="dark"
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AppWalletProvider>
      </body>
    </html>
  );
}
