import React, { useState, useEffect } from "react";
import { getAllEntries } from "../api/entry";
import { flattenEntry } from "../components/entries/entryMapper";
import EntryDashboardList from "../components/entries/EntryDashboardList";

export default function EntryDashboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filterRequest, setFilterRequest] = useState({});

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await getAllEntries(filterRequest, page, size);
      const flattenedEntries =
        response?.data?.content?.map((entry) => flattenEntry(entry)) || [];
      setEntries(flattenedEntries);
      console.log(flattenedEntries);
      setError("");
    } catch (error) {
      setError(error?.message || "Failed to load entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="act-page">
      <main className="act-page__main">
        {/* Page Header */}
        <header className="act-page__header">
          <h1 className="act-page__title">Entry Dashboard</h1>
          <p className="act-page__subtitle">Welcome to the Entry Dashboard.</p>
        </header>
        <EntryDashboardList entries={entries} />
        {error && (
          <div className="act-page__error" role="alert">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
