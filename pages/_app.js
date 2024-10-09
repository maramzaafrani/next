// pages/_app.js
import { SessionProvider } from "next-auth/react"; // Ajoute cette ligne
import '../styles/globals.css'; // Assurez-vous que le chemin est correct
export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );}