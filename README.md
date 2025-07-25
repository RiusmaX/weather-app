# MétéoIA - Application Météo Intelligente 🌦️

Une application météo moderne et élégante développée avec **Next.js 14**, **React**, **TypeScript**, **TailwindCSS** et **ShadCN UI**. Cette application suit les principes **SOLID** et une **architecture clean** pour une maintenabilité optimale.

## ✨ Fonctionnalités

- 🌍 **Météo en temps réel** - Données météorologiques actuelles précises
- 📊 **Prévisions 5 jours** - Prévisions détaillées avec températures min/max
- 🔍 **Recherche de villes** - Recherche intelligente avec autocomplétion
- 📍 **Géolocalisation** - Détection automatique de votre position
- 🗺️ **Carte météo interactive** - Visualisation des données sur carte Leaflet
- 📱 **Design responsive** - Interface adaptée à tous les écrans
- 🌙 **Mode sombre** - Support du thème sombre
- ⚡ **Performance optimisée** - Chargement rapide et interface fluide
- 🎨 **UI moderne** - Interface utilisateur élégante avec ShadCN

## 🚀 Installation Rapide

### Prérequis
- **Node.js** >= 18.0.0
- **npm** ou **yarn**

### 🔥 Démarrage Express (2 minutes)

1. **Clé API gratuite** - [Obtenez votre clé sur OpenWeatherMap](https://openweathermap.org/api)

2. **Configuration**
   ```bash
   # Copiez le fichier d'environnement
   cp .env.example .env.local
   
   # Éditez .env.local et ajoutez votre clé API
   NEXT_PUBLIC_OPENWEATHER_API_KEY=votre_cle_api_ici
   ```

3. **Installation et lancement**
   ```bash
   npm install
   npm run dev
   ```

4. **🎉 C'est parti !** → [http://localhost:3000](http://localhost:3000)

> 📖 Guide détaillé disponible dans [SETUP.md](./SETUP.md)

## 🏗️ Architecture

L'application suit une **architecture en couches** inspirée de la **Clean Architecture** :

```
src/
├── domain/              # 🎯 Logique métier
│   ├── entities/        # Entités du domaine
│   ├── repositories/    # Interfaces des repositories
│   └── use-cases/       # Cas d'usage métier
├── infrastructure/      # 🔌 Accès aux données externes
│   ├── config/          # Configuration des APIs
│   └── services/        # Implémentations des services
└── presentation/        # 🎨 Interface utilisateur
    ├── components/      # Composants React
    └── hooks/          # Hooks personnalisés
```

### Principes SOLID appliqués :

- **S** - Single Responsibility : Chaque classe a une responsabilité unique
- **O** - Open/Closed : Extensible sans modification du code existant
- **L** - Liskov Substitution : Les implémentations respectent les contrats
- **I** - Interface Segregation : Interfaces spécifiques et focalisées
- **D** - Dependency Inversion : Dépendance vers les abstractions

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI avec hooks
- **TypeScript** - Typage statique
- **TailwindCSS** - Framework CSS utility-first
- **ShadCN UI** - Composants UI modernes
- **Lucide React** - Icônes modernes

### APIs & Services
- **OpenWeatherMap API** - Données météorologiques
- **Leaflet** - Cartes interactives
- **Geolocation API** - Géolocalisation du navigateur
- **Axios** - Client HTTP
- **Date-fns** - Gestion des dates

## 📱 Captures d'écran

### 🖥️ Desktop
- Interface principale avec météo actuelle
- Prévisions 5 jours détaillées  
- Carte météo interactive avec couches de données

### 📱 Mobile
- Design totalement responsive
- Navigation optimisée tactile
- Recherche adaptée aux mobiles

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de développement

# Production
npm run build        # Build de production
npm run start        # Démarre le serveur de production

# Qualité de code
npm run lint         # Vérification ESLint
```

## 🎯 Utilisation

### Fonctionnalités principales

1. **🌍 Météo automatique**
   - Au premier démarrage, autorisez la géolocalisation
   - La météo de votre position s'affiche automatiquement

2. **🔍 Recherche de villes**
   - Utilisez la barre de recherche en haut
   - Tapez le nom d'une ville (ex: "Paris", "New York")
   - Sélectionnez dans la liste des suggestions

3. **🗺️ Carte interactive**
   - Explorez différentes couches météo
   - Précipitations, température, vent, nuages
   - Zoom et navigation fluide

4. **🔄 Actualisation**
   - Bouton "Actualiser" pour mettre à jour
   - Données mises en cache automatiquement

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Déploiement instantané
vercel --prod
```

### Docker
```bash
# Build de l'image
docker build -t meteo-ia .

# Lancement du conteneur
docker run -p 3000:3000 meteo-ia
```

## 🌟 Fonctionnalités à venir

- 🚨 **Alertes météo** - Notifications pour conditions extrêmes
- 📈 **Graphiques** - Visualisation des tendances météo
- 💾 **Favoris** - Sauvegarde de villes favorites
- 🌐 **PWA** - Application web progressive
- 🔔 **Notifications push** - Alertes en temps réel
- 🎨 **Thèmes personnalisés** - Personnalisation avancée

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [OpenWeatherMap](https://openweathermap.org/) pour les données météo
- [ShadCN](https://ui.shadcn.com/) pour les composants UI
- [Leaflet](https://leafletjs.com/) pour les cartes
- [Lucide](https://lucide.dev/) pour les icônes
- [TailwindCSS](https://tailwindcss.com/) pour le framework CSS

---

**Développé avec ❤️ par l'équipe MétéoIA**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
