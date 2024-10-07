import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    nom: "",
    prenom: "",
    dateDeNaissance: "",
    adresse: "",
    telephone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur :", error);
        setMessage("Erreur lors du chargement des données utilisateur.");
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!userInfo.nom || !userInfo.prenom || !userInfo.adresse || !userInfo.telephone) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(userInfo.adresse)}`
      );

      if (response.data.features.length > 0) {
        const { coordinates } = response.data.features[0].geometry;
        const [longitude, latitude] = coordinates;

        const distance = calculateDistanceFromParis(latitude, longitude);

        if (distance <= 50) {
          setMessage("L'adresse est valide et située à moins de 50 km de Paris.");
          // Vous pouvez ici enregistrer les nouvelles informations utilisateur
        } else {
          setMessage("L'adresse est située à plus de 50 km de Paris.");
        }
      } else {
        setMessage("Aucune adresse trouvée pour cette entrée.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API :", error);
      setMessage("Erreur lors de la validation de l'adresse.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDistanceFromParis = (lat, lon) => {
    const parisLat = 48.8566;
    const parisLon = 2.3522;
    const R = 6371; // Rayon de la Terre en km

    const dLat = (lat - parisLat) * (Math.PI / 180);
    const dLon = (lon - parisLon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(parisLat * (Math.PI / 180)) *
      Math.cos(lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en kilomètres
  };

  return (
    <div>
      <h1>Modifier le profil</h1>
      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" value={userInfo.nom} onChange={handleChange} />
        <input name="prenom" placeholder="Prénom" value={userInfo.prenom} onChange={handleChange} />
        <input type="date" name="dateDeNaissance" value={userInfo.dateDeNaissance} onChange={handleChange} />
        <input name="adresse" placeholder="Adresse" value={userInfo.adresse} onChange={handleChange} />
        <input name="telephone" placeholder="Téléphone" value={userInfo.telephone} onChange={handleChange} />
        <button type="submit" disabled={loading}>Modifier</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
