import React from "react";
import DefaultLayout from "./layouts/default";

export default function Admin() {
  return (
    <DefaultLayout>
      <h1>Admin</h1>
      <form method="POST">
        <input type="text" name="deviceIdentifier" />
        <button>Ajouter</button>
      </form>
    </DefaultLayout>
  );
}
