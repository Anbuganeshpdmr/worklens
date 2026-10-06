import { useEffect, useRef, useState } from "react";

function ModalSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  disabled = false,
  autoFocus = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const listboxRef = useRef(null);
  const allOptions = [{ value: "", label: placeholder }, ...options];
  const selectedIndex = allOptions.findIndex((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds) {
        setPosition({ top: bounds.bottom, left: bounds.left, width: bounds.width });
      }
    };
    const handleOutsidePointer = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listboxRef.current?.focus();
  }, [isOpen]);

  const openDropdown = () => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (bounds) {
      setPosition({ top: bounds.bottom, left: bounds.left, width: bounds.width });
    }
    setActiveIndex(selectedIndex < 0 ? 0 : selectedIndex);
    setIsKeyboardNavigation(false);
    setIsOpen(true);
  };

  const selectOption = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (event) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (!isOpen) openDropdown();
    }
  };

  const handleListboxKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      containerRef.current?.querySelector(".modal-select-trigger")?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsKeyboardNavigation(true);
      setActiveIndex((index) => Math.min(index + 1, allOptions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsKeyboardNavigation(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setIsKeyboardNavigation(true);
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setIsKeyboardNavigation(true);
      setActiveIndex(allOptions.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectOption(allOptions[activeIndex].value);
      containerRef.current?.querySelector(".modal-select-trigger")?.focus();
    }
  };

  return (
    <div className="modal-select-container" ref={containerRef}>
      <button
        id={id}
        type="button"
        className={`modal-input modal-select modal-select-trigger ${className}`.trim()}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={`${id}Options`}
        aria-haspopup="listbox"
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        autoFocus={autoFocus}
      >
        <span>{allOptions[selectedIndex < 0 ? 0 : selectedIndex].label}</span>
        <span className="modal-select-arrow" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          id={`${id}Options`}
          className="modal-select-options"
          role="listbox"
          aria-label={ariaLabel}
          ref={listboxRef}
          tabIndex={0}
          style={{ top: position.top, left: position.left, width: position.width }}
          onKeyDown={handleListboxKeyDown}
        >
          {allOptions.map((option, index) => (
            <div
              key={option.value || "placeholder"}
              className={`modal-select-option${
                isKeyboardNavigation && index === activeIndex ? " is-active" : ""
              }`}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => {
                setIsKeyboardNavigation(false);
                setActiveIndex(index);
              }}
              onClick={() => {
                selectOption(option.value);
                containerRef.current?.querySelector(".modal-select-trigger")?.focus();
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModalSelect;
