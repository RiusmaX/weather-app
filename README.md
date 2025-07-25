# 🌤️ MétéoIA - Application Météo Moderne

> **Application météo intelligente** développée avec Next.js 15, React 18 et TypeScript, suivant les principes de Clean Architecture.

![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38bdf8)
![Production Ready](https://img.shields.io/badge/Production-Ready-green)

## ✨ Fonctionnalités

### 🌍 **Météo en Temps Réel**
- 📍 **Géolocalisation automatique** au démarrage
- 🔍 **Recherche de villes** avec autocomplétion
- 🌡️ **Météo actuelle** détaillée (température, humidité, vent, pression)
- 📅 **Prévisions 5 jours** avec détails complets

### 🗺️ **Carte Météo Interactive**
- 🌧️ **Couches météo** : Précipitations, Température, Vent, Nuages
- 🎛️ **Filtres avancés** avec contrôles d'opacité
- 🔄 **Superposition multiple** de couches
- 📱 **Interface intuitive** avec animations

### 🎨 **Interface Moderne**
- 📱 **Design responsive** (Mobile, Tablet, Desktop)
- 🌙 **Mode sombre** supporté
- ⚡ **Animations fluides** et transitions
- 📳 **PWA Ready** - Installable sur mobile
- ♿ **Accessibilité** optimisée

## 🚀 Démarrage Rapide

### 1. 📦 Installation

```bash
git clone https://github.com/votre-username/weather-app.git
cd weather-app
npm install
```

### 2. 🔑 Configuration API

1. Obtenez votre clé API gratuite sur [OpenWeatherMap](https://openweathermap.org/api)
2. Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=votre_cle_api_ici
```

### 3. 🎯 Lancement

```bash
# Développement
npm run dev

# Production
npm run build && npm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Architecture

### 📁 Structure du Projet

```
weather-app/
├── 📱 src/app/                  # Pages Next.js (App Router)
├── 🎯 src/domain/               # Logique métier (Entities, Use Cases)
├── 🔌 src/infrastructure/       # Services externes (APIs, Config)
├── 🎨 src/presentation/         # Interface utilisateur (Components, Hooks)
├── 📦 src/components/ui/        # Composants UI réutilisables (ShadCN)
└── 🌐 public/                  # Assets statiques
```

### 🧩 Principes Architecturaux

- **🏛️ Clean Architecture** : Séparation claire des responsabilités
- **📐 SOLID** : Principes de conception orientée objet
- **🔄 Hooks Pattern** : Logique d'état réutilisable avec React Hooks
- **📱 Mobile-First** : Design adaptatif et responsive
- **⚡ Performance** : Optimisations Next.js et lazy loading

## 🛠️ Technologies

### 🎯 Frontend
- **Next.js 15** - Framework React full-stack
- **React 18** - Bibliothèque d'interface utilisateur
- **TypeScript** - Typage statique JavaScript
- **TailwindCSS** - Framework CSS utilitaire
- **ShadCN/UI** - Composants d'interface modernes

### 🗺️ Cartographie
- **Leaflet** - Bibliothèque de cartes interactives
- **OpenWeatherMap** - API météo et tuiles de carte

### 📊 APIs & Services
- **OpenWeatherMap API** - Données météo en temps réel
- **Geolocation API** - Localisation automatique
- **Next.js Image** - Optimisation d'images

## 🚀 Déploiement

### 📋 Prérequis Production

- ✅ Node.js 18+
- ✅ Clé API OpenWeatherMap active
- ✅ HTTPS (requis pour géolocalisation)

### 🌐 Options de Déploiement

#### 🥇 **Vercel (Recommandé)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### 🐳 **Docker**
```bash
docker build -t meteo-ia .
docker run -p 3000:3000 --env-file .env.local meteo-ia
```

#### ☁️ **Autres Plateformes**
- **Netlify** : Build automatique Next.js
- **Railway** : Déploiement Git simple
- **VPS** : Avec PM2 ou Docker

> 📖 **Guide complet** : Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📊 Performance

### ⚡ Métriques

- **Bundle Size** : ~154kB First Load
- **Lighthouse Score** : 90+ (Performance, Accessibility, SEO)
- **Core Web Vitals** : Optimisés
- **Images** : Optimisation automatique Next.js

### 🔧 Optimisations

- ✅ **Code Splitting** automatique
- ✅ **Lazy Loading** des composants
- ✅ **Image Optimization** avec Next.js
- ✅ **Tree Shaking** pour réduire la taille
- ✅ **Service Worker** pour PWA

## 🛡️ Sécurité

### 🔒 Headers de Sécurité

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: geolocation=(self)`

### 🔐 Bonnes Pratiques

- 🔑 **Variables d'environnement** sécurisées
- 🌐 **HTTPS obligatoire** en production
- 👤 **Utilisateur non-root** dans Docker
- 🚫 **Pas de données sensibles** côté client

## 🧪 Tests et Qualité

### 🔍 Outils Intégrés

- **ESLint** : Analyse statique du code
- **TypeScript** : Vérification de types
- **Prettier** : Formatage automatique
- **Build Verification** : Tests de compilation

### 📈 Monitoring

- 📊 **Vercel Analytics** (recommandé)
- 🔍 **Google PageSpeed Insights**
- 📱 **Lighthouse CI**

## 🤝 Contribution

1. **Fork** le projet
2. **Créez** votre branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- 🌐 **OpenWeatherMap** pour l'API météo
- 🗺️ **OpenStreetMap** pour les données cartographiques
- 🎨 **ShadCN** pour les composants UI
- ⚡ **Vercel** pour la plateforme de déploiement

---

<div align="center">

**🎯 Développé avec ❤️ en suivant les meilleures pratiques du développement moderne**

[🌐 Demo Live](https://your-app-url.vercel.app) • [📖 Documentation](./DEPLOYMENT.md) • [🐛 Signaler un Bug](https://github.com/your-username/weather-app/issues)

</div>
