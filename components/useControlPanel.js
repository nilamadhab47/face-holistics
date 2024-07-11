// useControlPanel.js
import { useState } from 'react';

const useControlPanel = (initialSettings) => {
  const [settings, setSettings] = useState(initialSettings);

  const toggleSetting = (fieldName) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [fieldName]: !prevSettings[fieldName],
    }));
  };

  const setSliderValue = (fieldName, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [fieldName]: value,
    }));
  };

  return [settings, toggleSetting, setSliderValue];
};

export default useControlPanel;
