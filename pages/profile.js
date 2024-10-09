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
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur :", error);
      }
    };
    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleValidation = () => {
    if (!userInfo.nom || !userInfo.prenom || !userInfo.adresse || !userInfo.telephone) {
      setIsFormValid(false);
      setMessage("Veuillez remplir tous les champs.");
      return false;
    }
    setIsFormValid(true);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return; // Si la validation échoue, on arrête l'exécution.

    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(userInfo.adresse)}&limit=1`
      );

      if (response.data.features && response.data.features.length > 0) {
        const { geometry, properties } = response.data.features[0];

        // Calcul de la distance par rapport à Paris
        const { coordinates } = geometry;
        const [longitude, latitude] = coordinates;
        const distance = calculateDistanceFromParis(latitude, longitude);

        // Construction du GeoJSON selon la spécification
        const geoJsonResponse = {
          type: "FeatureCollection",
          version: "draft",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              properties: {
                label: properties.label,
                score: properties.score,
                housenumber: properties.housenumber,
                street: properties.street,
                locality: properties.locality,
                municipality: properties.municipality,
                postcode: properties.postcode,
                citycode: properties.citycode,
                city: properties.city,
                district: properties.district,
                oldcitycode: properties.oldcitycode,
                oldcity: properties.oldcity,
                context: properties.context,
                importance: properties.importance,
                x: properties.x,
                y: properties.y,
                id: properties.id,
                type: properties.type,
                name: properties.name,
              },
            },
          ],
          attribution: "BAN",
          licence: "ODbL 1.0",
          query: userInfo.adresse,
          limit: 1,
        };

        if (distance <= 50) {
          setMessage("L'adresse est valide et située à moins de 50 km de Paris.");
          console.log("GeoJSON retourné : ", geoJsonResponse);

          // Envoi des nouvelles informations à l'API pour les enregistrer
          const updateResponse = await axios.put("/api/user", userInfo);

          // Mise à jour des données utilisateur après l'édition
          setUserInfo(updateResponse.data);
        } else {
          setMessage("L'adresse est située à plus de 50 km de Paris.");
        }
      } else {
        setMessage("Aucune adresse trouvée pour cette entrée.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête API :", error);
      setMessage("Erreur lors de la validation de l'adresse.");
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
        <input
          name="nom"
          placeholder="Nom"
          value={userInfo.nom}
          onChange={handleChange}
        />
        <input
          name="prenom"
          placeholder="Prénom"
          value={userInfo.prenom}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dateDeNaissance"
          value={userInfo.dateDeNaissance}
          onChange={handleChange}
        />
        <input
          name="adresse"
          placeholder="Adresse"
          value={userInfo.adresse}
          onChange={handleChange}
        />
        <input
          name="telephone"
          placeholder="Téléphone"
          value={userInfo.telephone}
          onChange={handleChange}
        />
        <button type="submit">Modifier</button>
      </form>

      {!isFormValid && <p style={{ color: "red" }}>{message}</p>}
      {isFormValid && message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
