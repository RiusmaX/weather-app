# 🚀 Guide d'Installation Rapide - MétéoIA

## ⚡ Installation en 3 étapes

### 1. 🔑 Obtenir une clé API OpenWeatherMap (GRATUIT)

1. Rendez-vous sur [OpenWeatherMap](https://openweathermap.org/api)
2. Cliquez sur "Sign Up" (Inscription gratuite)
3. Créez votre compte
4. Dans votre tableau de bord, copiez votre clé API
5. **Important** : La clé peut prendre jusqu'à 2 heures pour être activée

### 2. 🔧 Configuration

1. Ouvrez le fichier `.env.local` 
2. Remplacez `your_api_key_here` par votre vraie clé API :

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=votre_vraie_cle_api_ici
```

### 3. 🏁 Lancement

```bash
npm run dev
```

## 🌟 C'est parti !

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 🎯 Test rapide
1. Autorisez la géolocalisation quand votre navigateur le demande
2. Ou recherchez une ville (ex: "Paris", "London", "Tokyo")
3. Explorez les prévisions et la carte interactive !

---

## 🐛 Problèmes courants

### ❌ "Clé API invalide"
- Vérifiez que votre clé API est correcte dans `.env.local`
- Attendez jusqu'à 2h que OpenWeatherMap active votre clé

### ❌ "Géolocalisation refusée"
- Utilisez la recherche de ville à la place
- Ou autorisez la géolocalisation dans les paramètres du navigateur

### ❌ Erreur de compilation TypeScript
```bash
npm install
npm run dev
```

---

**🎉 Votre application météo moderne est prête !** 