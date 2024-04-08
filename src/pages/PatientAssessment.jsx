import React, { useState } from 'react';

const PatientAssessment = () => {
  const [symptoms, setSymptoms] = useState({
    majorFever: false,
    majorTiredness: false,
    majorCough: false,
    majorSoreThroat: false,
    majorBreath: false,
    majorNone: false,
    otherMuscleAches: false,
    otherNasalCongestion: false,
    otherRunnyNose: false,
    otherDiarrhea: false,
    otherNone: false,
    contact: '', // Use a single string for radio buttons
});

const [prediction, setPrediction] = useState([]);
const [resultMessage, setResultMessage] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    // If "None of the above" is checked, uncheck all others in the group
    if (name.includes('None')) {
        const group = name.split('None')[0]; // 'major' or 'other'
        setSymptoms((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => {
                if (key.startsWith(group)) {
                    acc[key] = false; // Reset this group's checkboxes
                } else {
                    acc[key] = prev[key]; // Keep all other values
                }
                return acc;
            }, {}),
            [name]: checked,
        }));
    } else {
        // If any other checkbox is checked, uncheck "None of the above"
        setSymptoms((prev) => ({
            ...prev,
            [name]: checked,
            [`${name.split('_')[0]}None`]: false,
        }));
    }
};

const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setSymptoms({ ...symptoms, [name]: value });
};

const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Start submitting

    // Convert symptoms to a features array
    const features = [
        symptoms.majorFever ? 1 : 0,
        symptoms.majorTiredness ? 1 : 0,
        symptoms.majorCough ? 1 : 0,
        symptoms.majorSoreThroat ? 1 : 0,
        symptoms.majorBreath ? 1 : 0,
        !symptoms.majorNone ? 0 : 1,
        symptoms.otherMuscleAches ? 1 : 0,
        symptoms.otherNasalCongestion ? 1 : 0,
        symptoms.otherRunnyNose ? 1 : 0,
        symptoms.otherDiarrhea ? 1 : 0,
        !symptoms.otherNone ? 0 : 1,
        symptoms.contact === 'yes' ? 1 : 0,
        symptoms.contact === 'no' ? 1 : 0,
        symptoms.contact === 'unknown' ? 1 : 0,
    ];

    try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ features }),
        });
        const result = await response.json();
        const predictions = result.predictions[0];
        console.log("Predictions: ", predictions)
        setPrediction(predictions);
        
        const severityIndex = predictions.indexOf(Math.max(...predictions));
        console.log('Severity Index:', severityIndex)
        const severity = ['Mild', 'Moderate', 'Severe', 'None'][severityIndex];
        console.log('Severity:', severity);
        let message = `You have ${severity} COVID Symptoms.`;
        if (severity === 'Moderate' || severity === 'Severe') {
            message += ' Please contact a doctor.';
        }
        setResultMessage(message);
    } catch (error) {
        console.error('Prediction error:', error);
        setResultMessage('An error occurred while predicting. Please try again.');
    }

    setIsSubmitting(false); // End submitting
};

    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="block text-red-700 text-xl font-bold mb-2">COVID Checklist</h2>
                <h2 className="block text-gray-700 text-xl font-bold mb-2">Are you currently experiencing any of these major symptoms?</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="majorFever" onChange={handleCheckboxChange} checked={symptoms.majorFever} className="mr-2 leading-tight"/> Fever and/or chills</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="majorTiredness" onChange={handleCheckboxChange} checked={symptoms.majorTiredness} className="mr-2 leading-tight"/> Extreme tiredness</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="majorCough" onChange={handleCheckboxChange} checked={symptoms.majorCough} className="mr-2 leading-tight"/> Dry Cough or Barking Cough</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="majorSoreThroat" onChange={handleCheckboxChange} checked={symptoms.majorSoreThroat} className="mr-2 leading-tight"/> Sore Throat</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="majorBreath" onChange={handleCheckboxChange} checked={symptoms.majorBreath} className="mr-2 leading-tight"/> Shortness of Breathe</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"l><input type="checkbox" name="majorNone" onChange={handleCheckboxChange} checked={symptoms.majorNone} className="mr-2 leading-tight"/> None of the above</label><br />
                </div>

                <div>
                  <h2 className="block text-gray-700 text-xl font-bold mb-2">Are you currently experiencing any of these other symptoms?</h2>
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="otherMuscleAches" onChange={handleCheckboxChange} checked={symptoms.otherMuscleAches} className="mr-2 leading-tight"/> Muscle aches/joint pain</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="otherNasalCongestion" onChange={handleCheckboxChange} checked={symptoms.otherNasalCongestion} className="mr-2 leading-tight"/> Nasal congestion</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="otherRunnyNose" onChange={handleCheckboxChange} checked={symptoms.otherRunnyNose} className="mr-2 leading-tight"/> Runny nose</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="otherDiarrhea" onChange={handleCheckboxChange} checked={symptoms.otherDiarrhea} className="mr-2 leading-tight"/> Diarrhea</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="checkbox" name="otherNone" onChange={handleCheckboxChange} checked={symptoms.otherNone} className="mr-2 leading-tight"/> None of the above</label><br />
                </div>

                <div>
                  <h2 className="block text-gray-700 text-xl font-bold mb-2">Have you been in close contact with someone with symptoms or with COVID-19?</h2>
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="radio" name="contact" value="yes" onChange={handleRadioChange} checked={symptoms.contact === 'yes'} className="mr-2 leading-tight"/> Yes</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="radio" name="contact" value="no" onChange={handleRadioChange} checked={symptoms.contact === 'no'} className="mr-2 leading-tight"/> No</label><br />
                  <label className="block text-gray-700 text-sm font-bold mb-2"><input type="radio" name="contact" value="unknown" onChange={handleRadioChange} checked={symptoms.contact === 'unknown'} className="mr-2 leading-tight"/> I don’t know</label><br />
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="white" d="M12 2c-1.65 0-3 1.35-3 3 0 1.31 0.84 2.42 2 2.83V10h2V7.83c1.16-0.41 2-1.52 2-2.83 0-1.65-1.35-3-3-3z"></path>
                        </svg>
                    ) : "Submit"}
                    </button>
                {resultMessage && <p className="mt-4 text-center text-red-500">{resultMessage}</p>}
            </form>
        </div>
      </>
    );
};

export default PatientAssessment;
