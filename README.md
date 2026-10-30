# Repero — socle technique

Application Next.js 15 (App Router) authentifiee via OIDC aupres de l IdP OoStudy.

## Demarrage local

1. Copier .env.example vers .env.local et renseigner les valeurs.
2. npm install
3. npm run dev
4. Ouvrir http://localhost:3000

## Prerequis cote OoStudy

Enregistrer un client OIDC dans l IdP OoStudy :

| Champ | Valeur |
|---|---|
| Client ID | repero |
| Client Secret | (genere, secret) |
| Redirect URI | http://localhost:3000/api/auth/callback |
| Post Logout Redirect URI | http://localhost:3000/ |
| PKCE | requis (S256) |
| Scopes | openid profile email tenant |
| Claim custom | oostudy/tenant_id dans l ID Token (sinon tenant_id) |

## Controles de securite

- Aucun secret OoStudy en clair cote client.
- Cookie repero_session : HttpOnly, Secure (prod), SameSite=Lax.
- Cookie repero_oidc_pending : JWT signe HS256, TTL 10 min.
- Logout en POST uniquement (protection CSRF).
- Aucun import @oostudy/auth (integration exclusivement par OIDC).