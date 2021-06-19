cd src
# API keys can be found here https://addons.mozilla.org/pl/developers/addon/api/key/
web-ext sign --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
cd ..
