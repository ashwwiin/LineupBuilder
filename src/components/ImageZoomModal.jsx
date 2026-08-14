import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, Check, X, Move, RotateCcw } from 'lucide-react';

export default function ImageZoomModal({
  imageSrc,
  initialZoom = 1.15,
  initialX = 0,
  initialY = 0,
  onConfirm,
  onClose
}) {
  const [zoom, setZoom] = useState(initialZoom);
  const [offsetX, setOffsetX] = useState(initialX);
  const [offsetY, setOffsetY] = useState(initialY);

  const handleReset = () => {
    setZoom(1.15);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleSave = () => {
    onConfirm({
      photo: imageSrc,
      photoZoom: zoom,
      photoOffsetX: offsetX,
      photoOffsetY: offsetY
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center select-none">
        {/* MODAL HEADER */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider my-0">
              Adjust & Zoom Headshot
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CIRCULAR HEADSHOT LIVE PREVIEW FRAME */}
        <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-emerald-400 shadow-2xl bg-slate-950 flex items-center justify-center my-2 group">
          <img
            src={imageSrc}
            alt="Preview"
            className="w-full h-full object-cover object-top transition-transform"
            style={{
              transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`
            }}
          />
          <div className="absolute inset-0 border-2 border-dashed border-emerald-400/40 rounded-full pointer-events-none" />
        </div>

        <p className="text-[11px] font-semibold text-slate-400 my-2 text-center">
          Zoom and align the face so it fits cleanly inside the headshot frame.
        </p>

        {/* CONTROLS */}
        <div className="w-full space-y-4 my-3">
          {/* Zoom Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-emerald-400" /> Zoom Level
              </span>
              <span className="text-emerald-400 font-mono">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomOut className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Vertical Offset Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Vertical Position (Up / Down)</span>
              <span className="text-slate-400 font-mono">{offsetY}px</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Horizontal Offset Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Horizontal Position (Left / Right)</span>
              <span className="text-slate-400 font-mono">{offsetX}px</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="w-full flex items-center justify-between gap-3 pt-3 border-t border-slate-800 mt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply Headshot
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
