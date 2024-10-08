import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {
  darkTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import '@rainbow-me/rainbowkit/styles.css';
import "./tailwind.css";
import config from "./wagmi.config";

import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script src="https://widgets.coingecko.com/gecko-coin-price-chart-widget.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider initialChain={8453} theme={darkTheme()}>
        <Navbar />
        <Outlet />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
}
