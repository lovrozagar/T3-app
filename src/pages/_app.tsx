import { type AppType } from "next/app"

import { api } from "@/utils/api"

import "@/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
