# 🚀 Guide de Déploiement - MétéoIA

Ce guide vous explique comment déployer l'application MétéoIA en production.

## 📋 Prérequis

- ✅ Node.js 18+ installé
- ✅ Clé API OpenWeatherMap active
- ✅ Compte sur une plateforme de déploiement (Vercel, Netlify, etc.)

## 🔧 Configuration de Production

### 1. Variables d'Environnement

Créez un fichier `.env.local` avec :

```env
# OBLIGATOIRE - Votre clé API OpenWeatherMap
NEXT_PUBLIC_OPENWEATHER_API_KEY=votre_vraie_cle_api

# OPTIONNEL - URL de votre application en production
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### 2. Build de Production

```bash
# Installation des dépendances
npm install

# Build optimisé pour la production
npm run build

# Test local du build de production
npm start
```

## 🌐 Options de Déploiement

### Option 1: Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. **Fork le repository** ou importez votre code
2. **Connectez à Vercel** via GitHub/GitLab
3. **Configurez les variables d'environnement** :
   - `NEXT_PUBLIC_OPENWEATHER_API_KEY`
4. **Déployez** - Vercel détecte automatiquement Next.js

### Option 2: Netlify

1. **Build Command** : `npm run build`
2. **Publish Directory** : `.next`
3. **Variables d'environnement** à configurer via l'interface Netlify

### Option 3: Docker

```dockerfile
# Utilisez le Dockerfile fourni
docker build -t meteo-ia .
docker run -p 3000:3000 --env-file .env.local meteo-ia
```

### Option 4: Serveur VPS

```bash
# Sur votre serveur
git clone votre-repository
cd weather-app
npm install
cp .env.example .env.local
# Editez .env.local avec vos vraies valeurs
npm run build
npm start

# Avec PM2 pour la production
npm install -g pm2
pm2 start npm --name "meteo-ia" -- start
```

## 🔒 Sécurité en Production

### Headers de Sécurité Configurés

- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: origin-when-cross-origin`
- ✅ `Permissions-Policy: geolocation=(self)`

### Bonnes Pratiques

- 🔐 **Clé API sécurisée** - Ne jamais commit la vraie clé
- 🌐 **HTTPS obligatoire** - Requis pour la géolocalisation
- 📱 **PWA Ready** - Installable sur mobile
- ⚡ **Images optimisées** - Via Next.js Image

## 📊 Performance

### Métriques Optimisées

- ⚡ **Bundle size** : ~154kB First Load
- 🖼️ **Images** : Optimisation automatique Next.js
- 📱 **Mobile** : Design responsive et PWA
- 🚀 **SEO** : Métadonnées optimisées

### Monitoring Recommandé

- 📈 **Vercel Analytics** (si déployé sur Vercel)
- 🔍 **Google PageSpeed Insights**
- 📊 **Lighthouse CI**

## 🔧 Configuration Avancée

### CDN et Cache

```typescript
// next.config.ts - Headers de cache
{
  source: '/api/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=300' // 5 minutes
    }
  ]
}
```

### Domaine Personnalisé

1. **Configurez DNS** : CNAME vers votre plateforme
2. **SSL automatique** : La plupart des plateformes le gèrent
3. **Redirections** : HTTP → HTTPS automatique

## 🐛 Résolution de Problèmes

### Erreurs Courantes

**❌ "Invalid API Key"**
- Vérifiez que `NEXT_PUBLIC_OPENWEATHER_API_KEY` est définie
- Attendez jusqu'à 2h que OpenWeatherMap active votre clé

**❌ Géolocalisation ne fonctionne pas**
- HTTPS requis en production
- Vérifiez les permissions du navigateur

**❌ Images ne se chargent pas**
- Vérifiez la configuration des domaines dans `next.config.ts`

### Logs et Debug

```bash
# Logs en production
npm run build && npm start 2>&1 | tee app.log

# Debug avec Vercel
vercel logs your-deployment-url
```

## ✅ Checklist de Déploiement

- [ ] ✅ Build réussi localement (`npm run build`)
- [ ] 🔑 Variables d'environnement configurées
- [ ] 🌐 HTTPS activé sur le domaine
- [ ] 📱 PWA installable
- [ ] ⚡ Performance testée (Lighthouse > 90)
- [ ] 🔒 Headers de sécurité vérifiés
- [ ] 📊 Monitoring configuré

## 📞 Support

En cas de problème :
1. Vérifiez les logs de déploiement
2. Testez localement avec `npm run build && npm start`
3. Consultez la documentation de votre plateforme

---

**🎉 Votre application MétéoIA est prête pour la production !** 