// pages/auth/signin.js
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      <h1>Connectez-vous</h1>
      <button onClick={() => signIn("google")}>Se connecter avec Google</button>
    </div>
  );
}