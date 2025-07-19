import React, { useState, useEffect, useRef } from 'react';
import symptomsData from '../../data/SymptomsJSON.json';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from '../styles/diseasePrediction.module.css';
import { Checkbox } from '@nextui-org/react';
import StartupLoader from '../../components/StartupLoader/StartupLoader';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader/PageLoader';
import DiseasePieChart from '@/components/DiseasePieChart';
import ProtectedRoute from '@/components/ProtectedRoute';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function SymptomCheckbox() {
  const [checkedSymptoms, setCheckedSymptoms] = useState({});
  const [predictedDisease, setPredictedDisease] = useState(null);
  const [startupLoading, setStartupLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const symptomRefs = useRef({});

  useEffect(() => {
    setStartupLoading(true);
    fetch(process.env.NEXT_PUBLIC_DISEASE_PREDICTION_API_URL)
      .catch((err) => console.error('API warmup error:', err))
      .finally(() => setStartupLoading(false));
  }, []);

  useEffect(() => {
    if (!startupLoading) return;
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [startupLoading, countdown]);

  const handleCheckboxChange = (category, symptom, isChecked) => {
    setCheckedSymptoms((prevState) => ({
      ...prevState,
      [category]: {
        ...(prevState[category] || {}),
        [symptom]: isChecked,
      },
    }));
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const selectedSymptomsArray = [];
      for (const category in checkedSymptoms) {
        for (const symptom in checkedSymptoms[category]) {
          if (checkedSymptoms[category][symptom]) {
            selectedSymptomsArray.push(symptom);
          }
        }
      }
      if (selectedSymptomsArray.length === 0) {
        setPredictedDisease('NO_SYMPTOMS');
        setLoading(false);
        scrollToTop();
        return;
      }

      const symptomsArray = {
        symptoms: selectedSymptomsArray,
      };

      // console.log('Symptoms Array:', symptomsArray);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_DISEASE_PREDICTION_API_URL + '/predict',
        symptomsArray
      );
      // console.log({ response });

      // Handle new API response format: response.data['Top 3 Predictions']
      const topPredictions = response?.data?.['Top 3 Predictions'];
      const singlePrediction = response?.data?.Disease;

      setPredictedDisease(
        topPredictions ??
          (singlePrediction ? [{ Disease: singlePrediction }] : null)
      );
    } catch (error) {
      console.error('Network error:', error);
      // Handle the error here, such as displaying a message to the user
    }
    scrollToTop();
    setLoading(false);
  };

  const handleReset = () => {
    setCheckedSymptoms({});
    setPredictedDisease(null); // Also clear the prediction result
    scrollToTop();
  };

  // Flatten all symptoms for search
  const allSymptoms = Object.entries(symptomsData).flatMap(([category, data]) =>
    data.symptoms.map((symptom) => ({
      label: Object.keys(symptom)[0],
      value: Object.values(symptom)[0],
      category,
    }))
  );

  // Scroll to symptom and select it, and clear prediction
  const handleSymptomSelect = (event, value) => {
    if (value) {
      // Also check the symptom
      setCheckedSymptoms((prevState) => ({
        ...prevState,
        [value.category]: {
          ...(prevState[value.category] || {}),
          [value.value]: true,
        },
      }));
      setPredictedDisease(null); // Clear the graph
      // Scroll after DOM/layout update
      setTimeout(() => {
        if (symptomRefs.current[value.value]) {
          symptomRefs.current[value.value].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 0);
    }
  };

  return (
    // <ProtectedRoute>
    <div className={styles.prediction_bg}>
      {startupLoading && (
        <div
          style={{
            backgroundColor: '#182f5d',
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 120,
            opacity: 0.98,
          }}
        >
          <StartupLoader countdown={countdown} />
        </div>
      )}
      {loading && !startupLoading && (
        <div className='fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-[#0116726b] z-[120]'>
          <PageLoader />
        </div>
      )}
      <Navbar />
      <div className='flex justify-center items-center lg:mt-16 mt-16 flex-col'>
        {predictedDisease === 'NO_SYMPTOMS' ? (
          <div className='flex justify-center mt-16'>
            <div className='flex flex-col items-center gap-2'>
              <div className='text-xl text-red-400 font-medium'>
                Please select your symptoms
              </div>
            </div>
          </div>
        ) : (
          predictedDisease && <DiseasePieChart data={predictedDisease} />
        )}
        {/* Search Dropdown */}
        <div className='w-full flex justify-center mt-8 mb-4'>
          <div className='w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-2'>
            <div
              className='w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-2'
              style={{
                background: 'white',
                borderRadius: 12,
                boxShadow: '0 2px 8px #0001',
                padding: 12,
              }}
            >
              <Autocomplete
                options={allSymptoms}
                groupBy={(option) => option.category}
                getOptionLabel={(option) => option.label}
                onChange={handleSymptomSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Search symptoms'
                    variant='outlined'
                    fullWidth
                  />
                )}
                sx={{
                  '& .MuiInputBase-root': {
                    background: 'white',
                    borderRadius: 2,
                  },
                }}
                PaperComponent={(props) => (
                  <div
                    style={{
                      zIndex: 1300,
                      position: 'absolute',
                      background: 'white',
                      boxShadow: '0 2px 8px #0002',
                      borderRadius: 8,
                      color: 'black',
                      opacity: 1, // ensure not transparent
                    }}
                    {...props}
                  />
                )}
              />
            </div>
          </div>
        </div>
        {Object.entries(symptomsData).map(([category, data]) => (
          <div
            className='lg:w-[80vw] w-[90vw] hover:border-blue-500 hover:border-2 mt-8 px-4 py-3 bg-blue-300/20 backdrop-blur-xl rounded-2xl'
            key={category}
          >
            <div key={category}>
              <div className='flex justify-center'>
                <div className='flex justify-center text-xl bg-gradient-to-r from-blue-400 to-blue-600 px-3 py-2 rounded-xl text-gray-200'>
                  <h2>{category}</h2>
                </div>
              </div>
              <div className='flex justify-center mt-2'>
                <div className='flex flex-wrap justify-center w-full'>
                {/* <div className='flex flex-wrap justify-evenly w-full'> */}
                  {data.symptoms.map((symptom) => (
                    <div
                      key={Object.keys(symptom)[0]}
                      ref={(el) =>
                        (symptomRefs.current[Object.values(symptom)[0]] = el)
                      }
                      // className='bg-gray-200 flex min-w-max w-40 lg:text-medium rounded-xl px-1 py-1 mx-1 my-1 lg:px-2 lg:py-1 lg:mx-2 lg:my-2 text-black'
                      className='bg-gray-200 flex min-w-max lg:text-medium rounded-xl px-1 py-1 mx-1 my-1 lg:px-2 lg:py-1 lg:mx-2 lg:my-2 text-black'
                    >
                      <Checkbox
                        id={Object.values(symptom)[0]}
                        radius='md'
                        isSelected={
                          checkedSymptoms[category]?.[
                            Object.values(symptom)[0]
                          ] || false
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            category,
                            Object.values(symptom)[0],
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={Object.values(symptom)[0]}>
                        {Object.keys(symptom)[0]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* <button onClick={handlePredict}>Predict</button>
        <button onClick={handleReset}>Reset</button> */}
        <div className='flex justify-center m-8 gap-4'>
          <button
            onClick={handlePredict}
            color='primary'
            className='text-white bg-gradient-to-r from-blue-500 to-blue-800 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg ease-in-out duration-200 text-xl px-3 py-2.5 text-cente'
          >
            Predict disease
          </button>
          <button
            onClick={handleReset}
            color='primary'
            className='text-white text-xl bg-gradient-to-r from-blue-500 to-blue-800 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg ease-in-out duration-200 px-3 py-2.5 text-cente'
          >
            Reset
          </button>
        </div>
      </div>
      <Footer />
    </div>
    // </ProtectedRoute>
  );
}
