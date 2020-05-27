const initLoadingState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  lastAction: {},
  lastError: {},
};

function reduceLoadingState(state = initLoadingState, action) {
  switch (action.type) {
    case 'API_START':
      return {
        ...state,
        isLoading: true,
        lastAction: {
          ...action.payload,
        },
      };
    case 'API_SUCCESS':
      return {
        ...state,
        isSuccess: true,
        lastAction: {
          ...action.payload,
        },
      };
    case 'API_ERROR':
      return {
        ...state,
      };
    case 'API_FINISH':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

const initModelLoadingState = {
  ...initLoadingState,
  objects: {},
};

function reduceOnModel(state = initModelLoadingState, action) {
  if (typeof action.payload.id === 'undefined') {
    return reduceLoadingState(state, action);
  }

  return {
    ...state,
    objects: {
      ...state.objects,
      [action.payload.id]: reduceLoadingState(
        state.objects[action.payload.id],
        action
      ),
    },
  };
}

const initApiState = {
  global: {
    count: 0,
    pending: [],
    isLoading: false,
    lastError: {},
    lastAction: {},
  },
};

export function api(state = initApiState, action) {
  let pending = [];
  switch (action.type) {
    case 'API_START':
      pending = state.global.pending;
      pending.push(action.payload.uuid);

      return {
        ...state,
        global: {
          ...state.global,
          count: state.global.count + 1,
          pending,
          isLoading: true,
          lastAction: {
            ...action.payload,
          },
        },
        [action.payload.name]: reduceOnModel(
          state[action.payload.name],
          action
        ),
      };
    case 'API_SUCCESS':
      return {
        ...state,
        [action.payload.name]: reduceOnModel(
          state[action.payload.name],
          action
        ),
      };
    case 'API_ERROR':
      return {
        ...state,
        global: {
          ...state.global,
          lastError: {
            ...action.payload,
          },
        },
        [action.payload.name]: reduceOnModel(
          state[action.payload.name],
          action
        ),
      };
    case 'API_FINISH':
      return {
        ...state,
        global: {
          ...state.global,
          pending: state.global.pending.filter(
            uuid => uuid !== action.payload.uuid
          ),
          count: state.global.count - 1,
          isLoading: state.global.count - 1 > 0,
        },
        [action.payload.name]: reduceOnModel(
          state[action.payload.name],
          action
        ),
      };
    default:
      return state;
  }
}
