import ReduxProvider from "@/store/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          height: "100vh", // ✅ FULL VIEWPORT
          overflow: "hidden", // ✅ STOP PAGE SCROLL ❗
        }}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
