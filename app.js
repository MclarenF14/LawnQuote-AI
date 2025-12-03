import React, { useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

function validateFileName(file) {
  const name = file.name.toLowerCase();
  return name.includes("front") || name.includes("back");
}

function App() {
  const [length, setLength] = useState("");
  const [area, setArea] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handlePhotoChange(e) {
    setErrors([]);
    setPhotos([]);
    setPreviewUrls([]);
    const files = Array.from(e.target.files);
    const valid = [];
    const previews = [];
    let newErrors = [];
    for (const file of files) {
      if (validateFileName(file)) {
        valid.push(file);
        previews.push(URL.createObjectURL(file));
      } else {
        newErrors.push(`Rejected "${file.name}". Filename must include "front" or "back".`);
      }
    }
    setPhotos(valid);
    setPreviewUrls(previews);
    setErrors(newErrors);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);
    let localErrs = [];

    if (!length) localErrs.push("Please enter the length of your lawn.");
    if (!area) localErrs.push("Please select which yard(s) you want mowed.");
    if (photos.length < 1) localErrs.push('Upload at least one photo named with "front" or "back".');
    if (localErrs.length) {
      setErrors(localErrs);
      setSubmitting(false);
      return;
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  }

  if (submitted) return (
    <div style={{ padding: 30 }}>
      <h2>Thank You!</h2>
      <p>Your lawncare quote request has been received!</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 460, margin: "2em auto", border: "1px solid #ddd", padding: "2em", borderRadius: 8 }}>
      <h1>Lawncare Quote</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Length of lawn (meters):<br/>
          <input
            type="number"
            min="1"
            required
            value={length}
            onChange={e => setLength(e.target.value)}
            style={{ width: 150 }}
          />
        </label>
        <br /><br />
        <label>
          Area to mow:<br />
          <select required value={area} onChange={e => setArea(e.target.value)}>
            <option value="">Select...</option>
            <option value="front">Front yard</option>
            <option value="back">Back yard</option>
            <option value="both">Both</option>
          </select>
        </label>
        <br /><br />
        <label>
          Upload photo(s) of your lawn (filename must include "front" or "back"):<br />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
          />
        </label>
        <br />
        {previewUrls.length > 0 && (
          <div style={{display:'flex', gap: 8, margin: "10px 0"}}>
            {previewUrls.map((src, i) => (
              <img key={i} src={src} alt="preview" style={{maxWidth: 100, maxHeight: 100, borderRadius: 4}}/>
            ))}
          </div>
        )}
        {errors.length > 0 && (
          <div style={{color: "#d12", margin: "14px 0"}}>
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Get Quote"}
        </button>
      </form>
      <div style={{fontSize:'80%',color:'#888',marginTop:12}}>
        Only photos of the front and/or back yard will be accepted. The filename must include "front" or "back".
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
