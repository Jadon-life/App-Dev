"use client";
import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BookOpen, X } from "lucide-react";
const Book3D = dynamic(() => import("@/components/book/Book3D"), {
  ssr: false,
  loading: () => (
    <p className="p-8 text-center text-white" role="status">
      Opening the book…
    </p>
  ),
});

export default function BookPreview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [finished, setFinished] = useState(false);
  const [supported, setSupported] = useState(false);
  const complete = useCallback(() => setFinished(true), []);
  const unavailable = useCallback(() => setSupported(false), []);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    setFlipping(false);
    setFinished(false);
  };
  const show = () => {
    let canRender = false;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        canRender = Boolean(gl);
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        /* Keep an accessible text version available. */
      }
    }
    setSupported(canRender);
    setOpen(true);
    dialog.current?.showModal();
  };
  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-touch items-center gap-2 text-sm font-semibold underline decoration-brand-teal/30 underline-offset-4"
        onClick={show}
      >
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        Open the CrysLearn book
      </button>
      <dialog
        ref={dialog}
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-labelledby="book-title"
        className="m-auto w-[min(94vw,600px)] rounded-section border border-brand-frost/20 bg-[#102b2b] p-4 text-white sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="book-title" className="text-lg font-semibold">
            A new chapter starts here.
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close book preview"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {open && supported ? (
          <div className="h-[300px] sm:h-[380px]" aria-hidden="true">
            <Book3D isFlipping={flipping} onComplete={complete} onUnavailable={unavailable} />
          </div>
        ) : (
          <div className="mx-auto my-10 flex h-56 w-40 items-center justify-center rounded-r-xl border-l-8 border-[#c8b37e] bg-[#205d54] p-4 text-center font-serif text-2xl">
            CrysLearn
            <br />
            Study notes
          </div>
        )}
        <p className="mb-4 text-sm leading-6 text-[#c6e7dc]" role="status">
          {finished
            ? "Your next chapter is yours to write."
            : "Practice a little. Understand more. Come back with confidence."}
        </p>
        <div className="flex flex-wrap gap-3">
          {supported && (
            <button
              type="button"
              className="btn-secondary"
              disabled={flipping}
              onClick={() => setFlipping(true)}
            >
              {flipping ? (finished ? "Book opened" : "Turning the pages…") : "Turn the pages"}
            </button>
          )}
          <Link href="/login" onClick={close} className="btn-primary">
            Start studying
          </Link>
        </div>
      </dialog>
    </>
  );
}
