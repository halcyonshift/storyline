import React from 'react'

import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import './i18n'
import database from './db'
import App from './App'

import * as Layouts from './ui/layouts'
import * as StoryLineScreens from './screens/storyline'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <p>404</p>,
    children: [
        {
            element: <Layouts.StoryLineLayout />,
            children: [
                {
                    index: true,
                    element: <StoryLineScreens.LandingScreen />
                }
            ]
        }
    ]
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <DatabaseProvider database={database}>
    <RouterProvider router={router} />
  </DatabaseProvider>
)