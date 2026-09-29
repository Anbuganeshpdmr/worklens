import React, { useState } from "react";
import { flattenEntry } from "../components/entries/entryMapper";
import EntryDashboardList from "../components/entries/EntryDashboardList";
import EntryHeaderComponent from "../components/entries/EntryHeaderComponent";

export default function EntryDashboard() {
  const [entries, setEntries] = useState([]);

  return (
    <div className="act-page">
      <main className="act-page__main">
        <header className="act-page__header">
          <h1 className="act-page__title">Entry Dashboard</h1>
          <p className="act-page__subtitle">Welcome to the Entry Dashboard.</p>
        </header>

        <EntryHeaderComponent onResults={setEntries} />

        <EntryDashboardList entries={entries} />
      </main>
    </div>
  );
}
