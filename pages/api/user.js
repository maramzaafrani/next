export default function handler(req, res) {
  // Simuler une base de données utilisateur
  let user = {
    nom: "Doe",
    prenom: "John",
    dateDeNaissance: "1990-01-01",
    adresse: "123 Rue Exemple",
    telephone: "0123456789",
  };

  // Ajout des en-têtes pour éviter la mise en cache
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    // Renvoie les données utilisateur
    res.status(200).json(user);
  } else if (req.method === 'PUT') {
    // Met à jour l'utilisateur avec les nouvelles données
    const updatedUser = req.body; // Les données sont envoyées dans le corps de la requête
    user = { ...user, ...updatedUser };

    // Retourne les nouvelles données
    res.status(200).json(user);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
