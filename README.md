# TP formulaire adresse

Le but de ce TP est de coder un formulaire de recherche d'adresse.
On s'appuiera sur :
* l'API `api-adresse.data.gouv.fr` pour la recherche proprement dite
* La bibliothèque `leaflet` pour l'affichage de marqueurs sur une carte
* La bibliothèque `Angular Material` pour la définition des éléments de formulaire
* Les observables `RxJS` pour orchestrer l'ensemble

On vous fourni un squelette de projet Angular, avec les dépendances nécessaires, ainsi que le composant `FormAdressComponent` qui implémente un champs de recherche d'adresse avec auto-complétion.

## A) Complétez le service `AdresseService`

La méthode `search` du service `AdresseService` doit appeler l'API `api-adresse.data.gouv.fr` pour récupérer les adresses correspondant à la recherche de l'utilisateur. Vous vous appuierez sur le service `HttpClient` d'Angular pour effectuer la requête. Notez que ce service est déjà injecté dans le service `AdresseService`.

Le code suivant permet de configurer l'émission d'une requête HTTP GET vers l'API `api-adresse.data.gouv.fr`, notez que cela produit un `Observable<HttpResponse<Object>>` :

```typescript
this._httpClient.get(
    `https://api-adresse.data.gouv.fr/search/`, 
    { observe: 'response', params: { q, limit: 5 } }
)
```

### A.1) Expliquer ce que le code ci-dessus fait. 

Détaillez les données envoyées et le type de réponse attendu.

### A.2) Dérivation d'observable

Vous devez dériver cet observable afin de vérifier que la réponse contient bien un code confirmant le succès de la requête. Soit `r` la réponse, alors :
* Si `r.ok`, il faut vérifier que le corp de la réponse (`r.body`) contient bien un `FeatureCollection<Point, Adress>`. Vous utiliserez pour cela la fonction **`parserFcPtAdresse`** définie au début du fichier `adresse.service.ts`.
* Sinon, il faut lever une erreur à l'aide de la fonction RxJS `throwError`.

**Indication**: Voir l'opérateur `switchMap` de RxJS.

## B) Orchestration dans le composant racine

### B.1) Explications

Expliquez comment est définit l'attribut `selectedAdressState` ? 
Quel est son type ? 
Sa valeur initiale ? 
Comment est-il mis à jour ?

### B.2) Code

Définissez l'observable `_selectedAdressStateObs`, 
dérivez le à partir du sujet `_searchQuery`.

**Indication**: Vous aurez besoin de `switchMap`, `map` et `catchError` de RxJS.
### B.3) Mises à jour

Prenez aussi en compte les mises à jours (observable `updates`) pour mettre à jour les valeurs produites par `_selectedAdressStateObs`.

**Indication**: Vous aurez besoin de `scan` et de `startWith` de RxJS.