import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Drizzle } from '@drizzle/store'
import { DrizzleContext } from "@drizzle/react-plugin"
import options from './DrizzleOptions.js'

const drizzle = new Drizzle(options)


ReactDOM.render(
  <React.StrictMode>
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          if (!initialized) {
            return "Loading..."
          }

          return (
            <App drizzle={drizzle} drizzleState={drizzleState} />
          )

        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
