import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from '../styles/nutritionChart.module.css';
import { Input } from '@nextui-org/react';
import { Checkbox } from '@nextui-org/react';
import NutritionCard from '../../components/NutritionCard/NutritionCard';
import ProtectedRoute from '@/components/ProtectedRoute';

// Height and weight limits as constants
const HEIGHT_MIN_CM = 80;
const HEIGHT_MAX_CM = 250;
const WEIGHT_MIN_KG = 20;
const WEIGHT_MAX_KG = 250;

// SSG for static nutrition data
export async function getStaticProps() {
  const nutritionDetails = require('../../data/nutritionDetails.json');
  return { props: { nutritionDetails } };
}

const NutritionChart = ({ nutritionDetails }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isNonVegetarian, setIsNonVegetarian] = useState(false);
  const [breakfast, setBreakfast] = useState(null);
  const [lunch, setLunch] = useState(null);
  const [snacks, setSnacks] = useState(null);
  const [dinner, setDinner] = useState(null);
  const [bmiStatusMessage, setBmiStatusMessage] = useState('');
  const [dietPurposeMessage, setDietPurposeMessage] = useState('');
  const [showBmiResult, setShowBmiResult] = useState(false); // New state to control BMI result display
  const [errorMessage, setErrorMessage] = useState(''); // New state for error
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

  // Replace both handlers with a single function
  const handleDietTypeChange = (type) => {
    if (type === 'veg') {
      setIsVegetarian(true);
      setIsNonVegetarian(false);
    } else if (type === 'non-veg') {
      setIsVegetarian(false);
      setIsNonVegetarian(true);
    }
  };

  // Validation function for height and weight
  const validateHeightWeight = (height, weight) => {
    if (height.trim() === '' || weight.trim() === '') {
      return 'Please enter both height and weight.';
    }

    if (
      !/^\d+(\.\d+)?$/.test(height.trim()) ||
      !/^\d+(\.\d+)?$/.test(weight.trim())
    ) {
      return 'Height and weight must be valid numbers (no letters or symbols).';
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (heightNum < HEIGHT_MIN_CM || heightNum > HEIGHT_MAX_CM) {
      return `Height must be between ${HEIGHT_MIN_CM} cm and ${HEIGHT_MAX_CM} cm.`;
    }

    if (weightNum < WEIGHT_MIN_KG || weightNum > WEIGHT_MAX_KG) {
      return `Weight must be between ${WEIGHT_MIN_KG} kg and ${WEIGHT_MAX_KG} kg.`;
    }

    return '';
  };

  // BMI calculation function
  const calculateBMI = (height, weight) => {
    const heightMeters = parseFloat(height) / 100;
    const bmiValue = parseFloat(weight) / (heightMeters * heightMeters);
    return bmiValue.toFixed(2);
  };

  const prepareDietChart = () => {
    setIsLoading(true);
    // Use validation function
    const validationError = validateHeightWeight(height, weight);
    if (validationError) {
      setErrorMessage(validationError);
      setIsLoading(false);
      // Only clear fields if both are empty
      if (height.trim() === '' && weight.trim() === '') {
        setHeight('');
        setWeight('');
      }
      setShowBmiResult(false);
      setBreakfast(null);
      setLunch(null);
      setSnacks(null);
      setDinner(null);
      setBmiStatusMessage('');
      setDietPurposeMessage('');
      setBMI(null);
      return;
    }

    // Error if no diet type selected
    if (!isVegetarian && !isNonVegetarian) {
      setErrorMessage(
        'Please select a diet type (Vegetarian or Non-Vegetarian).'
      );
      setIsLoading(false);
      setShowBmiResult(false);
      setBreakfast(null);
      setLunch(null);
      setSnacks(null);
      setDinner(null);
      setBmiStatusMessage('');
      setDietPurposeMessage('');
      setBMI(null);
      return;
    }

    setErrorMessage('');
    // Calculate BMI only here using the function
    const bmiValue = calculateBMI(height, weight);
    setBMI(bmiValue);
    setShowBmiResult(true); // Show BMI result only after button click
    if (bmiValue < 18.5) {
      setBmiStatusMessage('You are underweight.');
      setDietPurposeMessage(
        'This diet chart is designed to help you increase your weight.'
      );
      if (isVegetarian) {
        setBreakfast(nutritionDetails.diet_plan.Weight_Gain.veg.breakfast);
        setLunch(nutritionDetails.diet_plan.Weight_Gain.veg.lunch);
        setSnacks(nutritionDetails.diet_plan.Weight_Gain.veg.snacks);
        setDinner(nutritionDetails.diet_plan.Weight_Gain.veg.dinner);
      } else if (isNonVegetarian) {
        setBreakfast(
          nutritionDetails.diet_plan.Weight_Gain['non-veg'].breakfast
        );
        setLunch(nutritionDetails.diet_plan.Weight_Gain['non-veg'].lunch);
        setSnacks(nutritionDetails.diet_plan.Weight_Gain['non-veg'].snacks);
        setDinner(nutritionDetails.diet_plan.Weight_Gain['non-veg'].dinner);
      }
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setBmiStatusMessage('You have a normal weight.');
      setDietPurposeMessage(
        'This diet chart is designed to help you maintain your weight.'
      );
      if (isVegetarian) {
        setBreakfast(nutritionDetails.diet_plan.Maintenance.veg.breakfast);
        setLunch(nutritionDetails.diet_plan.Maintenance.veg.lunch);
        setSnacks(nutritionDetails.diet_plan.Maintenance.veg.snacks);
        setDinner(nutritionDetails.diet_plan.Maintenance.veg.dinner);
      } else if (isNonVegetarian) {
        setBreakfast(
          nutritionDetails.diet_plan.Maintenance['non-veg'].breakfast
        );
        setLunch(nutritionDetails.diet_plan.Maintenance['non-veg'].lunch);
        setSnacks(nutritionDetails.diet_plan.Maintenance['non-veg'].snacks);
        setDinner(nutritionDetails.diet_plan.Maintenance['non-veg'].dinner);
      }
    } else if (bmiValue >= 25 && bmiValue <= 30) {
      setBmiStatusMessage('You are overweight.');
      setDietPurposeMessage(
        'This diet chart is designed to help you decrease your weight.'
      );
      if (isVegetarian) {
        setBreakfast(nutritionDetails.diet_plan.Weight_Loss.veg.breakfast);
        setLunch(nutritionDetails.diet_plan.Weight_Loss.veg.lunch);
        setSnacks(nutritionDetails.diet_plan.Weight_Loss.veg.snacks);
        setDinner(nutritionDetails.diet_plan.Weight_Loss.veg.dinner);
      } else if (isNonVegetarian) {
        setBreakfast(
          nutritionDetails.diet_plan.Weight_Loss['non-veg'].breakfast
        );
        setLunch(nutritionDetails.diet_plan.Weight_Loss['non-veg'].lunch);
        setSnacks(nutritionDetails.diet_plan.Weight_Loss['non-veg'].snacks);
        setDinner(nutritionDetails.diet_plan.Weight_Loss['non-veg'].dinner);
      }
    } else if (bmiValue > 30) {
      setBmiStatusMessage('You are obese.');
      setDietPurposeMessage(
        'This diet chart is designed to help you lose excessive weight.'
      );
      if (isVegetarian) {
        setBreakfast(
          nutritionDetails.diet_plan.Losing_Excessive_Weight.veg.breakfast
        );
        setLunch(nutritionDetails.diet_plan.Losing_Excessive_Weight.veg.lunch);
        setSnacks(
          nutritionDetails.diet_plan.Losing_Excessive_Weight.veg.snacks
        );
        setDinner(
          nutritionDetails.diet_plan.Losing_Excessive_Weight.veg.dinner
        );
      } else if (isNonVegetarian) {
        setBreakfast(
          nutritionDetails.diet_plan.Losing_Excessive_Weight['non-veg']
            .breakfast
        );
        setLunch(
          nutritionDetails.diet_plan.Losing_Excessive_Weight['non-veg'].lunch
        );
        setSnacks(
          nutritionDetails.diet_plan.Losing_Excessive_Weight['non-veg'].snacks
        );
        setDinner(
          nutritionDetails.diet_plan.Losing_Excessive_Weight['non-veg'].dinner
        );
      }
    }
    setIsLoading(false);
  };

  return (
    // <ProtectedRoute>
    <div className={styles.nutrition_bg}>
      <Navbar />
      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          e.preventDefault();
          prepareDietChart();
        }}
      >
        <div className='h-[10vh]'></div>
        {/* Error message display */}
        {errorMessage && (
          <div className='w-full flex justify-center mb-2'>
            <div className='bg-red-600 text-white px-4 py-2 rounded shadow text-center font-semibold max-w-md'>
              {errorMessage}
            </div>
          </div>
        )}
        {/* Input fields container */}
        <div className='flex flex-col items-center gap-4 lg:flex-row lg:justify-evenly lg:p-0 p-2 lg:gap-0'>
          <div className='flex flex-wrap md:flex-nowrap w-full max-w-xs lg:w-3/12 gap-4 mt-12 text-blue-300 lg:text-xl text-lg font-medium'>
            <label className=' w-full'>
              Height (cm):
              <Input
                type='number'
                value={height}
                label='Enter your height'
                className='w-full'
                onChange={(e) => setHeight(e.target.value)}
              />
            </label>
          </div>
          <div className='flex flex-wrap md:flex-nowrap w-full max-w-xs lg:w-3/12 gap-4 mt-12 text-blue-300  lg:text-xl text-lg font-medium'>
            <label className='w-full'>
              Weight (kg):
              <Input
                type='number'
                value={weight}
                label='Enter your weight'
                onChange={(e) => setWeight(e.target.value)}
              />
            </label>
          </div>
        </div>
        {/* Checkboxes container */}
        <div className='flex flex-col items-center gap-2 lg:flex-row lg:justify-evenly mt-4 text-blue-300'>
          <Checkbox
            radius='md'
            isSelected={isVegetarian}
            onChange={() => handleDietTypeChange('veg')}
            className='flex justify-center items-center'
            classNames={{ base: 'flex items-center' }}
          >
            <p className='text-blue-400 h-full lg:text-xl text-lg flex justify-center items-center'>
              Vegetarian
            </p>
          </Checkbox>
          <Checkbox
            radius='md'
            isSelected={isNonVegetarian}
            onChange={() => handleDietTypeChange('non-veg')}
            className='flex justify-center items-center'
            classNames={{ base: 'flex items-center' }}
          >
            <p className='text-blue-400 h-full lg:text-xl text-lg flex justify-center items-center'>
              Non-Vegetarian
            </p>
          </Checkbox>
        </div>
        <div className={`${styles.btn} mt-8`}>
          <button
            type='submit'
            color='primary'
            disabled={isLoading}
            className={`flex justify-center text-xl px-3 py-2 ease-in-out duration-200 text-white bg-gradient-to-r from-blue-400 to-blue-700 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate Nutrition Chart'}
          </button>
        </div>

        {/* Display BMI and messages */}
        {showBmiResult && bmi && (
          <div className='flex flex-col items-center mt-4 text-gray-300 text-center'>
            <p className='text-xl font-bold px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg mb-2'>
              Your calculated BMI: {bmi}
            </p>
            <p className='text-lg'>{bmiStatusMessage}</p>
            <p className='text-lg'>{dietPurposeMessage}</p>
          </div>
        )}

        <div className={styles.nutrition_container}>
          {breakfast && (
            <>
              <h3
                className='mt-2 text-2xl font-medium text-gray-300'
                data-aos='fade-up'
                data-aos-easing='ease'
                data-aos-delay='150'
              >
                Breakfast
              </h3>
              <NutritionCard nutritionData={breakfast} />
              {/* <div>
              {breakfast.options.map((option, index) => (
                <div key={index}>
                  <div>{option.dish}</div>
                  <div>{option.description}</div>
                  <div>{option.recipe}</div>
                </div>
              ))}
            </div> */}
            </>
          )}
          {lunch && (
            <>
              <h3
                className='mt-4 text-2xl font-medium text-gray-300'
                data-aos='fade-up'
                data-aos-easing='ease'
                data-aos-delay='150'
              >
                Lunch
              </h3>
              <NutritionCard nutritionData={lunch} />
              {/* <div>
              {lunch.options.map((option, index) => (
                <div key={index}>
                  <div>{option.dish}</div>
                  <div>{option.description}</div>
                  <div>{option.recipe}</div>
                </div>
              ))}
            </div> */}
            </>
          )}
          {snacks && (
            <>
              <h3
                className='mt-4 text-2xl font-medium text-gray-300'
                data-aos='fade-up'
                data-aos-easing='ease'
                data-aos-delay='150'
              >
                Snacks
              </h3>
              <NutritionCard nutritionData={snacks} />
              {/* <div>
                {snacks.options.map((option, index) => (
                  <div key={index}>
                    <div>{option.dish}</div>
                    <div>{option.description}</div>
                    <div>{option.recipe}</div>
                  </div>
                ))}
              </div> */}
            </>
          )}
          {dinner && (
            <>
              <h3
                className='mt-4 text-2xl font-medium text-gray-300'
                data-aos='fade-up'
                data-aos-easing='ease'
                data-aos-delay='150'
              >
                Dinner
              </h3>
              <NutritionCard nutritionData={dinner} />
            </>
          )}
        </div>
      </form>
    </div>
    // </ProtectedRoute>
  );
};

export default NutritionChart;
