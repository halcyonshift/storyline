import React from 'react'

import { Q } from '@nozbe/watermelondb'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import ReactDOM from 'react-dom/client'

import { createHashRouter, RouterProvider } from 'react-router-dom'

import database from './db'
import { ProjectModel } from './db/models'
import './i18n'
import * as Layouts from './ui/layouts'
import * as StoryLineScreens from './screens/storyline'

import App from './App'


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
                    element: <StoryLineScreens.LandingScreen />,
                    loader: async () => await database.get<ProjectModel>('project').query(
                        Q.sortBy('title', Q.asc)
                    ).fetch(),
                }
            ]
        }
    ]
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root')
)

root.render(
  <DatabaseProvider database={database}>
    <RouterProvider router={router} />
  </DatabaseProvider>
)