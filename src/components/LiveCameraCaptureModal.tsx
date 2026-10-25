import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertTriangle, CheckCircle2, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import { GrievanceImage } from '../types';
import { evaluateStructuralImageFilter } from '../utils/foodSafetyRules';

interface LiveCameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (image: GrievanceImage) => void;
  currentCount: number;
}

const SAMPLE_FOOD_SCENES = [
  {
    name: 'Contaminated Dish (Foreign Insect / Fly)',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
    tags: ['food', 'bowl', 'dish', 'gravy', 'insect'],
    suggestedAngle: 'Close-up: Foreign Particle Defect'
  },
  {
    name: 'Unhygienic Commercial Kitchen Prep Counter',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
    tags: ['kitchen', 'counter', 'food', 'utensils', 'oil'],
    suggestedAngle: 'Overview: Kitchen & Preparation Area'
  },
  {
    name: 'Molded / Discolored Stale Item',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
    tags: ['plate', 'food', 'bread', 'mold', 'fungus'],
    suggestedAngle: 'Macro: Surface Spoilage & Discoloration'
  },
  {
    name: 'Product Packaging with Altered Date',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80',
    tags: ['packet', 'food', 'label', 'batch code'],
    suggestedAngle: 'Packaging: Batch Code & Expiry Stamp'
  }
];

export const LiveCameraCaptureModal: React.FC<LiveCameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
  currentCount
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [angleLabel, setAngleLabel] = useState(SAMPLE_FOOD_SCENES[0].suggestedAngle);
  
  // Lens simulation controls (to demonstrate testing structural filters!)
  const [simulatedBrightness, setSimulatedBrightness] = useState(128); // 0-255
  const [simulatedBlur, setSimulatedBlur] = useState(15); // 0 (sharp) to 100 (blur)
  const [forcePitchBlack, setForcePitchBlack] = useState(false);
  const [filterResult, setFilterResult] = useState<ReturnType<typeof evaluateStructuralImageFilter> | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Run structural filter on current simulation parameters
    const currentScene = SAMPLE_FOOD_SCENES[selectedSceneIndex];
    const luminance = forcePitchBlack ? 5 : simulatedBrightness;
    // Map blur slider (0-100) to laplacian variance (0 to 500)
    const laplacian = forcePitchBlack ? 50 : Math.max(10, Math.round((100 - simulatedBlur) * 5));
    
    const result = evaluateStructuralImageFilter({
      averageLuminance: luminance,
      laplacianVariance: laplacian,
      detectedKeywords: currentScene.tags
    });
    setFilterResult(result);
  }, [isOpen, selectedSceneIndex, simulatedBrightness, simulatedBlur, forcePitchBlack]);

  const handleShutterClick = () => {
    if (!filterResult) return;
    
    if (!filterResult.passed) {
      alert(`Structural Filter Rejection: ${filterResult.rejectionReason}\n\nPlease adjust camera lighting or focus before capturing.`);
      return;
    }

    const currentScene = SAMPLE_FOOD_SCENES[selectedSceneIndex];
    const newImage: GrievanceImage = {
      id: `IMG-${Date.now().toString().slice(-6)}`,
      dataUrl: currentScene.url,
      angleLabel: angleLabel || currentScene.suggestedAngle,
      timestamp: Date.now(),
      source: 'live_camera',
      structuralMetrics: {
        brightness: filterResult.brightness,
        blurScore: filterResult.blurScore,
        isPitchBlack: filterResult.isPitchBlack,
        isOverexposed: filterResult.isOverexposed,
        isLikelyScreenshot: filterResult.isLikelyScreenshot,
        hasFoodRelatedObjects: filterResult.hasFoodRelatedObjects,
        detectedObjects: filterResult.detectedObjects,
        passed: true
      }
    };

    onCaptureImage(newImage);
    onClose();
  };

  if (!isOpen) return null;

  const currentScene = SAMPLE_FOOD_SCENES[selectedSceneIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#36281C] border border-[#F4D9A0]/50 rounded-2xl w-full max-w-2xl text-[#FBF6EE] shadow-2xl overflow-hidden my-4">
        {/* Header (Mocha Brown gradient) */}
        <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] p-4 border-b border-[#F4D9A0]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#F4D9A0]" />
            <div>
              <div className="text-sm font-extrabold text-[#FBF6EE] flex items-center gap-2">
                Live Evidence Camera Shutter
                <span className="bg-[#2C2016] text-[#F4D9A0] font-mono text-[10px] px-2 py-0.5 rounded uppercase font-bold border border-[#F4D9A0]/30">
                  Photo {currentCount + 1} of 15
                </span>
              </div>
              <p className="text-[11px] text-[#F4D9A0]/80">
                Gallery uploads blocked. Tamper-proof live optical capture only.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/30 text-[#FBF6EE]/80 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border-2 border-[#F4D9A0]/40 shadow-inner flex items-center justify-center">
            {/* Live Camera Viewfinder Overlay */}
            <div className="absolute inset-4 border border-white/20 pointer-events-none rounded-lg flex flex-col justify-between p-3 z-20">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/70">
                <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C86D24] animate-ping" />
                  REC 1080P · LIVE FEED
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  SHUTTER 1/250s · ISO 100
                </span>
              </div>

              {/* Center Crosshairs */}
              <div className="self-center w-12 h-12 border-2 border-[#F4D9A0]/60 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#F4D9A0] rounded-full" />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-white/70">
                <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  ANGLE: {angleLabel}
                </span>
                <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  GPS: 12.9716° N, 77.6412° E
                </span>
              </div>
            </div>

            {/* Visual Subject Feed */}
            {forcePitchBlack ? (
              <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                <AlertTriangle className="w-10 h-10 text-[#C86D24] mb-2" />
                <p className="text-xs font-mono text-[#C86D24] font-bold">LENS FULLY OBSCURED / PITCH BLACK</p>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-1">Average luminance &lt; 18. Image clarity fails statutory baseline.</p>
              </div>
            ) : (
              <div 
                className="w-full h-full relative"
                style={{
                  filter: `brightness(${simulatedBrightness / 128}) blur(${simulatedBlur > 50 ? (simulatedBlur - 40) / 6 : 0}px)`
                }}
              >
                <img
                  src={currentScene.url}
                  alt={currentScene.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Real-time Structural Filter Diagnostics Box */}
          {filterResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              filterResult.passed
                ? 'bg-[#2C2016] border-[#F4D9A0]/40 text-[#F4D9A0]'
                : 'bg-[#401f18] border-[#C86D24] text-[#FBF6EE]'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {filterResult.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#F4D9A0]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#C86D24]" />
                  )}
                  Structural Filter Status: {filterResult.passed ? 'PASSED (Ready to capture)' : 'FAILED (Revert to User)'}
                </span>
                <span className="font-mono text-[11px] text-[#FBF6EE]/60">
                  Luminance: {filterResult.brightness}/255 · Blur: {filterResult.blurScore}%
                </span>
              </div>

              {!filterResult.passed ? (
                <p className="mt-1 text-[#C86D24] text-[11px] font-semibold">
                  ⚠️ {filterResult.rejectionReason}
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#FBF6EE]/80">
                  <span>CV Object Detection:</span>
                  {filterResult.detectedObjects.map((tag, i) => (
                    <span key={i} className="bg-[#5B4632] text-[#F4D9A0] px-1.5 py-0.5 rounded font-mono text-[10px] border border-[#F4D9A0]/30">
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[#F4D9A0] font-semibold">· Food Artifact Verified</span>
                </div>
              )}
            </div>
          )}

          {/* Interactive Simulation Panel to Test Edge Cases */}
          <div className="bg-[#2C2016] border border-[#F4D9A0]/30 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#F4D9A0] font-bold">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Live Camera Shutter & Structural Filter Test Bench
              </span>
              <span className="text-[10px] text-[#FBF6EE]/60 font-normal">
                Select sample incident angle or test filter edge cases
              </span>
            </div>

            {/* Preset scenes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_FOOD_SCENES.map((scene, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedSceneIndex(idx);
                    setAngleLabel(scene.suggestedAngle);
                    setForcePitchBlack(false);
                  }}
                  className={`p-2 rounded-lg text-left text-[11px] transition-all border cursor-pointer ${
                    selectedSceneIndex === idx && !forcePitchBlack
                      ? 'bg-[#5B4632] border-[#F4D9A0] text-[#FBF6EE] font-semibold'
                      : 'bg-[#36281C] border-[#F4D9A0]/20 text-[#FBF6EE]/60 hover:text-white'
                  }`}
                >
                  <div className="truncate font-medium">{scene.name}</div>
                  <div className="text-[9px] text-[#F4D9A0] truncate mt-0.5">{scene.suggestedAngle}</div>
                </button>
              ))}
            </div>

            {/* Structural Filter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <label className="text-[#FBF6EE]/70 text-[11px] block mb-1">
                  Brightness: {simulatedBrightness}
                </label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={simulatedBrightness}
                  disabled={forcePitchBlack}
                  onChange={e => setSimulatedBrightness(Number(e.target.value))}
                  className="w-full accent-[#F4D9A0] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[#FBF6EE]/70 text-[11px] block mb-1">
                  Blur Level: {simulatedBlur}% {simulatedBlur > 70 ? '(Excessive)' : ''}
                </label>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={simulatedBlur}
                  disabled={forcePitchBlack}
                  onChange={e => setSimulatedBlur(Number(e.target.value))}
                  className="w-full accent-[#F4D9A0] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 sm:pt-0">
                <button
                  type="button"
                  onClick={() => setForcePitchBlack(!forcePitchBlack)}
                  className={`w-full py-1.5 px-2 rounded text-xs font-semibold border cursor-pointer ${
                    forcePitchBlack
                      ? 'bg-[#C86D24] text-white border-[#C86D24]'
                      : 'bg-[#36281C] text-[#FBF6EE] border-[#F4D9A0]/30 hover:text-white'
                  }`}
                >
                  {forcePitchBlack ? 'Restore Lighting' : 'Simulate Pitch Black'}
                </button>
              </div>
            </div>
          </div>

          {/* Shutter Action & Gallery Prohibited Notice */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-[#FBF6EE]/70">
              <ShieldAlert className="w-4 h-4 text-[#C86D24] shrink-0" />
              <span>Gallery uploads disabled to prevent AI hallucination or pre-saved duplicate photos.</span>
            </div>

            <button
              type="button"
              onClick={handleShutterClick}
              disabled={!filterResult?.passed}
              className="w-full sm:w-auto px-8 py-3 bg-[#F4D9A0] hover:bg-[#F9E6BD] disabled:opacity-40 disabled:cursor-not-allowed text-[#2C2016] font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-[#F4D9A0] cursor-pointer"
            >
              <Camera className="w-5 h-5 text-[#2C2016]" />
              Capture Evidence Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
