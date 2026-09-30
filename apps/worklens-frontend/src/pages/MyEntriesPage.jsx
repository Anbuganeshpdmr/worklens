import React, { useState } from "react";
import EntryDashboardList, { PAGE } from "../components/entries/EntryDashboardList";
import EntryHeaderComponent from "../components/entries/EntryHeaderComponent";

export default function MyEntriesPage() {
  const [entries, setEntries] = useState([]);
  
    return (
      <div className="act-page">
        <main className="act-page__main">
          <header className="act-page__header">
            <h1 className="act-page__title">Your Entries</h1>
          </header>
  
          <EntryHeaderComponent onResults={setEntries} />
  
          <EntryDashboardList entries={entries} page={PAGE.MY_ENTRIES} />
        </main>
      </div>
    );
}
