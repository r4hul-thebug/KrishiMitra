// DISEASE ENGINE ── Disease detection and fertilizer use guidance (CNN/ONNX)
//
// Placeholder for integrating with an image-based CNN model in Phase 2.

export function getDiseaseGuidance(cropId, wetWarmDays) {
  // If the weather is highly conducive to disease, we simulate a disease detection hook
  if (wetWarmDays >= 3) {
    return {
      title: 'Disease Triage Alert',
      message: `Weather is highly favorable for fungal infections. Use the camera feature in the app to scan leaves. Our CNN model can detect early signs of rust and blight.`,
      basis: `model:cnn_triage;weather:wetWarmDays=${wetWarmDays}`
    };
  }
  return null;
}
