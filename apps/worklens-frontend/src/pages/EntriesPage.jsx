import React, { useState, useEffect } from "react";
import { getAllEntries } from "../api/entry";
import { flattenEntry } from "../components/entries/entryMapper";
import EntryPageList from "../components/entries/EntryPageList";

export default function EntriesPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filterRequest, setFilterRequest] = useState({});

  const [filterApplied, setFilterApplied] = useState(false);

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
          <h1 className="act-page__title">Entries</h1>
          <p className="act-page__subtitle">Welcome to the Entry Dashboard.</p>
        </header>
        <EntryPageList entries={entries} />
        {error && (
          <div className="act-page__error" role="alert">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
