import React from 'react'

import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import './index.css'
import Main from './Main'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import './i18n'
import database from './db'


const router = createHashRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <p>404</p>
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