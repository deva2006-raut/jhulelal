import React, { useState, useRef, useEffect } from 'react';
import { Upload, ImageIcon, RefreshCw, AlertTriangle, Info, XCircle, ShieldAlert, Leaf, CheckCircle, MapPin } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// Reference photographs bundled with the app (see public/images/CREDITS.json).
// These are for manual comparison only — the demo classifier does not diagnose disease.
const SAMPLE_IMAGES = [
  { id: 'healthy',    src: '/images/sample-healthy.jpg',    label: 'Healthy Leaf',    tone: 'text-forest-700',   ring: 'hover:border-forest-500' },
  { id: 'canker',     src: '/images/sample-canker.jpg',     label: 'Citrus Canker',   tone: 'text-red-700',      ring: 'hover:border-red-500' },
  { id: 'greening',   src: '/images/sample-greening.jpg',   label: 'Citrus Greening', tone: 'text-yellow-700',   ring: 'hover:border-yellow-500' },
  { id: 'deficiency', src: '/images/sample-deficiency.jpg', label: 'Nutrient Deficiency', tone: 'text-orange-700', ring: 'hover:border-orange-500' },
];

export default function ImageAnalysis() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  useEffect(() => {
    // Load MobileNet for base image classification (Relevance Gate)
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);
        setModelLoading(false);
      } catch (err) {
        console.error("Failed to load MobileNet model", err);
        setError("Failed to load the image classification engine. Please check your internet connection.");
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const handleImageUpload = (e) => {
    setError(null);
    setResult(null);
    const file = e.target.files[0];
    
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported file format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const categorizePredictions = (predictions) => {
    const text = predictions.map(p => p.className.toLowerCase()).join(' ');
    
    // Check for citrus/fruit
    if (text.match(/orange|lemon|fruit|citrus|granny smith|fig|strawberry|pineapple|banana/)) {
      return { type: 'citrus_fruit', label: 'Citrus / Orange Fruit' };
    }
    // Check for orchard/landscape
    if (text.match(/valley|farm|field|earth|alp|greenhouse|tractor|plow/)) {
      return { type: 'orchard', label: 'Citrus Tree / Orchard Overview' };
    }
    // Check for leaves/plants
    if (text.match(/leaf|plant|tree|flower|pot|daisy|broccoli|cabbage/)) {
      return { type: 'citrus_leaf', label: 'Plant / Citrus Leaf' };
    }
    // Everything else is unrelated
    return { type: 'unrelated', label: 'Unrelated Object' };
  };

  const runAnalysis = async () => {
    if (!model || !imageRef.current) {
      setError("Model is not ready. Please wait.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      // 1. Genuine Image Classification (Relevance Gate)
      const predictions = await model.classify(imageRef.current);
      console.log("MobileNet Predictions:", predictions);
      
      const category = categorizePredictions(predictions);
      const topPrediction = predictions[0];
      const confidencePercent = (topPrediction.probability * 100).toFixed(1);

      // Check if weather is available for context
      const cachedWeather = localStorage.getItem('orange_weather_cache');
      let weatherContext = "No recent weather data available.";
      if (cachedWeather) {
        const parsed = JSON.parse(cachedWeather);
        weatherContext = `Recent weather in ${parsed.locationName}: ${parsed.data.temperature_2m}°C, ${parsed.data.relative_humidity_2m}% humidity.`;
      }

      // 2. Routing based on Relevance
      if (category.type === 'unrelated') {
        setResult({
          status: 'rejected',
          category: category.label,
          detectedAs: topPrediction.className,
          confidence: confidencePercent,
          message: `This image does not appear to be related to citrus farming. The classifier detected "${topPrediction.className}". Please upload an orange fruit, citrus leaf, citrus tree, or orchard image.`,
        });
      } else if (category.type === 'orchard') {
        setResult({
          status: 'orchard_mode',
          category: category.label,
          detectedAs: topPrediction.className,
          confidence: confidencePercent,
          message: 'Orchard Overview mode activated.',
          details: 'We can identify this as an agricultural landscape or orchard. However, it is not possible to accurately detect individual tree diseases, pest infestations, or nutrient deficiencies from a distant overview image.',
          weatherContext: weatherContext,
          nextSteps: [
            'Add this overview image to your Orchard Zone records.',
            'For disease detection, please upload close-up images of affected leaves or fruits.',
            'Conduct a manual walkthrough to inspect individual tree health.'
          ]
        });
      } else {
        // Citrus Leaf or Fruit accepted
        setResult({
          status: 'preliminary',
          category: category.label,
          detectedAs: topPrediction.className,
          confidence: confidencePercent,
          message: 'Citrus-related image accepted. Disease classification model is UNAVAILABLE.',
          details: 'A general image classifier confirmed this is a plant/fruit, but no specialized Citrus Disease AI Model is currently connected to this system. We cannot automatically detect Canker, Greening, or Deficiencies.',
          symptoms: 'Observed visual symptoms cannot be automatically extracted without a trained disease model.',
          causes: 'Cannot reliably determine possible causes.',
          weatherContext: weatherContext,
          nextSteps: [
            'Inspect both sides of the leaves for raised lesions (Canker) or asymmetrical yellowing (Greening).',
            'Check nearby trees to see if symptoms are spreading.',
            'Consult a local agricultural expert for a reliable diagnosis.',
            'Do not apply chemical pesticides or fertilizers without expert verification.'
          ]
        });
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during image classification.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">Citrus Image Analysis</h1>
          <p className="text-gray-500 mt-1 text-lg">Upload images for visual assessment and decision support.</p>
        </div>
      </div>

      {modelLoading && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 text-blue-800 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading image classification engine (TensorFlow.js)...
        </div>
      )}

      <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 flex gap-3 text-forest-900">
        <Info className="w-6 h-6 shrink-0 text-forest-700" />
        <div className="text-sm">
          <p className="font-bold mb-1">Upload Instructions & Relevance Gate:</p>
          <p>Please upload a clear JPG, PNG, or WEBP image (Max 5MB) of a citrus leaf, fruit, or orchard. Unrelated images (cars, bikes, people) will be detected and rejected by the vision model. Blurry or distant images may be categorized as unclear.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-xl font-bold text-forest-950 mb-6">Image Input</h3>
          
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[350px] transition-all relative overflow-hidden
              ${selectedImage ? 'border-orange-500 bg-orange-50/30' : 'border-gray-300 hover:border-orange-400 bg-gray-50'}`}
          >
            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  ref={imageRef}
                  src={selectedImage} 
                  alt="Uploaded preview" 
                  crossOrigin="anonymous"
                  className="max-h-72 w-auto object-contain rounded-xl shadow-sm mb-6 border border-gray-200" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-forest-600 font-bold hover:text-forest-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 absolute bottom-4"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="p-5 bg-white rounded-full inline-block shadow-sm mb-4 border border-gray-100">
                  <Upload className="w-10 h-10 text-orange-500" />
                </div>
                <p className="text-base font-semibold text-gray-700 mb-2">Click to select or drag and drop</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 px-6 py-2.5 bg-forest-900 text-white rounded-xl font-semibold shadow-sm hover:bg-forest-800 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept=".jpg,.jpeg,.png,.webp" 
              className="hidden" 
            />
          </div>

          {!selectedImage && (
            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Reference samples</p>
                <span className="text-[11px] text-gray-400">Tap to load</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => { setError(null); setResult(null); setSelectedImage(sample.src); }}
                    className={`group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl`}
                  >
                    <div className={`aspect-[4/3] overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100 transition-colors ${sample.ring}`}>
                      <img
                        src={sample.src}
                        alt={sample.label}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className={`mt-2 text-xs font-bold leading-tight ${sample.tone}`}>{sample.label}</p>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
                Bundled field photographs for side-by-side comparison. Uploading them runs the same relevance check as your own photos.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex gap-3 text-sm font-medium">
              <XCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {selectedImage && !result && (
            <button 
              onClick={runAnalysis}
              disabled={analyzing || modelLoading}
              className="w-full mt-6 px-4 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Classifying Image...
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6" />
                  Analyze Image
                </>
              )}
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-forest-950 mb-6">Analysis & Recommendations</h3>
          
          {!selectedImage && !analyzing && (
            <div className="h-[350px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <ImageIcon className="w-16 h-16 mb-4 opacity-30 text-forest-900" />
              <p className="font-medium">Awaiting image upload</p>
            </div>
          )}

          {analyzing && (
            <div className="h-[350px] flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
              <RefreshCw className="w-12 h-12 animate-spin text-orange-500 mb-6" />
              <p className="font-semibold text-gray-700">Running TensorFlow.js Vision Model...</p>
              <p className="text-sm mt-2">Checking image relevance and category.</p>
            </div>
          )}

          {result && !analyzing && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* REJECTED STATE */}
              {result.status === 'rejected' && (
                <div className="p-6 rounded-xl border-l-4 shadow-sm bg-red-50 border-red-500">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <h4 className="text-xl font-extrabold text-red-900">Relevance Check Failed</h4>
                  </div>
                  <p className="text-red-800 font-medium mb-4">{result.message}</p>
                  <div className="bg-white/60 p-3 rounded-lg border border-red-100 text-sm flex justify-between">
                    <span className="text-red-900"><strong>Detected Class:</strong> {result.detectedAs}</span>
                    <span className="text-red-900"><strong>Confidence:</strong> {result.confidence}%</span>
                  </div>
                </div>
              )}

              {/* ORCHARD MODE */}
              {result.status === 'orchard_mode' && (
                <div className="p-6 rounded-xl border-l-4 shadow-sm bg-blue-50 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <h4 className="text-xl font-extrabold text-blue-900">Orchard Overview Mode</h4>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-blue-700">
                    <span>Category: {result.category}</span>
                    <span>Confidence: {result.confidence}%</span>
                  </div>
                  <p className="text-blue-900 font-medium mb-4">{result.details}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Weather Context</span>
                      <p className="text-blue-900 font-medium text-sm bg-white/50 p-3 rounded-lg">{result.weatherContext}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Safe Recommendations</span>
                      <ul className="list-disc pl-5 space-y-1 text-blue-900 font-medium text-sm">
                        {result.nextSteps.map((step, idx) => <li key={idx}>{step}</li>)}
                      </ul>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Add as Zone Observation
                  </button>
                </div>
              )}

              {/* PRELIMINARY OBSERVATION */}
              {result.status === 'preliminary' && (
                <div className="p-6 rounded-xl border-l-4 shadow-sm bg-yellow-50 border-yellow-500">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-6 h-6 text-yellow-600" />
                    <h4 className="text-xl font-extrabold text-yellow-900">Preliminary Observation</h4>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-yellow-800 bg-white/50 p-2 rounded-lg border border-yellow-100">
                    <span>{result.category}</span>
                    <span>Confidence: {result.confidence}%</span>
                  </div>
                  
                  <p className="text-yellow-900 font-bold mb-1">{result.message}</p>
                  <p className="text-yellow-800 text-sm mb-4">{result.details}</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 p-3 rounded-lg border border-yellow-200">
                         <span className="block text-xs font-bold uppercase tracking-wider text-yellow-700 mb-1">Visual Symptoms</span>
                         <p className="font-medium text-yellow-900 text-sm">{result.symptoms}</p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-yellow-200">
                         <span className="block text-xs font-bold uppercase tracking-wider text-yellow-700 mb-1">Possible Cause</span>
                         <p className="font-medium text-yellow-900 text-sm">{result.causes}</p>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-yellow-700 mb-2">Weather Context</span>
                      <p className="text-yellow-900 font-medium text-sm bg-white/50 p-3 rounded-lg">{result.weatherContext}</p>
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-yellow-700 mb-2">Safe Practical Next Steps</span>
                      <ul className="list-disc pl-5 space-y-1 text-yellow-900 font-medium text-sm">
                        {result.nextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={resetAnalysis}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Analyze Another Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
