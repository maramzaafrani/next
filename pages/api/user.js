export default function handler(req, res) {
    const user = {
      nom: "Doe",
      prenom: "John",
      dateDeNaissance: "1990-01-01",
      adresse: "123 Rue Exemple",
      telephone: "0123456789",
    };
  
    if (req.method === 'GET') {
      res.status(200).json(user);
    } else if (req.method === 'PUT') {
      const { nom, prenom, adresse, telephone } = req.body;
  
      if (!nom || !prenom || !adresse || !telephone) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" });
      }
  
      console.log("Nouvelles données utilisateur :", req.body);
      res.status(200).json(req.body); 
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  