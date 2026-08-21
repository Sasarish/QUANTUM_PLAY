import vision from "@google-cloud/vision";
import sharp from "sharp";

let client;
const getVisionClient = () => {
  if (!client) {
    client = new vision.ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_VISION_KEY_PATH,
    });
  }
  return client;
};

// Labels that plausibly indicate "this photo shows an electronic device"
const RELEVANT_KEYWORDS = [
  "electronics", "gadget", "technology", "video game console",
  "machine", "multimedia", "product", "output device",
  "peripheral", "hardware", "console", "computer hardware",
];

// Below this confidence, we don't guess a score — we ask for a clearer photo instead
const MIN_RELEVANCE_CONFIDENCE = 0.4;

/**
 * Analyze an uploaded trade-in photo and produce a rough condition score (1-10).
 * This is a heuristic proxy built from photo clarity/recognizability signals —
 * NOT a true physical-damage/wear assessment, which Vision API cannot do.
 *
 * @param {Buffer} imageBuffer - raw image bytes
 * @returns {Promise<{accepted: boolean, reason?: string, conditionScore?: number, signals?: object, labels: object[]}>}
 */
export const analyzeTradeInImage = async (imageBuffer) => {
  const visionClient = getVisionClient();

  const [labelResult] = await visionClient.labelDetection({ image: { content: imageBuffer } });
  const labels = labelResult.labelAnnotations || [];

  const [objectResult] = await visionClient.objectLocalization({ image: { content: imageBuffer } });
  const objects = objectResult.localizedObjectAnnotations || [];

  // --- Signal 1: how confidently Vision API recognises this as an electronic device ---
  const relevantLabels = labels.filter((l) =>
    RELEVANT_KEYWORDS.some((k) => l.description.toLowerCase().includes(k))
  );

  if (relevantLabels.length === 0) {
    return {
      accepted: false,
      reason: "We couldn't confidently recognise an electronic device in this photo. Please upload a clear, well-lit photo of the console by itself.",
      labels: labels.map((l) => ({ description: l.description, score: l.score })),
    };
  }

  const topRelevant = relevantLabels.slice(0, 3);
  const labelConfidence = topRelevant.reduce((sum, l) => sum + l.score, 0) / topRelevant.length;

  if (labelConfidence < MIN_RELEVANCE_CONFIDENCE) {
    return {
      accepted: false,
      reason: "We couldn't confidently recognise an electronic device in this photo. Please upload a clear, well-lit photo of the console by itself.",
      labels: labels.map((l) => ({ description: l.description, score: l.score })),
    };
  }

  // --- Signal 2: how much of the frame the device fills (a deliberate, close, well-composed shot) ---
  let objectCoverage = 0.5; // neutral default if no distinct object was localized
  if (objects.length > 0) {
    const best = objects.reduce((a, b) => (a.score > b.score ? a : b));
    const xs = best.boundingPoly.normalizedVertices.map((v) => v.x || 0);
    const ys = best.boundingPoly.normalizedVertices.map((v) => v.y || 0);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    objectCoverage = Math.min(1, width * height * 2); // a half-frame object scores ~1
  }

  // --- Signal 3: rough image detail/sharpness proxy, computed locally (not a Vision API feature) ---
  const stats = await sharp(imageBuffer).stats();
  const avgStdev = stats.channels.reduce((sum, c) => sum + c.stdev, 0) / stats.channels.length;
  const sharpnessProxy = Math.min(1, avgStdev / 70); // ~70 stdev treated as a clearly detailed photo

  // --- Combine into a single rough score out of 10 ---
  const rawScore = labelConfidence * 0.5 + objectCoverage * 0.2 + sharpnessProxy * 0.3;
  const conditionScore = Math.max(1, Math.min(10, Math.round(rawScore * 10)));

  return {
    accepted: true,
    conditionScore,
    signals: { labelConfidence, objectCoverage, sharpnessProxy },
    labels: labels.slice(0, 8).map((l) => ({ description: l.description, score: l.score })),
  };
};