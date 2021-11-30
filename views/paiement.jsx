import React from "react";
import DefaultLayout from "./layouts/default";

/**
 * @param {Object} props
 * @param {string} props.deviceIdentifier
 */
export default function Paiement({ deviceIdentifier }) {
  return (
    <DefaultLayout>
      <h1>Paiement requis</h1>
      <h3>
        Pour accéder à cet outil, vous devez contribuer aux{" "}
        <em>Paniers de Noël</em>. Pour se faire, veuillez contacter l'un des
        représentants du groupe 503 et lui montrer cette page.
      </h3>
      <p>
        Votre identifiant d'appareil est: <b>{deviceIdentifier}</b>
      </p>
      <h3>À noter</h3>
      <ul>
        <li>
          Vous n'êtes pas autorisé à partager le contenu de cette plateforme.
        </li>
        <li>
          Vous n'êtes pas autorisé à aider à contourner le système de paiement.
        </li>
        <li>
          Nous, les créateurs de cette plateforme, n'avons aucune forme
          d'obligation contractuelle à ce que cette plateforme soit
          perpétuellement et/ou en tout temps en ligne et/ou fonctionnelle.
          Utilisez-la comme référence supplémentaire.
        </li>
        <li>
          Vous êtes autorisé à prendre des captures d'écran de cette plateforme.
        </li>
      </ul>
    </DefaultLayout>
  );
}
