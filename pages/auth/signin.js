// pages/auth/signin.js

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();

  // Rediriger après une connexion réussie
  const handleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: '/profile' });  // Changer la redirection ici

    if (result?.error) {
      // Gérer l'erreur d'authentification ici si nécessaire
      console.error("Error during authentication", result.error);
    }
  };

  return (
    <div>
      <h1>Connectez-vous</h1>
      <button onClick={handleSignIn}>Se connecter avec Google</button>
    </div>
  );
}
