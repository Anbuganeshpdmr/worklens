import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import { testingQuotes } from "../data/quotes";
import { useUser } from "../context/UserContext";
import { Timer as TimerIcon, AlarmClock } from "lucide-react";
import { useEntryContext } from "../context/EntryContext";
import { getOpenEntry } from "../api/entry";
import { flattenEntry } from "./entries/entryMapper";

const QUOTE_INTERVAL = 2 * 60 * 1000;

// Greeting function
function updateGreeting(setGreeting) {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    setGreeting("Good Morning");
  } else if (hour >= 12 && hour < 17) {
    setGreeting("Good Afternoon");
  } else if (hour >= 17 && hour < 21) {
    setGreeting("Good Evening");
  } else {
    setGreeting("Good Night");
  }
}

// Quote function
function loadQuote(setQuote) {
  const storedQuote = localStorage.getItem("navbarQuote");
  const storedQuoteTime = localStorage.getItem("navbarQuoteTime");

  const now = Date.now();

  // If existing quote is still within 2 minutes, keep it
  if (
    storedQuote &&
    storedQuoteTime &&
    now - Number(storedQuoteTime) < QUOTE_INTERVAL
  ) {
    setQuote(storedQuote);
    return;
  }

  // Otherwise select a new random quote
  const randomIndex = Math.floor(Math.random() * testingQuotes.length);

  const newQuote = testingQuotes[randomIndex];

  setQuote(newQuote);

  localStorage.setItem("navbarQuote", newQuote);
  localStorage.setItem("navbarQuoteTime", now.toString());
}

function Navbar({ onMenuClick }) {
  const { user } = useUser();

  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState("");
  const [openEntry, setOpenEntry] = useState(null);
  const [entryError, setEntryError] = useState(null);

  const { entryVersion } = useEntryContext();

  const displayName =
    user?.name || user?.fullName || user?.username || user?.userId || "User";

  useEffect(() => {
    // Greeting based on current time
    updateGreeting(setGreeting);

    // Quote settings
    loadQuote(setQuote);

    // Check every 2 minutes
    const quoteTimer = setInterval(() => {
      loadQuote(setQuote);
    }, QUOTE_INTERVAL);

    // Cleanup timer
    return () => clearInterval(quoteTimer);
  }, []);

  useEffect(() => {
    const fetchOpenEntry = async () => {
      try {
        setEntryError(null);
        const entry = await getOpenEntry();

        if (!entry || !entry.data) {
          setOpenEntry(null);
          return;
        }
        const flattenedEntry = flattenEntry(entry.data || entry);
        setOpenEntry(flattenedEntry);
      } catch (err) {
        setOpenEntry(null);
        setEntryError(err?.response?.data?.message || err?.message || "Failed to fetch open entry");
      }
    };

    fetchOpenEntry();
  }, [entryVersion]);


  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar__left">
        <button
          className="navbar__menu"
          type="button"
          aria-label="Menu"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <div className="navbar__brand">
          <img
            src="/worklens-logo.png"
            alt="WorkLens"
            className="navbar__logo"
          />

          <span className="navbar__name">WorkLens</span>
        </div>

        {/* Greeting */}
        <div className="navbar__greeting">
          {greeting}, {displayName}! 👋
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar__right">
        {/* Quote */}
        <div className="navbar__quote">{quote}</div>

        {/* entry timer */}
        <div className="navbar__timer">
          {entryError ? (
            <span className="timer-error" title={entryError}>
              <AlarmClock size={17} strokeWidth={1.8} className="timer-error__icon" />
              No active entry
            </span>
          ) : openEntry ? (
            <Timer key={openEntry.id} entry={openEntry} />
          ) : (
            <span className="timer-inactive">
              <TimerIcon size={17} strokeWidth={1.8} />
              No active entry
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

function Timer({ entry }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startDateTime = new Date(
    `${entry.activityDate}T${entry.startTime}`,
  ).getTime();

  const elapsedSeconds = Math.max(0, Math.floor((now - startDateTime) / 1000));

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const formattedTime = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  return (
    <span className="timer-active">
      <span className="timer-icon">
        <TimerIcon size={17} strokeWidth={1.8} />
      </span>
      {formattedTime}
    </span>
  );
}

export default Navbar;
