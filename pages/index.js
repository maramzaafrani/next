import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <h1>Bienvenue</h1>
        <button onClick={() => signIn()}>Connectez-vous</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Bienvenue, {session.user.name}!</h1>
      <button onClick={() => signOut()}>Déconnexion</button>
    </div>
  );
}