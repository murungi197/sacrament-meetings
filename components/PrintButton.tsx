"use client";

export default function PrintButton() {
  return (
    <button className="button button-outline print-button" onClick={() => window.print()} type="button">
      <span aria-hidden="true">⎙</span>
      Print agenda
    </button>
  );
}
