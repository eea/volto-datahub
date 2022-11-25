export const setDatahubResult = (id, result) => {
  return {
    type: 'SET_DATAHUB_RESULT',
    id,
    result,
  };
};

const initialState = {};

export const datahub_results = (state = initialState, action) => {
  return {
    ...state,
    [action.id]: action.result,
  };
};
