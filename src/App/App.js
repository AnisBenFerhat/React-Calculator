import { useReducer } from 'react';
import './styles.css';

import DigitButton from './Components/DigitButton';
import OperationButton from './Components/OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      return state.overwrite
        ? { ...state, currentOperand: payload.digit, overwrite: false }
        : payload.digit === '0' && state.currentOperand === '0'
        ? state
        : payload.digit === '.' && state.currentOperand.includes('.')
        ? state
        : { ...state, currentOperand: `${state.currentOperand || ''}${payload.digit}` };
    case ACTIONS.CHOOSE_OPERATION:
      return state.currentOperand == null && state.previousOperand == null
        ? state
        : state.currentOperand == null
        ? { ...state, operation: payload.operation }
        : state.previousOperand == null
        ? {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        : {
            ...state,
            previousOperand: evaluate(state),
            operation: payload.operation,
            currentOperand: null,
          };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      return state.overwrite
        ? { ...state, overwrite: false, currentOperand: null }
        : state.currentOperand == null
        ? state
        : state.currentOperand.length === 1
        ? { ...state, currentOperand: null }
        : { ...state, currentOperand: state.currentOperand.slice(0, -1) };
    case ACTIONS.EVALUATE:
      return state.operation == null || state.currentOperand == null || state.previousOperand == null
        ? state
        : {
            ...state,
            overwrite: true,
            previousOperand: null,
            operation: null,
            currentOperand: evaluate(state),
          };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) || isNaN(current)) return '';
  let computation = '';
  switch (operation) {
    case '+':
      computation = previous + current;
      break;
    case '-':
      computation = previous - current;
      break;
    case '*':
      computation = previous * current;
      break;
    case '÷':
      computation = previous / current;
      break;
    default:
      return '';
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation='&divide;' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>
    </div>
  );
}

export default App;
