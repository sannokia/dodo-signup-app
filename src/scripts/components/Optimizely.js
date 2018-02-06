import React from 'react';

const isBrowser = () => typeof window !== 'undefined';

const isOptimizelyLoaded = () => isBrowser() && window['optimizely'];

const getAllExperiments = () =>
  isOptimizelyLoaded() ? window.optimizely.get('data').experiments || {} : {};

const getActiveExperiments = () =>
  isOptimizelyLoaded()
    ? window.optimizely.get('state').getActiveExperimentIds() || []
    : [];

const getVariationMap = () =>
  isOptimizelyLoaded()
    ? window.optimizely.get('state').getVariationMap() || {}
    : {};

const call = (method, ...args) => {
  window['optimizely'] = window['optimizely'] || [];
  try {
    window['optimizely'].push([method, ...args]);
  } catch (err) {
    console.error('react-optimizely', err);
  }
};

const activateExperiment = (experimentId) => {
  call('activate', experimentId);
};

const getPossibleIds = (experimentName) => {
  let allExperiments = getAllExperiments();
  return Object.keys(allExperiments).filter((key) => {
    return allExperiments[key].name === experimentName;
  });
};

const getExperimentId = (experimentName) => {
  let id = getPossibleIds(experimentName).pop();
  return id || null;
};

const getExperimentById = (experimentId) => {
  const allExperiments = getAllExperiments();
  const experiment = allExperiments[experimentId];

  return experiment || null;
};

const getExperimentByName = (experimentName) => {
  return getExperimentById(getExperimentId(experimentName));
};

const isEnabled = (experimentName) => {
  let experiment = getExperimentByName(experimentName);
  let enabledExperiments = getActiveExperiments();

  let filteredExperiments = enabledExperiments.filter((val) => {
    return val === experiment.id;
  });

  return experiment && filteredExperiments.length > 0;
};

const isNameUnique = (experimentName) => {
  return getPossibleIds(experimentName).length <= 1;
};

const isActive = (experimentName) => {
  const experimentId = getExperimentId(experimentName);
  const activateExperiments = getActiveExperiments();

  return activateExperiments.filter((id) => id === experimentId).length > 0;
};

export const activate = (experimentName) => {
  if (
    (isOptimizelyLoaded() && !isNameUnique(experimentName)) ||
    !isEnabled(experimentName)
  ) {
    return false;
  }

  const experimentId = getExperimentId(experimentName);

  if (!isActive(experimentName) && experimentId) {
    activateExperiment(experimentId);
  }

  return isActive(experimentName);
};

export const getVariant = (experimentName) => {
  const variationMap = getVariationMap();

  if (
    isOptimizelyLoaded() &&
    isNameUnique(experimentName) &&
    isEnabled(experimentName) &&
    isActive(experimentName)
  ) {
    return variationMap[getExperimentId(experimentName)];
  }

  return null;
};

export const tag = (...rawTags) => {
  let tags = {};
  rawTags.forEach((tag) => {
    if (typeof tag !== 'object')
      throw Error(`Expected tag to be an object, got ${typeof tag}`);
    tags = Object.assign(tags, tag);
  });

  call('customTag', tags);
};

export const track = (event, revenue = null) => {
  let metadata = {};
  if (revenue !== null) {
    metadata.revenue = revenue;
  }

  call('trackEvent', event, metadata);
};

export const variate = (variantToResultMap, variant) => {
  let result = variantToResultMap['default'];
  if (
    variant !== undefined &&
    variantToResultMap.hasOwnProperty(variant.name)
  ) {
    result = variantToResultMap[variant.name];
  }

  if (typeof result === 'function') {
    return result();
  }
  return result;
};

export default (experimentName) => (Component) => (props) => {
  const isActive = activate(experimentName);

  const experiment = getExperimentByName(experimentName);
  const variant = getVariant(experimentName);

  return (
    <Component {...props} optimizely={{ experiment, variant, isActive }} />
  );
};
